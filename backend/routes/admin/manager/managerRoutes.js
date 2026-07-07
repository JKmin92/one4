import express from "express";
import { getList, getManager, registerManager, updateManager } from "../../../controllers/admin/manager/managerController.js";
import { authMiddleware } from "../../../middleware/authMiddleware.js";

const router = express.Router();

// 모든 경로는 /api/admin/manager 에 마운트됩니다.
router.get('/list', authMiddleware, getList);
router.post('/register', authMiddleware, registerManager);
router.put('/:id', authMiddleware, updateManager);
router.get('/:id', authMiddleware, getManager);

export default router;
