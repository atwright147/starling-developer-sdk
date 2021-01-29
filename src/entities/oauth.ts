/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosPromise } from 'axios'
import debug from 'debug'
import { struct } from '../utils/validator'

// TODO: convert to ENUMs
const ACCESS_TOKEN_GRANT_TYPE = 'authorization_code'
const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token'

export interface IGetOAuthTokenQueryParams {
  code?: string;
  refresh_token?: string;
  grant_type: string;
  client_id: string;
  client_secret: string;
  redirect_uri?: string;
}

export interface IOAuthParams {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

const log = debug('starling:oauth-service')

/**
 * Service to interact with a the oauth endpoint
 */
export class OAuth {
  options: IOAuthParams  // not partial!

  /**
   * Create a new oauth service
   * @param {Object} options - configuration parameters
   */
  constructor (options: IOAuthParams) {
    this.options = options
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} authorizationCode - the authorization code, acquired from the user agent after the user authenticates with starling
   * @return {Promise} - the http request promise
   */
  getAccessToken (authorizationCode: string): AxiosPromise<any> {
    return this.getOAuthToken(
      this.options.apiUrl,
      {
        code: authorizationCode,
        grant_type: ACCESS_TOKEN_GRANT_TYPE,
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        redirect_uri: this.options.redirectUri
      }
    )
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} refreshToken - the oauth refresh token, used when the access token expires to claim a new access token.
   * @return {Promise} - the http request promise
   */
  refreshAccessToken (refreshToken: string): AxiosPromise<any> {
    return this.getOAuthToken(
      this.options.apiUrl,
      {
        refresh_token: refreshToken,
        grant_type: REFRESH_TOKEN_GRANT_TYPE,
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret
      }
    )
  }

  /**
   * Gets the access token from the starling OAuth endpoint
   * @param {string} apiUrl - the OAuth url
   * @param {object} queryParams - the query params passed to the OAuth endpoint as per the OAuth spec
   * @return {Promise} - the http request promise
   */
  getOAuthToken (apiUrl: string, parameters: IGetOAuthTokenQueryParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    getOAuthTokenParameterValidator({ apiUrl, parameters })

    const url = `${apiUrl}/oauth/access-token`
    log(`POST ${url} queryParams:${JSON.stringify(parameters)}`)

    return axios({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      params: parameters
    })
  }
}

const getOAuthTokenParameterValidator = struct.interface({
  apiUrl: 'string',
  queryParams: struct.union([
    struct.object({
      client_id: 'string',
      client_secret: 'string',
      grant_type: struct.literal(ACCESS_TOKEN_GRANT_TYPE),
      code: 'string',
      redirect_uri: 'string'
    }),
    struct.object({
      client_id: 'string',
      client_secret: 'string',
      grant_type: struct.literal(REFRESH_TOKEN_GRANT_TYPE),
      refresh_token: 'string'
    })
  ])
})
