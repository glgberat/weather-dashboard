var searchFormEl=document.querySelector("#search-form");
var cityInputEl = document.querySelector("#location");
var currentEl = document.querySelector("#current");
var cityH1EL = document.querySelector("#currentCity");
var uvEl=document.querySelector("#currentUV");
var cardsEl= document.querySelector("#cards");
var lat;
var lon;
var today = new Date();

var test;

var displayCurrentWeather = function(city) {
lat=city.coord.lon;
lon=city.coord.lat;
var oneapiurl="https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+ lon + "&appid=740f604db53ec85433f6fefa46149173";  
var iconcode = city.weather[0].icon;
var iconurl = "http://openweathermap.org/img/w/" + iconcode +".png";
cityH1EL.innerHTML="";
date = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
cityH1EL.innerHTML=city.name + " " +"("+ date +")" + " " + "<img src=" + iconurl +">";
document.getElementById('currentTemp').innerHTML="Temp: "+ city.main.temp+"°F";
document.getElementById('currentWind').innerHTML="Wind: "+ city.wind.speed+" MPH";
document.getElementById('currentHumidty').innerHTML="Humidty: "+ city.main.humidity+" %";
fetch(oneapiurl).then(function(response) {
    response.json().then(function(data) {
        var clr=uvindexColor(data.current.uvi);
        
        document.getElementById('currentUV').innerHTML="UV Index: "+ "<span id=uvspan class="+ clr +"> "+ data.current.uvi +"</span>";
        
        
        
    });
  });

}




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
function display5DayWeather(town)
{
    var today = new Date();
    
    console.log(town);
                cardsEl.innerHTML="";

            for(let j=0,i=0;j<5;i+=8){
                var iconcode = town.list[i].weather[0].icon;
              
               var date = new Date(town.list[i].dt*1000);
               date=date.toLocaleDateString("en-US");
               /*console.log("Date: "+date.getDate()+
                         "/"+(date.getMonth()+1)+
                         "/"+date.getFullYear()); */
                

                var iconurl = "http://openweathermap.org/img/w/" + iconcode +".png";
                
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
  


  
  var getCityForecast = function(city) {
    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=740f604db53ec85433f6fefa46149173";
  
    // make a get request to url
    fetch(apiUrl).then(function(response) {
      
      response.json().then(function(data) {
        displayCurrentWeather(data);
            
        
        

            
      });
    });
    
  apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=imperial&appid=740f604db53ec85433f6fefa46149173";
  
  fetch(apiUrl).then(function(response) {
      
    response.json().then(function(data) {
      console.log(data);
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
          $('#location').attr("value", "Austin");
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

renderCities();
  
  searchFormEl.addEventListener("submit", formSubmitHandler);



  

   