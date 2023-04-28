const Post=require('../models/posts');
const User=require('../models/users');
module.exports.home= async function(req,res){
   
// Post.find({},function(err,posts){

// return res.render('home',{title:'Codeial | Home',posts:posts});

// });
// Post.find({}).
// populate('user')
// .populate({path:'comments',
//     populate:{
//         path:'user'
//     }
// })
// .exec(function(err,posts){       //Populating the user with all the details of the object present in Database
//     User.find({},function(err,users){
//         return res.render('home',{title:'Codeial | Home',posts:posts,all_users:users});
//     });    
// });

//Same Code as above using async

try{
    let posts= await Post.find({}).
populate('user')
.populate({path:'comments',
    populate:{
        path:'user'
    }
});

let users=await User.find({});

return res.render('home',{
    title:'Codeial | Home',
    posts:posts,
    all_users:users});
}
catch(err){
    console.log("Error",err);
}
}
