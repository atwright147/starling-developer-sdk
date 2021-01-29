/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosPromise } from 'axios'
import debug from 'debug'
import { defaultHeaders, payloadHeaders } from '../utils/http'
import { struct, minAPIParameterDefintion, minAPIParameterValidator } from '../utils/validator'

export interface IParameters {
  apiUrl: string;
  accessToken: string;
  cardUid: string;
  enabled: boolean;
  endpoint: string;
}

const log = debug('starling:card-service')

/**
 * Service to interact with a customer card
 */
export class Card {
  options: Partial<IParameters>

  /**
   * Creates an instance of the client's card
   * @param {Object} options - configuration parameters
   */
  constructor (options: IParameters) {
    this.options = options
  }

  /**
   * Get all the cards for an account holder
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getCards (parameters: Pick<IParameters, 'apiUrl' | 'accessToken'>): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/cards`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Update card lock
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.cardUid - the card uid
   * @param {boolean} parameters.enabled - Whether the card should be locked. Set to false to lock, true to unlock.
   * @return {Promise} - the http request promise
   */
  updateCardLock (parameters: Omit<IParameters, 'endpoint'>): AxiosPromise<any> {
    return this.updateCardControl({ ...parameters, endpoint: 'enabled' })
  }

  /**
   * Update ATM withdrawal control
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.cardUid - the card uid
   * @param {boolean} parameters.enabled - Whether ATM withdrawals should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardATMControl (parameters: Omit<IParameters, 'endpoint'>): AxiosPromise<any> {
    return this.updateCardControl({ ...parameters, endpoint: 'atm-enabled' })
  }

  /**
   * Update online payments control
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.cardUid - the card uid
   * @param {boolean} parameters.enabled - Whether online payments should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardOnlineControl (parameters: Omit<IParameters, 'endpoint'>): AxiosPromise<any> {
    return this.updateCardControl({ ...parameters, endpoint: 'online-enabled' })
  }

  /**
   * Update mobile wallet payments control
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.cardUid - the card uid
   * @param {boolean} parameters.enabled - Whether mobile wallet payments should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardMobileWalletControl (parameters: Omit<IParameters, 'endpoint'>): AxiosPromise<any> {
    return this.updateCardControl({ ...parameters, endpoint: 'mobile-wallet-enabled' })
  }

  /**
   * Update gambling payments control
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.cardUid - the card uid
   * @param {boolean} parameters.enabled - Whether gambling payments should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardGamblingControl (parameters: Omit<IParameters, 'endpoint'>): AxiosPromise<any> {
    return this.updateCardControl({ ...parameters, endpoint: 'gambling-enabled' })
  }

  /**
   * Update card present payments (contactless and chip and pin) control
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.cardUid - the card uid
   * @param {boolean} parameters.enabled - Whether card present payments (contactless and chip and pin) should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardPresentControl (parameters: Omit<IParameters, 'endpoint'>): AxiosPromise<any> {
    return this.updateCardControl({ ...parameters, endpoint: 'pos-enabled' })
  }

  /**
   * Update magstripe payments control
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.cardUid - the card uid
   * @param {boolean} parameters.enabled - Whether magstripe payments should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardMagstripeControl (parameters: Omit<IParameters, 'endpoint'>): AxiosPromise<any> {
    return this.updateCardControl({ ...parameters, endpoint: 'mag-stripe-enabled' })
  }

  /**
   * Update a card control
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.cardUid - the card uid
   * @param {boolean} parameters.enabled - Whether the control should be should be locked. Set to false to lock, true to unlock.
   * @param {string} parameters.endpoint - the last segment of the endpoint name
   * @return {Promise} - the http request promise
   */
  updateCardControl (parameters: IParameters): AxiosPromise<any> {
    parameters = Object.assign({}, this.options, parameters)
    updateCardControlParameterValidator(parameters)
    const { apiUrl, accessToken, cardUid, enabled, endpoint } = parameters

    const url = `${apiUrl}/api/v2/cards/${cardUid}/controls/${endpoint}`
    log(`PUT ${url}`)

    return axios({
      method: 'PUT',
      url,
      headers: payloadHeaders(accessToken),
      data: JSON.stringify({ enabled })
    })
  }
}

const updateCardControlParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  cardUid: 'uuid',
  enabled: 'boolean'
})
