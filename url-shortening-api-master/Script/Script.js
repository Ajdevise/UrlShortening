const list = document.querySelector(".nav__list");
const hamburger = document.querySelector(".nav__hamburger");
const toggleListActiveClass = () => list.classList.toggle("active");

hamburger.addEventListener("click", toggleListActiveClass);

