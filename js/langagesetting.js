
  var lang = getCookie("lang");
  console.log("Langue = "+lang);

  if(!lang){
    createCookie("lang","fr",30);
    lang = getCookie("lang");
  }
  setlang(lang);

function setlang(lang) {
    if(lang === "fr"){
      var list = document.getElementsByClassName("eng");
      for (var i = 0; i < list.length; i++) {
        list.item(i).classList.add("none");
      }
      var list = document.getElementsByClassName("fr");
      for (var i = 0; i < list.length; i++) {
        list.item(i).classList.remove("none");
      }
    }else 
    
    if(lang === "eng"){
      var list = document.getElementsByClassName("eng");
      for (var i = 0; i < list.length; i++) {
        list.item(i).classList.remove("none");
      }
      var list = document.getElementsByClassName("fr");
      for (var i = 0; i < list.length; i++) {
        list.item(i).classList.add("none");
      }
    }   
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function createCookie(name, value, days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toUTCString();
    } else {
        expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
}



function switchlang(e){
  e.preventDefault();
  let lang = getCookie("lang");
  if (lang === "fr") {
    setlang("eng");
    createCookie("lang","eng",30); 
    console.log("cookie set to eng => "+getCookie("lang"))
  }
  if (lang === "eng") {
    setlang("fr");
    createCookie("lang","fr",30);
    console.log("cookie set to fr => "+getCookie("lang"))
  }
}


function switchlangnavbar(e){
  e.preventDefault();
  let lang = getCookie("lang");
  if (lang === "fr") {
    setlang("eng");
  }
  if (lang === "eng") {
    setlang("fr");
  }
}