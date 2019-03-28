(function () {
  'use strict';


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
  
  var menusLogoutElmt = document.querySelector('.menusLogout');
  menusLogoutElmt.myParam = menusLogoutElmt.getAttribute('value');

  localStorage.setItem("CurrentPage", "Login");
  localStorage.setItem("PreviousPage", "None");
  var UserInitial = localStorage.getItem('UserInitial');
  var StudyCode =  localStorage.getItem('StudyCode');
  if(UserInitial !== null && StudyCode !== null){
    //alert("UserInitial : " + UserInitial);
    //alert("StudyCode : " + StudyCode);

    document.querySelector('#menu_header').style.display = 'inherit';
    document.querySelector('#authorMenuDIV').style.display = 'inherit';
    document.querySelector('#sourceMenuDIV').style.display = 'none';
    document.querySelector('#contactMenuDIV').style.display = 'none';
    document.querySelector('#loginDIV').style.display = 'none';
    document.querySelector('#ratingMenuDIV').style.display = 'none';
    document.querySelector('.menu').classList.remove("menu--show");
    document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
    document.querySelector('.menu').style.transform = 'translateX(-110%)';
  }else{

  //Menus listing on first load loginDIV
    document.querySelector('#authorMenuDIV').style.display = 'none';
    document.querySelector('#contactMenuDIV').style.display = 'none';
    document.querySelector('#sourceMenuDIV').style.display = 'none';
    document.querySelector('#ratingMenuDIV').style.display = 'none';
    document.querySelector('#menu_header').style.display = 'none';
    document.querySelector('#loginDIV').style.display = 'inherit';
  }
  //Event listener on click of Menus
  menusAuthorElmt.addEventListener('click', displayMenusPage, false);
  menusSourceElmt.addEventListener('click', displayMenusPage, false);
  menusContactElmt.addEventListener('click', displayMenusPage, false);
  menusRatingElmt.addEventListener('click', displayMenusPage, false);
  menusLogoutElmt.addEventListener('click', displayMenusPage, false);


  // menusAuthorElmt.addEventListener("unload", unLoadAuthorPage);
  function displayMenusPage(evt) {


    var UserInitial = localStorage.getItem('UserInitial');
    var StudyCode =  localStorage.getItem('StudyCode');

    if(evt.target.myParam == 'author'){
      var previouspage  = localStorage.getItem("CurrentPage");
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();

      var timeDifference = (currentTimeStamp - entryTimeStamp)/1000;
      if(previouspage !== 'aboutUs'){
          localStorage.setItem("CurrentPageTimeStamp", Date.now());
      }
      var data = "Event="+previouspage+"&UserInitial="+UserInitial+"&StudyCode="+StudyCode+"&Duration="+timeDifference;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

      xhr.send(data);

      localStorage.setItem("PreviousPage", previouspage);
      localStorage.setItem("CurrentPage", "aboutUs");

      document.querySelector('#authorMenuDIV').style.display = 'inherit';
      document.querySelector('#sourceMenuDIV').style.display = 'none';
      document.querySelector('#contactMenuDIV').style.display = 'none';
      document.querySelector('#loginDIV').style.display = 'none';
      document.querySelector('#ratingMenuDIV').style.display = 'none';
      document.querySelector('.menu').classList.remove("menu--show");
      document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
      document.querySelector('.menu').style.transform = 'translateX(-110%)';

    }else if(evt.target.myParam == 'rating'){
      var previouspage  = localStorage.getItem("CurrentPage");
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();

      var timeDifference = (currentTimeStamp - entryTimeStamp)/1000;
      if(previouspage !== 'review'){
        
          localStorage.setItem("CurrentPageTimeStamp", Date.now());
      }
      var data = "Event="+previouspage+"&UserInitial="+UserInitial+"&StudyCode="+StudyCode+"&Duration="+timeDifference;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

      xhr.send(data);

      localStorage.setItem("PreviousPage", previouspage);
      localStorage.setItem("CurrentPage", "review");
      
      document.querySelector('#loginDIV').style.display = 'none';
      document.querySelector('#authorMenuDIV').style.display = 'none';
      document.querySelector('#sourceMenuDIV').style.display = 'none';
      document.querySelector('#contactMenuDIV').style.display = 'none';
      document.querySelector('#ratingMenuDIV').style.display = 'inherit';
      document.querySelector('.menu').classList.remove("menu--show");
      document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
      document.querySelector('.menu').style.transform = 'translateX(-110%)';
      $(".rating input:radio").attr("checked", false);

      $('.rating input').click(function () {
          $(".rating span").removeClass('checked');
          $(this).parent().addClass('checked');
      });
  
      $('input:radio').change(
        function(){
          var userRating = this.value;
          //alert(userRating);
      }); 
    }else if(evt.target.myParam == 'contact'){

      var previouspage  = localStorage.getItem("CurrentPage");
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();

      var timeDifference = (currentTimeStamp - entryTimeStamp)/1000;
      if(previouspage !== 'contactUs'){
        
          localStorage.setItem("CurrentPageTimeStamp", Date.now());
      }
      var data = "Event="+previouspage+"&UserInitial="+UserInitial+"&StudyCode="+StudyCode+"&Duration="+timeDifference;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

      xhr.send(data);

      localStorage.setItem("PreviousPage", previouspage);
      localStorage.setItem("CurrentPage", "contactUs");

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

      var previouspage  = localStorage.getItem("CurrentPage");
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();

      var timeDifference = (currentTimeStamp - entryTimeStamp)/1000;
      if(previouspage !== 'aboutGroundingLog'){
          localStorage.setItem("CurrentPageTimeStamp", Date.now());
      }
      var data = "Event="+previouspage+"&UserInitial="+UserInitial+"&StudyCode="+StudyCode+"&Duration="+timeDifference;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

      xhr.send(data);

      localStorage.setItem("PreviousPage", previouspage);
      localStorage.setItem("CurrentPage", "aboutGroundingLog");

      document.querySelector('#sourceMenuDIV').style.display = 'inherit';
      document.querySelector('#loginDIV').style.display = 'none';
      document.querySelector('#authorMenuDIV').style.display = 'none';
      document.querySelector('#ratingMenuDIV').style.display = 'none';
      document.querySelector('#contactMenuDIV').style.display = 'none';
      document.querySelector('.menu').classList.remove("menu--show");
      document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
      document.querySelector('.menu').style.transform = 'translateX(-110%)';

    }
    else if(evt.target.myParam == 'logout'){

      var previouspage  = localStorage.getItem("CurrentPage");
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();

      var timeDifference = (currentTimeStamp - entryTimeStamp)/1000;
      var data = "Event="+previouspage+"&UserInitial="+UserInitial+"&StudyCode="+StudyCode+"&Duration="+timeDifference;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          localStorage.clear();
          window.location.reload();
        }
      });

      xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

      xhr.send(data);
      

    }
    
  }

  function myScript(){
    console.log('unload Author page');
  }

  var addCardBtnElement = document.querySelector('.add__btn');
  //Add github user data to the card
  var addCardInputElement = document.querySelector('#studyID');
  var addCardInputElement1 = document.querySelector('#studyInitials');
  function addGitUserCard() {
    var userInput = addCardInputElement.value;
    var userInput1 = addCardInputElement1.value;
    if (userInput === '' || userInput.length < 3)  { 
      alert('StudyID should be 3 digits');
      return;
    }
    if (userInput1 === '' || userInput1.length < 4) {
      alert('Study Initials should be 4 letters');
      return;
    }
 

    addCardInputElement.value = '';
    localStorage.setItem('request', userInput);
    localStorage.setItem('UserInitial', userInput);
    localStorage.setItem('StudyCode', userInput1);

    fetchGitUserInfo(userInput);

    var previouspage  = localStorage.getItem("CurrentPage");

    localStorage.setItem("PreviousPage", previouspage);
    localStorage.setItem("CurrentPage", "aboutUs");
    localStorage.setItem("CurrentPageTimeStamp", Date.now());

      var data = "Event=doLogin&UserInitial="+userInput+"&StudyCode="+userInput1;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
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
      });

      xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

      xhr.send(data);

  
  }
  //Add card click event
  addCardBtnElement.addEventListener('click', addGitUserCard, false);

  var cardElement = document.querySelector('.card');
  var rating = 0;
  var addReviewInputElement = document.querySelector('.add_review__btn');

  var str1 = document.querySelector('#str1');
  var str2 = document.querySelector('#str2');
  var str3 = document.querySelector('#str3');
  var str4 = document.querySelector('#str4');
  var str5 = document.querySelector('#str5');

  str5.addEventListener("click", function(){ rating = str5.value; });
  str4.addEventListener("click", function(){ rating = str4.value; });
  str3.addEventListener("click", function(){ rating = str3.value; });
  str2.addEventListener("click", function(){ rating = str2.value; });
  str1.addEventListener("click", function(){ rating = str1.value; });

    //Add github user data to the card
  function addReviewUserCard() {
      //alert('Thank you!');
    //   UserInitial: {type: String},
    // StudyCode: {type: String},
    // RatingComment: {type: String},
    // Rating:{type:Number},
    //alert(rating);
    var comments = document.querySelector('#comments').value;
    var UserInitial = localStorage.getItem('UserInitial');
    var StudyCode =  localStorage.getItem('StudyCode');
      var data = "UserInitial="+UserInitial+"&StudyCode="+StudyCode+"&RatingComment="+comments+"&Rating="+rating;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log("successB: " + this.responseText);
          alert("Thanks for providing Feedback");
          window.location.reload();
        }
      });

      xhr.open("POST", "https://grounding.herokuapp.com/reviewCreate");
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

      xhr.send(data);

  }

  addReviewInputElement.addEventListener('click', addReviewUserCard, false);
  var spinnerElement = document.querySelector('.card__spinner');
  var bgSyncTextElement = document.querySelector('.bg-sync__text');
  var bgSyncElement = document.querySelector('.custom__button-bg');

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


  var timeoutID;
 //BodyElement
  function setup() {
      document.addEventListener("mousemove", resetTimer, false);
      document.addEventListener("mousedown", resetTimer, false);
      document.addEventListener("keypress", resetTimer, false);
      document.addEventListener("DOMMouseScroll", resetTimer, false);
      document.addEventListener("mousewheel", resetTimer, false);
      document.addEventListener("touchmove", resetTimer, false);
      document.addEventListener("MSPointerMove", resetTimer, false);
   
      startTimer();
  }
  setup();
   
  function startTimer() {
      // wait 2 seconds before calling goInactive
      timeoutID = window.setTimeout(goInactive, 240000);
  }
   
  function resetTimer(e) {
      window.clearTimeout(timeoutID);
   
      goActive();
  }
   
  function goInactive() {
      // do something
      //alert('Inactive logout');
    setTimeout(function(){ 
        localStorage.clear();
        window.location.reload();
    }, 10000);
    alert('InActive since last 4 mintues');

    // var r = confirm("InActive since last 4 mintues so do you want to logout?");
    //   if (r == true) {
    //       var previouspage  = localStorage.getItem("CurrentPage");
    //       var previouspage1  = localStorage.getItem("PreviousPage");
    //       var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
    //       var currentTimeStamp = Date.now();

    //       var timeDifference = (currentTimeStamp - entryTimeStamp)/1000;
          
    //       var data = "Event="+previouspage+"&UserInitial="+UserInitial+"&StudyCode="+StudyCode+"&Duration="+timeDifference;

    //       var xhr = new XMLHttpRequest();
    //       xhr.withCredentials = true;

    //       xhr.addEventListener("readystatechange", function () {
    //         if (this.readyState === 4) {
    //           console.log(this.responseText);
    //           localStorage.clear();
    //           window.location.reload();
    //         }
    //       });

    //       xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
    //       xhr.withCredentials = false;
    //       xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    //       xhr.setRequestHeader("cache-control", "no-cache");
    //       xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

    //       xhr.send(data);
          
    //   } else {
    //     window.clearTimeout(timeoutID);
    //     goActive();
    //   }


  }
   
  function goActive() {
      // do something
           
      startTimer();
  }


})();
