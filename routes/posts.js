const express=require('express');
const router=express.Router();
const passport=require('passport');

const postController =require('../controllers/posts_controller');

router.post('/create',passport.checkAuthentication,postController.create); //Checks if Authenticated User/Logged In user is requesting
router.get('/destroy/:id',passport.checkAuthentication,postController.destroy);

module.exports=router;