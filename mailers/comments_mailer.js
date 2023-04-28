const nodeMailer=require('../config/nodemailer');

//another way of exporting a method
exports.newComment=(comment)=>{
    let htmlString=nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from:'2006200@kiit.ac.in',
        to:comment.email,
        subject:'New Comment published',
        html:htmlString
    },(err,info)=>{
        if(err) {
            console.log('Error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
        return;
    });
}