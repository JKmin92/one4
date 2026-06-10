import * as model from '../../../models/admin/member/userModel.js'

export const getUserList = async () => {
    return await model.getUserList();
}