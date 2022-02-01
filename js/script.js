// Global Variables
var searchFormEl=document.querySelector("#search-form");
var cityInputEl = document.querySelector("#location");
var currentEl = document.querySelector("#current");
var cityH1EL = document.querySelector("#currentCity");
var uvEl=document.querySelector("#currentUV");
var cardsEl= document.querySelector("#cards");
var lat;
var lon;
var today = new Date(); //variable to hold current date provided by Operating System 
var currentCity = "";
var lastCity = "";

var test;
//Function to process current weather
function displayCurrentWeather(city) {
lat=city.coord.lat;
lon=city.coord.lon;
//calling an api to get UV index data
var oneapiurl="https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+ lon +"&exclude=hourly,daily,minutely&appid=740f604db53ec85433f6fefa46149173";  
var iconcode = city.weather[0].icon;
var iconurl = "https://openweathermap.org/img/w/" + iconcode +".png";
cityH1EL.innerHTML="";

//current date assigned 
date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
cityH1EL.innerHTML=city.name + " " +"("+ date +")" + " " + "<img src=" + iconurl +">";
document.getElementById('currentTemp').innerHTML="Temp: "+ city.main.temp+"°F";
document.getElementById('currentWind').innerHTML="Wind: "+ city.wind.speed+" MPH";
document.getElementById('currentHumidty').innerHTML="Humidty: "+ city.main.humidity+" %";
//fetching UV index API
fetch(oneapiurl).then(function(response) {
    response.json().then(function(data) {

      console.log(data.current.uvi);
      console.log(data);
        var clr=uvindexColor(data.current.uvi);
        
        document.getElementById('currentUV').innerHTML="UV Index: "+ "<span id=uvspan class="+ clr +"> "+ data.current.uvi +"</span>";
        
        
        
    });
  });

}


//UV index color is assigned in this function

function uvindexColor(x){
if(x<=2)
{
    return "green";
}
else if(x>2 && x<6)
{
return "yellow";

}
else if(x>=6 && x<8){
return "orange"
}

else {
    return "red"
}
     

}

// 5 day Forecast weather function
function display5DayWeather(town)
{
    var today = new Date();
    
    
                cardsEl.innerHTML="";

            for(let j=0,i=0;j<5;i+=8){ //for loop to 5 hour forescast 
                var iconcode = town.list[i].weather[0].icon; //weather icon assigned here
              
               var date = new Date(town.list[i].dt*1000); //UNIX tyoe date converted readable type in here
               date=date.toLocaleDateString("en-US");
             
                

                var iconurl = "https://openweathermap.org/img/w/" + iconcode +".png";
                
                //DOM elements created and manipulated here
                var bdcardEl=document.createElement("div");
                bdcardEl.className="card-body";
                cardsEl.appendChild(bdcardEl);
                var cardUl=document.createElement("ul");
                var dateForcastEl=document.createElement("li");
                dateForcastEl.innerHTML= date;
                cardUl.appendChild(dateForcastEl);
                bdcardEl.appendChild(cardUl);
                var icoEl=document.createElement("li");
                icoEl.innerHTML="<img src=" + iconurl +">";
                cardUl.appendChild(icoEl);
                var tempEl=document.createElement("li");
                tempEl.innerHTML="Temp: " + Math.floor(town.list[i].main.temp);
                cardUl.appendChild(tempEl);

                var windEl=document.createElement("li");
                windEl.innerHTML="Wind: " + Math.floor(town.list[i].wind.speed);
                cardUl.appendChild(windEl);

                var humEl=document.createElement("li");
                humEl.innerHTML="Humidty: " + town.list[i].main.humidity;
                cardUl.appendChild(humEl);

                j++;        
        
            }


        
    
    
    
   
    
}


//Searched City data received and processed here
var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
  var cityname = cityInputEl.value.trim();

  if (cityname) {
    saveCity(cityname);
    getCityForecast(cityname);
  } else {
    alert("Please enter a City");
  }

  };
  


  //Api called here for current weather
  var getCityForecast = function(city) {
    // format api url using searched city query
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=740f604db53ec85433f6fefa46149173";
  
    // make a get request to url
    fetch(apiUrl).then(function(response) {
      
      response.json().then(function(data) {
        displayCurrentWeather(data);
            
        
        

            
      });
    });

    //5 day Forecast Api called here
    
  apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid=740f604db53ec85433f6fefa46149173";
  
  fetch(apiUrl).then(function(response) {
      
    response.json().then(function(data) {
        display5DayWeather(data);
          
      
      

          
    });
  });

  };


  // Function to save the city to localStorage
var saveCity = (newCity) => {
  let cityExists = false;
  // Check if City exists in local storage
  for (let i = 0; i < localStorage.length; i++) {
      if (localStorage["cities" + i] === newCity) {
          cityExists = true;
          break;
      }
  }
  // Save to localStorage if city is new
  if (cityExists === false) {
      localStorage.setItem('cities'+localStorage.length, newCity);
  }
}

var renderCities = () => {
  $('#city-results').empty();
  // If localStorage is empty
  if (localStorage.length===0){
      if (lastCity){
          $('#location').attr("value", lastCity);
      } else {
          $('#location').attr("value", "Queens");
      }
  } else {
      // Build key of last city written to localStorage
      let lastCityKey="cities"+(localStorage.length-1);
      lastCity=localStorage.getItem(lastCityKey);
      // Set search input to last city searched
      $('#location').attr("value", lastCity);
      // Append stored cities to page
      for (let i = 0; i < localStorage.length; i++) {
          let city = localStorage.getItem("cities" + i);
          let cityEl;
          // Set to lastCity if currentCity not set
          if (currentCity===""){
              currentCity=lastCity;
          }
          // Set button class to active for currentCity
          if (city === currentCity) {
              cityEl = `<button type="button" class="list-group-item list-group-item-action active mb-3 bg-light text-center>${city}</button></li>`;
          } else {
              cityEl = `<button type="button" class="list-group-item list-group-item-action mb-3 bg-light text-center ">${city}</button></li>`;
          } 
          // Append city to page
          $('#city-results').prepend(cityEl);
      }
      
  }
  
}



// New city search button event listener
$('#search-button').on("click", (event) => {
  event.preventDefault();
  currentCity = $('#location').val();
  formSubmitHandler(event);
  });
  
  // Old searched cities buttons event listener
  $('#city-results').on("click", (event) => {
      event.preventDefault();
      $('#location').val(event.target.textContent);
      currentCity=$('#location').val();
      formSubmitHandler(event);
  });

//Default page and City Weather called here
let defaultcity="Queens";

getCityForecast(defaultcity);  
renderCities();

  //Search Button listener

  searchFormEl.addEventListener("submit", formSubmitHandler);



  

   