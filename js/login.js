var loginShow = document.getElementById("loginshow"),
    regShow = document.getElementById("regshow");

loginShow.addEventListener("click", function(){
    document.getElementById("username").style.display = "none"; 
    document.getElementById("register").style.display = "none";
    
    document.getElementById("login").style.display = "inline-block"; 
});

regShow.addEventListener("click", function(){
    document.getElementById("login").style.display = "none";
    
    document.getElementById("register").style.display = "inline-block"; 
    document.getElementById("username").style.display = "inline-block"; 
});

$(document).ready(function(){
    //register button click ajax
    document.getElementById("register").addEventListener("click", function(){
        $.ajax({
            url:"/user/register",
            type:"post",
            data:{
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
                email: document.getElementById("email").value
            },
            success:function(resp){
                console.log(resp);
            }
        }) 
    });
    
    
    //login button click ajax
    document.getElementById("login").addEventListener("click", function(){
        $.ajax({
            url:"/user/login",
            type:"post",
            data:{
                password: document.getElementById("password").value,
                email: document.getElementById("email").value
            },
            success:function(resp){
                if(resp.status === "logined"){
                    location.href = "/post";
                }
                if(resp.status ==="not-logined"){
                    alert("Email or password incorrect.")
                }
            }
        }) 
    });
});