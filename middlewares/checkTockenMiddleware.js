const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    let token = req.get('token');
    //判断
    if (!token) {
        return res.json({
            code: '2003',
            msg: 'token缺失',
            data: null
        });
    }
    //校验token
    jwt.verify(token, 'aiguigu', (err, data) => {
        if (err) {
            return res.json({
                code: '2004',
                msg: 'token校验失败',
                data: null
            })
        }
        next();
    });
}