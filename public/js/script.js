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

//showAlert
const showAlert=document.querySelector("[show-alert]");
if(showAlert){
    const time =parseInt(showAlert.getAttribute("data-time"));
    const closeAlert=document.querySelector("[close-alert]");
    setTimeout(()=>{
       showAlert.classList.add("alert-hidden");
    },time);
    closeAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hidden");
    })
}
//upload image
//updload image
const uploadImage=document.querySelector("[upload-image]");
if(uploadImage){
    const updloadImageInput=document.querySelector("[upload-image-input]");
    const updloadImagePreview=document.querySelector("[upload-image-preview]");
    updloadImageInput.addEventListener("change",(e)=>{
       const file=e.target.files[0];
       if(file){
        updloadImagePreview.src=URL.createObjectURL(file);
       }
    })
}
//end upload image
  
  
