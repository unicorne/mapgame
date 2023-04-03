


function loadJSONP(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  }
  
function calculateScore(distance) {
    var maxDistance = 12000000;
    var tmp_score = maxDistance/distance;
    var score = Math.round(tmp_score);
    return score;
}

function displayScore(score) {
    document.getElementById('score-table').innerHTML = score; 
}

function displayLevel(level) {
    document.getElementById('level-header').innerHTML = (level + 1).toString(); 
}

function displayCounter(counter) {
    document.getElementById('counter').innerHTML = counter; 
}

function displayMarkerLocation(level, randomNumber){
    document.getElementById('marker-location').innerHTML = locations[level].cities[randomNumber].city;
}

function nextTarget(mymap, level, targetMarker, distanceLine){
    // remove Target MArker from map
    targetMarker.removeFrom(mymap);
    var randomNumber = Math.floor(Math.random() * locations[level].cities.length);
    console.log(randomNumber);
    displayMarkerLocation(level, randomNumber)
    var lat = locations[level].cities[randomNumber].lat;
    var lng = locations[level].cities[randomNumber].lng;
    targetMarker.setLatLng([lat, lng]);
}
  
  // Map
  
  loadJSONP('locations.js', function() {


  
    var maximumlevel = locations.length;
    var level = 0;
    var score = 0;
    var counter = 0;
    displayLevel(level)
    displayScore(score)
    displayCounter(counter)
  
  
    var mymap = L.map('mapid').setView([0, 0], 2);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 14,
      id: 'mapbox.streets'
    }).addTo(mymap);
  
    var targetMarker = L.marker([45.5231, -122.6765])
  
    var draggableMarker = L.marker([0, 0], {
      draggable: true,
      autoPan: true
    }).addTo(mymap);
  
    var distanceLine = null;

    nextTarget(mymap, level, targetMarker, distanceLine);

  // Set the duration of the countdown in seconds
  const duration = 10;

  // Get the countdown element
  const countdown = document.getElementById('countdown');

  // Create the animation
  const animation = countdown.animate([
    { width: '100%' },
    { width: '0%' }
  ], {
    duration: duration * 1000,
    easing: 'linear',
    fill: 'forwards'
  });

  // Set the initial color of the countdown
  countdown.style.backgroundColor = '#f00';

  // Set up a function to update the color of the countdown
  function updateColor(time) {
    const percent = time / duration * 100;
    countdown.style.backgroundColor = `hsl(${percent}, 100%, 50%)`;
  }

  // Add an event listener to the animation to update the color of the countdown
  animation.addEventListener('update', () => {
    updateColor(animation.currentTime / 1000);
  });



  
  
    // Buttons
    var calculateButton = document.getElementById('calculate-distance');
    calculateButton.addEventListener('click', function() {

      animation.pause();

      targetMarker.addTo(mymap);

      counter += 1;
      displayCounter(counter)
      var targetLatLng = targetMarker.getLatLng();
      var draggableLatLng = draggableMarker.getLatLng();
      var distance = targetLatLng.distanceTo(draggableLatLng).toFixed(2);
      if (distanceLine) {
        distanceLine.removeFrom(mymap);
      }
      distanceLine = L.polyline([targetLatLng, draggableLatLng], {color: 'red'});
      distanceLine.addTo(mymap);
      alert('The distance between the markers is ' + distance + ' meters.');
  
      score += calculateScore(distance);
      displayScore(score)

      console.log(distanceLine)
      
  
      if (level == maximumlevel) {
        alert('You have reached the maximum level. Your score is ' + score);
      }
  
      if (counter == 5) {
        level += 1;
        displayLevel(level)
        counter = 0;
        displayCounter(counter)
      }

    });

    var nextButton = document.getElementById('Next Target');
    nextButton.addEventListener('click', function() {
      nextTarget(mymap, level, targetMarker, distanceLine);
      distanceLine.removeFrom(mymap);
      animation.cancel();
      animation.play();
        });
  
  
    // Markers
  
    draggableMarker.on('drag', function(event) {
      var marker = event.target;
      var position = marker.getLatLng();
      if (distanceLine) {
        distanceLine.removeFrom(mymap);
      }
    });
  
  
    // The JSONP file has been loaded, and its contents are now available
    // in a variable named "locations".
    console.log(locations);
    // get random number between 0 and lenght of locations array

  });
  
  
  
  
  
  
  
  
  