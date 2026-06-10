import * as userService from "../../../services/admin/member/userService.js";

export const getUserList = async (req, res, next) => {
    try {
        const users = await userService.getUserList();
        return res.status(200).json(users);
    } catch (e) {
        next(e);
    }
}