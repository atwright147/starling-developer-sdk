export interface IDefaultHeaders {
  Accept: string;
  Authorization: string;
}

export interface IPayloadHeaders extends IDefaultHeaders {
  'Content-Type': string;
}

export const defaultHeaders = (accessToken: string): IDefaultHeaders => ({
  Accept: 'application/json',
  Authorization: `Bearer ${accessToken}`
})

export const payloadHeaders = (accessToken: string): IPayloadHeaders => ({
  ...defaultHeaders(accessToken),
  'Content-Type': 'application/json'
})
