var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const fs = require('fs');
path = require('path');
router.use(express.json());
router.use(express.urlencoded({extended:true}));
var compression = require('compression');
const imgUploadPath = [];
router.use(compression({ filter: shouldCompress }))
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }
 
  // fallback to standard filter function
  return compression.filter(req, res)
}


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:'provi'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to provi for creating shop index db !");
});

router.get('/',(req,res,next)=>{
  res.send('shop upload section')
})
router.post('/',(req,res,next)=>{
//console.log(req.body);
const ID = req.body.ID;
const img = req.body.img;
var dir = `./databases/shop/shop_${ID}`;
if(!!img){
  try {
    fs.mkdirSync(dir,{recursive: true},(err)=>{console.log(err)
    });
    console.log(`successfully created ${dir} directory`);
  } catch(e) {
    if (e.code != 'EEXIST') 
    console.log(e)
    ;
  }
    var base64Data = img.image.replace(/^data:image\/\w+;base64,/, '')
    var ext = path.extname(img.name);
    filePath = path.join(dir, `pic_${ID}.${ext}`);
    fs.writeFile(filePath, base64Data,{encoding: 'base64'}, function(err, data) {
    if (err) {
              console.log('error at writing file',err)
            }
              })
              console.log(`successful upload ${filePath}`);
              imgUploadPath.push(filePath);
              console.log('imgUploadPath',imgUploadPath);
              con.query(`CREATE TABLE IF NOT EXISTS shop_${ID} (ID int(10) PRIMARY KEY AUTO_INCREMENT,productName varchar(50),price int(10),dprice int(10),img varchar(200),quantity int(5))`,(err,result)=>{
                if(err){console.log('ERROR IN CREATING TABLE',err)
                }
                if(result){console.log(`SUCCESSFULLY CREATED shop_${ID} TABLE`)
                con.query(`INSERT INTO shop_${ID} (productName,price,dprice,img) VALUES (?,?,?,?)`,[req.body.productName,req.body.price,req.body.dprice,imgUploadPath[0]],(err,result)=>{
                  if(err)console.log(err);
                   res.send('Successfully uploaded !');
                  console.log(result);
                })
              
              }
              })
}
else{
  console.log({msg:'no image found to save'});
}
//res.status(200).send('recieveing at bacjend');
})

router.get('/getData',(req,res,next)=>{
  res.send('Get data of upload.js')
})

router.post('/getData',(req,res,next)=>{
  if(!req.body.ID){
    console.log('no body found')
  }else{
    console.log(req.body)
  const ID = req.body.ID;
con.query(`SELECT * from provi.shop_${ID}`,(err,data)=>{
  if(err){
    console.log(`error at get data of shop_${ID}`,err);
    res.json({msg:'error occured at getdata',result:null});
}
if(!!data){
  res.json({msg:'shop item are listed here',result:data});
}
})
  }
})

router.post('/delData',(req,res,next)=>{
  const ID = req.body.ID;
  const pId = req.body.pId;
con.query(`DELETE FROM provi.shop_${ID} WHERE ID=${pId}`,(err,data)=>{
  if(err){
    console.log(`Error in delete shop_${ID}'s row with ID ${pId}`,err);
    res.json({msg:`Error in delete shop_${ID}'s row with ID ${pId}`});
}
if(!!data){
  res.json({msg:'Successfully removed'});
}
})
})

router.post('/feedbackForm',(req,res)=>{
  if(!req.body){
    res.json({msg:'No data send found'});
  }else{
    con.query('CREATE TABLE IF NOT EXISTS feedback (ID int(5) PRIMARY KEY AUTO_INCREMENT,name varchar(50),mobile varchar(10),location varchar(50),locality varchar(50),comment varchar(500))',(err,result)=>{
      if(err){
        console.log('No table created',err)
      }else{
        con.query('INSERT INTO provi.feedback (name,mobile,location,locality,comment) VALUES (?,?,?,?,?)',[req.body.name,req.body.mobile,req.body.location,req.body.locality,req.body.comment],(err,result)=>{
          if(err){
            console.log('Error ',err)
            res.json({msg:'Error at feedback',result:[]})
          }else{
            res.json({msg:'successfull feedback',result:result})
          }
        })
      }
    })
  }
})
module.exports = router;
