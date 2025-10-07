import CryptoJS from "crypto-js";

const SECRET_KEY = "A9f#7x!qL2vZpR8m@W4tYc3Kz%5DgH6sF0uN1bE^jVwQeXoIuTL8rNmYpXsCkQzJh&2R@dF!9Gm#5UvWb"; 

export const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

export const decryptMessage = (cipherText) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
        return originalMessage;
    } catch (error) {
        console.error("Decryption failed", error);
        return "";
    }
}
