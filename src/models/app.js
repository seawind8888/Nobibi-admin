/* global window */

import { router } from 'utils'
import { stringify } from 'qs'
import store from 'store'
import { queryLayout, pathMatchRegexp } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import api from 'api'
import config from 'config'
import routes from '../routes'
// import Cookies from 'js-cookie'

const { logoutUser, queryUserInfo } = api

export default {
  namespace: 'app',
  state: {
    userInfo: {},
    permissions: {
      visit: [],
    },
    userSelectList: [],
    categoryList: [],
    routeList: [
      {
        id: '0',
        name: 'Dashboard',
        zh: {
          name: '面板',
        },
        icon: 'dashboard',
        route: '/dashboard',
      },
    ],
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(location => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },

    setup({ dispatch }) {
      dispatch({
        type: 'query',
      })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      const { success, data } = yield call(queryUserInfo, {
        username: window.localStorage.getItem('username'),
      })
      const { locationPathname } = yield select(_ => _.app)
      if (success && data) {
        const userInfo = data
        window.localStorage.setItem('controlCode', userInfo._id)
        let permissions = {
          visit: [],
        }
        permissions.visit = userInfo.visit
        let routeList = [
          {
            id: '0',
            name: 'Dashboard',
            zh: {
              name: '面板',
            },
            icon: 'dashboard',
            route: '/dashboard',
          },
        ]
        const routeListFilter = routes.filter(item => {
          return permissions.visit.includes(String(item.id))
        })
        routeList = [...routeList, ...routeListFilter]
        yield put({
          type: 'updateState',
          payload: {
            userInfo,
            permissions,
            routeList,
          },
        })
        if (pathMatchRegexp(['/', '/login'], window.location.pathname)) {
          router.push({
            pathname: '/dashboard',
          })
        }
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        router.push({
          pathname: '/login',
          search: stringify({
            from: locationPathname,
          }),
        })
      }
    },

    *signOut({ payload }, { call, put }) {
      const data = yield call(logoutUser)
      // Cookies.remove('username')
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: {},
            permissions: {
              visit: [],
            },
            routeList: [
              {
                id: '0',
                name: 'Dashboard',
                zh: {
                  name: '面板',
                },
                icon: 'dashboard',
                route: '/dashboard',
              },
            ],
          },
        })
        window.localStorage.removeItem('Token')
        yield put({
          type: 'query',
        })
      } else {
        throw data
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
  },
}
