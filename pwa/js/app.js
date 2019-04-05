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

  localStorage.setItem("CurrentPage", "doLogin");
  localStorage.setItem("PreviousPage", "None");
  var StudyID = localStorage.getItem('StudyID');
  var StudyInitials =  localStorage.getItem('StudyInitials');
  if(StudyID !== null && StudyInitials !== null){
    document.querySelector('#menu_header').style.display = 'inherit';
    document.querySelector('#authorMenuDIV').style.display = 'inherit';
    document.querySelector('#sourceMenuDIV').style.display = 'inherit';
    document.querySelector('#sourceMenuDIV').style.position = 'absolute';
    document.querySelector('#sourceMenuDIV').style.left = '-10000px';
    document.querySelector('#sourceMenuDIV').style.top = '-10000px';
    document.querySelector('#contactMenuDIV').style.display = 'none';
    document.querySelector('#loginDIV').style.display = 'none';
    document.querySelector('#ratingMenuDIV').style.display = 'none';
    document.querySelector('.menu').classList.remove("menu--show");
    document.querySelector('.menu__overlay').classList.remove("menu__overlay--show");
    document.querySelector('.menu').style.transform = 'translateX(-110%)';
    setTimeout(function(){    
      document.querySelector('#sourceMenuDIV').style.display = 'none';
      document.querySelector('#sourceMenuDIV').style.position = 'initial';
      document.querySelector('#sourceMenuDIV').style.left = '0';
      document.querySelector('#sourceMenuDIV').style.top = '0';
    },3000);
  }else{
  //Menus listing on first load loginDIV
    document.querySelector('#authorMenuDIV').style.display = 'none';
    document.querySelector('#contactMenuDIV').style.display = 'none';
    document.querySelector('#sourceMenuDIV').style.display = 'inherit';
    document.querySelector('#sourceMenuDIV').style.position = 'absolute';
    document.querySelector('#sourceMenuDIV').style.left = '-10000px';
    document.querySelector('#sourceMenuDIV').style.top = '-10000px';
    document.querySelector('#ratingMenuDIV').style.display = 'none';
    document.querySelector('#menu_header').style.display = 'none';
    document.querySelector('#loginDIV').style.display = 'inherit';
    setTimeout(function(){    
      document.querySelector('#sourceMenuDIV').style.display = 'none';
      document.querySelector('#sourceMenuDIV').style.position = 'initial';
      document.querySelector('#sourceMenuDIV').style.left = '0';
      document.querySelector('#sourceMenuDIV').style.top = '0';
    },3000);
  }
  //Event listener on click of Menus
  menusAuthorElmt.addEventListener('click', displayMenusPage, false);
  menusSourceElmt.addEventListener('click', displayMenusPage, false);
  menusContactElmt.addEventListener('click', displayMenusPage, false);
  menusRatingElmt.addEventListener('click', displayMenusPage, false);
  menusLogoutElmt.addEventListener('click', displayMenusPage, false);

  function displayMenusPage(evt) {


    var StudyID = localStorage.getItem('StudyID');
    var StudyInitials =  localStorage.getItem('StudyInitials');

    var previouspage  = localStorage.getItem("CurrentPage");
    if(evt.target.myParam == 'aboutUs'){
      if(previouspage!==evt.target.myParam)
      {
        var previouspage1  = localStorage.getItem("PreviousPage");
        var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
        var currentTimeStamp = Date.now();
        var StudyID = localStorage.getItem('StudyID');
        var StudyInitials =  localStorage.getItem('StudyInitials');
        var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
        var timeDifference = Math.floor(timeDifferenceseconds);
        if(previouspage !== 'aboutUs'){
            localStorage.setItem("CurrentPageTimeStamp", Date.now());
        }
        var data = "Event="+previouspage+"&StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&Duration="+timeDifference;
  
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
        xhr.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
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
  
      }
      
    }else if(evt.target.myParam == 'review'){
      var previouspage  = localStorage.getItem("CurrentPage");
      if(previouspage!==evt.target.myParam)
      {
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();
      var StudyID = localStorage.getItem('StudyID');
      var StudyInitials =  localStorage.getItem('StudyInitials');
      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds);
      if(previouspage !== 'review'){
        
          localStorage.setItem("CurrentPageTimeStamp", Date.now());
      }
      var data = "Event="+previouspage+"&StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&Duration="+timeDifference;

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
      xhr.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
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
    }
    }else if(evt.target.myParam == 'contactUs'){

      var previouspage  = localStorage.getItem("CurrentPage");
      if(previouspage!==evt.target.myParam)
      {
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();
      var StudyID = localStorage.getItem('StudyID');
      var StudyInitials =  localStorage.getItem('StudyInitials');
      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds);
      if(previouspage !== 'contactUs'){
        
          localStorage.setItem("CurrentPageTimeStamp", Date.now());
      }
      var data = "Event="+previouspage+"&StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&Duration="+timeDifference;

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
      xhr.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
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
    }
    else if(evt.target.myParam == 'aboutGroundingLog'){

      var previouspage  = localStorage.getItem("CurrentPage");
      if(previouspage!==evt.target.myParam)
      {
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();
      var StudyID = localStorage.getItem('StudyID');
      var StudyInitials =  localStorage.getItem('StudyInitials');
      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds);
      if(previouspage !== 'aboutGroundingLog'){
          localStorage.setItem("CurrentPageTimeStamp", Date.now());
      }
      var data = "Event="+previouspage+"&StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&Duration="+timeDifference;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
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
    }
    else if(evt.target.myParam == 'logout'){

      var previouspage  = localStorage.getItem("CurrentPage");
      if(previouspage!==evt.target.myParam)
      {
      var previouspage1  = localStorage.getItem("PreviousPage");
      var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
      var currentTimeStamp = Date.now();
      var StudyID = localStorage.getItem('StudyID');
      var StudyInitials =  localStorage.getItem('StudyInitials');
      var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
      var timeDifference = Math.floor(timeDifferenceseconds);

      var data = "Event="+previouspage+"&StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&Duration="+timeDifference;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          var data1 = "Event=logout&StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&Duration="+timeDifference;
          var xhr2 = new XMLHttpRequest();
          xhr2.withCredentials = true;

          xhr2.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
              console.log(this.responseText);
            }
          });

          xhr2.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
          xhr2.withCredentials = false;
          xhr2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr2.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
          xhr2.setRequestHeader("cache-control", "no-cache");
          xhr2.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

          xhr2.send(data1);


          localStorage.clear();
          window.location.reload();
        }
      });

      xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
      xhr.setRequestHeader("cache-control", "no-cache");
      xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

      xhr.send(data);
    }

    }
    
  }

  function myScript(){
    console.log('unload Author page');
  }

  var addCardBtnElement = document.querySelector('.add__btn');
  //Add github user data to the card
  var addCardInputElement = document.querySelector('#StudyID');
  var addCardInputElement1 = document.querySelector('#StudyInitials');
  function addGitUserCard() {
    var StudyID = addCardInputElement.value;
    var StudyInitials = addCardInputElement1.value;
    if (StudyID === '' || StudyID.length !== 3)  { 
      alert('StudyID should be 3 digits');
      return;
    }
    if (StudyInitials === '' || StudyInitials.length !== 4) {
      alert('Study Initials should be 4 letters');
      return;
    }
 

    addCardInputElement.value = '';
    localStorage.setItem('StudyID', StudyID);
    localStorage.setItem('StudyInitials', StudyInitials);

    fetchReqInfo(StudyID);

    var previouspage  = localStorage.getItem("CurrentPage");

    localStorage.setItem("PreviousPage", previouspage);
    localStorage.setItem("CurrentPage", "aboutUs");
    localStorage.setItem("CurrentPageTimeStamp", Date.now());

      var data = "Event=doLogin&StudyID="+StudyID+"&StudyInitials="+StudyInitials;

      document.querySelector('#StudyInitialslb').innerHTML =StudyInitials;
      document.querySelector('#StudyIDlb').innerHTML =StudyID;
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
       xhr.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
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
    var StudyID = localStorage.getItem('StudyID');
    var StudyInitials =  localStorage.getItem('StudyInitials');
    if (rating === 0 || GroundingRate === 0)  { 
      alert('All questions are required to answer');
      return;
    }
      var data = "StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&RatingComment="+comments+"&Rating="+rating+"&GroundingRate="+GroundingRate;

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
      xhr.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
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

  fetchReqInfo(localStorage.getItem('StudyID')); //Fetch github users data


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
      if(localStorage.getItem("CurrentPage")!=="doLogin")
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
      var StudyID = localStorage.getItem('StudyID');
      var StudyInitials =  localStorage.getItem('StudyInitials');
      if(StudyID!==null || StudyInitials !==null)
      {
        var previouspage  = localStorage.getItem("CurrentPage");
        var entryTimeStamp = localStorage.getItem("CurrentPageTimeStamp");
        var currentTimeStamp = Date.now();

        var timeDifferenceseconds = (currentTimeStamp - entryTimeStamp)/1000;
        var timeDifference = Math.floor(timeDifferenceseconds);

        var data = "Event="+previouspage+"&StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&Duration="+timeDifference;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            console.log(this.responseText);
            var data1 = "Event=logout&StudyID="+StudyID+"&StudyInitials="+StudyInitials+"&Duration="+timeDifference;
            var xhr2 = new XMLHttpRequest();
            xhr2.withCredentials = true;

            xhr2.addEventListener("readystatechange", function () {
              if (this.readyState === 4) {
                console.log(this.responseText);
            localStorage.clear();
            window.location.reload();
              }
            });

            xhr2.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
            xhr2.withCredentials = false;
            xhr2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr2.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
            xhr2.setRequestHeader("cache-control", "no-cache");
            xhr2.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

            xhr2.send(data1);
          }
        });

        xhr.open("POST", "https://grounding.herokuapp.com/API/eventLogCreate");
        xhr.withCredentials = false;
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Access-Control-Allow-Origin", "https://facing-forward.org");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("Postman-Token", "a5a1754d-842e-46d6-88f1-478c94bdf132");

        xhr.send(data);
      }
      else
      {
        localStorage.clear();
            window.location.reload();
      }
          
       
    }, 10000);
    alert('This page has been inactive for several minutes. You will be logged out shortly.');

  }
   
  function goActive() {
      // do something
           
      startTimer();
  }


})();
