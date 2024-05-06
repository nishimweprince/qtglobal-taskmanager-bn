import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);

    return hash;
}

export const comparePassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
}

export const generateRandomString = (length = 8) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
};
