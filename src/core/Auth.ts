// @ts-ignore
import VueJwtDecode from 'vue-jwt-decode'
import { JsonObject } from '../interface'
import { IAuthToken, LocationQuery } from '../../types/core/Auth'

export interface IAuth {
  exchangeCodeForToken: (queryString: { state: string }) => Promise<{
    authResponse: JsonObject,
    state: Record<string, string>
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

export const useAuth = (config: IAuthConfig) => {
  const saveToken = (token: string) => {
    if (!doVerifyToken(token)) {
      throw Error('Invalid or expired token')
    }
    localStorage.setItem(config.authTokenName, token)
  }
  const removeToken = () => {
    localStorage.removeItem(config.authTokenName)
    sessionStorage.removeItem('pkceCodeVerifier')
    sessionStorage.removeItem('stateCodeVerifier')
  }
  const redirectToAuth = (state?: string | { value: string; }) => {
    getLoginUrl(state).then((url: string) => {
      window.location.href = url
    })
  }
  const getLoginUrl = (state: string | { value: string; } = ''): Promise<string> => {
    return new Promise<string>(resolve => {
      const codeVerifier = generateCodeVerifier()
      sessionStorage.setItem('pkceCodeVerifier', codeVerifier)
      const stateCodeVerifier = generateRandomString(64)
      sessionStorage.setItem('stateCodeVerifier', stateCodeVerifier)
      // convert state to object if not an object
      if (typeof state !== 'object') {
        state = {
          value: state
        }
      }
      state = Object.assign(
        {
          stateCodeVerifier
        },
        state
      )
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
          '&code_challenge_method=S256')
      })
    })
  }
  const defaultLogOut = () => {
    if (config.authLogoutEndpoint) {
      fetch(config.authLogoutEndpoint, {
        method: 'POST',
        credentials: 'include', // enables cookies
        headers: new Headers(getAuthHeader())
      })
        .then(() => {
          redirectToAuth()
        })
        .catch(() => {
          redirectToAuth()
        })
    } else {
      redirectToAuth()
    }
  }
  const logOut = () => {
    console.log('logging out');
    removeToken()
    if (config.logOut) {
      config.logOut(defaultLogOut)
      return
    }
    defaultLogOut()
  }
  const toUrlEncoded = (obj: JsonObject<string>) => {
    return Object.keys(obj)
      .filter(x => x)
      .map(
        (key) => `${ encodeURIComponent(key) }=${ encodeURIComponent(obj[key]) }`
      )
      .join('&')
  }
  const exchangeCodeForToken = (queryString?: LocationQuery): Promise<IAuthToken> => {
    if (!queryString) {
      throw new Error('Missing required queryString param')
    }
    return new Promise((resolve, reject) => {
      const state = Object.fromEntries(
        new URLSearchParams(queryString as Record<string, string>).entries()
      )
      const innerState = Object.fromEntries(
        new URLSearchParams(state.state).entries()
      )
      if (!sessionStorage.getItem('stateCodeVerifier')) {
        reject('missing stateCodeVerifier')
        return
      }
      if (sessionStorage.getItem('stateCodeVerifier') !== innerState.stateCodeVerifier) {
        reject('stateCodeVerifiers do not match')
        return
      }
      const pkceCodeVerifier = sessionStorage.getItem('pkceCodeVerifier')
      if (!pkceCodeVerifier) {
        reject('missing pkceCodeVerifier')
        return
      }
      const data = {
        grant_type: 'authorization_code',
        code: state.code,
        client_id: config.authClientId,
        state: queryString.state,
        redirect_uri: config.authRedirectUrl,
        code_verifier: pkceCodeVerifier
      } as JsonObject<string>
      fetch(config.authEndpoint + '/access_token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF8'
        },
        body: toUrlEncoded(data)
      })
        .then((response) => response.json())
        .then((json: IAuthToken) => {
          sessionStorage.removeItem('pkceCodeVerifier')
          sessionStorage.removeItem('stateCodeVerifier')
          resolve(json)
        }).catch(error => {
        reject()
        throw Error(error)
      })
    })
  }
  const verifyToken = (): void => {
    if (!doVerifyToken(localStorage.getItem(config.authTokenName) || '')) {
      logOut()
    }
  }
  const doVerifyToken = (token: string) => {
    if (!token) {
      return false
    }
    return typeof getDecodedToken(token)?.exp !== 'undefined'
  }
  const getDecodedToken = (token: string) => {
    return VueJwtDecode.decode(token)
  }
  const getAuthHeader = () => {
    const token = localStorage.getItem(config.authTokenName)

    return token ? { Authorization: 'Bearer ' + token } : undefined
  }
  const generateRandomString = (length = 32) => {
    const array = new Uint32Array(length)
    window.crypto.getRandomValues(array)
    return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join(
      ''
    )
  }
  const generateCodeVerifier = () => {
    return (
      generateRandomString()
        .toString()
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    )
  }
  const sha256 = (plain: string):  Promise<ArrayBuffer> => {
    return new Promise((resolve) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      resolve(window.crypto.subtle.digest('SHA-256', data))
    })
  }
  const base64urlEncode = (str: ArrayBuffer): string => {
    return btoa(String.fromCharCode.apply(null, (new Uint8Array(str) as unknown as number[])))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  }
  const pkceChallengeFromVerifier = (verifier: string): Promise<string> => {
    return new Promise((resolve) => {
      sha256(verifier).then((arrayBuffer) => {
        resolve(base64urlEncode(arrayBuffer))
      })
    })
  }

  return {
    exchangeCodeForToken,
    saveToken,
    verifyToken,
    logOut,
  }
}