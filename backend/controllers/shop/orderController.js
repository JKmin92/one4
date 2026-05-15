import * as orderService from "../../services/shop/orderService.js";

export const insertProductOrder = async (req, res) => {
    try {
        const data = req.body;
        const user = req.user;
        if (!user) return res.status(404).send({ message: 'no user' });
        const result = await orderService.insertProductOrder({ ...data, user_code: user.user_code });
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: false, error: error.message });
    }
}

export const getProductOrder = async (req, res) => {
    try {
        const order_code = req.params.order_code;
        const result = await orderService.getProductOrder(order_code);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ result: false, error: error.message });
    }
}