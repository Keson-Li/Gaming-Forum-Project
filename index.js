const express = require("express");
const port = process.env.PORT || 10000;
const path = require("path");
const bodyParser = require("body-parser");

//require session
const session = require("express-session");

var pF = path.resolve(__dirname, "public");
var app = express();

//create a new server for socket, but combine it with express functions
const server = require("http").createServer(app);

//create a socket server with the new server
var io = require("socket.io")(server);

//postgres
const pg = require("pg");

//dburl
var dbURL = process.env.DATABASE_URL || "postgres://postgres:li138@CMCC@localhost:5432/final_project";
//windows would be "postgres://postgres:password@localhost:5432/chatroom"

app.use("/scripts", express.static("build"));
app.use("/imgs", express.static("images"));
app.use(bodyParser.urlencoded({
    extended: true
}));

//use sessions
app.use(session({
    secret:"forum", //for cookie handling, type whatever you want
    resave: true,
    saveUninitialized: true
}));

app.get("/", function(req, resp){
    if(req.session.user){
        resp.sendFile(pF+"/post.html");
    } else {
        resp.sendFile(pF+"/login.html");
    }
    
});
app.get("/post", function(req, resp){
    if(req.session.user){
        resp.sendFile(pF+"/post.html");
    } else {
        resp.sendFile(pF+"/login.html");
    }
    
});



/*-----------------------------register and login---------------------------*/
app.post("/user/register", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }
        
        client.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id", [req.body.username, req.body.email, req.body.password], function(err, result){
            
            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }
            
            resp.send({status:"success", id:result.rows[0].id});
        });
    })
});

app.post("/user/login", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }
        
        client.query("SELECT * FROM users where email = $1 and password = $2", [req.body.email, req.body.password], function(err, result){
            
            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            } else {
                if(result.rows.length>0){
                    req.session.user = {
                        id: result.rows[0].id,
                        name: result.rows[0].username
                        
                    }
                    resp.send({status: "logined"})
                } else{
                    resp.send({
                        status: "not-logined"
                    })
                }
            }
        });
    })
});



/*-----------------------------posting---------------------------*/

app.post("/posted", function(req, resp){
    
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }
        
        client.query("SELECT a.username, b.title,b.description, b.time_created, b.id FROM users a JOIN posts b on a.id = b.user_id", [], function(err, result){
            
            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            } else {
                if(req.body.type == "allposted"){
                    var allposted =[];
                    for(var i = 0; i<result.rows.length; i++){
                        var record = {
                            index: result.rows[i].id,
                            username: result.rows[i].username,
                            title: result.rows[i].title,
                            description: result.rows[i].description,
                            time_created: result.rows[i].time_created,
                            
                        }
                        console.log(result.rows[i].time_created);
                        allposted.push(record);
                    }
        
                    resp.send({
                        status:"success",
                        user:req.session.user.name,
                        data:allposted
                    })
                }else {
                    resp.send({
                        status:"unknow"
                    })
                }
            }
        });
    }) 
});


app.post("/posting", function(req, resp){
    if(req.body.type == "newPost"){
        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            client.query("INSERT INTO posts (user_id, title, description) VALUES ($1, $2, $3)", [req.session.user.id, req.body.title, req.body.description], function(err, result){

                done();
                if(err){
                    console.log(err);
                    resp.send({status:"fail"});
                }

                resp.send({status:"success"});
            });
        })

    }
    
});


/*-----------------------------go to reply file---------------------------*/



app.get("/room/:roomindex", function(req, resp){
    if(req.session.user){
        var index = req.params.roomindex;
        req.session.postId = index;

        resp.sendFile(pF+"/reply.html");
    } else {
        resp.sendFile(pF+"/login.html");
    }
    
});


app.post("/room/roomId", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }
        
        client.query("SELECT a.username, b.title,b.description, b.time_created, b.id FROM users a JOIN posts b on a.id = b.user_id where b.id = $1", [req.session.postId], function(err, result){
            
            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            } else {
                resp.send({
                    status:"success",
                    username: result.rows[0].username,
                    title: result.rows[0].title,
                    description: result.rows[0].description,
                    time_created: result.rows[0].time_created
                });
            }
        });
    })
});

