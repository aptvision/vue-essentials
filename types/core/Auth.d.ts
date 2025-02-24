import { JsonObject } from '../interface';
import { IAuthToken, LocationQuery } from '../types/core/Auth';
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
};
