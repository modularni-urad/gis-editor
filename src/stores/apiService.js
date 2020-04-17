/* global Conf, localStorage */
import axios from 'axios'

const STORAGE_KEY = '_os_user'

export default class APIService {
  //
  constructor (on401) {
    this.on401 = on401
    try {
      this.user = JSON.parse(localStorage.getItem(STORAGE_KEY))
    } catch (e) {
      this.user = {}
    }
  }

  isLoggedIn () {
    return this.user !== {}
  }

  makeRequest (reqinfo) { // wrapper to be able to catch 401
    return new Promise((resolve, reject) => {
      const onSuccess = (res) => {
        resolve(res.data)
      }
      reqinfo.withCredentials = true
      axios(reqinfo)
        .then(onSuccess)
        .catch(err => {
          if (err.response && err.response.status === 401) {
            return this.on401(err)
              .then(() => {
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

  delete (url) {
    return this.makeRequest({
      method: 'delete',
      url: `${Conf.url}${url}`,
      headers: this.authHeader
    })
  }

  login (credents) {
    return axios({
      method: 'post',
      url: Conf.loginUrl,
      data: credents
    })
      .then(res => {
        return axios.post(`${Conf.url}/login`, null, {
          headers: {
            Authorization: `JWT ${res.data}`
          }
        })
      })
      .then(res => {
        this.user = credents
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user))
      })
  }

  logout () {
    axios.post(`${Conf.url}/logout`).then(res => {
      localStorage.removeItem(STORAGE_KEY)
      this.user = {}
    })
  }
}
