$(document).ready(function(){
    document.getElementById("logout").addEventListener("click", function() {
        $.ajax({
            url: "/logout",
            type: "post",
            success: function(resp){
                location.reload();
            }
        
        });
    });
    document.getElementById("send").addEventListener("click", function(){
        $.ajax({
            url: "/reply",
            type: "post",
            data:{
                type: "send",
                data: document.getElementById("msg").value
            },
            success: function(resp){
                if(resp.status = "success"){
                    location.reload(); 
                }
                
            }
        }); 
    
    })
    $.ajax({
        url: "/room/roomId",
        type: "post",
        success: function(resp){
            if(resp.status == "success"){
                createRoom(resp.username, resp.title, resp.description, resp.time_created);
                
                $.ajax({
                    url: "/checkreply",
                    type: "post",
                    data:{type: "allMsg"},
                    success: function(subresp){
                         
                        if(subresp.status === "success"){
                            var alldata = subresp.data;
                            for(var i=0; i<alldata.length; i++){
                                addHistoryMsg(alldata[i].index,alldata[i].rep, alldata[i].time, alldata[i].username, alldata[i].upvoteQty);
                            }
                        }                         
                    }
                });  
            }
        }
            
    });    
});



function addHistoryMsg(index, rep, time, username, upvoteQty){
    
    var msgD = document.createElement("div");
    var timeD = document.createElement("div");
    var replyD = document.createElement("div");
    var chatB = document.createElement("button");
    var upvoteNum = document.createElement("div");
    var upvote = document.createElement("img");
    
    
    
    timeD.style.height = "auto";
    timeD.innerHTML = username+":  "+time;
//    timeD.style.position="relative";
//    timeD.style.left = "50%";
    timeD.style.textAlign = "center";
    msgD.appendChild(timeD);
    
    replyD.style.width = "94vw";
    replyD.style.height = "auto";
    replyD.innerHTML = rep;
    msgD.appendChild(replyD);
    
    chatB.style.float = "right";
    chatB.innerHTML = "Chat";
    chatB.chatindex=index;
    chatB.addEventListener("click", function(){
        location.href = "/chat/"+this.chatindex;
    })
    msgD.appendChild(chatB);
    
    upvote.src = "/imgs/upvote.png";
    upvote.style.height = "15px";
    upvote.style.float = "right";
    upvote.onclick = function(){
        $.ajax({
            url: "/upvote",
            type: "post",
            data: {
                type: "vote",
                id:index,
                Qty:upvoteQty+1
            },
            success: function(resp){
                if(resp.status === "success"){
                    location.reload();
                }
            },
        })
    };
    msgD.appendChild(upvote);
    
    upvoteNum.style.fontSize = "15px";
    upvoteNum.style.float = "right";
    upvoteNum.innerHTML = upvoteQty;
    msgD.appendChild(upvoteNum);
    
    

       
    msgD.style.display = "inline-block";
    msgD.style.backgroundColor = "grey";
    msgD.style.margin = "5px 0 5px 0";
    msgD.style.width = "96vw";
        
   
            
            //append it
    document.getElementById("display").appendChild(msgD);
}


function createRoom(username,title, description, time_created){
    var newD = document.createElement("div");
    var userN = document.createElement("div");
    var titleD = document.createElement("div");
    var descD = document.createElement("div");
    var tiemD = document.createElement("div");
    
    var reptitle = document.createElement("p");
    var lineBreak = document.createElement("p");
        
    
        
    titleD.style.width = "94vw";
    titleD.style.height = "auto";
    titleD.innerHTML ="<h2>"+ title +"</h2>";
    newD.appendChild(titleD);
        
        
    descD.style.width = "94vw";
    descD.style.height = "auto";
    descD.innerHTML = description;
    newD.appendChild(descD);

    userN.style.height = "auto";
    userN.style.float = "right";
    userN.innerHTML = username;
    userN.style.margin = "0 40px 0 0";
    newD.appendChild(userN);
    
    tiemD.style.height = "auto";
    tiemD.style.float = "right";
    tiemD.innerHTML = time_created;
    tiemD.style.margin = "0 40px 0 0";
    newD.appendChild(tiemD);
    
    
    newD.style.position = "block";
    newD.style.width = "96vw";
    newD.style.margin = "0 0 20px 0";
    document.getElementById("topic").appendChild(newD);
    
    
    reptitle.innerHTML = "Replies";
    reptitle.style.textAlign = "center" ;
    reptitle.style.margin = "60px 0 0 0"
    reptitle.style.color = "red";
    reptitle.style.fontSize = "25px";
    document.getElementById("topic").appendChild(reptitle);
    
    lineBreak.innerHTML = "<hr>";
    document.getElementById("topic").appendChild(lineBreak);
       
}

