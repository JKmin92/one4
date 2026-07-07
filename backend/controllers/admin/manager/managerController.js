import bcrypt from 'bcrypt';
import { generateUserCode } from '../../../utils/customUtils.js';
import { getManagerList, getManagerByCode, existsEmail, existsUserCode, insertManager, updateManager as updateManagerData } from "../../../models/admin/manager/managerModel.js";

export const getList = async (req, res) => {
    try {
        const managers = await getManagerList();
        res.status(200).json(managers);
    } catch (error) {
        console.error("Error fetching manager list:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

export const getManager = async (req, res) => {
    try {
        const { id } = req.params;
        const manager = await getManagerByCode(id);
        
        if (!manager) {
            return res.status(404).json({ message: "관리자를 찾을 수 없습니다." });
        }
        
        res.status(200).json(manager);
    } catch (error) {
        console.error("Error fetching manager:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};


export const registerManager = async (req, res) => {
    try {
        const data = req.body;
        
        // 이메일 중복 확인
        const exists = await existsEmail(data.email);
        if (exists) {
            return res.status(400).json({ message: "이미 사용중인 이메일입니다." });
        }
        
        // user_code 생성
        let user_code;
        let codeExists = true;
        while (codeExists) {
            user_code = generateUserCode(data.email);
            codeExists = await existsUserCode(user_code);
        }
        
        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        await insertManager({
            ...data,
            user_code,
            password: hashedPassword
        });
        
        res.status(201).json({ message: "관리자가 등록되었습니다." });
    } catch (error) {
        console.error("Error registering manager:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};

export const updateManager = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const manager = await getManagerByCode(id);
        if (!manager) {
            return res.status(404).json({ message: "관리자를 찾을 수 없습니다." });
        }
        
        const updateData = {
            name: data.name,
            phone: data.phone,
            role: data.role
        };
        
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        
        await updateManagerData(id, updateData);
        
        res.status(200).json({ message: "관리자 정보가 수정되었습니다." });
    } catch (error) {
        console.error("Error updating manager:", error);
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
};
