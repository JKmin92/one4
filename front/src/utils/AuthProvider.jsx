import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance, { setupInterceptors } from "./api";
import { Spinner } from "@chakra-ui/react";


const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState();
    const [accessToken, setAccessToken] = useState();
    const [isLoading, setIsLoading] = useState();

    const login = useCallback(async (credentials, type='user') => {
        try {
            const url = type === 'admin' ? '/admin/user/signIn' : '/user/signIn';
            const res = await axiosInstance.post(url, credentials);
            if(res.status === 200) {
                const {accessToken : newAccessToken, ...userData} = res.data;
                setUser(userData);
                setAccessToken(newAccessToken);
                return userData;
            }
            return null;
        } catch {
            throw new Error('로그인 실패 : 확인되는 계정이 없습니다.');
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await axiosInstance.post('/user/signOut');
        } catch(err) {
            console.error(err);
        } finally {
            setUser(null);
            setAccessToken(null);
        }
    }, []);

    const refreshAuthToken = useCallback(async () => {
        try {
            const res = await axiosInstance.post('/user/refresh');
            if(res.status === 200) {
                const {accessToken : newAccessToken} = res.data;
                setAccessToken(newAccessToken);

                const userRes = await axiosInstance.get('/user/', {
                    headers : {Authorization: `Bearer ${newAccessToken}`}
                });
                setUser(userRes.data);
                return newAccessToken;
            }

            return null;
        } catch {
            logout();
            return null;
        }
    }, [logout]);

    useEffect(() => {
        setupInterceptors({getAccessToken : () => accessToken, setAccessToken, logout, refreshAuthToken});

        const checkAuthStatus = async () => {
            try {
                const newAccessToken = await refreshAuthToken();
                if(!newAccessToken) {
                    setUser(null);
                    setAccessToken(null);
                }
            } catch(err) {
                console.error(err);
                setUser(null);
                setAccessToken(null);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuthStatus();
    }, [accessToken, logout, refreshAuthToken]);

    const contextValue = useMemo(() => ({
        user, setUser, accessToken, setAccessToken, login, logout, refreshAuthToken
    }), [user, accessToken, login, logout, refreshAuthToken]);

    if(isLoading) {
        return (<Spinner color="blue.500" borderWidth="4px" position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" size="xl" />);
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext};