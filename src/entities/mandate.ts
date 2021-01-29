/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosPromise } from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { struct, minAPIParameterDefintion, minAPIParameterValidator } from '../utils/validator'

export interface IMandateParams {
  apiUrl: string;
  accessToken: string;
  mandateUid: string;
}

const log = debug('starling:mandate-service')

/**
 * Service to interact with a customer's mandates
 */
export class Mandate {
  options: Partial<IMandateParams>

  /**
   * Create a new mandate service
   * @param {Object} options - configuration parameters
   */
  constructor (options: IMandateParams) {
    this.options = options
  }

  /**
   * Gets a list of the customer's current direct debit mandates
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  listMandates (parameters: Omit<IMandateParams, 'mandateUid'>): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/direct-debit/mandates`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Gets a specific direct debit mandate
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.mandateUid - unique identifier of the mandate
   * @return {Promise} - the http request promise
   */
  getMandate (parameters: IMandateParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    getMandateParameterValidator(parameters)
    const { apiUrl, accessToken, mandateUid } = parameters

    const url = `${apiUrl}/api/v2/direct-debit/mandates/${mandateUid}`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Deletes specific direct debit mandate
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token.
   * @param {string} parameters.mandateUid - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  deleteMandate (parameters: IMandateParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    deleteMandateParameterValidator(parameters)
    const { apiUrl, accessToken, mandateUid } = parameters

    const url = `${apiUrl}/api/v2/direct-debit/mandates/${mandateUid}`
    log(`DELETE ${url}`)

    return axios({
      method: 'DELETE',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getMandateParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  mandateUid: 'uuid'
})

const deleteMandateParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  mandateUid: 'uuid'
})
