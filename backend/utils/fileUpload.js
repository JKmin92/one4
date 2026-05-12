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

    // 디렉토리 경로: public/uploads/YYYY/MM/DD/{type}/{id}
    const relativeDir = path.join(datePath, type, String(id));
    const absoluteDir = path.join(process.cwd(), UPLOAD_ROOT, relativeDir);

    // 디렉토리 생성
    if (!fs.existsSync(absoluteDir)) {
        fs.mkdirSync(absoluteDir, { recursive: true });
    }

    // 이미지 정보 확인
    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    // 1500px로 리사이즈될 때의 예상 높이 계산
    let targetWidth = metadata.width;
    let targetHeight = metadata.height;

    if (metadata.width > 1500) {
        targetWidth = 1500;
        targetHeight = Math.round(metadata.height * (1500 / metadata.width));
    }

    // WebP의 최대 픽셀 제한은 16383x16383 입니다.
    // 세로로 매우 긴 상세페이지 이미지의 경우 이를 초과할 수 있으므로,
    // 이 경우 WebP 대신 제한이 더 여유로운 JPEG(최대 65535px)로 저장합니다.
    const isTooLargeForWebp = targetWidth > 16383 || targetHeight > 16383;
    const ext = isTooLargeForWebp ? 'jpg' : 'webp';

    // 파일명 생성: 랜덤 UUID 사용
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const filePath = path.join(absoluteDir, fileName);

    // 이미지 처리 (sharp)
    // 1. 가로 1500px 제한 (비율 유지)
    let processor = image.resize({
        width: 1500,
        withoutEnlargement: true,
    });

    if (isTooLargeForWebp) {
        // WebP 변환 시 에러가 나는 초장축 이미지는 JPEG로 변환
        await processor.jpeg({ quality: 80 }).toFile(filePath);
    } else {
        // 일반적인 이미지는 압축률이 좋은 WebP로 변환
        await processor.webp({ quality: 80 }).toFile(filePath);
    }

    // DB에 저장할 경로 반환 (Windows 백슬래시를 슬래시로 변환)
    const dbPath = path.join('/uploads', relativeDir, fileName).replace(/\\/g, '/');
    return dbPath;
};
