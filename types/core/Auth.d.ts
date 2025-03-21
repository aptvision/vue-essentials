import { JsonObject } from '../interface';
export interface IAuthToken {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}
type LocationQueryValue = string | null;
export type LocationQuery = Record<string, LocationQueryValue | LocationQueryValue[]>;
export interface IAuth {
    exchangeCodeForToken: (queryString: {
        state: string;
    }) => Promise<{
        authResponse: JsonObject;
        state: Record<string, string>;
    }>;
    handleVerifiedToken: (token: string) => void;
    verifySavedToken: () => boolean;
    logOut: (defaultLogout: () => void) => void;
}
export interface IAuthConfig {
    authTokenName: string;
    authEndpoint: string;
    authClientId: string;
    authScope: string;
    authRedirectUrl: string;
    authLogoutEndpoint: string;
    logOut: (defaultLogout: () => void) => void;
}
export declare const useAuth: (config: IAuthConfig) => {
    exchangeCodeForToken: (queryString?: LocationQuery) => Promise<IAuthToken>;
    saveToken: (token: string) => void;
    verifyToken: () => Promise<void>;
    logOut: () => void;
    defaultLogOutHandler: () => void;
    getToken: () => string | null;
};
export {};
