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
    $.ajax({
        url:"/posted",
        type: "post",
        data:{
            type:"allposted",
        },
        success: function(resp){
            if(resp.status == "success"){
                var alldata = resp.data;
                for(var i=0; i<alldata.length; i++){
                    createRoom(alldata[i].index, alldata[i].username, alldata[i].title,alldata[i].description,alldata[i].time_created,resp.user);
                }
            }
        }
    });
    
    
    document.getElementById("summit").addEventListener("click", function(){
        var topicTitle = document.getElementById("title").value;
        var topicDesc = document.getElementById("desc").value;
        $.ajax({
            url:"/posting",
            type:"post",
            data:{
                type: "newPost",
                title: topicTitle,
                description: topicDesc
            },
            success: function(resp){
                if(resp.status = "success"){
                    location.reload(); 
                }
            }
        });   
    });
    
    
});



    

function createRoom(index, username, title, description, time_created, user){
    var newD = document.createElement("div");
    var userN = document.createElement("div");
    var titleD = document.createElement("div");
    var descD = document.createElement("div");
    var tiemD = document.createElement("div");
    var linebreak = document.createElement("div");
        
    
        
    titleD.style.width = "94vw";
    titleD.style.height = "auto";
    titleD.innerHTML ="<h2>"+ title +"</h2>";
    newD.appendChild(titleD);
        
        
    descD.style.width = "94vw";
    descD.style.height = "auto";
    descD.innerHTML = description;
    newD.appendChild(descD);
    
    if(username = user){
        var delB = document.createElement("button");
        delB.innerHTML = "Delete";
        delB.style.float = "left";
        delB.addEventListener("click", function(){
            $.ajax({
                url: "/deletePost",
                type: "post",
                data:{
                    status: "delete",
                    index: index
                },
                success: function(resp){
                    location.reload();
                }
            });
        });
        document.body.appendChild(delB);
    }
    
//    userN.style.width = "10vw";
    userN.style.height = "auto";
    userN.style.float = "right";
    userN.innerHTML = username;
    userN.style.color = "red";
    userN.style.margin = "0 40px 0 0";
    newD.appendChild(userN);
    
//    tiemD.style.width = "10vw";
    tiemD.style.height = "auto";
    tiemD.style.float = "right";
    tiemD.innerHTML = time_created;
    tiemD.style.margin = "0 40px 0 0";
    newD.appendChild(tiemD);
    
    
    newD.style.position = "block";
    newD.style.height = "11vw";
    newD.style.width = "96vw";
    newD.style.height = "auto";
    newD.style.float = "left";
    newD.style.margin = "0 0 40px 0";
    document.body.appendChild(newD);
    
    linebreak.innerHTML = "<hr>";
    linebreak.style.margin = "0 0 60px 0";
    newD.appendChild(linebreak);
    
    newD.myindex= index;
    newD.addEventListener("click", function(){
        location.href = "/room/" +this.myindex;
    })
    
}

