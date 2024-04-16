var mysql=require("mysql");
var express=require('express');
var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'@Aashish1',
    database:'prototypeproject'
});
var nodemailer=require('nodemailer');
var path=require('path');
var bodyParser=require('body-parser');
var Registration = require('./SqlFunction');
var app=express();
var cookieparser=require('cookie-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieparser());
connection.connect(function(error){
    if(error) throw error;
    console.log("Database is connected!");
});
var transporter=nodemailer.createTransport({
    service:'Gmail',
    host:'smtp.gmail.com',
    port:5000,
    secure:'true',
    auth:{
        user:'hellocollege143@gmail.com',
        pass:'qgpx acjz lztl dgyj',
    },
});
var username,data;
app.get('/',function(req,res){
res.sendFile(path.resolve(__dirname,'public','index.html'));
});
app.get('/login',function(req,res){
    res.sendFile(path.resolve(__dirname,'public' ,'login.html'));
    });
    app.post('/checkUsername',function(req,res){
        query=`SELECT userName FROM userinfo WHERE userName='${req.body.username}'`;
        connection.query(query,function(error,result){
            if(error) throw error;
            if(result.length===0){
    res.send({available:true});
            }
            else{
                res.send({available:false});
            }
        });
    });
    var otpsent;
    app.post('/register',function(req,res){
        username=req.body.username,
       fullname=req.body.fullname,
       email=req.body.email,
       password=req.body.password,
       cpassword=req.body.cpassword;
       query=`SELECT userName FROM userinfo WHERE userName='${username}'`;
       connection.query(query,function(error,result){
           if(result.length===0){
               if(password===cpassword){
                   Registration.sendemail(username,fullname,email).then(result=>{
                             otpsent=result;
                          });
       res.sendFile(path.resolve(__dirname,'public','verify.html'),function(error,result){
           if(error) throw error;
       });
               }
               else{
                res.send('<script>alert("Password does not match!");alert("Your registration to our website is pending!"); window.location.href="./login.html";</script>');
                // res.send('<script>alert("Your registration to our website is pending!");</script>');
// res.sendFile(path.resolve(__dirname, 'public', 'login.html'), function(error, result) {
//     if (error) throw error;
// });
               }
           }
       else{
        res.send('<script>alert("Username exists!"); window.location.href="./login.html"; </script>');
    //    res.sendFile(path.resolve(__dirname,'public','login.html'),function(error,result){
    //        if(error) throw error;
    //    });
       }
       })
       });

    //verify

       app.post('/verify',function(req,res){
        var otp=req.body.first+req.body.second+req.body.third+req.body.fourth+req.body.fifth+req.body.sixth;
        otpsent = otpsent.toString();    
        if(otpsent===otp){
    Registration.Insertion(username,fullname,email,password);
    res.send('<script>alert("Your Account has been created!");alert("Please do log In!");window.location.href="./login.html"</script>');
    // res.send('<script></script');
    // res.sendFile(path.resolve(__dirname,'public','login.html'),function(error,result){
    //     if(error) throw error;
    // });
        }
        else{
            res.send('<script> alert("OTP does not match!");window.location.href="./login.html"</script>');
            // res.sendFile(path.resolve(__dirname,'public','login.html'));
        }
    });

//fromdatavalidation

    app.post('/fromdatabaseVerification',function(req,res){
        username=req.body.username;
        password=req.body.password;
        query=`SELECT userName,password FROM userinfo Where userName='${username}'`;
        connection.query(query,function(error,result){
            if(error) throw error;
        if(result.length===0){
            res.send(`<script>alert("Username does not exist!"); window.location.href = './login.html';</script>`);
            return;
        }
        
        if (result[0].password == password) {
            res.cookie("username", username).send(`<script>alert("You are logged in!"); window.location.href = './index.html';</script>`);        
        }
            else{
                res.send(`<script>alert("Password does not match!"); window.location.href = './login.html';</script>`);
            }
        });
        });
        
app.get('/photogallery',function(req,res){
res.sendFile(path.resolve(__dirname,'public','photo-gallery.html'));
});


        //load message

        app.post('/loadmessage',function(req,res){
            username=req.body.username;
        query=`SELECT * FROM \`${username}\``;
        connection.query(query,function(error,result){
        if(error) throw error;
        if(result.length==0){
            return;
        }
        else{
            query = `SELECT 
            COALESCE(\`${username}\`.issue, community.issue) AS issue,
            GREATEST(COALESCE(\`${username}\`.upvote, 0), community.upvote) AS upvote,
            GREATEST(COALESCE(\`${username}\`.downvote, 0), community.downvote) AS downvote
         FROM 
            prototypeproject.\`${username}\` AS \`${username}\`
         LEFT JOIN 
            prototypeproject.community AS community ON \`${username}\`.issue = community.issue ORDER BY upvote desc;
`;
connection.query(query,function(error,result){
    if(error) throw error;
    var responseData = []; 
    for(var i = 0; i < result.length; i++) {
        Data = {
            issue: result[i].issue,
            like: result[i].upvote,
            dislike: result[i].downvote
        };
        if(Data.issue===responseData.issue){
    
        }
        else{
            // console.log(Data);
        responseData.push(Data); 
        }
    }
    res.send(responseData);
});
        }
        });
        });

//add issue
app.post('/addissue', (req, res) => {
    const message = req.body.message;
    const username = req.body.username;
    const userQuery = `INSERT INTO \`${username}\` (issue) VALUES ('${message}')`;
    connection.query(userQuery, function (error, result) {
        if (error) {
            console.error('Error inserting into user table:', error);
            return res.status(500).send('An error occurred while adding the issue to the user table.');
        }
        const checkQuery = `SELECT issue FROM community WHERE issue='${message}'`;
        connection.query(checkQuery, function (error, result) {
            if (error) {
                console.error('Error checking issue existence in community table:', error);
                return res.status(500).send('An error occurred while checking the issue existence.');
            }
            if (result.length === 0) {
                const createQuery = `CREATE TABLE \`${message}\` (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    username VARCHAR(100) NOT NULL
                )`;
                connection.query(createQuery, function (error, result) {
                    if (error) {
                        console.error('Error creating message table:', error);
                        return res.status(500).send('An error occurred while creating the message table.');
                    }
                    const insertQuery = `INSERT INTO community (issue) VALUES ('${message}')`;
                    connection.query(insertQuery, function (error, result) {
                        if (error) {
                            console.error('Error inserting into community table:', error);
                            return res.status(500).send('An error occurred while adding the issue to the community.');
                        }

                        return res.sendStatus(200);
                    });
                });
            } else {
                return res.send('<script>alert("The issue exists in the community!"); </script>');
            }
        });
    });
});
        //commnity

        app.get('/community',function(req,res){
            res.sendFile(path.resolve(__dirname,'public','community.html'));
            });

            //community section

            app.post('/communitysection',function(req,res){
                var username = req.body.username;
                if(!username){
                    data = {
                        show: 'notshow'
                    };
                    res.send(data);
                } else {
                    query = `SELECT * FROM community order by upvote desc;`;
                    connection.query(query, function(error, result) {
                        if(error) throw error;
                        if(result.length == 0){
                            data = {
                                show: 'show',
                                message: 'nomessages'
                            };
                            res.send(data);
                        } else {
                            var responseData = []; 
                            for(var i = 0; i < result.length; i++) {
                                var messageData = {
                                    issue: result[i].issue,
                                    like: result[i].upvote,
                                    dislike: result[i].downvote
                                };
                                if(messageData.issue===responseData.issue){
            
                                }
                                else{
                                responseData.push(messageData); 
                                }
                            }
                            res.send(responseData);
                        }
                    });
                }
            });

//community section

app.post('/communitysection',function(req,res){
    var username = req.body.username;
    if(!username){
        data = {
            show: 'notshow'
        };
        res.send(data);
    } else {
        query = `SELECT * FROM community order by upvote desc;`;
        connection.query(query, function(error, result) {
            if(error) throw error;
            if(result.length == 0){
                data = {
                    show: 'show',
                    message: 'nomessages'
                };
                res.send(data);
            } else {
                var responseData = []; 
                for(var i = 0; i < result.length; i++) {
                    var messageData = {
                        issue: result[i].issue,
                        like: result[i].upvote,
                        dislike: result[i].downvote
                    };
                    if(messageData.issue===responseData.issue){

                    }
                    else{
                    responseData.push(messageData); 
                    }
                }
                // console.log(responseData);
                res.send(responseData); 
            }
        });
    }
});

//new community section

app.post('/newcommunitysection',function(req,res){
    var username = req.body.username;
    if(!username){
        data = {
            show: 'notshow'
        };
        res.send(data);
    } else {
        query = `SELECT * FROM community order by id desc;`;//previously asc with the combination of upvote
        connection.query(query, function(error, result) {
            if(error) throw error;
            if(result.length == 0){
                data = {
                    show: 'show',
                    message: 'nomessages'
                };
                res.send(data);
            } else {
                var responseData = [];
                for(var i = 0; i < result.length; i++) {
                    var messageData = {
                        issue: result[i].issue,
                        like: result[i].upvote,
                        dislike: result[i].downvote
                    };
                    if(messageData.issue===responseData.issue){

                    }
                    else{
                    responseData.push(messageData);
                    }
                }
                // console.log(responseData);
                res.send(responseData); 
            }
        });
    }
});

//likes
app.post('/like', function(req, res) {
    var issue = req.body.message;
    var username = req.body.username;
    var query = `SELECT username FROM \`${issue}\` WHERE username='${username}'`;
    connection.query(query, function(error, result) {
        if (error) {
       console.error("Error checking if user has liked the issue:", error);
            res.status(500).send("Error checking if user has liked the issue");
        } else {
            if (result.length === 0) {
                var insertQuery = `INSERT INTO \`${issue}\` (username) VALUES ('${username}')`;
                connection.query(insertQuery, function(error, result) {
                    if (error) {
                        console.error("Error inserting like into issue table:", error);
                        res.status(500).send("Error inserting like into issue table");
                    } else {
                        var updateQuery = `UPDATE community SET upvote = upvote + 1 WHERE issue = '${issue}'`;
                        connection.query(updateQuery, function(error, result) {
                            if (error) {
                                console.error("Error updating upvote in community table:", error);
                                res.status(500).send("Error updating upvote in community table");
                            } else {
                                var selectQuery = `SELECT upvote FROM community WHERE issue = '${issue}'`;
                                connection.query(selectQuery, function(error, result) {
                                    if (error) {
                                        console.error("Error retrieving upvote count:", error);
                                        res.status(500).send("Error retrieving upvote count");
                                    } else {
                                        var data = {
                                            upvote: result[0].upvote
                                        };
                                        res.send(data);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                var data = {
                    responded: 'yes'
                };
                res.send(data);
            }
        }
    });
});
//dislikes
app.post('/dislike', function(req, res) {
    var issue = req.body.message;
    var username = req.body.username;
    var query = `SELECT username FROM \`${issue}\` WHERE username='${username}'`;
    connection.query(query, function(error, result) {
        if (error) {
            console.error("Error checking if user has liked the issue:", error);
            res.status(500).send("Error checking if user has liked the issue");
        } else {
            if (result.length === 0) {
                var insertQuery = `INSERT INTO \`${issue}\` (username) VALUES ('${username}')`;
                connection.query(insertQuery, function(error, result) {
                    if (error) {
                        console.error("Error inserting dislike into issue table:", error);
                        res.status(500).send("Error inserting dislike into issue table");
                    } else {
                        var updateQuery = `UPDATE community SET downvote = downvote + 1 WHERE issue = '${issue}'`;
                        connection.query(updateQuery, function(error, result) {
                            if (error) {
                                console.error("Error updating upvote in community table:", error);
                                res.status(500).send("Error updating upvote in community table");
                            } else {
                                var selectQuery = `SELECT downvote FROM community WHERE issue = '${issue}'`;
                                connection.query(selectQuery, function(error, result) {
                                    if (error) {
                                        console.error("Error retrieving upvote count:", error);
                                        res.status(500).send("Error retrieving upvote count");
                                    } else {
                                        var data = {
                                            downvote: result[0].upvote
                                        };
                                        res.send(data);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                var data = {
                    responded: 'yes'
                };
                res.send(data);
            }
        }
    });
});
//////////////////////////////////////
//faq addition
/////////////////////////////////////
app.get('/faq',function(req,res){
res.sendFile(path.resolve(__dirname,'public','faq.html'));
});

//////////////////////////////////////
//Creating Dynamic Layout
/////////////////////////////////////

app.post('/realtimechange', function(req, res){
    var query = `SELECT userName FROM userinfo`;
    connection.query(query, function(error, result){
        if(error) throw error;
        var usercount = result.length;

        var query = `SELECT id FROM community`;
        connection.query(query, function(error, result){
            if(error) throw error;
            var communitycount = result.length;

            var data = {
                usercount: usercount,
                communitycount: communitycount
            };
            res.send(data);
        });
    });
});

/////////////////////////////////////////////
//update.html
////////////////////////////////////////////
app.get('/update',function(req,res){
res.sendFile(path.resolve(__dirname,'public','update.html'));
});

/////////////////////////////////////////////
//competitive programming
////////////////////////////////////////////
app.get('/computercourse', function(req, res){
    res.sendFile(path.resolve(__dirname, 'public', 'computer_courses.html'));
});

/////////////////////////////////////////////
//Merchandize router
////////////////////////////////////////////

app.get('/merchandise',function(req,res){
res.sendFile(path.resolve(__dirname,'public','merchandise.html'));
});

/////////////////////////////////////////////////
//addying group communication features
////////////////////////////////////////////////

app.get('/communicationchat',function(req,res){
res.sendFile(path.resolve(__dirname,'public','chat.html'));
});
//sending group communication chat!
app.post('/sendgroupchat', function(req, res) {
     username = req.body.username;
     query = `SELECT joinedgroupname FROM \`${username}Group\``;

    connection.query(query, function(error, result) {
        if (error) {
            throw error;
        }
        if (result.length === 0) {
            const data = {
                message: 'nomessage'
            };
            res.send(data);
        } else {
            const responseData = [];
            for (let i = 0; i < result.length; i++) {
                const messageData = {
                    group: result[i].joinedgroupname
                };
                responseData.push(messageData);
            }
            res.send(responseData);
        }
    });
});

app.post('/showmessage',function(req,res){

});

//creating a group
// app.post('/creatinggroup',function(req,res){
//     app.post('/creatinggroup', function(req, res) {
//         var groupName = req.body.groupname;
//         var username = req.body.username;
    
//         if (!groupName) {
//             return res.status(400).json({ error: 'Group name is required' });
//         }
    
//         var query = `CREATE TABLE IF NOT EXISTS \`${groupName}\` (
//             id INT PRIMARY KEY AUTO_INCREMENT,
//             message VARCHAR(500),
//             username VARCHAR(100),
//             time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//         )`;
        
//         connection.query(query, function(error, result) {
//             if (error) {
//                 console.error('Error creating group table:', error);
//                 return res.status(500).json({ error: 'Internal server error' });
//             }
            
//             res.json({ created: 'yes' });
//         });
//     });
    

//retreiving the group content


/////////////////////////////////////////////////////
//404 error page 
/////////////////////////////////////////////////////
app.get('*',function(req, res){
    res.sendFile(path.resolve(__dirname,'public','404.svg'));
});


//listening 

        var port=3000;

app.listen(port,function(error,result){
    if(error) throw error;
    console.log(`Server is working of the port ${port}`);
});
