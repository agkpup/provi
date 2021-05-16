var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
path = require('path'),    

/*----------db ----------*/

router.use(express.json());
router.use(express.urlencoded({extended:true}));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhay@ue198003",
  database:'provi'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to provi db !");
});

router.post('/',(req,res,next)=>{
  const id = req.body.id;
con.query(`SELECT * from provi.shop_${id}`,(err,data)=>{
  if(err){
    console.log('error at get data of new tv',err);
    res.json({msg:'error occured at getdata of new tv'});
}
if(!!data){
  res.send(data);
}
})
})
module.exports = router;
