declare module 'vue-jwt-decode' {
    const decode: <T = unknown>(token: string) => T;
    export { decode };
  }