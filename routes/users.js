/**
 * Created by quang on 04/07/2017.
 */
const bcrypt = require('bcryptjs');
const { db,config } = require('../pgp');

module.exports = function (app, express) {


    // handle sign up request
    app.post('/signup', (req, res) => {
       //console.log(req.body);

        db.any("SELECT * FROM users WHERE username = $1", [req.body.username, req.body.password,req.body.phonenumber])
            .then(data => {
                if (data.length === 0) {
                    // this username does not yet exist
                    // hasing password by auto-generating a salt and hash
                    bcrypt.hash(req.body.password, 5, function (err, hash) {
                        db.none("INSERT INTO users (username, password,phonenumber) VALUES($1, $2,$3)", [req.body.username, hash,req.body.phonenumber])
                            .then(() => {
                                //console.log('Insert account successfully');
                                //req.flash('info','Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ!')
                                res.render('index', { status: 'Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ!' });
                            })
                            .catch(error => {
                                console.log(error.message);
                            });
                    });

                } else {
                    // this username already exists
                    res.render('index', { status: 'Tài khoản đã tồn tại. Vui lòng đăng nhập hoặc đăng ký một tài khoản khác!' })
                }
            })
            .catch(error => {
                console.log(error.message);
            });;
    });
    // handle sign in request
    app.post('/signin', (req, res) => {
        console.log(req.body);
        db.oneOrNone("SELECT * FROM users WHERE username = $1", [req.body.username, req.body.password])
            .then(data => {
                if (data === null) {
                    // this account does not match
                    console.log('Log in unsuccessfully. Account does not exist!!!');
                    res.render('index', { status: 'Đăng nhập không thành công. Tài khoản không tồn tại!!!' });
                } else {
                    console.log(data);
                    // this account matches
                    bcrypt.compare(req.body.password, data.password, function (err, hashRes) {
                        if (hashRes) {
                            //console.log('Log in successfully');
                            req.session.user = req.body.username;
                            res.render('index', { status: 'Bạn đăng nhập thành công!', username: req.body.username, password: data.password });
                        } else {
                            //console.log('Log in unsuccessfully. Account does not match!!!');
                            res.render('index', { status: 'Đăng nhập không thành công. Tài khoản không khớp !!!' });
                        }
                    })
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    });
}