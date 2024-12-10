export declare const useSafeStorage: () => {
    set: (password: string, key: string, value: string) => void;
    get: (password: string, key: string) => string | undefined;
};
