const Like=require('../models/likes');
const Post=require('../models/posts');
const Comment=require('../models/comments');

module.exports.toggleLike=async function(req,res){
    try{
        let likeable;
        let deleted=false; //When deleted is false Like can be increased by 1 if true like will be decreased by 0
        if(req.query.type == 'Post'){   //If the type of Object liked is POST/Comment,according to which likeable will change
            likeable=await Post.findById(req.query.id).populate('likes');
        }else{
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exists,for this we need to check if a user has already liked in requested Post/Comment
        let existingLike=await Like.findOne({
            likeable:req.query.id,
            user:req.user.id,
            onModel:req.query.type
        });

        //If a like already exists,delete it
        if(existingLike){
            likeable.likes.pull(existingLike.id);
            likeable.save();
            existingLike.remove();
            deleted=true;
        }
        else{
            //make a new like
            let newLike=await Like.create({
                user:req.user.id,
                likeable:req.query.id,
                onModel:req.query.type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        // 
        return res.json(200,{
            message:'Request successfully complete',
            data:{
            deleted:deleted
            }
        });
    }
    catch(err){
        console.error('Error occured while liking');
        return res.status(500).json({message:'Internal Server Error'}); 
    }
}