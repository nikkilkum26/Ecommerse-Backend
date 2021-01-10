var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const {MONGOURI}= require('../db/keys')
var cors =require('cors');

router.use(cors({
  origin:"*"
}))

require('../models/schema');
require('../models/category');
require('../models/product');

mongoose.connect(MONGOURI,{
  useNewUrlParser:true,
  useUnifiedTopology: true ,
  useCreateIndex:true
})
mongoose.connection.on('connected',()=>{
  console.log("MongoDb Atlas is Connected");
}
)

mongoose.connection.on('error',(err)=>{
  console.log("MongoDb Atlas is throwing error ==> "+err);
}
)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
