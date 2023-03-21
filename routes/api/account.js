const express = require('express');
const router = express.Router();
const checkTockenMiddleware = require("../../middlewares/checkTockenMiddleware");
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
const jwt = require('jsonwebtoken')

/* 记账本首页  */
router.get('/account', checkTockenMiddleware, function (req, res, next) {
    //读取数据库
    AccountModel.find().sort({ time: -1 }).exec((err, data) => {
        if (err) {
            return res.json({
                code: '1001',
                msg: '读取失败',
                data: null
            })
        }
        res.json({
            //响应编号
            code: '0000',
            //响应的信息
            msg: '读取成功',
            //响应的数据
            data: data
        });
    });
});

/* 新增账单 */
router.post('/account', checkTockenMiddleware, function (req, res, next) {
    //插入数据库
    AccountModel.create({
        ...req.body,
        time: moment(req.body.time).toDate()
    }, (err, data) => {
        if (err) {
            return res.json({
                code: '1002',
                msg: '插入失败',
                data: null
            });
        }
        res.json({
            code: '0000',
            msg: '插入成功',
            data: data
        });
    })
});

/* 删除记录 */
router.delete('/account/:id', checkTockenMiddleware, function (req, res, next) {
    let id = req.params.id;
    //从数据库中删除
    AccountModel.deleteOne({ _id: id }).exec((err, data) => {
        if (err) {
            return res.json({
                code: "1003",
                msg: '删除失败',
                data: null
            });
        }
        res.json({
            code: '0000',
            msg: '删除成功',
            data: {}
        });
    })
});


/* 获取单个账单信息 */
router.get('/account/:id', checkTockenMiddleware, (req, res) => {
    //获取参数
    let { id } = req.params;
    //查询数据库
    AccountModel.findById(id, (err, data) => {
        if (err) {
            return res.json({
                code: '1004',
                msg: '获取失败',
                data: null
            })
        }
        res.json({
            code: '0000',
            msg: '获取成功',
            data: data
        })
    })
});


/* 更新账单信息 */
router.patch('/account/:id', checkTockenMiddleware, (req, res) => {
    //获取 id 参数值
    let { id } = req.params;
    //更新数据库
    AccountModel.updateOne({ _id: id }, req.body, (err, data) => {
        if (err) {
            return res.json({
                code: '1005',
                msg: '更新失败~~',
                data: null
            })
        }
        //再次查询数据库 获取单条数据
        AccountModel.findById(id, (err, data) => {
            if (err) {
                return res.json({
                    code: '1004',
                    msg: '读取失败~~',
                    data: null
                })
            }
            //成功响应
            res.json({
                code: '0000',
                msg: '更新成功',
                data: data
            })
        })

    });
});
module.exports = router;
