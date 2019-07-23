import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { pageModel } from 'utils/model'

const { queryRoleList, createRole, removeRole, updateRole } = api

export default modelExtend(pageModel, {
  namespace: 'role',

  state: {
    currentItem: {},
    menuList: [
      '面板',
      '用户管理',
      '角色管理',
      '分类管理',
      '主题管理',
      '评论管理',
    ],
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/role', location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      const { data } = yield call(queryRoleList, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.list,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeRole, { _id: payload })
      const { selectedRowKeys } = yield select(_ => _.role)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },

    *multiDelete({ payload }, { call, put }) {
      const data = yield call(removeRole, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
      } else {
        throw data
      }
    },

    *create({ payload }, { call, put }) {
      const data = yield call(createRole, payload)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ role }) => role.currentItem.id)
      const newRole = { ...payload, id }
      const data = yield call(updateRole, newRole)
      if (data.success) {
        yield put({ type: 'hideModal' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
