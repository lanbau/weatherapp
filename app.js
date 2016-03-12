// Fetch & Display Countries
function whenUserTypes() {
	// Get Input
	var location = document.getElementById("location").value;
	if (location != "") {
		fetch('https://crossorigin.me/http://autocomplete.wunderground.com/aq?query=' + location)
			.then(function(res) {
				return res.json();
			}).then(function(data) {
				document.getElementById("countries").innerHTML = "";
				var ul = document.createElement('ul');
				// Append Response In A List
				data.RESULTS.forEach(obj => {
					var li = document.createElement('li');
					li.innerHTML = obj.name;
					ul.appendChild(li);
				})
				document.getElementById("countries").appendChild(ul);
			})
	} else {
		document.getElementById("countries").innerHTML = "";
	}
}
var count = 1;
var countryJSON;
var countrycode;
var zmw;
// Get Target Country Weather Data
countries.addEventListener("click", function(event){
	var country = event.srcElement.innerText;
	fetch('https://crossorigin.me/http://autocomplete.wunderground.com/aq?query=' + country)
		.then(function(res) {
			return res.json();
		}).then(function(data) {
			if (country === "Singapore") {
				countrycode = data.RESULTS[1].c;
				zmw = "zmw:" + data.RESULTS[1].zmw;
				countryJSON = "http://api.wunderground.com/api/268a6794b0827993/geolookup/conditions/forecast/q/" + zmw + ".json";
			} else {
				countrycode = data.RESULTS[0].c;
				zmw = "zmw:" + data.RESULTS[0].zmw;
				countryJSON = "http://api.wunderground.com/api/268a6794b0827993/geolookup/conditions/forecast/q/" + zmw + ".json";
			}
		});

	// Wait for promise to complete
	setTimeout(function() {
		fetch(countryJSON)
			.then(function(res){
				return res.json();
			}).then(function(data){
				var weatherIcon = data.current_observation.icon_url;
				var img = document.createElement('img');
				img.src = weatherIcon;

				$('#listing').html("");
				$('#weather').append('<p>' + event.srcElement.innerText + '</p>');
				$('#weather').append('<p>'+ data.current_observation.weather + '</p>');
				$('#weather').append(img);
				$('#weather').append('<p>'+ data.current_observation.temperature_string + '</p>');

				var ctyAttributes = {
					name : event.srcElement.innerText,
					weather : data.current_observation.weather,
					url : data.current_observation.icon_url,
					temperature : data.current_observation.temperature_string
				};

				localStorage.setItem(count, JSON.stringify(ctyAttributes));
				count = count + 1;

				for (var i = 0; i < localStorage.length; i++){
					var list = document.createElement('li');
					list.innerText = JSON.parse(localStorage.getItem(localStorage.key(i))).name;
					var link = JSON.parse(localStorage.getItem(localStorage.key(i))).url;
					// var image = document.createElement('img')
					// image.src = link
					// $('#listing').append(image)
					$('#listing').append(list);
				}

				$('#weather').click(function(e){
					var answer = confirm("Delete?");
					if (answer){
						document.getElementById("weather").innerHTML = "";
						document.getElementById("listing").innerHTML = "";
					} else {
					  console.log("Nothing Deleted.");
					}
				})
			})
	}, 3000);

	document.getElementById("countries").innerHTML = "";
});

//Swap Center Element With Clicked On Element
var botElement;
var bot = document.querySelector('.bottom');
bot.addEventListener('click', function(e) {
	botElement = e.srcElement.innerText;
	var centralElement = document.querySelector('#weather p').innerText;
	e.srcElement.innerText = centralElement;
	for(var i in window.localStorage) {
	   val = localStorage.getItem(i);
	   var valName = JSON.parse(val).name;
	   if(botElement === valName) {
	   		document.querySelectorAll('#weather p:nth-child(1)')[0].innerText = JSON.parse(val).name;
	   		document.querySelectorAll('#weather p:nth-child(2)')[0].innerText = JSON.parse(val).weather;
	   		document.querySelectorAll('#weather img')[0].src = JSON.parse(val).url;
	   		document.querySelectorAll('#weather p:nth-child(3)')[0].innerText = JSON.parse(val).temperature;
	   }
	}
});
