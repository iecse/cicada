var express = require("express");
var bp = require("body-parser");
var hbs = require('express-handlebars');
var path = require('path');
var mysql = require('mysql');
var config = require('dotenv').config();
var app = express();

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',hbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

app.use(express.static('public'));

app.use(bp.urlencoded({extended: true}));
app.use(bp.json());
var http = require('http').Server(app);


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err)=>{
    if(err){
        console.log(err.toString());
    }
    else{
        console.log("connected");
    }
});


const data = require( "./data" );


app.post('/api/submitAnswer',function(req,res){
    try{
        var startTime = new Date( 2019 , 2 , 31 , 11 );
        var currentTime = new Date();
        var timeTaken = ( currentTime.getTime() - startTime.getTime() ) / 1000;
        
        var utoken = req.body.utoken;
        var question = req.body.question;
        var flag = req.body.flag;
        console.log( req.body );
        if( utoken == undefined || 
            question == undefined || 
            data['questionMapping'][question] == undefined || 
            data['userMapping'][utoken] == undefined ){

                res.setHeader('Content-Type', 'application/json');
                return res.json( { success : false , msg : "invalid format" } );
                

        }
        else{
            if( data['questionMapping'][question] === flag ){
                // correct answer
                db.query( "select * from submissions where question = ? and correctAnswer = 1 and utoken = ?" , [ question , utoken ] ,( err_check , res_check )=>{
                    if( err_check ){
                        console.log(err_check);
                        res.setHeader('Content-Type', 'application/json');
                        return res.json( { success : false , msg : "internal server error" } );
                    }
                    else{
                        if( res_check.length > 0 ){
                            // already correct answer
                            res.setHeader('Content-Type', 'application/json');
                            return res.json( { success : false , msg : "already correctly answered" } );
                        }
                        else{
                            // correct answer now
                            db.query( "insert into submissions(utoken,uid,question,submittedFlag,correctAnswer,points,timeSinceStart) values(?,?,?,?,?,?,?)" , [ utoken , data['userMapping'][utoken] , question , flag , 1 , data['questionPoints'][question] , timeTaken ] ,( err_correct , res_correct )=>{
                                if( err_correct ){
                                    console.log(err_correct);
                                    res.setHeader('Content-Type', 'application/json');
                                    return res.json( { success : false , msg : "internal server error" } );
                                }
                                else{
                                    res.setHeader('Content-Type', 'application/json');
                                    return res.json( { success : true , msg : "correct answer" } );
                                }
                            });
                        }
                    }
                });
            }
            else{
                // wrong answer
                db.query( "insert into submissions(utoken,uid,question,submittedFlag,correctAnswer,timeSinceStart) values(?,?,?,?,?,?)" , [ utoken , data['userMapping'][utoken] , question , flag , 0 , timeTaken ] ,( err_wrong , res_wrong )=>{
                    if( err_wrong ){
                        console.log(err_wrong);
                        res.setHeader('Content-Type', 'application/json');
                        return res.json( { success : false , msg : "internal server error" } );
                    }
                    else{
                        res.setHeader('Content-Type', 'application/json');
                        return res.json( { success : false , msg : "wrong answer" } );
                    }
                });
            }
        }
    }
    catch(err){
        console.log( err );
        res.setHeader('Content-Type', 'application/json');
        return res.json( { success : false , msg : "internal server error" } );
    }  
});


app.get('/api/leaderboard',function(req,res){
    try{
        var lb = [];
        db.query( "select sum(points) points,sum(timeSinceStart) tsum,uid from submissions where correctAnswer = 1 group by uid" ,( err_lb , res_lb )=>{
            if( err_lb ){
                console.log( err_lb );
                res.setHeader('Content-Type', 'application/json');
                return res.json( { success : false , msg : "internal server error" } );
            }
            else{
                res_lb.sort((x, y) => {
                    let n = y.points - x.points;
                    if (n !== 0) {
                        return n;
                    }
            
                    return x.tsum - y.tsum;
                });
                for( var i = 1; i <= 12 ; i++ ){
                    var found = false;
                    for( var j = 0; j< res_lb.length ; j++ ){
                        if( res_lb[j]['uid'] == i ){
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        res_lb.push( { points : 0 , tsum : 0 , uid : i } );
                    }
                }
                for( var i = 0 ; i < res_lb.length ; i++ ){
                    res_lb[i]['uname'] = data['userNames'][res_lb[i]['uid']];
                }
                
                res.setHeader('Content-Type', 'application/json');
                return res.json( { success : true , msg : "leaderboard sent" , lb:res_lb } );
            }
        });
        
    }
    catch(err){
        console.log(err);
    }
});


app.get('/leaderboard',function(req,res){
    try{
        var lb = [];
        db.query( "select sum(points) points,sum(timeSinceStart) tsum,uid from submissions where correctAnswer = 1 group by uid" ,( err_lb , res_lb )=>{
            if( err_lb ){
                console.log( err_lb );
                res.setHeader('Content-Type', 'application/json');
                return res.json( { success : false , msg : "internal server error" } );
            }
            else{
                res_lb.sort((x, y) => {
                    let n = y.points - x.points;
                    if (n !== 0) {
                        return n;
                    }
            
                    return x.tsum - y.tsum;
                });
                for( var i = 1; i <= 12 ; i++ ){
                    var found = false;
                    for( var j = 0; j< res_lb.length ; j++ ){
                        if( res_lb[j]['uid'] == i ){
                            found = true;
                            break;
                        }
                    }
                    if(!found){
                        res_lb.push( { points : 0 , tsum : 0 , uid : i } );
                    }
                }
                var start = "<!DOCTYPE html><html><head>    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />    <link rel=\"stylesheet\" type=\"text/css\" href=\"./style.css\" />    <title>Leaderboard</title></head><body>    <div id=\"page\" ALIGN=\"center\">        <table>            <tr>                <th>Rank</th>                <th>Team Name</th>                <th>Score</th>            </tr>";
                var end = "</table>        <div id=\"footer\"> </div>    </div></body><script type=\"text/javascript\">  setTimeout(function(){    location = ''  },5000)</script></html>";
                var medium = "";
                for( var i = 0; i < res_lb.length ; i++ ){
                    medium = medium + "<tr><td>"+( i + 1 )+"</td><td>"+( data['userNames'][res_lb[i]['uid']] )+"</td><td>"+res_lb[i]['points']+"</td></tr>";
                }
                
                res.writeHeader(200, {"Content-Type": "text/html"});
                res.write( start + medium + end );  
                return res.end();
            }
        });
        
    }
    catch(err){
        console.log(err);
    }
});

http.listen(5000);