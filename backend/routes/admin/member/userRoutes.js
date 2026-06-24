import express from 'express';
import * as userController from '../../../controllers/admin/member/userController.js';

const router = express.Router();

router.get('/list', userController.getUserList);
router.get('/addressList/:user_code', userController.getUserAddressList);
router.get('/orderTotalPrice/:user_code', userController.getUserProductOrderTotalPrice);
router.get('/:user_code', userController.getUser);
router.get('/orderList/:user_code', userController.getUserProductOrderList);
router.get('/reviewChannelList/:user_code', userController.getUserReviewChannelList);
router.get('/orderBasketList/:user_code', userController.getUserProductOrderBasketList);
router.get('/reviewCampaignList/:user_code', userController.getUserReviewCampaignList);
router.get('/productReviewList/:user_code', userController.getUserProductReviewList);
router.get('/productInquiryList/:user_code', userController.getUserProductInquiryList);
router.get('/reviewCampaignApplicationChannelList/:campaign_application_code', userController.getReviewCampaignApplicationChannelList);
router.get('/address/:address_code', userController.getUserAddress);

router.get('/point/:user_code', userController.getUserPoint);
router.get('/point/history/:user_code', userController.getUserPointHistory);
router.get('/point/payout/:user_code', userController.getUserPointPayout);
router.put('/point/:user_code', userController.updateUserPoint);
router.put('/point/payout/:payout_code', userController.updateUserPointPayout);

export default router;