var express = require('express');
var router = express.Router();
var cors =require('cors');

router.use(cors({
  origin:"*"
}))


const {create,categoryById,read,update,remove,list} = require('../controllers/category')

const {requireSignin,isAdmin,isAuth} = require('../controllers/auth')

const {userById} = require('../controllers/user');


router.get('/categories',list);
router.get('/:categoryId',read);
router.post('/create/:userId',requireSignin,isAuth,isAdmin,create)
router.put('/:categoryId/:userId',requireSignin,isAuth,isAdmin,update)
router.delete('/:categoryId/:userId',requireSignin,isAuth,isAdmin,remove)



router.param('categoryId',categoryById);
router.param('userId',userById);






module.exports = router;
