import VueJwtDecode from 'vue-jwt-decode';
export const useAuth = (config) => {
    const saveToken = (token) => {
        if (!doVerifyToken(token)) {
            throw Error('Invalid or expired token');
        }
        localStorage.setItem(config.authTokenName, token);
    };
    const removeToken = () => {
        localStorage.removeItem(config.authTokenName);
        sessionStorage.removeItem('pkceCodeVerifier');
        sessionStorage.removeItem('stateCodeVerifier');
    };
    const redirectToAuth = (state) => {
        getLoginUrl(state).then((url) => {
            window.location.href = url;
        });
    };
    const getLoginUrl = (state = '') => {
        return new Promise(resolve => {
            const codeVerifier = generateCodeVerifier();
            sessionStorage.setItem('pkceCodeVerifier', codeVerifier);
            const stateCodeVerifier = generateRandomString(64);
            sessionStorage.setItem('stateCodeVerifier', stateCodeVerifier);
            // convert state to object if not an object
            if (typeof state !== 'object') {
                state = {
                    value: state
                };
            }
            state = Object.assign({
                stateCodeVerifier
            }, state);
            pkceChallengeFromVerifier(codeVerifier).then((codeChallenge) => {
                resolve(config.authEndpoint +
                    '/authorize' +
                    '?response_type=code' +
                    '&client_id=' +
                    encodeURIComponent(config.authClientId) +
                    '&state=' +
                    encodeURIComponent(new URLSearchParams(state).toString()) +
                    '&scope=' +
                    encodeURIComponent(config.authScope) +
                    '&redirect_uri=' +
                    encodeURIComponent(config.authRedirectUrl) +
                    '&code_challenge=' +
                    encodeURIComponent(codeChallenge) +
                    '&code_challenge_method=S256');
            });
        });
    };
    const defaultLogOut = () => {
        if (config.authLogoutEndpoint) {
            fetch(config.authLogoutEndpoint, {
                method: 'POST',
                credentials: 'include', // enables cookies
                headers: new Headers(getAuthHeader())
            })
                .then(() => {
                redirectToAuth();
            })
                .catch(() => {
                redirectToAuth();
            });
        }
        else {
            redirectToAuth();
        }
    };
    const logOut = () => {
        removeToken();
        if (config.logOut) {
            config.logOut(defaultLogOut);
            return;
        }
        defaultLogOut();
        throw new Error('Logging out...');
    };
    const toUrlEncoded = (obj) => {
        return Object.keys(obj)
            .filter(x => x)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(String(obj[key]))}`)
            .join('&');
    };
    const exchangeCodeForToken = (queryString) => {
        if (!queryString) {
            throw new Error('Missing required queryString param');
        }
        return new Promise((resolve, reject) => {
            const state = Object.fromEntries(new URLSearchParams(queryString).entries());
            const innerState = Object.fromEntries(new URLSearchParams(state.state).entries());
            if (!sessionStorage.getItem('stateCodeVerifier')) {
                reject('missing stateCodeVerifier');
                return;
            }
            if (sessionStorage.getItem('stateCodeVerifier') !== innerState.stateCodeVerifier) {
                reject('stateCodeVerifiers do not match');
                return;
            }
            const pkceCodeVerifier = sessionStorage.getItem('pkceCodeVerifier');
            if (!pkceCodeVerifier) {
                reject('missing pkceCodeVerifier');
                return;
            }
            const data = {
                grant_type: 'authorization_code',
                code: state.code,
                client_id: config.authClientId,
                state: queryString.state,
                redirect_uri: config.authRedirectUrl,
                code_verifier: pkceCodeVerifier
            };
            fetch(config.authEndpoint + '/access_token', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF8'
                },
                body: toUrlEncoded(data)
            })
                .then((response) => response.json())
                .then((json) => {
                sessionStorage.removeItem('pkceCodeVerifier');
                sessionStorage.removeItem('stateCodeVerifier');
                resolve(json);
            }).catch(error => {
                reject();
                throw Error(error);
            });
        });
    };
    const verifyToken = () => {
        return new Promise((resolve, reject) => {
            if (!doVerifyToken(localStorage.getItem(config.authTokenName) || '')) {
                logOut();
                reject();
            }
            else {
                resolve();
            }
        });
    };
    const doVerifyToken = (token) => {
        if (!token) {
            return false;
        }
        return typeof getDecodedToken(token)?.exp !== 'undefined';
    };
    const getDecodedToken = (token) => {
        return VueJwtDecode.decode(token);
    };
    const getAuthHeader = () => {
        const token = localStorage.getItem(config.authTokenName);
        return token ? { Authorization: 'Bearer ' + token } : undefined;
    };
    const generateRandomString = (length = 32) => {
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join('');
    };
    const generateCodeVerifier = () => {
        return (generateRandomString()
            .toString()
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, ''));
    };
    const sha256 = (plain) => {
        return new Promise((resolve) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            resolve(window.crypto.subtle.digest('SHA-256', data));
        });
    };
    const base64urlEncode = (str) => {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };
    const pkceChallengeFromVerifier = (verifier) => {
        return new Promise((resolve) => {
            sha256(verifier).then((arrayBuffer) => {
                resolve(base64urlEncode(arrayBuffer));
            });
        });
    };
    return {
        exchangeCodeForToken,
        saveToken,
        verifyToken,
        logOut,
        defaultLogOutHandler: defaultLogOut
    };
};
