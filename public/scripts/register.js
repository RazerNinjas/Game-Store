$(function(){
    $("#register").submit(function(){

        if(validUsername($("#username").val()) && validPassword($("#password").val()))
            return true;     
        else
            return false;
    });

    $("#username").change(function(){
        if($(this).val().length === 0)
        {
            $(this).css("background-color","transparent"); 
            if($("#username-error").length){
                $("#username-error").remove();
            }
        }
        else
        {
            if(validUsername($(this).val()))
                $(this).css("background-color","lightgreen"); 
            else
                $(this).css("background-color","lightcoral"); 
        }
    });

    $("#password").change(function(){
        if($(this).val().length === 0)
        {
            $(this).css("background-color","transparent"); 
            if($("#password-error1").length)
                $("#password-error1").remove();

            if($("#password-error2").length)
                $("#password-error2").remove();
            
            if($("#password-error3").length)
                $("#password-error3").remove();
            
            if($("#password-error4").length)
                $("#password-error4").remove(); 
        }
        else{
            if(validPassword($(this).val()))
                $(this).css("background-color","lightgreen"); 
            else
                $(this).css("background-color","lightcoral"); 
        }
    });
});

function validUsername(username)
{
    let regUsername = /^[a-zA-Z0-9]+$/;
    if(regUsername.test(username)){
        if($("#username-error").length){
            $("#username-error").remove();
        }
    
        return true;
    }
    else 
    {
        if(!$("#username-error").length){
            $(`<div id="username-error" class="error"> </div>`).appendTo('#form-username');
            $('#username-error').text("Error: contains non alphanumeric characters");
        }

        return false;
    }  
}

function validPassword(password)
{
    let regPassword = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (regPassword.test(password))
    {
        if($("#password-error1").length)
            $("#password-error1").remove();

        if($("#password-error2").length)
            $("#password-error2").remove();
            
        if($("#password-error3").length)
            $("#password-error3").remove();
            
        if($("#password-error4").length)
            $("#password-error4").remove(); 
        
        return true;
    }
    else
    {
        let regNumber = /[0-9]/;
        let regUpper = /[A-Z]/
        let regLower = /[a-z]/
        if (!regLower.test(password)){
            if(!$("#password-error1").length){
                $(`<div id="password-error1" class="error"> </div>`).appendTo('#form-password');
                $('#password-error1').text("Error: doesn't contain a lowercase letter");
            }
        }
        else {
            if($("#password-error1").length)
                $("#password-error1").remove();   
        }
        if (!regUpper.test(password)){
            if(!$("#password-error2").length){
                $(`<div id="password-error2" class="error"> </div>`).appendTo('#form-password');
                $('#password-error2').text("Error: doesn't contain an uppercase letter");
            }
        }
        else{
            if($("#password-error2").length)
                $("#password-error2").remove();
        }
        if (!regNumber.test(password)){
            if(!$("#password-error3").length){
                $(`<div id="password-error3" class="error"> </div>`).appendTo('#form-password');
                $('#password-error3').text("Error: doesn't contain a number");
            }
        }
        else{
            if($("#password-error3").length)
                $("#password-error3").remove();
        }
        if (password.length < 6){
            if(!$("#password-error4").length){
                $(`<div id="password-error4" class="error"> </div>`).appendTo('#form-password');
                $('#password-error4').text("Error: is less than 6 characters long");
            }
        }
        else{
            if($("#password-error4").length)
                $("#password-error4").remove(); 
        }

        return false;
    }
}