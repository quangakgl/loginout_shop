/**
 * Created by quang on 03/07/2017.
 */

const { db, } = require('../pgp');
exports.index = (req,res) =>{
    if(req.session['user']) {
        console.log(req.session.user)
    }
    db.any('SELECT * FROM information')
        .then( data =>{
            //console.log(data);
            res.render('index',{
                carts : data,

            })
        } )
}
exports.productdetail = (req, res) => {
    let id = req.params.id;
        db.any('SELECT * FROM information WHERE id = ' + id)
            .then(data => {
                //console.log(data);
                res.render('product-detail', {
                    carts: data
                })
            })
}
exports.giohang1 = (req,res) =>{
    db.any('SELECT * FROM information')
        .then( data =>{
            //console.log(data);

            res.render('giohang',{
                carts : data
            })
        } )
}
exports.thanhtoan = (req,res) =>{
    db.any('SELECT * FROM information')
        .then( data =>{
            //console.log(data);

            res.render('thanhtoan',{
                carts : data
            })
        } )
}

