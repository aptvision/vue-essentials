class AptError {
    constructor(error, response) {
        this.response = response;
        if (error instanceof Error) {
            this.error = error;
        }
        else if (error && typeof error === 'object' && !Array.isArray(error) && error.errors && error.meta) {
            this.error = error.errors;
            this.meta = error.meta;
        }
        else if (typeof error === 'string') {
            this.error = error;
        }
    }
    isApiError() {
        return !!(this.meta);
    }
    isAbort() {
        return !!(this.error && typeof this.error === 'object' && !Array.isArray(this.error) && this.error.name === 'AbortError');
    }
    getMeta() {
        return this.meta;
    }
    getMessages() {
        const messages = [];
        if (typeof this.error === 'string') {
            messages.push({ message: this.error });
        }
        else if (this.error instanceof Error) {
            switch (this.error.name) {
                case 'SyntaxError':
                case 'TypeError':
                    messages.push({ message: 'Unexpected error, please contact the admin' });
                    break;
                default:
                    messages.push({ message: this.error.message });
            }
        }
        else if (this.error && this.isApiError() && Array.isArray(this.error)) {
            messages.push(...this.getApiErrorMessages());
        }
        return messages;
    }
    getRawError() {
        return this.error;
    }
    getApiErrors() {
        if (Array.isArray(this.error)) {
            return this.error;
        }
        return [];
    }
    getApiErrorMessages() {
        const messages = [];
        if (this.isApiError() && this.error && Array.isArray(this.error)) {
            this.error.forEach(error => {
                const message = {
                    message: error.template,
                    params: error.params
                };
                if (error.type === 'NOTICE' && !messages.includes(message)) {
                    messages.push(message);
                }
            });
        }
        return messages;
    }
}
export default AptError;
