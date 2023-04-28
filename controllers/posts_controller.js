const Post=require('../models/posts')
const Comment=require('../models/comments')
module.exports.create= async function(req,res){
    // Post.create({
    //     content:req.body.content,
    //     user:req.user._id
    // },function(err,post){
    //     if(err){
    //         console.log('Error in creating post:');
    //         return;
    //     }
    //     return res.redirect('back');
    // });

    //Same code as above using async & try/catch
try{
    await Post.create({
        content:req.body.content,
        user:req.user._id
    });
    req.flash('success','Post Created!');
    return res.redirect('back');
}
catch(err){
    req.flash('error',err);
    return res.redirect('back');
}
}

     //Same code as above using async & try/catch
module.exports.destroy = async function(req,res){
    // Post.findById(req.params.id,function(err,post){
    //     if(post.user == req.user.id){
    //         post.remove();
    //         Comment.deleteMany({post:req.params.id},function(err){
    //             return res.redirect('back');
    //         });
    //     }
    //     else{
    //         return res.redirect('back');
    //     }
    // });

try{
    let post=await Post.findById(req.params.id);

if(post.user == req.user.id){
    post.remove();
    await Comment.deleteMany({post:req.params.id}); 
    req.flash('success','Post Deleted!')       
    return res.redirect('back');
}
else{
    req.flash('error','You Cannot delete this Post!')
    return res.redirect('back');
}
}
catch(err){
    req.flash('error',err);
}
}