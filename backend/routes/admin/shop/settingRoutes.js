import express from 'express';
import * as controller from '../../../controllers/admin/shop/settingController.js';

const router = express.Router();

router.get('/delivery', controller.getDeliverySetting);
router.put('/delivery', controller.updateDeliverySetting);

router.get('/account', controller.getAccountList);
router.put('/account/order', controller.updateAccountOrder);
router.get('/account/:account_code', controller.getAccount);
router.post('/account', controller.insertAccount);
router.put('/account', controller.updateAccount);
router.delete('/account/:account_code', controller.deleteAccount);

export default router;
