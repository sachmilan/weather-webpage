var input = document.getElementById('inputvalue');
var btn = document.getElementById('btn');
var name = document.getElementById('name');
var qq = document.getElementById('qq');

btn.addEventListener('click', function(){
    fetch('api.openweathermap.org/data/2.5/weather?q='+input.value+'&appid=1291db61f641ff72ce7519899878bf5a')
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })});

