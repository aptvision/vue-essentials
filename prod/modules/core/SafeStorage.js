"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSafeStorage = void 0;
const encrypt_storage_1 = require("encrypt-storage");
const getProcessedPassword = (password) => {
    if (!password) {
        throw new Error('Safe storage password cannot be empty');
    }
    // this is to make sure password is at least 10 chars long (it's a requirement from EncryptStorage library)
    return 'safe_storage_password_' + password;
};
const useSafeStorage = () => {
    const set = (password, key, value) => {
        const storage = new encrypt_storage_1.EncryptStorage(getProcessedPassword(password));
        storage.setItem(key, storage.encryptValue(value));
    };
    const get = (password, key) => {
        const storage = new encrypt_storage_1.EncryptStorage(getProcessedPassword(password));
        let hash;
        try {
            hash = storage.getItem(key);
        }
        catch (e) {
            return undefined;
        }
        if (!hash) {
            return undefined;
        }
        let decrypted;
        try {
            decrypted = storage.decryptValue(hash || '');
        }
        catch (e) {
            return undefined;
        }
        return decrypted || undefined;
    };
    return { set, get };
};
exports.useSafeStorage = useSafeStorage;
