/* global Conf, localStorage */
import axios from 'axios'

const STORAGE_KEY = '_os_user'

export default class APIService {
  //
  constructor (on401) {
    this.on401 = on401
    try {
      this.auth = JSON.parse(localStorage.getItem(STORAGE_KEY))
      this.setToken(this.auth.token)
    } catch (e) {
      this.auth = {}
    }
  }

  setToken (token) {
    this.authHeader = { 'Authorization': `Bearer ${token}` }
  }

  makeRequest (reqinfo) { // wrapper to be able to catch 401
    return new Promise((resolve, reject) => {
      const onSuccess = (res) => {
        resolve(res.data)
      }
      axios(reqinfo)
        .then(onSuccess)
        .catch(err => {
          if (err.response && err.response.status === 401) {
            return this.on401(err)
              .then(() => {
                reqinfo.headers = this.authHeader // update with new token
                return axios(reqinfo) // retry
              })
              .then(onSuccess)
              .catch(reject)
          }
          reject(err)
        })
    })
  }

  getUrl (path) {
    return `${Conf.url}/${path}`
  }

  get (url) {
    return this.makeRequest({
      method: 'get',
      url: `${Conf.url}${url}`,
      headers: this.authHeader
    })
  }

  post (url, data) {
    return this.makeRequest({
      method: 'post',
      url: `${Conf.url}${url}`,
      headers: this.authHeader,
      data
    })
  }

  put (url, data) {
    return this.makeRequest({
      method: 'put',
      url: `${Conf.url}${url}`,
      headers: this.authHeader,
      data
    })
  }

  login (credents) {
    return axios({ method: 'post', url: Conf.loginUrl, data: credents })
      .then(res => {
        this.auth = {
          user: credents,
          token: res.data.token
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.auth))
        this.setToken(res.data.token)
      })
  }

  logout () {
    localStorage.removeItem(STORAGE_KEY)
    this.auth = {}
  }
}
