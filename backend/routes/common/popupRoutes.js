import express from "express";
import { getActivePopups } from "../../controllers/admin/popup/popupController.js";

const router = express.Router();

// 퍼블릭 접근 허용 API (로그인 불필요)
router.get('/:target', getActivePopups);

export default router;
