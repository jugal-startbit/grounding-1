(function () {
  'use strict';
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

  function displayMenusPage(evt) {


    var UserInitial = localStorage.getItem('UserInitial');
    var StudyCode =  localStorage.getItem('StudyCode');

    if(evt.target.myParam == 'author'){
      var previouspage  = localStorage.getItem("CurrentPage");
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();

      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds / 60);
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

      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds / 60);
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
      }); 
    }else if(evt.target.myParam == 'contact'){

      var previouspage  = localStorage.getItem("CurrentPage");
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();

      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds / 60);
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

      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds / 60);
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

      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds / 60);
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
    if (userInput === '' && userInput.length < 3)  { 
      alert('StudyID should be 3 digits');
      return;
    }
    if (userInput1 === '' && userInput1.length < 4) {
      alert('Study Initials should be 4 letters');
      return;
    }
 

    addCardInputElement.value = '';
    localStorage.setItem('request', userInput);
    localStorage.setItem('UserInitial', userInput);
    localStorage.setItem('StudyCode', userInput1);

    fetchReqInfo(userInput);

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
  var GroundingRate = 0;
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

  var bstr1 = document.querySelector('#bstr1');
  var bstr2 = document.querySelector('#bstr2');
  var bstr3 = document.querySelector('#bstr3');
  var bstr4 = document.querySelector('#bstr4');
  var bstr5 = document.querySelector('#bstr5');

  bstr5.addEventListener("click", function(){ GroundingRate = bstr5.value; });
  bstr4.addEventListener("click", function(){ GroundingRate = bstr4.value; });
  bstr3.addEventListener("click", function(){ GroundingRate = bstr3.value; });
  bstr2.addEventListener("click", function(){ GroundingRate = bstr2.value; });
  bstr1.addEventListener("click", function(){ GroundingRate = bstr1.value; });


    //Add github user data to the card
  function addReviewUserCard() {
    var comments = document.querySelector('#comments').value;
    var UserInitial = localStorage.getItem('UserInitial');
    var StudyCode =  localStorage.getItem('StudyCode');
      var data = "UserInitial="+UserInitial+"&StudyCode="+StudyCode+"&RatingComment="+comments+"&Rating="+rating+"&GroundingRate="+GroundingRate;

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
  function fetchReqInfo(username, requestFromBGSync) {
  }

  fetchReqInfo(localStorage.getItem('request')); //Fetch github users data


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
  }
   
  function goActive() {
      // do something
           
      startTimer();
  }


})();
