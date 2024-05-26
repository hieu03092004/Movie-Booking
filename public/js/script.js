
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
// //button showDate
const buttonShowDate=document.querySelectorAll("[button-showDate]");
if(buttonShowDate.length>0){
    let url=new URL(window.location.href);
    const cinema=document.querySelector("#cinema");
    let cinema_name="";
        if(cinema){
            cinema.onchange=function(){
                cinema_name=cinema.value;
                console.log(cinema_name);
            }
        }
    const theater=document.querySelector("#theater");
    let theater_name="";
    if(theater){
        theater.onchange=function(){
            theater_name=theater.value;
            console.log(theater_name);
        }
    }
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
        //ALL
        if(showDate && cinema_name=="" && theater_name==""){
            url.searchParams.set("showDate",convertedDate);
            url.searchParams.delete("cinema");
            url.searchParams.delete("theater");
        }    
        else if(showDate && cinema_name!="" && theater_name==""){
            url.searchParams.set("showDate",convertedDate);
            url.searchParams.set("cinema",cinema_name);
        }
        else if(showDate && cinema_name!="" && theater_name!=""){
            url.searchParams.set("showDate",convertedDate);
            url.searchParams.set("cinema",cinema_name);
            url.searchParams.set("theater",theater_name);
        }
        else if(showDate && cinema_name=="" && theater_name!=""){
            url.searchParams.set("showDate",convertedDate);
            url.searchParams.set("theater",theater_name);
        }
        window.location.href=url.href;
      
    })
  })
}
 //end button showDate

//  //Change image every 2 seconds
 //Profile
const inputUserAccount=document.querySelector("#user_account");
if(inputUserAccount){
    const link=document.querySelector("#changeUserAccount");
    const hrefValue = link.getAttribute("href");
    
    // Tách lấy số từ href
    const number = parseInt(hrefValue);
    inputUserAccount.onchange=function(){
        link.href=`/user/profile/${number}/?user_account=${inputUserAccount.value}`;
    }
}
const inputUserPassword=document.querySelector("#user_password");
if(inputUserPassword){
    const link=document.querySelector("#changePassword");
    const hrefValue = link.getAttribute("href");
    // Tách lấy số từ href
    const number = parseInt(hrefValue);
    inputUserPassword.onchange=function(){
        link.href=`/user/profile/${number}/?user_password=${inputUserPassword.value}`;
    }
}
// //showpassword
const showPassword=document.querySelector("#password");
if(showPassword){
    const type=showPassword.type;
    const buttonShowPassword=document.querySelector('.fa-eye-slash');
    if(buttonShowPassword){
        buttonShowPassword.addEventListener("click",()=>{
            if(type=="password")
            {
                showPassword.type="text";
            }
            else
            {
                showPassword.type="password";
            }
        });
    }
}
const newPassword=document.querySelector("#newPassword");
if(newPassword){
    const type=newPassword.type;
    const buttonShowPassword=document.querySelector('.fa-eye-slash');
    if(buttonShowPassword){
        buttonShowPassword.addEventListener("click",()=>{
            if(type=="password")
            {
                newPassword.type="text";
            }
            else
            {
                newPassword.type="password";
            }
        });
    }
}

