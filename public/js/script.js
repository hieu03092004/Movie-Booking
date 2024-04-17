// console.log("ok");
//booking
$(document).ready(function(){
    $('.larger').click(function(){
        var text= "";
      
        $('.larger:checked').each(function(){
            text+=$(this).val()+ ',';

        });
        text=text.substring(0,text.length-1);
        $('#selectedtext').val(text);

        var count = $("[type='checkbox']:checked").length;
        $('#count').val($("[type='checkbox']:checked").length);

        if(count == 8){
            document.getElementById('notvalid').innerHTML="Maximun seat seleact 8"
    return false;
        }
});
});
//pagination
const buttonsPagination=document.querySelectorAll("[button-pagination]");
if(buttonsPagination){
    let url=new URL(window.location.href);
    buttonsPagination.forEach(button=>{
        button.addEventListener("click",()=>{
            const page=button.getAttribute("button-pagination");
            url.searchParams.set("page",page);
            window.location.href=url.href;
        })
    })
}

//end pagiantion


