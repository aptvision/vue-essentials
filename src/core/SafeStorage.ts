import { EncryptStorage } from 'encrypt-storage'

const getProcessedPassword = (password: string) => {
  if (!password) {
    throw new Error('Safe storage password cannot be empty')
  }
  // this is to make sure password is at least 10 chars long (it's a requirement from EncryptStorage library)
  return 'safe_storage_password_' + password
}
export const useSafeStorage = () => {
  const set = (password: string, key: string, value: string): void => {
    const storage = new EncryptStorage(getProcessedPassword(password))
    storage.setItem(key, storage.encryptValue(value))
  }
  const get = (password: string, key: string): string|undefined => {
    const storage = new EncryptStorage(getProcessedPassword(password))
    let hash
    try {
      hash = storage.getItem(key)
    } catch (e) {
      return undefined
    }
    if (!hash) {
      return undefined
    }
    let decrypted
    try {
      decrypted = storage.decryptValue(hash || '')
    } catch (e) {
      return undefined
    }
    return decrypted || undefined
  }
  return { set, get }
}