app.post("/checkreply", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }
        
        client.query("SELECT r.id, r.reply, r.time_created, u.username, r.upvote_num FROM replies r JOIN posts p on r.post_id = p.id JOIN users u on p.user_id = u.id where r.post_id = $1 order by r.upvote_num desc", [req.session.postId], function(err, result){
            
            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            } else {
                if(req.body.type == "allMsg"){
                    var allMsg =[];
                    for(var i = 0; i<result.rows.length; i++){
                        var record = {
                            index: result.rows[i].id,
                            rep: result.rows[i].reply,
                            time: result.rows[i].time_created,
                            username: result.rows[i].username,
                            upvoteQty:result.rows[i].upvote_num
                        }
                        allMsg.push(record);
                    }
        
                    resp.send({
                        status:"success",
                        data:allMsg
                    })
                }else {
                    resp.send({
                        status:"unknow"
                    })
                }
                
            }
        });
    })
});

app.post("/reply", function(req, resp){
    if(req.body.type == "send"){
        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            client.query("INSERT INTO replies (post_id, reply) VALUES ($1, $2)", [req.session.postId, req.body.data], function(err, result){

                done();
                if(err){
                    console.log(err);
                    resp.send({status:"fail"});
                }

                resp.send({status:"success"});
            });
        })

    }
    
});

app.post("/upvote", function(req, resp){
    if(req.body.type == "vote"){
        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            client.query("update replies set upvote_num = ($1) where id = $2", [req.body.Qty, req.body.id], function(err, result){

                done();
                if(err){
                    console.log(err);
                    resp.send({status:"fail"});
                }

                resp.send({status:"success"});
            });
        })

    }
    
});

/*-----------------------------chat room---------------------------*/
app.get("/chat/:chatindex", function(req, resp){
    if(req.session.user){
        var chatindex = req.params.chatindex;
        req.session.chatindex = chatindex;

        resp.sendFile(pF+"/chat.html");
    } else {
        resp.sendFile(pF+"/login.html");
    }
    
});

app.post("/chatinfo", function(req, resp){
    pg.connect(dbURL, function(err, client, done){
        if(err){
            console.log(err);
            resp.send({status:"fail"});
        }
        
        client.query("SELECT r.id, r.reply, r.time_created, u.username FROM replies r JOIN posts p on r.post_id = p.id JOIN users u on p.user_id = u.id where r.id =$1", [req.session.chatindex], function(err, result){
            
            done();
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            } else {
                if(req.body.status == "check"){
                    resp.send({
                        status:"success",
                        username:result.rows[0].username,
                        chatroomId:req.session.chatindex,
                        rep: result.rows[0].reply,
                        time: result.rows[0].time_created,
                        sender: req.session.user.name
                   })
                }else {
                    resp.send({
                        status:"fail"
                    })
                }
                
            }
        });
    })
});

/*-----------------------------delete posted---------------------------*/

app.post("/deletePost", function(req, resp){
    if(req.body.status == "delete"){
        pg.connect(dbURL, function(err, client, done){
            if(err){
                console.log(err);
                resp.send({status:"fail"});
            }

            client.query("delete from posts where id = ($1)", [req.body.index], function(err, result){

                done();
                if(err){
                    console.log(err);
                    resp.send({status:"fail"});
                }

                resp.send({status:"success"});
            });
        })

    }
    
});

/*-----------------------------logout---------------------------*/
app.post("/logout", function(req, resp){
    req.session.destroy();
    resp.send({status:"logouted"})
});

/*-----------------------------socket and listening to the port---------------------------*/


io.on("connection", function(socket){
    socket.on("join chat room", function(chatroomId){
        socket.roomId = "room"+chatroomId;
        socket.join(socket.roomId);
    });
    
    socket.on("send message", function(obj){

        io.to(socket.roomId).emit("create message", obj); 
        
    });
    
    socket.on("disconnect", function(){
        //when the user leaves my html, they "disconnect" by closing the connection 
    });
});




//not app.listen because we want to use the socket server, but we can keep all the express stuff above
server.listen(port, function(err){
    if(err){
        console.log(err);
        return false;
    }
    
    console.log(port+" is running");
});