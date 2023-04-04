function loadJSONP(url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  script.onload = callback;
  document.body.appendChild(script);
}


loadJSONP('locations.js', function() {
// ###############################################
// #                                             #
// #                Functions                    #
// #                                             #
// ###############################################
  function showModal(distance) {
    var modal = document.getElementById("myModal");
    var distanceValue = document.getElementById("distance-value");
    var scoreValue = document.getElementById("score-value");
    var timeValue = document.getElementById("time-value");
    distanceValue.innerHTML = "Distance: " + distance + " meters";
    scoreValue.innerHTML = "Score: " + calculateScore(distance);
    timeValue.innerHTML = "Time: " + lastTimeRemaining;
    modal.style.display = "block";
    
    var modalButton = document.getElementById("Next Target Modal");
    

    modalButton.addEventListener("click", closeModal); // add event listener to close modal
    modalButton.addEventListener("click", nextTargetComplete); // add event listener to close modal

    var pauseButton = document.getElementById("Pause");
    pauseButton.addEventListener("click", pauseAnimation); // add event listener to close modal

    
    var closeBtn = document.getElementsByClassName("close")[0];
    closeBtn.onclick = function() {
      modal.style.display = "none";
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  function showStartModal() {
    var modal = document.getElementById("startModal");
    modal.style.display = "block";
    
    var modalButton = document.getElementById("StartGame");
    

    modalButton.addEventListener("click", closeStartModal); // add event listener to close modal
    //modalButton.addEventListener("click", nextTargetComplete); // add event listener to close modal

    
    var closeBtn = document.getElementsByClassName("close")[0];
    closeBtn.onclick = function() {
      modal.style.display = "none";
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }

  function pauseAnimation(){
    // check if animation is paused
    if (animation._paused) {
      animation.play();
    } else {
      animation.pause();
    }
  }

  function startAnimation() {
    animation.cancel();
    animation.play();
  }

  function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  function closeStartModal() {
    var modal = document.getElementById("startModal");
    modal.style.display = "none";
    startAnimation() 
  }

    
  function calculateScore(distance) {
      var maxDistance = 12000000;
      var tmp_score = maxDistance/distance;
      var score = Math.round(tmp_score);
      updateTimeRemaining();
      return score;
  }

  function displayScore(score, levelScore) {
      //document.getElementById('score-table').innerHTML = score; 
      document.getElementById('score-display').innerHTML = score;
      document.getElementById('levelScore').innerHTML = levelScore; 
  }

  function displayLevel(level) {
      //document.getElementById('level-header').innerHTML = (level + 1).toString(); 
      document.getElementById('level-display').innerHTML = (level + 1).toString();
      document.getElementById('scoreNeeded').innerHTML = scoreNeeded; 
  }

  function displayCounter2(counter) {
      document.getElementById('counter').innerHTML = counter; 
  }

  function displayMarkerLocation(level, randomNumber, counter){
      //document.getElementById('marker-location').innerHTML = locations[level].cities[randomNumber].city;
      document.getElementById('target-display').innerHTML = locations[level].cities[randomNumber].city;
      displayCounter();

  }

  function displayCounter(){
    //var timeleft = 10 - animation.currentTime / 1000
    //document.getElementById('timeleft-display').innerHTML = timeleft
    var max_c = locations[level].counter_max;
    var counter_show = counter +1;
    document.getElementById('counter-display').innerHTML = counter_show + '/' + max_c;

  };

  function nextTarget(){
      // remove Target MArker from map
      targetMarker.removeFrom(mymap);
      var randomNumber = Math.floor(Math.random() * locations[level].cities.length);
      console.log(randomNumber);
      displayMarkerLocation(level, randomNumber)
      var lat = locations[level].cities[randomNumber].lat;
      var lng = locations[level].cities[randomNumber].lng;
      targetMarker.setLatLng([lat, lng]);
  }

  function nextTargetComplete(){
      nextTarget(mymap, level, targetMarker)
      distanceLine.removeFrom(mymap);
      mymap.setView([0,0], 2);
      animation.cancel();
      animation.play();
    }



  

  function calculateDistance(){
    animation.pause();
    targetMarker.addTo(mymap);
    var targetLatLng = targetMarker.getLatLng();
    var draggableLatLng = draggableMarker.getLatLng();
    var distance = targetLatLng.distanceTo(draggableLatLng).toFixed(2);

    // calculate the center of the two markers
    var latLngs = [targetLatLng, draggableLatLng];
    var center = L.latLngBounds(latLngs).getCenter();

    // calculate the appropriate zoom level based on the distance between the markers
    var zoom = mymap.getBoundsZoom(L.latLngBounds(latLngs).pad(0.5), false);
    console.log(zoom);
    var zoom_time = zoom*300;
    var zoom_time_modal = zoom*300 + 500;


    // set the map view to the center of the markers with the appropriate zoom level
    mymap.flyTo(center, zoom);
    setTimeout(function(){
      distanceLine = L.polyline([targetLatLng, draggableLatLng], {color: 'red'});
      distanceLine.addTo(mymap);
    }, zoom_time);
    setTimeout(function(){
      showModal(distance);
    }, zoom_time_modal);

    
      
    return distance;
  }

  function completeGuess(){
    distance = calculateDistance();
    setTimeout(function(){
      updateGameState(distance);
      nextTargetComplete();
      closeModal();
    }, 5000);
  };

  function updateGameState(distance){
    score += calculateScore(distance);
    levelScore += calculateScore(distance);
    displayScore(score, levelScore) 

    counter += 1;
    displayCounter(counter)
    

    if (level == maximumlevel - 1) {
      alert('You have reached the maximum level. Your score is ' + score);
    }

    counter_max = locations[level].counter_max;
    console.log('Counter max' + counter_max);
    console.log('scoreNeeded' + scoreNeeded);
    console.log('levelScore' + levelScore);
    if (counter == counter_max) {
      if (scoreNeeded <= levelScore) {
        level += 1;
        scoreNeeded = locations[level].score_needed;
        displayLevel(level)
        counter = 0;
        levelScore = 0;
        displayCounter(counter)
        displayScore(score, levelScore) 
      }else {
        console.log('Game Over');
        alert('Game Over');
        console.log('Game Over');
      }
    }
  };


  


  // ###############################################
  // #                                             #
  // #                Functions                    #
  // #                                             #
  // ###############################################

  showStartModal();
  
  var maximumlevel = 3;
  var level = 0;
  var score = 0;
  var counter = 0;
  var scoreNeeded = locations[level].score_needed;
  var levelScore = 0;
  var lastTimeRemaining = 0;
  
  displayLevel(level)
  displayScore(score, levelScore) 
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

  nextTarget(mymap, level, targetMarker, distanceLine);

  // Set the initial color of the countdown
  countdown.style.backgroundColor = '#f00';

  // Set up a function to update the color of the countdown
  function updateColor(time) {
    const percent = time / duration * 100;
    console.log(percent)
    countdown.style.backgroundColor = `hsl(${percent}, 100%, 50%)`;
  
  }

  function updateTimeRemaining() {
    const remaining =  ((10000 - animation.currentTime)/1000).toFixed(2);
    lastTimeRemaining = remaining;
  }


  // Add an event listener to the animation to update the color of the countdown
  animation.addEventListener('update', () => {
    updateColor(animation.currentTime / 1000);
  });

  //animation.addEventListener('finish', () => {
    //completeGuess();
  //});



  
  
    // Buttons
    var calculateButton = document.getElementById('calculate-distance');
    calculateButton.addEventListener('click', function() {

      distance = calculateDistance();
  

      updateGameState(distance);

    });

    //var nextButton = document.getElementById('Next Target');
    //nextButton.addEventListener("click", closeModal);
    //nextButton.addEventListener('click', function() {
      //nextTargetComplete(mymap, level, targetMarker, distanceLine, animation);
        //});

  
    // Markers
    mymap.on('click', function(e) {
      draggableMarker.setLatLng(e.latlng);
    });
  
    draggableMarker.on('drag', function(event) {
      var marker = event.target;
      if (distanceLine) {
        distanceLine.removeFrom(mymap);
      }
    });
  
  
    // The JSONP file has been loaded, and its contents are now available
    // in a variable named "locations".
    console.log(locations);
    // get random number between 0 and lenght of locations array

    
  });
  
  
  
  
  
  
  
  
  