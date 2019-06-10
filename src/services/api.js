export default {
  queryRouteList: '/routes',

  queryUserInfo: '/user/getUserInfo',
  logoutUser: '/user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',
  queryUserList: '/user/getUserList',
  updateUser: 'PATCH /user/updateUser',
  createUser: 'POST /user/createUser',
  removeUser: 'POST /user/removeUser',
  removeUserList: 'POST /user/removeUser',
  queryPostList: '/topic/getTopicList',
  createPost: 'POST /topic/createTopic',
  removePost: 'POST /topic/removeTopic',
  updatePost: 'PATCH /topic/updateTopic',
  queryMenuList: '/menu/list',
  createMenu: 'POST /menu/create',
  removeMenu: 'POST /menu/remove',
  updateMenu: 'PATCH /menu/update',
  removeMenuList: '',
  queryCategoryList: '/category/getCategoryList',
  createCategory: 'POST /category/createCategory',
  removeCategory: 'POST /category/removeCategory',
  updateCategory: 'PATCH /category/updateCategory',
  removeCategoryList: ''
}
