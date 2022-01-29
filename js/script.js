var searchFormEl=document.querySelector("#search-form");
var cityInputEl = document.querySelector("#location");
var currentEl = document.querySelector("#current");
var cityH1EL = document.querySelector("#currentCity");
var lat;
var lon;
var today = new Date();
var date =(today.getMonth()+1) +'-'+ today.getDate()+'-'+ today.getFullYear();

var displayCurrentWeather = function(city) {
lat=city.coord.lon;
lon=city.coord.lat;
var oneapiurl="https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+ lon + "&appid=740f604db53ec85433f6fefa46149173";  
var iconcode = city.weather[0].icon;
var iconurl = "http://openweathermap.org/img/w/" + iconcode +".png";
cityH1EL.innerHTML="";

cityH1EL.innerHTML=city.name + " " + date + " " + "<img src=" + iconurl +">";
document.getElementById('currentTemp').innerHTML="Temp: "+ city.main.temp+"°F";
document.getElementById('currentWind').innerHTML="Wind: "+ city.wind.speed+" MPH";
document.getElementById('currentHumidty').innerHTML="Humidty: "+ city.main.humidity+" %";
var uvdata=uvindex(oneapiurl);
document.getElementById('currentUV').innerHTML="UV Index: "+ uvdata.current.uvi;

}


function uvindex(url) {
    
    // make a get request to url
    fetch(url).then(function(response) {
        
       return response.json()
      });
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
  var cityname = cityInputEl.value.trim();

  if (cityname) {
    getCityForecast(cityname,"weather");
    cityInputEl.value = "";
  } else {
    alert("Please enter a City");
  }

  };
  


  
  var getCityForecast = function(city,parameter) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/" + parameter + "?q=" + city + "&units=imperial&appid=740f604db53ec85433f6fefa46149173";
  
    // make a get request to url
    fetch(apiUrl).then(function(response) {
      console.log(response);
      response.json().then(function(data) {
          console.log(data.main.temp);
        displayCurrentWeather(data);
      });
    });
  };
  
  searchFormEl.addEventListener("submit", formSubmitHandler);



/*
var requestUrl = "http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=740f604db53ec85433f6fefa46149173"

  fetch(requestUrl)
    .then(function(response) {
      return response.json();
    })

    
    .then(function(data) {

      console.log(data);
      // Looping over the fetch response and inserting the URL of your repos into a list
      
    });

    */



   