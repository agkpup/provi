var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 8;
require('dotenv').config();
/* GET home page. */
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhay@ue198003",
  database:'provi'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to provi db at customerOrder!");
});
router.get('/',(req,res)=>{
    res.send('customer id section ')
})
router.post('/',(req,res)=>{
    console.log(req.body);
    const orderId = req.body.orderId;
    const shopId = req.body.shopId;
  con.query('CREATE TABLE IF NOT EXISTS customerOrder (OrderId int(20) PRIMARY KEY AUTO_INCREMENT,fromCust varchar(10),toShop varchar(10),custorder varchar(8000),orderTime varchar(20),date varchar(20),recieved varchar(10),packed varchar(10),delivered varchar(10))',(err,result)=>{
      if(err){
          console.log('err st customerorder.js',err);
      }
      if(result){
          console.log('successfully created table customer order',result);
          con.query(`SELECT custorder FROM provi.customerOrder where orderId=${orderId} AND toShop = ${shopId}`,(err2,result2)=>{
             if(!!result2){
                if(result2.length==0){res.send({msg:'No record found',result:[]});} 
               else{ res.send({msg:`successfully found`,result:result2});}}
            if(!!err2){ res.json({msg:'Something Error occurred',result:[]});
            console.log('err in fetching customer',err2);    
            }
            })
      }
  })
})
router.get('/profile',(req,res)=>{
    res.send('customer profile page');
})
router.post('/profile',(req,res)=>{
    console.log(req.body);
    const shopId = req.body.shopId;
    console.log('customerorder console',req.body);
  con.query('CREATE TABLE IF NOT EXISTS customerOrder (OrderId int(20) PRIMARY KEY AUTO_INCREMENT,fromCust varchar(10),toShop varchar(10),custorder varchar(8000),orderTime varchar(20),date varchar(20),recieved varchar(10),packed varchar(10),delivered varchar(10))',(err,result)=>{
      if(err){
          console.log('err st customerorder.js',err);
      }
      if(result){
          console.log('successfully created table customer order',result);
          con.query(`select OrderId,Name,custAddress,date,orderTime,fromCust,mobile,recieved,packed,delivered FROM provi.user LEFT JOIN provi.customerorder ON provi.user.ID = provi.customerorder.fromcust WHERE toshop = ${shopId}`,(err2,result2)=>{
             if(!!result2){
                if(result2.length==0){res.send({msg:'No record found',result:[]});} 
               else{ res.send({msg:`successfully found`,result:result2});}}
            if(!!err2){ res.json({msg:'Something Error occurred ',result:[]});
            console.log('err in fetching customer',err2);    
            }
            })
      }
  })
})

router.get('/union',(req,res)=>{
    con.query('Select custorder from provi.user LEFT JOIN provi.customerorder ON provi.user.ID = provi.customerorder.fromCust WHERE toShop = 12 GROUP BY user.ID',(err,result)=>{
        if(err) res.send({msg:'error occurred',err:err,result:[]})
        if(result) res.send({msg:'successfully fetched',result:result})
    })
})

router.get('/recieveorder',(req,res)=>{
res.send('order recieve section')
})

router.post('/recieveOrder',(req,res)=>{
    if(req.body.length==0){
        res.send('No value find')
    }else{
        const shopId = req.body.shopId;
        const custId = req.body.custId;
        const custOrder = JSON.stringify(req.body.order);
        const address = req.body.address;
        const recieved = 'false';
        const packed = 'false';
        const delivered = 'false';
        var d = new Date();
        var orderdated = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
        var ordertime =`${d.getHours()}:${d.getMinutes()}`;
    con.query('CREATE TABLE IF NOT EXISTS customerOrder (OrderId int(20) PRIMARY KEY AUTO_INCREMENT,fromCust varchar(10),toShop varchar(10),custorder varchar(8000),custAddress varchar(200),orderTime varchar(20),date varchar(20),recieved varchar(10),packed varchar(10),delivered varchar(10))',(err,result)=>{
        if(err){
            console.log('err st customerorder.js ka recieve section',err);
        }
        if(!!result){
            con.query(`INSERT INTO customerOrder (fromCust,toShop,custorder,custAddress,orderTime,date,recieved,packed,delivered) VALUES (?,?,?,?,?,?,?,?,?)`,[custId,shopId,custOrder,address,ordertime,orderdated,recieved,packed,delivered],(err,result)=>{
                if(err){
                    console.log('error',err);
                    res.json({msg:'failed order placing'})
                }
                if(result){
                    console.log('result',result);
                    res.json({msg:'successfully placed order'})
                }
            })
        }
    })
}
    
})

module.exports = router;
