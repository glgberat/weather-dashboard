var searchFormEl=document.querySelector("#search-form");
var cityInputEl = document.querySelector("#location");
var currentEl = document.querySelector("#current");
var cityH1EL = document.querySelector("#currentCity");
var uvEl=document.querySelector("#currentUV");
var cardsEl= document.querySelector("#cards");
var lat;
var lon;
var today = new Date();
var dayafter =  new Date();
dayafter.setDate(today.getDate() + 1);
var date =(today.getMonth()+1) +'-'+ today.getDate()+'-'+ today.getFullYear();
var test;

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

            for(let i=0;i<5;i++){
                var iconcode = town.list[i].weather[0].icon;
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+i);

                console.log(town.list[i].dt);
                console.log(town.list[i].main.temp);
                console.log(town.list[i].main.humidity);
                console.log(town.list[i].wind.speed);

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
        
        
            }


        
    
    
    
   
    
}



var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
  var cityname = cityInputEl.value.trim();

  if (cityname) {
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
        display5DayWeather(data);
          
      
      

          
    });
  });

  };
  
  searchFormEl.addEventListener("submit", formSubmitHandler);



  

   