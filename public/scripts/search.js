$(function(){
    //console.log(category);
    //console.log(search);

    if(typeof(category) != undefined)
        $("#category").val("default");
    else
        $("#category").val(category);

    console.log(search);
    $("#title").val(search);
})