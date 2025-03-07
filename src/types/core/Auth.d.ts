export interface IAuthToken {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}
type LocationQueryValue = string | null
export type LocationQuery = Record<string, LocationQueryValue | LocationQueryValue[]>
