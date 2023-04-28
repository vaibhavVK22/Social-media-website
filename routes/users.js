const express=require('express');
const router=express.Router();
const passport = require('passport');
const userController=require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.post('/update/:id',passport.checkAuthentication,userController.update);
router.get('/signIn',userController.signIn);
router.get('/signUp',userController.signUp);
router.post('/create',userController.create);

//USE PASSPORT AS A MIDDLEWARE TO AUTHENTICATE
router.post('/create-session',passport.authenticate('local',{failureRedirect:'/users/signIn'}),userController.createSession);

router.get('/signOut',userController.destroySession);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession);
router.get('/forgot_password',userController.forgotPassword);
router.post('/create_reset_token', userController.createResetPasswordToken);
router.get('/reset_password/:access_token',userController.resetPasswordPage);
router.post('/update-password/:access_token',userController.resetPassword);

module.exports=router;

