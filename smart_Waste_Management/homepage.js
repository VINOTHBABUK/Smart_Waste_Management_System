const splash = document.querySelectorAll(".splash");
document.addEventListener("DOMContentLoaded", (e) => {
  setTimeout(() => {
    splash.forEach((element) => {
      element.classList.add("display-none");
    });
  }, 2000);
});
let slideIndex = 0;
showSlides();

function showSlides() {
  let slideshows = document.getElementsByClassName("slideshow-container");
  for (let i = 0; i < slideshows.length; i++) {
    let slides = slideshows[i].getElementsByClassName("slideshow-image");
    for (let j = 0; j < slides.length; j++) {
      slides[j].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";
  }
  setTimeout(showSlides, 2000);
}
