var express = require('express');
var router = express.Router();
var cors =require('cors');

router.use(cors({
  origin:"*"
}))

const {requireSignin,isAdmin,isAuth} = require('../controllers/auth')

const {userById,read,update} = require('../controllers/user')

router.get('/secret/:userId',requireSignin,isAuth,isAdmin,(req,res)=>{
    res.json({
        user:req.profile
    })
})

router.get('/user/:userId',requireSignin,isAuth,read)
router.put('/user/:userId',requireSignin,isAuth,update)


router.param('userId',userById);


module.exports = router;
