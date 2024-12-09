"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAptvisionApiRest = exports.AuthorizationException = void 0;
class AuthorizationException extends Error {
}
exports.AuthorizationException = AuthorizationException;
const useAptvisionApiRest = (config) => {
    const apiUrl = config.apiUrl.trim().replace(/\/+$/, '');
    const pollTimeouts = {};
    const toUrlEncoded = (params, keys = [], isArray = false) => {
        return Object.keys(params).map(key => {
            const val = params[key];
            if (typeof val === 'object' && val && !Array.isArray(val)) {
                keys.push(key);
                return toUrlEncoded(val, keys, Array.isArray(val));
            }
            else if (typeof val === 'string') {
                let tKey = key;
                if (keys.length > 0) {
                    const tKeys = isArray ? keys : [...keys, key];
                    tKey = tKeys.reduce((str, k) => {
                        return str === '' ? k : `${str}[${k}]`;
                    }, '');
                }
                if (isArray) {
                    return `${tKey}[]=${val}`;
                }
                else {
                    return `${tKey}=${encodeURIComponent(val)}`;
                }
            }
            else {
                throw new Error('Unsupported params type');
            }
        }).join('&');
    };
    const getAuthHeader = () => {
        if (!config.token) {
            throw new AuthorizationException('Failed restoring local token');
        }
        return { Authorization: 'Bearer ' + config.token };
    };
    const handleResponse = async (response, configOverride) => {
        const conf = Object.assign({}, config, configOverride || {});
        if (response.status === 401) {
            if (conf.unauthorizedHandler) {
                conf.unauthorizedHandler();
            }
            throw new AuthorizationException('401 - unauthorized');
        }
        if (response.status !== 200) {
            throw new Error(response.statusText);
        }
        switch (conf.responseType) {
            case 'blob':
                return response.blob();
            case 'json': {
                const json = response.json();
                if (typeof json !== 'object' || json === null) {
                    throw new Error('Response is not json object');
                }
                return json;
            }
            default:
                throw new Error('Invalid response type config');
        }
    };
    const getUrl = (endpoint, configOverride) => {
        const conf = Object.assign({}, config, configOverride || {});
        let apiUrlCopy = apiUrl;
        if (conf.prefixRoutesWithApiVersion) {
            if (!conf.apiVersion) {
                throw Error('Missing apiVersion');
            }
            apiUrlCopy += '/' + conf.apiVersion;
        }
        if (conf.prefixRoutesWithOrganizationId) {
            if (!conf.organizationId) {
                throw Error('Missing organizationId');
            }
            apiUrlCopy += '/organizations/' + conf.organizationId;
        }
        if (conf.prefixRoutesWithUserId) {
            if (!conf.userId) {
                throw Error('Missing userId');
            }
            apiUrlCopy += '/users/' + conf.userId;
        }
        return apiUrlCopy + '/' + endpoint.replace(/^\//, '');
    };
    const get = (endpoint, params, configOverride) => new Promise((resolve, reject) => {
        let url = getUrl(endpoint, configOverride);
        if (params && typeof params === 'object') {
            // remove empty params
            for (const key in params) {
                if (typeof params[key] === 'undefined' ||
                    (['filterBy', 'orderBy'].includes(key) && !Object.keys(params[key] || {}).length) ||
                    (key === 'groups' && Array.isArray(params[key]) && !params[key].length) ||
                    (key === 'search' && params[key] === '')) {
                    delete params[key];
                }
            }
            if (params.groups && Array.isArray(params.groups)) {
                params.groups = params.groups.join(',');
            }
            const paramsEncoded = toUrlEncoded(params);
            if (paramsEncoded) {
                url += `?${paramsEncoded}`;
            }
        }
        const abortController = configOverride?.abortController || new AbortController();
        let resp;
        fetch(url, {
            method: 'GET',
            signal: abortController.signal,
            headers: getAuthHeader()
        })
            .then(response => {
            resp = response;
            return handleResponse(response, configOverride);
        })
            .then(result => resolve(result))
            .catch((error) => {
            reject(config.errorHandler ? config.errorHandler(error, resp) : error);
        });
    });
    const post = (endpoint, data, configOverride) => {
        return new Promise((resolve, reject) => {
            const url = getUrl(endpoint, configOverride);
            const abortController = configOverride?.abortController || new AbortController();
            let resp;
            if (typeof data !== 'object') {
                data = {};
            }
            fetch(url, {
                method: 'POST',
                signal: abortController.signal,
                headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeader()),
                body: JSON.stringify(data)
            })
                .then(response => {
                resp = response;
                return handleResponse(response, configOverride);
            })
                .then(result => resolve(result))
                .catch((error) => {
                reject(config.errorHandler ? config.errorHandler(error, resp) : error);
            });
        });
    };
    const put = (endpoint, data, id, configOverride) => {
        return new Promise((resolve, reject) => {
            let url = getUrl(endpoint, configOverride);
            const abortController = configOverride?.abortController || new AbortController();
            let resp;
            if (typeof data !== 'object') {
                data = {};
            }
            if (typeof id !== 'undefined') {
                url += '/' + id;
            }
            fetch(url, {
                method: 'PUT',
                signal: abortController.signal,
                headers: Object.assign({ 'Content-Type': 'application/json' }, getAuthHeader()),
                body: JSON.stringify(data)
            })
                .then(response => {
                resp = response;
                return handleResponse(response, configOverride);
            })
                .then(result => resolve(result))
                .catch((error) => {
                reject(config.errorHandler ? config.errorHandler(error, resp) : error);
            });
        });
    };
    const remove = (endpoint, configOverride) => {
        return new Promise((resolve, reject) => {
            const url = getUrl(endpoint, configOverride);
            const abortController = configOverride?.abortController || new AbortController();
            let resp;
            fetch(url, {
                method: 'DELETE',
                signal: abortController.signal,
                headers: getAuthHeader()
            })
                .then(response => {
                resp = response;
                return handleResponse(response, configOverride);
            })
                .then(result => resolve(result))
                .catch((error) => {
                reject(config.errorHandler ? config.errorHandler(error, resp) : error);
            });
        });
    };
    const poll = (endpoint, params, intervalSec, configOverride) => {
        // clear timeout if exists
        if (typeof pollTimeouts[endpoint] !== 'undefined') {
            clearTimeout(pollTimeouts[endpoint]);
        }
        const fetchData = () => {
            return new Promise((resolve, reject) => {
                let url = getUrl(endpoint, configOverride);
                if (typeof params === 'object') {
                    const paramsEncoded = toUrlEncoded(params);
                    if (paramsEncoded) {
                        url += `?${paramsEncoded}`;
                    }
                }
                const abortController = configOverride?.abortController || new AbortController();
                let resp;
                fetch(url, {
                    method: 'GET',
                    headers: getAuthHeader(),
                    signal: abortController.signal
                })
                    .then(response => {
                    resp = response;
                    return handleResponse(response, configOverride);
                })
                    .then(result => resolve(result))
                    .catch((error) => {
                    reject(config.errorHandler ? config.errorHandler(error, resp) : error);
                });
            });
        };
        fetchData().finally(() => {
            pollTimeouts[endpoint] = setTimeout(() => {
                poll(endpoint, params, intervalSec, configOverride);
            }, (intervalSec || 120) * 1000);
        });
    };
    const pollCancel = (endpoint) => {
        if (typeof pollTimeouts[endpoint] !== 'undefined') {
            clearTimeout(pollTimeouts[endpoint]);
        }
    };
    return {
        get,
        post,
        put,
        remove,
        poll,
        pollCancel
    };
};
exports.useAptvisionApiRest = useAptvisionApiRest;
