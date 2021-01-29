/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosPromise } from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { minAPIParameterValidator } from '../utils/validator'

export interface IAccountHolderParams {
  apiUrl: string;
  accessToken: string;
}

const log = debug('starling:account-holder-service')

/**
 * Service to interact with an account holder
 */
export class AccountHolder {
  options: Partial<IAccountHolderParams>

  /**
   * Creates an instance of the account holder client
   * @param {Object} options - application config
   */
  constructor (options: IAccountHolderParams) {
    this.options = options
  }

  /**
   * Get basic information about the account holder
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolder (parameters: IAccountHolderParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/account-holder`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get the name of the account holder
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderName (parameters: IAccountHolderParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/account-holder/name`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get an individual account holder's details
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderIndividual (parameters: IAccountHolderParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/account-holder/individual`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a joint account holder's details
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderJoint (parameters: IAccountHolderParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/account-holder/joint`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a business account holder's details
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderBusiness (parameters: IAccountHolderParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/account-holder/business`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a business account holder's registered address
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderBusinessRegisteredAddress (parameters: IAccountHolderParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/account-holder/business/registered-address`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a business account holder's correspondence address
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderBusinessCorrespondenceAddress (parameters: IAccountHolderParams): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/account-holder/business/correspondence-address`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}
