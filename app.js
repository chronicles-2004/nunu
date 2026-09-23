

let current = "gate";


/* =========================================
   SHORT SELECTORS
========================================= */

const $ = (selector) => {
  return document.querySelector(selector);
};


const $$ = (selector) => {
  return [...document.querySelectorAll(selector)];
};


/* =========================================
   PAGE NAVIGATION
========================================= */

function show(id) {

  const target = document.getElementById(id);

  if (!target) {
    return;
  }


  /*
     Remove previous page
  */

  const currentScreen =
    document.getElementById(current);

  if (currentScreen) {
    currentScreen.classList.remove("show");
  }


  /*
     Change current page
  */

  current = id;


  /*
     Show target page
  */

  target.classList.add("show");


  /*
     Bottom navigation
     authentication page-এ থাকবে না
  */

  const nav = $("#nav");

  if (nav) {

    nav.style.display =
      id === "gate"
        ? "none"
        : "flex";

  }


  /*
     Every page change-এর পর
     page-এর top-এ নিয়ে যাবে
  */

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================
   AUTHENTICATION
========================================= */

function unlock() {

  const birthday =
    $("#bd").value.trim();

  const firstMeeting =
    $("#fm").value.trim();

  const error =
    $("#err");


  /*
     Correct information
  */

  if (
    birthday === SITE_CONFIG.birthday &&
    firstMeeting === SITE_CONFIG.firstMeeting
  ) {

    error.textContent = "";

    show("intro");

    return;
  }


  /*
     Wrong information
  */

  error.textContent =
    "একটা date ভুল হয়েছে, আমার Kuchupuchu 😌❤️";

}


/* =========================================
   GALLERY
========================================= */

function createGallery() {

  const masonry =
    $("#masonry");

  const firstPhoto =
    $("#firstPhoto");

  const finalImg =
    $("#finalImg");


  if (
    !masonry ||
    !firstPhoto ||
    !finalImg
  ) {
    return;
  }


  /*
     Remove empty image paths
  */

  const validPhotos =
    photos.filter(Boolean);


  /*
     First memory image
  */

  if (validPhotos.length > 0) {

    firstPhoto.style.backgroundImage =
      `url("${validPhotos[0]}")`;

    finalImg.src =
      validPhotos[0];

  }


  /*
     Clear existing gallery
  */

  masonry.innerHTML = "";


  /*
     Generate every photo
  */

  validPhotos.forEach(
    (path, index) => {

      const item =
        document.createElement("figure");


      item.className =
        "polaroid";


      /*
         Slight random-style rotation
      */

      item.style.setProperty(
        "--r",
        `${(index % 3 - 1) * 1.3}deg`
      );


      /*
         Image
      */

      const image =
        document.createElement("img");


      image.src =
        path;


      image.alt =
        SITE_CONFIG.captions[index] ||
        "Our memory";


      /*
         Lazy loading
      */

      image.loading =
        index === 0
          ? "eager"
          : "lazy";


      /*
         If image doesn't exist,
         remove the card instead of
         showing broken image.
      */

      image.onerror = () => {
        item.remove();
      };


      /*
         Caption
      */

      const caption =
        document.createElement("figcaption");


      caption.className =
        "caption";


      caption.textContent =
        SITE_CONFIG.captions[index] ||
        "আমার favourite memory ❤️";


      /*
         Put image + caption
         inside card
      */

      item.append(
        image,
        caption
      );


      /*
         Put card inside gallery
      */

      masonry.appendChild(item);

    }
  );

}


/* =========================================
   BIRTHDAY CONFETTI
========================================= */

function celebrate() {

  const conf =
    $("#conf");

  const wishMessage =
    $("#wishmsg");

  const wishBtn =
    $("#wishBtn");


  if (
    !conf ||
    !wishMessage
  ) {
    return;
  }


  /*
     Remove old confetti
  */

  conf.innerHTML = "";


  const pieces = 110;


  /*
     Create confetti pieces
  */

  for (
    let i = 0;
    i < pieces;
    i++
  ) {

    const piece =
      document.createElement("i");


    piece.className = "c";


    /*
       Random horizontal position
    */

    piece.style.left =
      `${Math.random() * 100}vw`;


    /*
       Random animation delay
    */

    piece.style.animationDelay =
      `${Math.random() * 1.3}s`;


    /*
       Different colors
    */

    piece.style.background = [

      "#ff8fba",
      "#ffd69a",
      "#a88cff",
      "#ffffff"

    ][i % 4];


    conf.appendChild(piece);

  }


  /*
     Birthday message
  */

  wishMessage.innerHTML = `

    🎉 এবার একটা জিনিস মনে রাখিস—

    <br>

    <strong>
      তুই আমার জীবনের সবচেয়ে সুন্দর
      chapter-গুলোর একটা। ❤️
    </strong>

    <br><br>

    <button
      class="btn main"
      id="finalBtn"
    >
      One last page →
    </button>

  `;


  /*
     Prevent multiple confetti triggers
  */

  if (wishBtn) {
    wishBtn.disabled = true;
  }


  /*
     Final page button
  */

  const finalBtn =
    $("#finalBtn");


  if (finalBtn) {

    finalBtn.addEventListener(
      "click",
      () => show("final"),
      { once: true }
    );

  }

}


/* =========================================
   NAVIGATION EVENTS
========================================= */

function bindNavigation() {


  /*
     Every [data-go] button
  */

  $$("[data-go]").forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          show(
            button.dataset.go
          );

        }
      );

    }
  );


  /*
     Authentication form
  */

  const unlockForm =
    $("#unlockForm");


  if (unlockForm) {

    unlockForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        unlock();

      }
    );

  }


  /*
     Birthday button
  */

  const wishBtn =
    $("#wishBtn");


  if (wishBtn) {

    wishBtn.addEventListener(
      "click",
      celebrate
    );

  }


  /*
     Keyboard support
  */

  document.addEventListener(
    "keydown",
    (event) => {


      /*
         Enter = unlock
      */

      if (
        event.key === "Enter" &&
        current === "gate"
      ) {

        unlock();

      }


      /*
         Escape = remove focus
      */

      if (
        event.key === "Escape"
      ) {

        $("#bd")?.blur();

        $("#fm")?.blur();

      }

    }
  );

}


/* =========================================
   INITIALIZATION
========================================= */

function init() {

  /*
     Build gallery
  */

  createGallery();


  /*
     Activate navigation
  */

  bindNavigation();


  /*
     Start at authentication
  */

  show("gate");

}


/* =========================================
   START WEBSITE
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);

