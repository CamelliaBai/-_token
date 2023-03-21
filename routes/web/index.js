var express = require('express');
var router = express.Router();
//导入 moment
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');

const checkLoginMinddleware = require('../../middlewares/checkLoginMinddleware')

//首页
router.get('/', (req, res) => {
  //重定向
  res.redirect('/account');
})


//记账本的列表
router.get('/account', checkLoginMinddleware, function (req, res, next) {

  AccountModel.find().sort({ time: -1 }).exec((err, data) => {
    if (err) {
      res.status(500).send('读取失败~~~');
      return;
    }
    //响应成功的提示
    res.render('list', { accounts: data, moment: moment });
  })
});


//添加记录
router.get('/account/create', checkLoginMinddleware, function (req, res, next) {
  res.render('create');
});

//新增记录
router.post('/account', checkLoginMinddleware, (req, res) => {
  //插入数据库
  AccountModel.create({
    ...req.body,
    //修改 time 属性的值
    time: moment(req.body.time).toDate()
  }, (err, data) => {
    if (err) {
      res.status(500).send('插入失败~~');
      return
    }
    //成功提醒
    res.render('success', { msg: '添加成功哦~~~', url: '/account' });
  })
});

//删除记录
router.get('/account/:id', checkLoginMinddleware, (req, res) => {
  //获取 params 的 id 参数
  let id = req.params.id;
  //删除
  AccountModel.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send('删除失败~');
      return;
    }
    //提醒
    res.render('success', { msg: '删除成功~~~', url: '/account' });
  })
});

module.exports = router;
