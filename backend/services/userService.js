import * as model from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { generateUniqueId, generateUserCode } from '../utils/customUtils.js';

export const createUser = async (data) => {
    let user_code;
    let exists = true;

    while (exists) {
        user_code = generateUserCode(data.email);
        exists = await model.existsUserCode(user_code);
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await model.insertUser({ ...data, user_code: user_code, password: hashedPassword });
}

export const existsEmail = async (email) => {
    return await model.existsEmail(email);
}

export const signIn = async (data) => {
    const user = await model.login({ email: data.email });
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) return null;
    return {
        email: user.email,
        profile: user.profile,
        role: user.role,
        user_code: user.user_code,
        name: user.name,
        status: user.status
    };
}

export const getUserProfile = async (user_code) => {
    return await model.getUserProfile(user_code);
}

export const getUserAddress = async (user_code) => {
    return await model.getUserAddress(user_code);
}

export const insertUserAddress = async (user_address) => {
    const address_code = generateUniqueId();
    return await model.insertUserAddress({ ...user_address, address_code: address_code });
}

export const updateUserAddress = async (user_address) => {
    return await model.updateUserAddress(user_address);
}

export const deleteUserAddress = async (address_code, user_code) => {
    return await model.deleteUserAddress(address_code, user_code);
}

export const getUserReviewChannelList = async (user_code) => {
    return await model.getUserReviewChannelList(user_code);
}

export const getUserReviewChannel = async (user_code, review_channel_code) => {
    return await model.getUserReviewChannel(user_code, review_channel_code);
}

export const insertUserReviewChannel = async (user_review_channel) => {
    const review_channel_code = generateUniqueId();
    const channel_code = user_review_channel.channel_url.includes('instagram.com') ?
        '202603171603001' : user_review_channel.channel_url.includes('youtube.com') ?
            '202603171603002' : user_review_channel.channel_url.includes('naver.com') ? '202603171602001' : '';
    const meta_title = user_review_channel.metaData.title;
    const meta_description = user_review_channel.metaData.description;
    const meta_image = user_review_channel.metaData.image;
    const channel_url = user_review_channel.metaData.url || user_review_channel.channel_url;
    const follower_count = user_review_channel.metaData.followerCount || null;
    return await model.insertUserReviewChannel({ ...user_review_channel, review_channel_code: review_channel_code, channel_code: channel_code, meta_title: meta_title, meta_description: meta_description, meta_image: meta_image, channel_url: channel_url, follower_count: follower_count });
}

export const deleteUserReviewChannel = async (review_channel_code, user_code) => {
    return await model.deleteUserReviewChannel(review_channel_code, user_code);
}

export const updateUserReviewChannel = async (user_review_channel) => {
    const channel_code = user_review_channel.channel_url.includes('instagram.com') ?
        '202603171603001' : user_review_channel.channel_url.includes('youtube.com') ?
            '202603171603002' : user_review_channel.channel_url.includes('naver.com') ? '202603171602001' : '';
    const meta_title = user_review_channel.metaData.title;
    const meta_description = user_review_channel.metaData.description;
    const meta_image = user_review_channel.metaData.image;
    const channel_url = user_review_channel.metaData.url || user_review_channel.channel_url;
    const follower_count = user_review_channel.metaData.followerCount || null;

    return await model.updateUserReviewChannel({ ...user_review_channel, channel_code: channel_code, meta_title: meta_title, meta_description: meta_description, meta_image: meta_image, channel_url: channel_url, follower_count: follower_count });
}

export const updatePassword = async (user_code, currentPassword, newPassword) => {
    const userPassword = await model.getUserPassword(user_code);
    const isMatch = await bcrypt.compare(currentPassword, userPassword);
    if (!isMatch) return { result: false, code: '001' };
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await model.updateUserPassword(user_code, hashedPassword);
}