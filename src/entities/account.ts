/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosPromise } from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { struct, minAPIParameterDefintion, minAPIParameterValidator } from '../utils/validator'

export interface IAccountParams {
  accessToken: string;
  accountUid: string;
  apiUrl: string;
  end: string;
  format: string;
  responseType: string;  // TODO: figure out what this should actually be
  start: string;
  targetAmountInMinorUnits: number;
  yearMonth: string;
}

const log = debug('starling:account-service')

/**
 * Service to interact with a customer's account
 */
export class Account {
  options: Partial<IAccountParams>

  /**
   * Creates an instance of the account client
   * @param {Object} options - application config
   */
  constructor (options: Partial<IAccountParams>) {
    this.options = options
  }

  /**
   * Get an account holder's bank accounts
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccounts (parameters: Pick<IAccountParams, 'apiUrl' | 'accessToken'>): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/accounts`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get an account's bank identifiers
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getAccountIdentifiers (parameters: Pick<IAccountParams, 'apiUrl' | 'accessToken' | 'accountUid'>): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    getAccountIdentifiersParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid } = parameters

    const url = `${apiUrl}/api/v2/accounts/${accountUid}/identifiers`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get an account's balance
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getAccountBalance (parameters: Pick<IAccountParams, 'apiUrl' | 'accessToken' | 'accountUid'>): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    getAccountBalanceParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid } = parameters

    const url = `${apiUrl}/api/v2/accounts/${accountUid}/balance`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get whether there are available funds for a requested amount
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {number} parameters.targetAmountInMinorUnits - the target amount in minor units
   * @return {Promise} - the http request promise
   */
  getConfirmationOfFunds (parameters: Pick<IAccountParams, 'apiUrl' | 'accessToken' | 'accountUid' | 'targetAmountInMinorUnits'>): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    getConfirmationOfFundsParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, targetAmountInMinorUnits } = parameters

    const url = `${apiUrl}/api/v2/accounts/${accountUid}/confirmation-of-funds`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken),
      params: {
        targetAmountInMinorUnits
      }
    })
  }

  /**
   * Get list of statement periods which are available for an account
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getStatementPeriods (parameters: Pick<IAccountParams, 'apiUrl' | 'accessToken' | 'accountUid'>): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    getStatementPeriodsParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid } = parameters

    const url = `${apiUrl}/api/v2/accounts/${accountUid}/statement/available-periods`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Download a statement for a given statement period
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string=} parameters.yearMonth - the statement period's year month (yyyy-MM)
   * @param {string=} parameters.format - one of 'application/pdf' or 'text/csv'
   * @param {string=} parameters.responseType - the axios responseType for the request
   * @return {Promise} - the http request promise
   */
  getStatementForPeriod (parameters: Omit<IAccountParams, 'targetAmountInMinorUnits' | 'start' | 'end'>): AxiosPromise<any> {
    parameters = Object.assign({}, { yearMonth: new Date().toISOString().slice(0, 7), format: 'text/csv', responseType: 'stream' }, this.options, parameters)
    getStatementForPeriodParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, format, yearMonth, responseType } = parameters

    const url = `${apiUrl}/api/v2/accounts/${accountUid}/statement/download`
    log(`GET ${url}`)

    // @ts-ignore
    return axios({
      method: 'GET',
      url,
      headers: {
        ...defaultHeaders(accessToken),
        Accept: format
      },
      params: {
        yearMonth
      },
      responseType
    })
  }

  /**
   * Download a statement for a given date range
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string} parameters.start - the beginning of the statement date range (yyyy-MM-dd)
   * @param {string=} parameters.end - the end of the statement date range (yyyy-MM-dd)
   * @param {string=} parameters.format - one of 'application/pdf' or 'text/csv'
   * @param {string=} parameters.responseType - the axios responseType for the request
   * @return {Promise} - the http request promise
   */
  getStatementForRange (parameters: IAccountParams): AxiosPromise<any> {
    parameters = Object.assign({}, { format: 'text/csv', responseType: 'stream' }, this.options, parameters)
    getStatementForRangeParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, start, end, format, responseType } = parameters

    const url = `${apiUrl}/api/v2/accounts/${accountUid}/statement/downloadForDateRange`
    log(`GET ${url}`)

    // @ts-ignore
    return axios({
      method: 'GET',
      url,
      headers: {
        ...defaultHeaders(accessToken),
        Accept: format
      },
      params: {
        start,
        end
      },
      responseType
    })
  }
}

const getAccountIdentifiersParameterValidator = struct.interface({ ...minAPIParameterDefintion, accountUid: 'uuid' })

const getAccountBalanceParameterValidator = struct.interface({ ...minAPIParameterDefintion, accountUid: 'uuid' })

const getConfirmationOfFundsParameterValidator = struct.interface({ ...minAPIParameterDefintion, accountUid: 'uuid', targetAmountInMinorUnits: 'number' })

const getStatementPeriodsParameterValidator = struct.interface({ ...minAPIParameterDefintion, accountUid: 'uuid' })

const getStatementForPeriodParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  yearMonth: 'yearMonth',
  format: struct.enum(['application/pdf', 'text/csv']),
  responseType: 'string'
})

const getStatementForRangeParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  start: 'date',
  end: 'date?',
  format: struct.enum(['application/pdf', 'text/csv']),
  responseType: 'string'
})
