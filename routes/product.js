var express = require('express');
var router = express.Router();
var cors =require('cors');

router.use(cors({
  origin:"*"
}))


const {create,productById,read,remove,update,list,related,listCategories,listBySearch,photo,listSearch} = require('../controllers/product')

const {requireSignin,isAdmin,isAuth} = require('../controllers/auth')

const {userById} = require('../controllers/user')

router.post('/create/:userId',requireSignin,isAuth,isAdmin,create);


router.get('/products',list)

router.get("/products/search", listSearch);

router.get('/product/:productId',read)

router.get('/prod/categories',listCategories)

router.get('/prods/related/:productId', related)

router.post("/by/search", listBySearch);

router.get('/photo/:productId',photo)

router.delete('/:productId/:userId',requireSignin,isAdmin,isAuth,remove)
router.put('/:productId/:userId',requireSignin,isAdmin,isAuth,update)

router.param('userId',userById);
router.param('productId',productById);

module.exports = router;
