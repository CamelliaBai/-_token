var express = require('express');
var router = express.Router();
const UserModel = require("../../models/UserModel");
const md5 = require('md5');
const jwt = require('jsonwebtoken');

//登录账号
router.post('/login', (req, res) => {
    //获取用户名和密码
    let { username, password } = req.body;
    //查询数据库
    UserModel.findOne({ username: username, password: md5(password) }, (err, data) => {
        //判断
        if (err) {
            res.json({
                code: '2001',
                msg: '数据库读取失败',
                data: null
            })
            return;
        }
        //判断 data
        if (!data) {
            return res.json({
                code: '2002',
                msg: '用户名或密码错误',
                data: null
            });
        }
        //创建token
        let token = jwt.sign({
            username: data.username,
            _id: data._id
        }, 'aiguigu', {
            expiresIn: 60 * 60 * 24 * 7
        })
        //响应json
        res.json({
            code: '0000',
            msg: '登录成功',
            data: token
        })
        //登录成功响应
        res.render('success', { msg: '登录成功', url: '/account' });
    })
});

//退出登录
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.render('success', { msg: '退出登录成功', url: '/login' });
    });
})

module.exports = router;
