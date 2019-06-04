import { router, pathMatchRegexp } from 'utils'
import api from 'api'
import md5 from 'md5'
import Cookies from 'js-cookie'

const { loginUser } = api

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      Cookies.set('username', payload.username)
      const data = yield call(loginUser, {
        username: payload.username,
        password: md5(payload.password)
      })
      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (!pathMatchRegexp('/login', from)) {
          if (from === '/') router.push('/dashboard')
          else router.push(from)
        } else {
          router.push('/dashboard')
        }
      } else {
        throw data
      }
    },
  },
}
