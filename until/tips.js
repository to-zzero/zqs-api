const success = {
  // 后台管理
  1000: {message: '新增用户成功'},
  1001: {message: '退出成功'},
  1002: {message: '删除用户成功'}
}

const tips = {
  // 后台管理
  1000: {code: 1000, message: '用户不存在'},
  1001: {code: 1001, message: '密码错误'},
  1002: {code: 1002, message: '登录失效(server)'},
  1003: {code: 1003, message: '登录失效(client)'},
  1004: {code: 1004, message: '用户名重复'},
  1005: {code: 1005, message: 'sql错误'},
  1006: {code: 1006, message: '用户名过短'},
  1007: {code: 1007, message: '用户名过长'},
  1008: {code: 1008, message: '密码过短'},
  1009: {code: 1009, message: '密码过长'},
  1010: {code: 1010, message: '没有查询到数据'},
  1012: {code: 1011, message: '用户不存在'},
  1012: {code: 1012, message: '参数错误'},
  1013: {code: 1013, message: '删除失败'},
  1014: {code: 1014, message: 'root管理员 不可删除'},
  1015: {code: 1015, message: '浏览器cookie被禁用'}
}

module.exports = {
  tips,
  success
}
