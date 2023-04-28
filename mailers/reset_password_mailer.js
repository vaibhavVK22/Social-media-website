const nodeMailer = require('../config/nodemailer');

exports.newResetLink = (passwordToken) => {
    let htmlString = nodeMailer.renderTemplate({password_token : passwordToken}, '/reset_link.ejs');
    nodeMailer.transporter.sendMail({
        from : '2006200@kiit.ac.in',
        to : passwordToken.email,
        subject : 'Password Reset Link for Codeial!',
        html : htmlString
    }, (err, info) => {
        if(err){console.log('Error in sending mail', err); return;}
        console.log('Reset link sent', info);
        return;
    });
}