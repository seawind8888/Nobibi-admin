import axios from 'axios'

// import Cookies from 'js-cookie'
import { cloneDeep, isEmpty } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import qs from 'qs'
import { router } from 'utils'
axios.defaults.headers.common['Authorization'] =
  'Bearer ' + window.localStorage.getItem('Token')

const { CancelToken } = axios
window.cancelRequest = new Map()

export default function request(options) {
  options.withCredentials = true
  let { data, url, method = 'get' } = options
  const cloneData = cloneDeep(data)

  try {
    let domain = process.env.API_HOST
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    message.error(e.message)
  }
  options.headers = {
    Authorization: 'Bearer ' + window.localStorage.getItem('Token'),
  }

  options.url =
    method.toLocaleLowerCase() === 'get'
      ? `${url}${isEmpty(cloneData) ? '' : '?'}${qs.stringify(cloneData)}`
      : url

  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  return axios(options)
    .then(response => {
      const { data } = response
      const { status } = data
      const success = status === 200 ? true : false
      // if(!success) {
      //   message.error(data.message)
      // }
      if (status === '401') {
        message.error('token已失效，请重新登录')
        router.push({
          pathname: '/login',
        })
      }
      // const { message, status, data } = response
      // let result = {}
      // if (typeof data === 'object') {
      //   result = data
      //   if (Array.isArray(data)) {
      //     result.list = data
      //   }
      // } else {
      //   result.data = data
      // }

      return Promise.resolve({
        success: success,
        // message: message,
        // statusCode: status,
        ...data,
      })
    })
    .catch(error => {
      const { response, message } = error

      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, message } = response
        statusCode = response.status
        msg = data.message || message
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
