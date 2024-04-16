const openNav = document.getElementById("openNav");
const rightNav = document.getElementById("rightNav");

openNav.addEventListener("click", () => {
  rightNav.classList.toggle("showNav");
  openNav.classList.toggle("activeNav");
});
