var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const bcryptjs = require('bcryptjs');
const saltRounds = 8;
const jwt = require('jsonwebtoken');
const { route } = require('.');
/* GET home page. */
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhay@ue198003",
  database:'provi'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to provi db at authuser!");
});

router.post('/login', function(req, res, next) {
  con.query(`SELECT * from provi.user WHERE mobile = ${req.body.mobile}`,(err,resu)=>{
    if(err){
      console.log('err at authuser db',err)
    } else{
      if(!!(resu.length==0)){
        res.json({msg:'No data found'})
        console.log('no data found');
      }else{
      resu.forEach(element => {
        bcryptjs.compare(req.body.password,element.password, function(err,val) {
          if(err)res.json({msg:'Error occurred at login'})
          if(val==true){
            const token = jwt.sign({ id:element.ID},process.env['SECRET'], {
              expiresIn: 86400 // expires in 24 hours
            });
            res.json({msg:'Successful login',data:{ID:element.ID,Name:element.Name,address:element.address,mobile:element.mobile,token:token}})
            console.log('successful login')
          }else{
            console.log('unsuccessful login');
            res.json({msg:'unSuccessful login'});
          }
        });
      });
      
      }
    }
  })  
});
router.post('/register', function(req, res, next) {
  if(req.body.length==0){
    res.send('Null data send')
  }else{
      console.log(req.body);
      bcryptjs.genSalt(saltRounds, (err, salt) => {
        bcryptjs.hash(req.body.password, salt, (err, hash) => {
            // Now we can store the password hash in db.
            if(err)console.log('error at hashing pass',err);
            if(hash)console.log('hash password',hash);
            con.query('CREATE TABLE IF NOT EXISTS provi.user (ID int(10) PRIMARY KEY AUTO_INCREMENT,Name varchar(30),address varchar(50),mobile varchar(20),password varchar(120))',(err,result)=>{
              if(err)console.log('ERROR AT CREATING AUTHUSER SECTION');
              if(result){
                console.log('SUCCESSFULLY CREATED AUTHUSER ACCOUNT')
            con.query(`SELECT * FROM provi.user WHERE mobile = ${req.body.mobile}`,(err,result)=>{
              console.log('result shop from sql',result);
              if(err){
                console.log('error authShop select',err);
              }
              if(result.length > 0){
                res.send('already created Shop account please login');
              }else{
                con.query('INSERT INTO provi.user (Name,address,mobile,password) VALUES (?,?,?,?)',[req.body.name,req.body.address,req.body.mobile,hash],(err,result)=>{
                  if(err){
                    console.log("err at reg authUser",err);
                  }else{
                    res.send('successfully created account');
                    console.log(result);
                  }
                })
              }
            })
          }
        })
        });
    });
  }
});
router.post('/getDeliveryLocation',(req,res)=>{
 // console.log(req.body)
  if(req.body){
  con.query(`SELECT Name,address,mobile from provi.user WHERE mobile = '${req.body.mobile}'`,(err,result)=>{
if(err){
  res.json({msg:'error occurred',result:[]})
}else{
  res.json({msg:'successfull',result:result})
}
  })
}else{
  console.log('No body found')
}
})

router.post('/getclientorder',(req,res)=>{
if(!req.body){
res.json({msg:'No UserId found',result:[]})
}else{
  con.query('CREATE TABLE IF NOT EXISTS customerOrder (OrderId int(20) PRIMARY KEY AUTO_INCREMENT,fromCust varchar(10),toShop varchar(10),custorder varchar(8000),orderTime varchar(20),date varchar(20),recieved varchar(10),packed varchar(10),delivered varchar(10))',(err,result)=>{
    if(err){
        console.log('err at authuser getclient.js',err);
    }
    if(result){
        console.log('successfully created table customer order',result);
        con.query(`select custorder,toShop,orderTime,date,recieved,packed,delivered FROM provi.user LEFT JOIN provi.customerorder ON provi.user.ID = provi.customerorder.fromcust WHERE fromCust = ${req.body.ID}`,(err2,result2)=>{
           if(!!result2){
              if(result2.length==0){res.send({msg:'No record found',result:[]});} 
             else{ res.send({msg:`successfully found`,result:result2});console.log(result2)}}
          if(!!err2){ res.json({msg:'Something Error occurred ',result:[]});
          console.log('err in fetching customer',err2);    
          }
          })
    }
})
}
})

router.post('/updateuserprofile',(req,res,next)=>{
 // console.log(req.body)
  con.query(`UPDATE provi.user SET user.Name='${req.body.name}',user.mobile='${req.body.mobile}',user.address='${req.body.address}' WHERE user.ID=${req.body.id}`,(err,result)=>{
    if(err)console.log(err);
    if(result){
      res.send('successfull updated');
      console.log('successfully update..')
    }
  })
  //console.log(req.body);
});
module.exports = router;
