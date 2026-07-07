import express from "express";
import multer from "multer";
import { getList, getOne, register, update, remove } from "../../../controllers/admin/popup/popupController.js";
import { authMiddleware } from "../../../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB 제한
});

router.get('/list', authMiddleware, getList);
router.post('/register', authMiddleware, upload.single('image'), register);
router.put('/:id', authMiddleware, upload.single('image'), update);
router.delete('/:id', authMiddleware, remove);
router.get('/:id', authMiddleware, getOne);

export default router;
