var input = document.getElementById('inputvalue');
var btn = document.getElementById('btn');
var city = document.getElementById('city');
var temp = document.getElementById('temp');
var wind = document.getElementById('wind');
var humidity = document.getElementById('humidity');
var uvIdx = document.getElementById('uvindex');
var temp1 = document.getElementById('temp1');
var wind1 = document.getElementById('wind1');
var humidity1 = document.getElementById('humidity1');
var temp2 = document.getElementById('temp2');
var wind2 = document.getElementById('wind2');
var humidity2 = document.getElementById('humidity2');
var temp3 = document.getElementById('temp3');
var wind3 = document.getElementById('wind3');
var humidity3 = document.getElementById('humidity3');
var temp4 = document.getElementById('temp4');
var wind4 = document.getElementById('wind4');
var humidity4 = document.getElementById('humidity4');
var temp5 = document.getElementById('temp5');
var wind5 = document.getElementById('wind5');
var humidity5 = document.getElementById('humidity5');
var cityStr = document.getElementById('cityStr');
var cities = []; 

var lat1 = "";
var lon1 ="";
var name= document.getElementById('name');

btn.addEventListener('click', function(){
fetch('http://api.openweathermap.org/geo/1.0/direct?q='+input.value+'&limit=1&appid=1291db61f641ff72ce7519899878bf5a')
.then(function(response){
    return response.json();
})
.then(function(data){
    console.log(data);
    var lat= data['0']['lat'];
    var lon= data['0']['lon'];
    var cityEl = data['0']['name'];

    city.textContent=cityEl;
    cities.push(cityEl);
    localStorage.setItem("city",cities);
    //var citystore = localStorage.getItem("city");
    //for(var i=0; i<citystore.length; i++){
        var litsEL= document.createElement("li");
        litsEL.textContent=cityEl;
        cityStr.appendChild(litsEL);
   // }

    //document.createElement();

    console.log(typeof citystore);
    console.log(cityEl);
    lat1 = lat;
    lon1 = lon;
    console.log(lat1);
    console.log(lon1);


fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat1+'&lon='+lon1+'&units=imperial&appid=1291db61f641ff72ce7519899878bf5a')
.then(function(response){
    return response.json();
})
.then(function(data){
    console.log(data);
    var w= data['current']['temp'];
    var x = data['current']['wind_speed'];
    var y= data['current']['humidity'];
    var z = data['current']['uvi']

    var w1= data['daily']['1']['temp']['max'];
    var x1 = data['daily']['1']['wind_speed'];
    var y1= data['daily']['1']['humidity'];

    console.log(w1);

    var tempEl= "Temp: " +w+ "F";
    var windEl = "Wind: " +x+ "MPH";
    var humidityEl = " Humidity: " +y+ "%";
    var uvIdxEl = "UV Index: " +z+ "";  

    var tempEl1 ="Temp: " +w1+ "F";
    var windEl1 ="Wind: " +x1+ "MPH";
    var humidityEL1 ="Humidity: " +y1+ "%";


    //wind = windEl;
    console.log(tempEl);
    console.log(windEl);
    temp.textContent = tempEl;
    wind.textContent = windEl;
    humidity.textContent = humidityEl;
    uvIdx.textContent = uvIdxEl;

    temp1.textContent = tempEl1;
    wind1.textContent = windEl1;
    humidity1.textContent = humidityEL1;

    var w2= data['daily']['2']['temp']['max'];
    var x2 = data['daily']['2']['wind_speed'];
    var y2= data['daily']['2']['humidity'];

    var tempEl2 ="Temp: " +w2+ "F";
    var windEl2 ="Wind: " +x2+ "MPH";
    var humidityEL2 ="Humidity: " +y2+ "%";

    temp2.textContent = tempEl2;
    wind2.textContent = windEl2;
    humidity2.textContent = humidityEL2;

    var w3= data['daily']['3']['temp']['max'];
    var x3 = data['daily']['3']['wind_speed'];
    var y3= data['daily']['3']['humidity'];

    var tempEl3 ="Temp: " +w3+ "F";
    var windEl3 ="Wind: " +x3+ "MPH";
    var humidityEL3 ="Humidity: " +y3+ "%";

    temp3.textContent = tempEl3;
    wind3.textContent = windEl3;
    humidity3.textContent = humidityEL3;

    var w4= data['daily']['4']['temp']['max'];
    var x4 = data['daily']['4']['wind_speed'];
    var y4= data['daily']['4']['humidity'];

    var tempEl4 ="Temp: " +w4+ "F";
    var windEl4 ="Wind: " +x4+ "MPH";
    var humidityEL4 ="Humidity: " +y4+ "%";

    temp4.textContent = tempEl4;
    wind4.textContent = windEl4;
    humidity4.textContent = humidityEL4;
    
    var w5= data['daily']['5']['temp']['max'];
    var x5 = data['daily']['5']['wind_speed'];
    var y5= data['daily']['5']['humidity'];

    var tempEl5 ="Temp: " +w5+ "F";
    var windEl5 ="Wind: " +x5+ "MPH";
    var humidityEL5 ="Humidity: " +y5+ "%";

    temp5.textContent = tempEl5;
    wind5.textContent = windEl5;
    humidity5.textContent = humidityEL5;


})
// var windEl= data["current"];
// wind = windEl;
// console.log(windEl);

console.log(lat1);
console.log(lon1);
}) })

