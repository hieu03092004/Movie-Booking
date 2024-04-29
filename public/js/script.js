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
//button showDate
const buttonShowDate=document.querySelectorAll("[button-showDate]");
if(buttonShowDate.length>0){
    let url=new URL(window.location.href);
  buttonShowDate.forEach(button=>{
    button.addEventListener("click",()=>{
        function convertDateFormat(dateString) {
            // Tách ngày, tháng và năm từ chuỗi đầu vào
            const parts = dateString.split('/');
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
        
            // Ghép lại chuỗi mới với dấu "-"
            return `${year}-${month}-${day}`;
        }
        
        const showDate=button.getAttribute("button-showDate");
        const convertedDate = convertDateFormat(showDate);
        if(showDate ){
            url.searchParams.set("showDate",convertedDate);
        }
        window.location.href=url.href;
        
    })
  })
}
//end button showDate
//slider
let slideIndex = 0;
showSlides();
function showSlides() {
    let slides=document.querySelectorAll('.slider img');
    for(let i=0;i<slides.length;i++){
        slides[i].style.display="none";
     // Change image every 2 seconds
  }
    slideIndex++;
    if(slideIndex>slides.length){
        slideIndex=1;
    }
    slides[slideIndex-1].style.display="block";
    setTimeout(showSlides, 3000);
}
 // Change image every 2 seconds
  
  
