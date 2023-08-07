
    const firebaseConfig = {
    apiKey: "AIzaSyCEsylIm412gqUfcc9gnPTMmHJbX0O0KaE",
    authDomain: "dustbin-monitor-1102f.firebaseapp.com",
    databaseURL: "https://dustbin-monitor-1102f-default-rtdb.firebaseio.com",
    projectId: "dustbin-monitor-1102f",
    storageBucket: "dustbin-monitor-1102f.appspot.com",
    messagingSenderId: "5065718611",
    appId: "1:5065718611:web:1aa84f7f92744a7f8e3fa6",
    measurementId: "G-YGTVSNME62"
    };
    
    firebase.initializeApp(firebaseConfig);



    var map;
    var markers = {};

    function initMap() {
      var initialLocation = { lat: 9.1727, lng: 77.8715 };
      map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 10,
      });

     
      addMarkersForBins();
    }

    function addMarker(location, binId) {
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });
      marker.addListener('click', function () {
        var binLevel = "N/A"; // Default value

        var binsRef = firebase.database().ref("bin").child(binId);
        binsRef.once("value").then(function (snapshot) {
          var binData = snapshot.val();
          if (binData && binData.level !== undefined) {
            binLevel = binData.level;
          }

          var infoWindow = new google.maps.InfoWindow({
            content: "City: " + binId + "<br>Bin Level: " + binLevel
          });

          infoWindow.open(map, marker);
        });
      });

      markers[binId] = marker;
    }
    function animateMarker(marker, newIcon) {
      // Add animation effect when changing the marker icon
      marker.setAnimation(google.maps.Animation.DROP);

      setTimeout(function () {
        marker.setIcon(newIcon);
      }, 800); // Delay the icon change to give animation effect
    }
    function fetchBinData() {
      var binsRef = firebase.database().ref("bin");
      binsRef.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var binKey = childSnapshot.key;
          var binData = childSnapshot.val();

          var binLevel = binData.level;
          var marker = markers[binKey];

          var newIcon;
          if (binLevel <= 30) {
            newIcon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
          } else if (binLevel <= 75) {
            newIcon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
          } else {
            newIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
          }

          if (marker.getIcon() !== newIcon) {
            animateMarker(marker, newIcon);
          }

          console.log("Bin: " + binKey + ", Level: " + binLevel);
        });
      });
    }

    function addMarkersForBins() {
      
      var binLocations = [
        { binId: "bin1", location: { lat: 9.1727, lng: 77.8715 } },
        { binId: "bin2", location: { lat: 9.2000, lng: 77.9800 } },
        { binId: "bin3", location: { lat: 9.1500, lng: 77.8200 } },
      ];

      binLocations.forEach((bin) => {
        addMarker(bin.location, bin.binId);
      });
      fetchBinData();
    setInterval(fetchBinData, 5000);
    }

  
    var script = document.createElement("script");
    
    document.body.appendChild(script);

   