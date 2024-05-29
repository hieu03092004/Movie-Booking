// slider
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