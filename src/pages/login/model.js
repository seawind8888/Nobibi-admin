import { router, pathMatchRegexp } from 'utils'
import api from 'api'
import md5 from 'md5'

const { loginUser } = api

export default {
  namespace: 'login',

  state: {},

  effects: {
    *login({ payload }, { put, call, select }) {
      const res = yield call(loginUser, {
        username: payload.username,
        password: md5(payload.password),
      })
      window.localStorage.setItem('username', payload.username)
      window.localStorage.setItem('Token', res.data.token)

      const { locationQuery } = yield select(_ => _.app)
      if (res.success) {
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (!pathMatchRegexp('/login', from)) {
          if (from === '/') router.push('/dashboard')
          else router.push(from)
        } else {
          router.push('/dashboard')
        }
      } else {
        throw res
      }
    },
  },
}
