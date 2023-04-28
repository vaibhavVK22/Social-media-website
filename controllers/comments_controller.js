const Comment=require('../models/comments');
const Post=require('../models/posts');
const commentsMailer=require('../mailers/comments_mailer');
const queue=require('../config/kue');
const commentEmailWorker=require('../workers/comment_email_worker');



module.exports.create=function(req,res){
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content: req.body.content,
                post:req.body.post,
                user:req.user._id,
                email:req.user.email
            },function(err,comment){
                //handle error
                post.comments.push(comment);
                post.save();
                //commentsMailer.newComment(comment);
               let job= queue.create('emails',comment).save(function(err){  //Using KUE for delayed jobs
                    if(err){
                        console.log('Error in creating queue',err);
                        return
                    }
                    console.log('job enqueued',job.id);
                })
                req.flash('success','Commented');
                res.redirect('back');
            });
        }
    });
}
module.exports.destroy=function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment.user==req.user.id){
            let postId=comment.post;
            comment.remove();

            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){  //Pull removes from an existing array with the matched specified condition
                req.flash('error','Comment Deleted!');
                return res.redirect('back');
            })
        }
        else{
            return res.redirect('back');
        }
    })
}