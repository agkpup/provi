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
  console.log("Connected to provi db at authshop!");
});

router.get('/',(req,res)=>{
  console.log(secret);
})
router.get('/login',(req,res)=>{
  res.send('login authshop');
})
router.post('/login', function(req, res, next) {
 // console.log(req.body);
  const mobile= req.body.mobile;
  con.query(`SELECT * from provi.shopkepper WHERE mobile = ${mobile}`,(err,resu)=>{
    if(err){
      console.log('err at authShop db',err)
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
            res.json({msg:'Successful login',data:{ID:element.id,storeName:element.store_name,location:element.location,address:element.address,mobile:element.mobile,token:token}})
            console.log('successful login')
          }else{
            console.log('unsuccessful login');
            res.json({msg:'unSuccessful login'});
          }
        });
      });
      
      }
    }
    //res.json({msg:'recived at backend',result:result})
  })
});
router.get('/register',(req,res)=>{
  res.send('authshop js register')
})
router.post('/register', (req, res, next)=>{
  if(req.body.length==0){
    res.send('Null data send')
  }else{
     // console.log(req.body);
      bcryptjs.genSalt(saltRounds, (err, salt) => {
        bcryptjs.hash(req.body.password, salt, (err, hash) => {
            // Now we can store the password hash in db.
            if(err)console.log('error at hashing pass',err);
            if(hash)console.log('hash password',hash);
            con.query('CREATE TABLE IF NOT EXISTS provi.shopkepper(ID int(10) PRIMARY KEY AUTO_INCREMENT,store_name varchar(30),location varchar(30),address varchar(50),mobile varchar(20),password varchar(120),locality varchar(30),image varchar(100))',(err,result)=>{
              if(err) console.log('ERROR OCCURRED AT CREATING AUTHSHOP TABLE',err);
              if(result){
            con.query(`SELECT * FROM provi.shopkepper WHERE mobile = ${req.body.mobile}`,(err,result)=>{
              console.log('result shop from sql',result);
              if(err){
                console.log('error authShop select',err);
              }
              if(result.length > 0){
                res.send('already created Shop account please login');
              }else{
                con.query('INSERT INTO provi.shopkepper (store_name,location,address,mobile,password,locality) VALUES (?,?,?,?,?,?)',[req.body.storeName,req.body.location,req.body.address,req.body.mobile,hash,req.body.locality],(err,result)=>{
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
router.post('/sendlocality',(req,res,next)=>{
  if(!req.body){
    console.log('No req Body found')
  }
  console.log(req.body.location)
  //res.send('getting locality')
  con.query(`SELECT DISTINCT locality FROM provi.shopkepper WHERE location = '${req.body.location}'`,(err,result)=>{
    res.send(result);
    console.log(result);
  })
})

router.get('/sendServiceCity',(req,res,next)=>{
  if(!req.body){console.log('No req Body found')
  }
  console.log(req.body)
  //res.send('getting locality')
  con.query(`SELECT DISTINCT location FROM provi.shopkepper`,(err,result)=>{
    res.send(result);
    console.log(result);
  })
})

router.post('/getShop',(req,res,next)=>{
  if(!req.body){
    res.json({msg:'error occurred'})
    console.log('ERROR OCCURRED')
  }else{
    console.log(req.body);
    const location = req.body.location;
    const locality = req.body.locality;
  con.query(`SELECT ID,image,store_name,address,locality fROM provi.shopkepper WHERE location='${location}' AND locality='${locality}'`,(err,result)=>{
    if(!!result){
      res.send(result)
    }
    else{
      res.json({msg:'ERROR OCCURRED AT FETCHING SHOPLIST'})
    }
  })
}
})


router.post('/getitems',(req,res,next)=>{
  console.log(req.body)
  if(!req.body.ID){
    res.json({msg:'No shop selected',result:[]})
  }
  else{
  console.log(req.body)
 con.query(`SELECT * FROM provi.shop_${req.body.ID}`,(err,result)=>{
   if(!!err){
     console.log(err);
     res.json({msg:err,result:[]});
   }
   else{
     console.log(result);
     res.json({msg:'successfully found shop list',result:result})
   }
 })
}
})
router.post('/updateShopprofile',(req,res,next)=>{
 
  con.query(`UPDATE provi.shopkepper SET shopkepper.store_name='${req.body.name}',shopkepper.mobile='${req.body.mobile}',shopkepper.address='${req.body.address}' WHERE shopkepper.id=${req.body.id}`,(err,result)=>{
    if(err)console.log(err);
    if(result){
      res.jsonp({msg:'successfull updated'});
    }
  })
  //console.log(req.body);
})
module.exports = router;

