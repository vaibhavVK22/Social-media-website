const express = require('express');
const app = express();
const port=8000;
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const db=require('./models/mongoose');
//Used for session cookies
const session=require('express-session');
const passport = require('passport');
const passportLocal=require('./config/passport-local-strategy');
const pasportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customWare=require('./config/middleware');

//Setup the chat server to be used with socket.io
const chatServer=require('http').Server(app);
const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening to port 5000');
const path=require('path');

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}));
app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

//make the uploads path available to user
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(expressLayout);




//Setting up view engine
app.set('view engine','ejs');
app.set('views','./views');

//Adding middleware for cookies
app.use(session({
    name:'codeial',
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore({          //mongo store used to store the sesssion in the db
        mongooseConnection:db,
        autoRemove:'disabled'
    },
        function(err){
            console.log(err || 'Connect MongoDB Setup error');
        }
    )      


}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customWare.setFlash);

//use express router
app.use('/',require('./routes/index'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running server: ${err}`);
        return;
    }
    console.log(`Server is running on port:${port}`);
});
