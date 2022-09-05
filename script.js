'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnright = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLL
// adding event listener to the button
btnScrollTo.addEventListener('click', function (event) {
  event.preventDefault();

  section1.scrollIntoView({ behavior: 'smooth' });
});

// PAGE NAVIGATION

//not efficient
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (event) {
//     event.preventDefault();
//     const id = el.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//using delegation

// 1. we attach event to a parent element of all elements that we are intersted in
// 2.determine what element originated the event

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();
    //find matching
    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

// TABBED COMPONENT

tabsContainer.addEventListener('click', function (event) {
  event.preventDefault();
  const clicked = event.target.closest('.operations__tab');
  // GUARD CLAUSE
  if (!clicked) return;
  // remove active classlist
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // adding active class
  clicked.classList.add('operations__tab--active');
  // removing content active
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  // adding operations content active
  // console.log(clicked.dataset.tab);
  // console.log(clicked.getAttribute('data-tab'));
  document
    .querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION

const handleHover = function (event) {
  event.preventDefault();
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// passing "arguments" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// sticky navigation : intersection observer API

// when the target (section1) intersects the root (null:viewport) at threshold(10%) the call back function will be called
// const observerCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const observerOptions = {
//   root: null,
//   threshold: 0.1,
// };
// const observer = new IntersectionObserver(observerCallBack, observerOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  if (!entries[0].isIntersecting) nav.classList.add('sticky');
  if (entries[0].isIntersecting) nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// revealing sections

const sectionReavealer = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionReavealer, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading Images

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function (e) {
    e.preventDefault();
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});

// implementing the slider
let currSlide = 0;
const maxSlide = slides.length - 1;
// implementing dots function
const createDots = function () {
  slides.forEach((_, i) => {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class ="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

const dotActivate = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
dotActivate(0);

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
goToSlide(0);

const nextSlide = function () {
  if (currSlide === maxSlide) {
    currSlide = 0;
  } else {
    currSlide++;
  }
  goToSlide(currSlide);
  dotActivate(currSlide);
};

const prevSlide = function () {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else {
    currSlide--;
  }
  goToSlide(currSlide);
  dotActivate(currSlide);
};
// right button slide
sliderBtnright.addEventListener('click', nextSlide);

// left button slide
sliderBtnLeft.addEventListener('click', prevSlide);

// arrows slide
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

// dots slide

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    dotActivate(slide);
  }
});

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// document.querySelector('.header');
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('.section--1');

// const allButtons = document.getElementsByTagName('button'); //return html live collection
// console.log(allButtons);
// if we deleted elements programmaticaly using dom the element will be removed from the html live collection
// console.log(document.getElementsByClassName('btn')); //return html live collection

// creating and inserting elements
// insertAdjacentHtml
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics <button class ="btn btn--close-cookie">GOT IT!</button>';
// const header = document.querySelector('.header');
// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message);

// // DELETE ELEMENTS
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// // to change styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// // to get styles that we done above that are inline styles
// // console.log(message.style.backgroundColor);
// // but to get syles that we did not do in dom we use
// // console.log(getComputedStyle(message).color);

// // to change style based on computed style
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

// to set property for css variables as .root it is similar to documentElement in JS
// document.documentElement.style.setProperty('--color-primary', 'orangeRed');

// for attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// const twitterLink = document
//   .querySelector('.twitter-link')
//   .getAttribute('href');
// console.log(twitterLink);

// // SMOOTH SCROLL
// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.getElementById('section--1');

// // adding event listener to the button
// btnScrollTo.addEventListener('click', function (event) {
//   event.preventDefault();

//   // scrolling

//   // OLD WAY
//   // const section1Coordinates = section1.getBoundingClientRect();
//   // console.log(section1Coordinates);
//   // window.scrollTo({
//   //   left: section1Coordinates.left + window.pageXOffset,
//   //   top: section1Coordinates.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // });

//   // MODERN WAY
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// const h1 = document.querySelector('h1');
// const alert1 = function (event) {
//   event.preventDefault();
//   alert('you are listening to the header');
//   // h1.removeEventListener('mouseenter', alert1);
// };

// h1.addEventListener('mouseenter', alert1);

// setTimeout(() => h1.removeEventListener('mouseenter', alert1), 3000);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// // console.log(randomColor());

// document
//   .querySelector('.nav__link')
//   .addEventListener('click', function (event) {
//     event.preventDefault();
//     this.style.backgroundColor = randomColor();
//     // event.stopPropagation();
//   });

// document
//   .querySelector('.nav__links')
//   .addEventListener('click', function (event) {
//     event.preventDefault();
//     this.style.backgroundColor = randomColor();
//   });

// document.querySelector('.nav').addEventListener('click', function (event) {
//   event.preventDefault();
//   this.style.backgroundColor = randomColor();
// });
