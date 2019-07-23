import modelExtend from 'dva-model-extend'
import { pageModel } from 'utils/model'
export default modelExtend(pageModel, {
  namespace: 'dashboard',
  state: {
    numbers: [
      {
        icon: 'pay-circle-o',
        color: '#64ea91',
        title: 'Online Review',
        number: 2781,
      },
      {
        icon: 'team',
        color: '#8fc9fb',
        title: 'New Customers',
        number: 3241,
      },
    ],
  },
  subscriptions: {
    setup({ dispatch, history }) {},
  },
})
