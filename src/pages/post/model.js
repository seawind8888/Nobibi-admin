import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import api from 'api'
import { pageModel } from 'utils/model'

const {
    queryPostList,
    createPost,
    removePost,
    updatePost,
    queryUserList,
    queryCategoryList
  } = api

export default modelExtend(pageModel, {
    namespace: 'post',
  
    state: {
        currentItem: {},
        modalVisible: false,
        modalType: 'create',
        selectedRowKeys: [],
        categoryList: [],
        userSelectList: []
    },
    subscriptions: {
        setup({ dispatch, history }) {
          history.listen(location => {
            dispatch({ type: 'queryUserSelect'})
            dispatch({ type: 'queryCategorySelect'})
            if (pathMatchRegexp('/post', location.pathname)) {
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
            const {data} = yield call(queryPostList, payload)
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
        *queryUserSelect({ payload = {}}, { call, put }) {
          const {data} = yield call(queryUserList, payload)
          if (data) {
            yield put({
              type: 'updateState',
              payload: {
                userSelectList: data.list
              },
            })
          }
        },
        *queryCategorySelect({ payload = {}}, { call, put }){
          const {data} = yield call(queryCategoryList, payload)
          if (data) {
            yield put({
              type: 'updateState',
              payload: {
                categoryList: data.list
              },
            })
          }
        },
       
        *delete({ payload }, { call, put, select }) {
            const data = yield call(removePost, { _id: payload })
            const { selectedRowKeys } = yield select(_ => _.post)
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
            const data = yield call(removePost, payload)
            if (data.success) {
              yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
            } else {
              throw data
            }
        },
        *create({ payload }, { call, put }) {
            const data = yield call(createPost, payload)
            if (data.success) {
              yield put({ type: 'hideModal' })
            } else {
              throw data
            }
          },
      
          *update({ payload }, { select, call, put }) {
            const id = yield select(({ post }) => post.currentItem.id)
            const newPost = { ...payload, id }
            const data = yield call(updatePost, newPost)
            if (data.success) {
              yield put({ type: 'hideModal' })
            } else {
              throw data
            }
          },
    },
    reducers: {
        querySelectSuccess(state, { payload }) {
          return { ...state, ...payload }
        },
        showModal(state, { payload }) {
          return { ...state, ...payload, modalVisible: true }
        },
    
        hideModal(state) {
          return { ...state, modalVisible: false }
        },
      },
})