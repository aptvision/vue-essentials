declare module 'vue-jwt-decode' {
  export function decode<T = unknown>(token: string): T;
}