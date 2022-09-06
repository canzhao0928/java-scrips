'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollto = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");
const header = document.querySelector(".header")
const nav = document.querySelector(".nav")
const allSection = document.querySelectorAll(".section")

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//scrolling
btnScrollto.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" })
})

//nav smooth
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (event) {
//     event.preventDefault();
//     // console.log(this);
//     const section = el.getAttribute("href").slice(1)
//     document.getElementById(section).scrollIntoView({ behavior: "smooth" })
//     // console.log(section);

//   })
// })

//event delegation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" })
  }
})


//tab container

const tabs = document.querySelectorAll(".operations__tab");
const contents = document.querySelectorAll(".operations__content");

document.querySelector(".operations__tab-container").addEventListener("click", function (e) {
  e.preventDefault();
  const click = e.target.closest(".operations__tab");
  if (!click) return
  //remove active
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"))
  contents.forEach((content) => content.classList.remove("operations__content--active"))
  //add active
  // const id = click.getAttribute("data-tab");
  click.classList.add("operations__tab--active")
  document.querySelector(`.operations__content--${click.dataset.tab}`).classList.add("operations__content--active")

})



//links fade Animation

const handover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const clicked = e.target;
    const siblings = clicked.closest(".nav").querySelectorAll(".nav__link")
    const logo = clicked.closest(".nav").querySelector("img")
    //fade siblings and logo
    siblings.forEach((link) => {
      if (link !== clicked) {
        link.style.opacity = this
      }
    })
    logo.style.opacity = this
  }
}
//callback need a function,so can't be handover(e,0.5)
nav.addEventListener("mouseover", handover.bind(0.5))
nav.addEventListener("mouseout", handover.bind(1))


//sticky nav with scroll event===bad performance
// window.addEventListener("scroll", () => {
//   console.log(window.scrollY);
//   console.log(section1.getBoundingClientRect().top);
//   if (window.scrollY >= Math.abs(section1.getBoundingClientRect().top)) { document.querySelector(".nav").classList.add("sticky") }
//   else { document.querySelector(".nav").classList.remove("sticky") }
// })
const navHeight = nav.getBoundingClientRect().height

const observeCallback = function (entries, observer) {
  if (entries[0].isIntersecting) {
    nav.classList.remove("sticky")
  } else {
    nav.classList.add("sticky")
  }

}
const observeOpt = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}

const observe = new IntersectionObserver(observeCallback, observeOpt)
observe.observe(header)

//reveal sections


const observeSectionCallback = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observe.unobserve(entry.target);
}

const observeSectionOpt = {
  root: null,
  threshold: 0.15,
}

const sectionObserver = new IntersectionObserver(observeSectionCallback, observeSectionOpt)
allSection.forEach((section) => {
  sectionObserver.observe(section)
  section.classList.add("section--hidden")
})

//lazy load img
const allImg = document.querySelectorAll("img[data-src]")
const imgload = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", () => {
    entry.target.classList.remove("lazy-img")
  })
  observe.unobserve(entry.target);
}
const imgobserver = new IntersectionObserver(imgload, {
  root: null,
  threshold: 0,
})

allImg.forEach(img => imgobserver.observe(img))


//-------slider------------------------
const allSliders = document.querySelectorAll(".slide");
const leftBtn = document.querySelector(".slider__btn--left");
const rightBtn = document.querySelector(".slider__btn--right");
let curSlide = 0
const maxSlide = allSliders.length;

//functions
const moveSlide = function (slide) {
  allSliders.forEach((slider, i) => {
    slider.style.transform = `translateX(${100 * (i - slide)}%)`
  })
}

const creatDots = function () {
  allSliders.forEach((_, i) => {
    document.querySelector(".dots").insertAdjacentHTML("beforeend", `<button class='dots__dot' data-slide='${i}'></button>`)
  })
}

const activeDot = function (slide) {
  document.querySelectorAll(".dots__dot").forEach(dot => dot.classList.remove("dots__dot--active"))
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add("dots__dot--active")
}

//init
const init = function () {
  moveSlide(0);
  creatDots();
  activeDot(0);
}
init();



//events
leftBtn.addEventListener("click", () => {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  moveSlide(curSlide);
  activeDot(curSlide);
})

rightBtn.addEventListener("click", () => {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  moveSlide(curSlide);
  activeDot(curSlide);
})

document.querySelectorAll(".dots__dot").forEach(dot => {
  dot.addEventListener("click", (e) => {
    e.preventDefault();
    activeDot(e.target.dataset.slide);
    moveSlide(e.target.dataset.slide);
  })
})




