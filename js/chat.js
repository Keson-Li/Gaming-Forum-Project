$(document).ready(function(){
    document.getElementById("logout").addEventListener("click", function() {
        $.ajax({
            url: "/logout",
            type: "post",
            success: function(resp){
                location.reload();
            }
        
    })
    });
    $.ajax({
        url: "/chatinfo",
        type: "post",
        data: {
            status: "check"
        },
        success: function(resp){
            if(resp.status === "success"){
                createReplyinfo(resp.rep, resp.time,resp.username);
                initSockets(resp.chatroomId, resp.sender);
            }
        }
    })
    
})


function createReplyinfo(rep, time, username){
    
    var msgD = document.createElement("div");
    var timeD = document.createElement("div");
    var replyD = document.createElement("div");
    
    var reptitle = document.createElement("p");
    var lineBreak = document.createElement("p");
    
    
    
    timeD.style.height = "auto";
    timeD.innerHTML = username+":  "+time;
    timeD.style.position="relative";
    timeD.style.left = "50%";
    msgD.appendChild(timeD);
    
    replyD.style.width = "94vw";
    replyD.style.height = "auto";
    replyD.innerHTML = rep;
    msgD.appendChild(replyD);
    
  
    msgD.style.display = "inline-block";
    msgD.style.backgroundColor = "grey";
    msgD.style.margin = "5px 0 5px 0";
    msgD.style.width = "96vw";
        
   
            
    document.getElementById("reply").appendChild(msgD);
    
    
    reptitle.innerHTML = "Chat Room";
    reptitle.style.textAlign = "center";
    reptitle.style.margin = "60px 0 0 0"
    reptitle.style.color = "red";
    reptitle.style.fontSize = "25px";
    document.getElementById("reply").appendChild(reptitle);
    
    lineBreak.innerHTML = "<hr>";
    document.getElementById("reply").appendChild(lineBreak);
}



function initSockets(chatroomId, sender){
    //connect to the io opened tunnel in the server
    var socket = io();
    
    //send a message to join a room
    socket.emit("join chat room", chatroomId);
      
    document.getElementById("send").addEventListener("click", function(){
            //when clicked, use your socket to send a message
            
            //create an ogj to send over
            
        var obj = {
            msg:document.getElementById("msg").value,
        };
            
            
        socket.emit("send message", obj);
        
    });
        
    socket.on("create message", function(obj){

        var nameD = document.createElement("div");
        var msgD = document.createElement("div");
        var chatinfo = document.createElement("div");
        
        nameD.innerHTML = sender+":  ";
        nameD.style.fontweight = "bold";
        nameD.style.color = "red";
        nameD.style.float = "left";
        nameD.style.clear = "left";
        chatinfo.appendChild(nameD);
    
        msgD.innerHTML = obj.msg;
        msgD.style.float = "left";
        chatinfo.appendChild(msgD);
            

        document.getElementById("display").appendChild(chatinfo);
        
        
    });
}