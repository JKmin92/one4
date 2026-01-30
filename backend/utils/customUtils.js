export const generateUserCode = (email) => {
    if(!email || email.length < 3) throw new Error('이메일은 최소 3글자 이상');

    const prefix = email.slice(0, 3);
    const randomNumbers = Math.floor(1000 + Math.random() * 9000);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomLetters = '';
    for(let i=0; i<2; i++) {
        randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    const now = new Date();
    const yearMonth = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, "0");
    return `${prefix}${randomNumbers}${randomLetters}${yearMonth}`;
}