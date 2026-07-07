import * as popupModel from "../../../models/admin/popup/popupModel.js";
import { generateUniqueId } from "../../../utils/customUtils.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getList = async (req, res) => {
    try {
        const list = await popupModel.getPopupList();
        res.status(200).json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

export const getOne = async (req, res) => {
    try {
        const popup = await popupModel.getPopup(req.params.id);
        if (!popup) return res.status(404).json({ message: "팝업을 찾을 수 없습니다." });
        res.status(200).json(popup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

export const remove = async (req, res) => {
    try {
        await popupModel.deletePopup(req.params.id);
        res.status(200).json({ message: "삭제되었습니다." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

const processImage = async (file) => {
    const metadata = await sharp(file.buffer).metadata();
    
    // 1:1 비율(정사각형) 검사
    if (metadata.width !== metadata.height) {
        throw new Error("정사각형 이미지가 아닙니다.");
    }
    
    let pipeline = sharp(file.buffer);
    
    // 1000px 초과 시 리사이징
    if (metadata.width > 1000) {
        pipeline = pipeline.resize(1000, 1000, {
            fit: 'cover'
        });
    }
    
    // public/uploads 폴더 기준 저장
    // 현재 컨트롤러 위치: backend/controllers/admin/popup/
    // 백엔드 루트: backend/
    const uploadDir = path.resolve('public/uploads/popup');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const fileName = `${Date.now()}_${Math.floor(Math.random()*1000)}.webp`;
    const filePath = path.join(uploadDir, fileName);
    
    await pipeline.webp({ quality: 80 }).toFile(filePath);
    
    return `/uploads/popup/${fileName}`;
};

export const register = async (req, res) => {
    try {
        const data = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: "이미지를 업로드해주세요." });
        }
        
        let image_url;
        try {
            image_url = await processImage(req.file);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
        
        const popupData = {
            popup_code: generateUniqueId(),
            title: data.title,
            image_url: image_url,
            link_url: data.link_url || null,
            is_new_tab: data.is_new_tab === 'true' || data.is_new_tab === true ? 1 : 0,
            is_visible: data.is_visible === 'true' || data.is_visible === true ? 1 : 0,
            is_always_visible: data.is_always_visible === 'true' || data.is_always_visible === true ? 1 : 0,
            start_time: data.start_time && data.start_time !== 'null' ? data.start_time : null,
            end_time: data.end_time && data.end_time !== 'null' ? data.end_time : null,
            target_service: data.target_service || 'ALL'
        };
        
        await popupModel.insertPopup(popupData);
        res.status(201).json({ message: "팝업이 등록되었습니다." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const popup = await popupModel.getPopup(id);
        if (!popup) return res.status(404).json({ message: "팝업을 찾을 수 없습니다." });
        
        let image_url = null;
        if (req.file) {
            try {
                image_url = await processImage(req.file);
            } catch (err) {
                return res.status(400).json({ message: err.message });
            }
        }
        
        const updateData = {
            title: data.title,
            image_url: image_url,
            link_url: data.link_url || null,
            is_new_tab: data.is_new_tab === 'true' || data.is_new_tab === true ? 1 : 0,
            is_visible: data.is_visible === 'true' || data.is_visible === true ? 1 : 0,
            is_always_visible: data.is_always_visible === 'true' || data.is_always_visible === true ? 1 : 0,
            start_time: data.start_time && data.start_time !== 'null' ? data.start_time : null,
            end_time: data.end_time && data.end_time !== 'null' ? data.end_time : null,
            target_service: data.target_service || 'ALL'
        };
        
        await popupModel.updatePopup(id, updateData);
        res.status(200).json({ message: "팝업이 수정되었습니다." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

// 퍼블릭 팝업
export const getActivePopups = async (req, res) => {
    try {
        const { target } = req.params; // 'shop' 또는 'review'
        const popups = await popupModel.getActivePopups(target);
        res.status(200).json(popups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};
