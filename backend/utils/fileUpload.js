import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import moment from 'moment';

const UPLOAD_ROOT = 'public/uploads';

/**
 * 이미지 처리 및 저장 함수
 * @param {Object} file - multer가 처리한 파일 객체 (buffer 포함)
 * @param {String} type - 'product' 등 폴더 구분
 * @param {String} id - 상품 ID 등 식별자
 * @returns {Promise<String>} - 저장된 파일의 상대 경로 (예: /uploads/2026/02/09/product/12345/image.webp)
 */
export const uploadFile = async (file, type, id) => {
    if (!file || !file.buffer) {
        throw new Error('파일이 없거나 버퍼가 비어있습니다.');
    }

    // 날짜 기반 경로 생성
    const now = moment();
    const datePath = now.format('YYYY/MM/DD'); // 2026/02/09

    // 최종 디렉토리 경로: public/uploads/YYYY/MM/DD/{type}/{id}
    // 사용자가 요구한 구조: uploads/YYYY/MM/DD/product/{상품ID}/
    const relativeDir = path.join(datePath, type, String(id));
    const absoluteDir = path.join(process.cwd(), UPLOAD_ROOT, relativeDir);

    // 디렉토리 생성
    if (!fs.existsSync(absoluteDir)) {
        fs.mkdirSync(absoluteDir, { recursive: true });
    }

    // 파일명 생성: 랜덤 UUID 사용 (한글/특수문자 문제 방지)
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webp`;
    const filePath = path.join(absoluteDir, fileName);

    // 이미지 처리 (sharp)
    // 1. 가로 1500px 제한 (비율 유지)
    // 2. WebP 변환
    await sharp(file.buffer)
        .resize({
            width: 1500,
            withoutEnlargement: true, // 1500보다 작으면 확대하지 않음
        })
        .webp({ quality: 80 }) // 품질 80 설정
        .toFile(filePath);

    // DB에 저장할 경로 반환 (Windows 백슬래시를 슬래시로 변환)
    const dbPath = path.join('/uploads', relativeDir, fileName).replace(/\\/g, '/');
    return dbPath;
};
