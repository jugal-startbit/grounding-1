(function () {
  'use strict';

  var cardElement = document.querySelector('.card');
  var addCardBtnElement = document.querySelector('.add__btn');
  var addCardInputElement = document.querySelector('.add__input');
  var spinnerElement = document.querySelector('.card__spinner');
  var bgSyncTextElement = document.querySelector('.bg-sync__text');
  var bgSyncElement = document.querySelector('.custom__button-bg');

  /**
   * 
   * 
					<li><a target="_blank" rel="noopener" class="menusAuthor" value="author">Author</a></li>
					<li><a target="_blank" rel="noopener" class="menusSource" value="source">Source</a></li>
					<li><a target="_blank" rel="noopener" class="menusContact" value="contact">Contact</a></li>
          <li><a target="_blank" rel="noopener" class="menusRating" value="contact">Rating</a></li>
          
          loginDIV
          authorMenuDIV
          sourceMenuDIV
          ratingMenuDIV
          contactMenuDIV
   */
  var menusAuthorElmt = document.querySelector('.menusAuthor');
  menusAuthorElmt.myParam = menusAuthorElmt.getAttribute('value');
  
  var menusSourceElmt = document.querySelector('.menusSource');
  menusSourceElmt.myParam = menusSourceElmt.getAttribute('value');
  
  var menusContactElmt = document.querySelector('.menusContact');
  menusContactElmt.myParam = menusContactElmt.getAttribute('value');

  var menusRatingElmt = document.querySelector('.menusRating');
  menusRatingElmt.myParam = menusRatingElmt.getAttribute('value');
  
  //Menus listing on first load loginDIV
    document.querySelector('#authorMenuDIV').style.display = 'none';
    document.querySelector('#contactMenuDIV').style.display = 'none';
    document.querySelector('#sourceMenuDIV').style.display = 'none';
    document.querySelector('#ratingMenuDIV').style.display = 'none';
    document.querySelector('#menu_header').style.display = 'none';
    document.querySelector('#loginDIV').style.display = 'inherit';
  //Event listener on click of Menus
  menusAuthorElmt.addEventListener('click', displayMenusPage, false);
  menusSourceElmt.addEventListener('click', displayMenusPage, false);
  menusContactElmt.addEventListener('click', displayMenusPage, false);
  menusRatingElmt.addEventListener('click', displayMenusPage, false);
  function displayMenusPage(evt) {
    if(evt.target.myParam == 'author'){
      document.querySelector('#authorMenuDIV').style.display = 'inherit';
      document.querySelector('#sourceMenuDIV').style.display = 'none';
      document.querySelector('#contactMenuDIV').style.display = 'none';
      document.querySelector('#loginDIV').style.display = 'none';
      document.querySelector('#ratingMenuDIV').style.display = 'none';
      document.querySelector('.menu').classList.remove("menu--show");
      document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
      document.querySelector('.menu').style.transform = 'translateX(-110%)';

    }else if(evt.target.myParam == 'rating'){
      
      document.querySelector('#loginDIV').style.display = 'none';
      document.querySelector('#authorMenuDIV').style.display = 'none';
      document.querySelector('#sourceMenuDIV').style.display = 'inherit';
      document.querySelector('#contactMenuDIV').style.display = 'none';
      document.querySelector('#ratingMenuDIV').style.display = 'none';
      document.querySelector('.menu').classList.remove("menu--show");
      document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
      document.querySelector('.menu').style.transform = 'translateX(-110%)';
    }else if(evt.target.myParam == 'contact'){
      document.querySelector('#contactMenuDIV').style.display = 'inherit';
      
      document.querySelector('#loginDIV').style.display = 'none';
      document.querySelector('#authorMenuDIV').style.display = 'none';
      document.querySelector('#sourceMenuDIV').style.display = 'none';
      document.querySelector('#ratingMenuDIV').style.display = 'none';
      document.querySelector('.menu').classList.remove("menu--show");
      document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
      document.querySelector('.menu').style.transform = 'translateX(-110%)';

    }
    else if(evt.target.myParam == 'source'){
      document.querySelector('#ratingMenuDIV').style.display = 'inherit';
      document.querySelector('#loginDIV').style.display = 'none';
      document.querySelector('#authorMenuDIV').style.display = 'none';
      document.querySelector('#sourceMenuDIV').style.display = 'none';
      document.querySelector('#contactMenuDIV').style.display = 'none';
      document.querySelector('.menu').classList.remove("menu--show");
      document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
      document.querySelector('.menu').style.transform = 'translateX(-110%)';

    }

  }

  //Add github user data to the card
  function addGitUserCard() {
    var userInput = addCardInputElement.value;
    if (userInput === '') return;
    addCardInputElement.value = '';
    localStorage.setItem('request', userInput);
    fetchGitUserInfo(userInput);
  document.querySelector('#menu_header').style.display = 'inherit';
  document.querySelector('#authorMenuDIV').style.display = 'inherit';
  document.querySelector('#sourceMenuDIV').style.display = 'none';
  document.querySelector('#contactMenuDIV').style.display = 'none';
  document.querySelector('#loginDIV').style.display = 'none';
  document.querySelector('#ratingMenuDIV').style.display = 'none';
  document.querySelector('.menu').classList.remove("menu--show");
  document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
  document.querySelector('.menu').style.transform = 'translateX(-110%)';
  }
  //Add card click event
  addCardBtnElement.addEventListener('click', addGitUserCard, false);


  //To get github user data via `Fetch API`
  function fetchGitUserInfo(username, requestFromBGSync) {
    /* var name = username || 'jugal-startbit';
    var url = 'https://api.github.com/users/' + name;

    spinnerElement.classList.add('show'); //show spinner

    fetch(url, { method: 'GET' })
    .then(function(fetchResponse){ return fetchResponse.json() })
      .then(function(response) {
        if (!requestFromBGSync) {
          localStorage.removeItem('request'); //Once API is success, remove request data from localStorage
        }
        //cardElement.querySelector('.card__title').textContent = response.name;
        //cardElement.querySelector('.card__desc').textContent = response.bio;
        //cardElement.querySelector('.card__img').setAttribute('src', response.avatar_url);
        //cardElement.querySelector('.card__following span').textContent = response.following;
        //cardElement.querySelector('.card__followers span').textContent = response.followers;
        //cardElement.querySelector('.card__temp span').textContent = response.company;
        spinnerElement.classList.remove('show'); //hide spinner
      })
      .catch(function (error) {
        //If user is offline and sent a request, store it in localStorage
        //Once user comes online, trigger bg sync fetch from application tab to make the failed request
        localStorage.setItem('request', name);
        spinnerElement.classList.remove('show'); //hide spinner
        console.error(error);
      }); */
  }

  fetchGitUserInfo(localStorage.getItem('request')); //Fetch github users data
  //Listen postMessage when `background sync` is triggered
  navigator.serviceWorker.addEventListener('message', function (event) {
    console.info('From background sync: ', event.data);
    fetchGitUserInfo(localStorage.getItem('request'), true);
    bgSyncElement.classList.remove('hide'); //Once sync event fires, show register toggle button
    bgSyncTextElement.setAttribute('hidden', true); //Once sync event fires, remove registered label
  });
})();
