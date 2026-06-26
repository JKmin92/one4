import { useEffect, useRef, useState } from 'react';

export const useBehaviorTracker = (idleTimeoutMs = 10000) => {
    const [activeDwellTime, setActiveDwellTime] = useState(0);
    const idleTimerRef = useRef(null);
    const dwellIntervalRef = useRef(null);
    const isIdleRef = useRef(false);

    useEffect(() => {
        // 활성 체류 시간 1초마다 증가
        dwellIntervalRef.current = setInterval(() => {
            if (!isIdleRef.current) {
                setActiveDwellTime(prev => prev + 1);
            }
        }, 1000);

        const resetIdleTimer = () => {
            isIdleRef.current = false;
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            
            // 10초간 아무 이벤트가 없으면 Idle(유휴) 상태로 변경
            idleTimerRef.current = setTimeout(() => {
                isIdleRef.current = true;
            }, idleTimeoutMs);
        };

        resetIdleTimer();

        const events = ['mousemove', 'scroll', 'keydown', 'click', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetIdleTimer));

        return () => {
            if (dwellIntervalRef.current) clearInterval(dwellIntervalRef.current);
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
            events.forEach(event => window.removeEventListener(event, resetIdleTimer));
        };
    }, [idleTimeoutMs]);

    return activeDwellTime;
};
