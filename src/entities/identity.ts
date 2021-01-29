/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosPromise } from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { minAPIParameterValidator } from '../utils/validator'

export interface IIdentityParams {
  apiUrl: string;
  accessToken: string;
}

const log = debug('starling:identity-service')

/**
 * Service to interact with the API User identities endpoints
 */
export class Identity {
  options: Partial<IIdentityParams>

  /**
   * Creates an instance of the identity client
   * @param {Object} options - configuration parameters
   */
  constructor (options: IIdentityParams) {
    this.options = options
  }

  /**
   * Get the current token identity
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getTokenIdentity (parameters: IIdentityParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/identity/token`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get the authorising individual's identity
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getAuthorisingIndividual (parameters: IIdentityParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/identity/individual`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}
