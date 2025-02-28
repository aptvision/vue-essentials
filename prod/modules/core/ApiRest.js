var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class AuthorizationException extends Error {
}
const pollTimeouts = {};
export const useApiRest = (config) => {
    const apiUrl = config.apiUrl.trim().replace(/\/+$/, '');
    //@ts-expect-error type
    function is(className, object) {
        return Object.prototype.toString.call(object) === '[object ' + className + ']';
    }
    const DataEncoder = function () {
        //@ts-expect-error type
        this.levels = [];
        //@ts-expect-error type
        this.actualKey = null;
    };
    //@ts-expect-error type
    DataEncoder.prototype.__dataEncoding = function (data) {
        let uriPart = '';
        const levelsSize = this.levels.length;
        if (levelsSize) {
            uriPart = this.levels[0];
            for (let c = 1; c < levelsSize; c++) {
                uriPart += '[' + this.levels[c] + ']';
            }
        }
        let finalString = '';
        if (is('Object', data)) {
            const keys = Object.keys(data);
            const l = keys.length;
            for (let a = 0; a < l; a++) {
                const key = keys[a];
                const value = data[key];
                this.actualKey = key;
                this.levels.push(this.actualKey);
                finalString += this.__dataEncoding(value);
            }
        }
        else if (is('Array', data)) {
            if (!this.actualKey)
                throw new Error("Directly passed array does not work");
            const aSize = data.length;
            for (let b = 0; b < aSize; b++) {
                const aVal = data[b];
                this.levels.push(b);
                finalString += this.__dataEncoding(aVal);
            }
        }
        else {
            finalString += uriPart + '=' + encodeURIComponent(data) + '&';
        }
        this.levels.pop();
        return finalString;
    };
    //@ts-expect-error type
    DataEncoder.prototype.encode = function (data) {
        if (!is('Object', data) || !Object.keys(data).length)
            return null;
        return this.__dataEncoding(data).slice(0, -1);
    };
    const toUrlEncoded = (params) => {
        //@ts-expect-error type
        const encoder = new DataEncoder();
        return encoder.encode(params);
    };
    const getHeaders = (configOverride = {}) => {
        const conf = Object.assign({}, config, configOverride || {});
        if (!conf.token) {
            throw new AuthorizationException('Failed restoring local token');
        }
        const headers = {
            Authorization: 'Bearer ' + conf.token
        };
        if (conf.includeOrganizationIdHeader) {
            if (!conf.organizationId) {
                throw Error('Missing organizationId');
            }
            headers['x-organization-id'] = conf.organizationId;
        }
        return headers;
    };
    const handleResponse = (response, configOverride) => __awaiter(void 0, void 0, void 0, function* () {
        const conf = Object.assign({}, config, configOverride || {});
        if (response.status === 401) {
            if (conf.unauthorizedHandler) {
                conf.unauthorizedHandler();
            }
            throw new AuthorizationException('401 - unauthorized');
        }
        if (![200, 201].includes(response.status)) {
            throw new Error(response.statusText);
        }
        switch (conf.responseType) {
            // case 'blob':
            //   return response.blob()
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
    });
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
            for (const key in params) {
                if (typeof params[key] === 'undefined' ||
                    (['filterBy', 'orderBy'].includes(key) && !Object.keys(params[key] || {}).length) ||
                    (key === 'groups' && Array.isArray(params[key]) && !params[key].length) ||
                    (key === 'search' && params[key] === '')) {
                    delete params[key];
                }
            }
            const paramsEncoded = toUrlEncoded(params);
            if (paramsEncoded) {
                url += `?${paramsEncoded}`;
            }
        }
        const abortController = (configOverride === null || configOverride === void 0 ? void 0 : configOverride.abortController) || new AbortController();
        let resp;
        fetch(url, {
            method: 'GET',
            signal: abortController.signal,
            headers: getHeaders(configOverride)
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
            var _a, _b;
            const url = getUrl(endpoint, configOverride);
            const abortController = (configOverride === null || configOverride === void 0 ? void 0 : configOverride.abortController) || new AbortController();
            let resp;
            if (typeof data !== 'object') {
                data = {};
            }
            fetch(url, {
                method: 'POST',
                signal: abortController.signal,
                headers: Object.assign({ 'Content-Type': ((_b = (_a = config.xhrOverride) === null || _a === void 0 ? void 0 : _a.post) === null || _b === void 0 ? void 0 : _b.contentType) || config.xhrDefaults.contentType }, getHeaders(configOverride)),
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
            var _a, _b;
            let url = getUrl(endpoint, configOverride);
            const abortController = (configOverride === null || configOverride === void 0 ? void 0 : configOverride.abortController) || new AbortController();
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
                headers: Object.assign({ 'Content-Type': ((_b = (_a = config.xhrOverride) === null || _a === void 0 ? void 0 : _a.put) === null || _b === void 0 ? void 0 : _b.contentType) || config.xhrDefaults.contentType }, getHeaders(configOverride)),
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
    const patch = (endpoint, data, id, configOverride) => {
        return new Promise((resolve, reject) => {
            var _a, _b;
            let url = getUrl(endpoint, configOverride);
            const abortController = (configOverride === null || configOverride === void 0 ? void 0 : configOverride.abortController) || new AbortController();
            let resp;
            if (typeof data !== 'object') {
                data = {};
            }
            if (typeof id !== 'undefined') {
                url += '/' + id;
            }
            fetch(url, {
                method: 'PATCH',
                signal: abortController.signal,
                headers: Object.assign({ 'Content-Type': ((_b = (_a = config.xhrOverride) === null || _a === void 0 ? void 0 : _a.patch) === null || _b === void 0 ? void 0 : _b.contentType) || config.xhrDefaults.contentType }, getHeaders(configOverride)),
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
            const abortController = (configOverride === null || configOverride === void 0 ? void 0 : configOverride.abortController) || new AbortController();
            let resp;
            fetch(url, {
                method: 'DELETE',
                signal: abortController.signal,
                headers: getHeaders(configOverride)
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
                const abortController = (configOverride === null || configOverride === void 0 ? void 0 : configOverride.abortController) || new AbortController();
                let resp;
                fetch(url, {
                    method: 'GET',
                    headers: getHeaders(configOverride),
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
        patch,
        remove,
        poll,
        pollCancel
    };
};
