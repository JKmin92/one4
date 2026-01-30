import * as model from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { generateUserCode } from '../utils/customUtils.js';

export const createUser = async (data) => {
    let user_code;
    let exists = true;

    while(exists) {
        user_code = generateUserCode(data.email);
        exists = await model.existsUserCode(user_code);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await model.insertUser({...data, user_code:user_code, password:hashedPassword});
}

export const existsEmail = async (email) => {
    return await model.existsEmail(email);
}

export const signIn = async (data) => {
    const user = await model.login({email:data.email});
    const isMatch = await bcrypt.compare(data.password, user.password);

    if(!isMatch) return null;
    return {email:user.email, profile:user.profile, role:user.role, user_code:user.user_code};
}