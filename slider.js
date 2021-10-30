const slider = document.querySelector("#slider-container");
const slides = Array.from(document.querySelectorAll(".slide-content"));
// slide counter elements
const currentSlideNum = document.querySelector(".currentSlideNum");
const totalSlideNum = document.querySelector(".totalSlideNum");
// minilist
const miniListItems = Array.from(document.querySelectorAll(".mini-list-item"));
// gap and calculating
let sliderWidth = slider.getBoundingClientRect().width;
const slideItem = document.querySelector(".slide-content");
let slideWidth = slideItem.getBoundingClientRect().width;
parentChildGap = sliderWidth - slideWidth;

//#region mobile slider
// matchmedia
const mediaQueryXs = window.matchMedia("(max-width:35.9375em)");
function isMobile() {
  return mediaQueryXs.matches;
}

if (isMobile()) {
  disableRightClick();
  slides.forEach((slide, index) => {
    const slideImage = slide.querySelector("img");
    slideImage.addEventListener("dragstart", (e) => e.preventDefault());

    // Touch events
    slide.addEventListener("touchstart", touchStart(index));
    slide.addEventListener("touchend", touchEnd);
    slide.addEventListener("touchmove", touchMove);

    // Mouse events
    slide.addEventListener("mousedown", touchStart(index));
    slide.addEventListener("mouseup", touchEnd);
    slide.addEventListener("mouseleave", touchEnd);
    slide.addEventListener("mousemove", touchMove);
  });
}
//initial values
totalSlideNum.textContent = slides.length;
let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0,
  isResizing = false;
// disable contextmenu
function disableRightClick() {
  slider.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  };
}
function touchStart(index) {
  return function (event) {
    currentIndex = index;
    startPos = getPositionX(event);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
  };
}

function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationID);
  const movedBy = currentTranslate - prevTranslate;
  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
  } else if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
  }
  setPositionByIndex();
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}
window.addEventListener("resize", function () {
  if (window.innerWidth < 576) {
    setPositionByIndex();
  } else {
    resetSliderPosition();
    slides.forEach((slide, index) => {
      // Touch events
      slide.removeEventListener("touchstart", touchStart(index));
      slide.removeEventListener("touchend", touchEnd);
      slide.removeEventListener("touchmove", touchMove);

      // Mouse events
      slide.removeEventListener("mousedown", touchStart(index));
      slide.removeEventListener("mouseup", touchEnd);
      slide.removeEventListener("mouseleave", touchEnd);
      slide.removeEventListener("mousemove", touchMove);
    });
  }
});
function setPositionByIndex() {
  currentTranslate = currentIndex * -(window.innerWidth - parentChildGap);
  prevTranslate = currentTranslate;
  currentSlideNum.textContent = currentIndex + 1;
  setSliderPosition();
}

function resetSliderPosition() {
  currentIndex = 0;
  prevTranslate = 0;
  currentTranslate = 0;
  setSliderPosition();
}
function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}
//#endregion
//#region desktop slider
function toggleElement(elementRemoved, elementAdded) {
  elementRemoved.classList.remove("active");
  elementRemoved.setAttribute("aria-selected", false);
  elementAdded.classList.add("active");
  elementAdded.setAttribute("aria-selected", true);
}
if (miniListItems.length > 0) {
  // initial values
  let miniActive = miniListItems[0];
  let activeItem = slides[0];
  miniListItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      const itemId = e.currentTarget.dataset.id;
      const selectedItem = document.getElementById(itemId);
      const isActive = selectedItem.classList.contains("active");
      if (isActive) {
        return;
      } else if (!isActive) {
        toggleElement(miniActive, item);
        toggleElement(activeItem, selectedItem);
        activeItem = selectedItem;
        miniActive = item;
      }
    });
  });
}

//#endregion
