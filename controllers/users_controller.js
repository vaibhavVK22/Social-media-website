const express=require('express');
const User=require('../models/users');
const PasswordToken = require('../models/reset_password_token');
const resetLinkMailer = require('../mailers/reset_password_mailer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

module.exports.profile=function(req,res){
    User.findById(req.params.id,function(err,user){
        return res.render('users',{title:'User Profile',profile_user:user});
    });
}
module.exports.update =async function(req, res){     //Update User data
    // if(req.user.id==req.params.id){
    //     User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         return res.redirect('back');
    //     });
    // }
    // else{
    //     return res.status(401).send('Unauthorized');
    // }
        if(req.user.id==req.params.id){
            try{
                let user=await User.findById(req.params.id);
                User.uploadedAvatar(req,res,function(err){
                    if(err){
                        console.log('**Multer error',err);
                    }
                    user.name=req.body.name;
                    user.email=req.body.email;
                    if(req.file){
                        //this is saving the path of the uploaded file into the avatar field of the user
                        user.avatar=User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();
                    return res.redirect('back');
                });
            }
            catch(err){
                req.flash('error',err);
                return res.redirect('back');
            }
        }
        else{
            req.flash('error','Unauthorized');
            return res.status(401).send('Unauthorized');
        }
    }



module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
       }

    return res.render('user_sign_in',{title:'Codeial | Sign In'});
}
module.exports.signUp=function(req,res){
   if(req.isAuthenticated()){
    return res.redirect('/users/profile');
   }
   
    return res.render('user_sign_up',{title:'Codeial | Sign Up'});
}
module.exports.create=function(req,res){
    console.log(req.body);
    if(req.body.password != req.body.confirm_password){
        req.flash('error','Password Does not Match')
        return res.redirect('back');
    }
    User.findOne({email:req.body.email}, function(err,user){
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }
        if(!user){
            User.create(req.body,function(err,user){
                if(err){
                console.log('Error in creating user');
                return;
                }
                req.flash('success','Registered Successfully!')
                return res.redirect('/users/signIn');
            });
        }
        else{
            req.flash('error','Already Registered');
            return res.redirect('back');
        }
    });
}
module.exports.createSession=function(req, res){
    //Without using passport & express session
    // console.log(req.body);
    // User.findOne({email:req.body.email},function(err,user){
    //     if(err){
    //         console.log('Error in sign in');
    //         return;
    //     }
    //     if(user){
    //         if(user.password != req.body.password){
    //             return res.redirect('back');
    //         }
    //         res.cookie('user_id',user.id);
    //         return res.redirect('/users/profile');
    //     }
    //     else{
    //         return res.redirect('back');
    //     }
    // });

    //USING PASSPORT AND EXPRESS SESSION
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}
//For Sign Out
module.exports.destroySession = function(req, res){
    req.logout(function(err){
        if(err){
        console.log(err);
        return;
        }
        req.flash('success','Logged Out');
        return res.redirect('/');
    });
}
module.exports.forgotPassword = function(req, res){
    res.render('user_forgot_password',{ 
        title:'Codeial | Forgot Password'
    });
}
module.exports.createResetPasswordToken= async function(req, res){
    try{
        let reqUser=await User.findOne({email:req.body.email});
        console.log(reqUser);
        if(reqUser){
            let passwordToken=await PasswordToken.create({ 
                user:reqUser._id,
                email:reqUser.email,
                accessToken: crypto.randomBytes(20).toString('hex'),
                isValid:true
            });
            //passwordToken = await passwordToken.populate('user','email').execPopulate();
            resetLinkMailer.newResetLink(passwordToken);
            req.flash('success', 'Reset Link Sent on your mail!')
            return res.redirect('back');
        } else {
            req.flash('error', 'Email does not exist!');
            return res.render('user_sign_in', {
                title: 'Connecti | Sign In'
            });
        }
    } catch (err) {
        console.log('Error in creating reset token!');
    }
}
module.exports.resetPasswordPage= async function(req, res){

    try{
        let passwordToken=await PasswordToken.findOne({accessToken:req.params.access_token});
        return res.render('user_reset_password',{
            title:'Codeial | Reset Password',
            password_token:passwordToken
        });
    }
    catch(err){
        console.log('Error in accessing reset token');
    }

}
module.exports.resetPassword=async function(req, res){
    PasswordToken.findOneAndUpdate({accessToken:req.params.access_token},{isValid:false},function(err,passwordToken){
        if(passwordToken.isValid==true){
            if(req.body.password!=req.body.confirm_password){
                req.flash('error','Passwords does not match');
                return res.redirect('back');
            }
            User.findByIdAndUpdate(passwordToken.user,{password:req.body.password},function(err, user){
                if(err){console.log('Error while resetting the password');return}
                req.flash('success','Password Updated Successfully!');
                return res.redirect('/users/signIn');
            });
        }
    });
}