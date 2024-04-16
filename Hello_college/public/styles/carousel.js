const arrow_btn = document.getElementsByClassName("arrow_btn");
const leftMovement = document.getElementById("leftMovement");
const rightMovement = document.getElementById("rightMovement");
const mainBox = document.getElementById("mainBox");
for (let i = 0; i < arrow_btn.length; i++) {
  arrow_btn[i].addEventListener("click", () => {
    moveBox(i);
  });
}
// For Right Movement
let t = setInterval(() => {
  let maxScrollLeft = rightMovement.scrollWidth - rightMovement.clientWidth;

  if (rightMovement.scrollLeft === 0) {
    rightMovement.scrollLeft = maxScrollLeft;
  }
  rightMovement.scrollLeft -= 1;
}, 15);
// For left Movement
let u = setInterval(() => {
  let maxScrollLeft1 = leftMovement.scrollWidth - leftMovement.clientWidth;
  if (maxScrollLeft1 - parseInt(leftMovement.scrollLeft) < 2) {
    leftMovement.scrollLeft = 0;
  }
  leftMovement.scrollLeft += 1;
}, 15);

const moveBox = (value) => {
  if (value % 2 == 0) {
    mainBox.scrollLeft -= 340;
  } else {
    mainBox.scrollLeft += 340;
  }
};
