var facilities;
var group;

function addHealthCentres(map) {
  return $.getJSON('data/healthCentres.json', function(json) {
    var markers = [];

    var clinicIcon = new L.Icon({iconUrl: 'js/images/clinic.png', iconSize: [16, 16]});
    var hospitalIcon = new L.Icon({iconUrl: 'js/images/hospital.png', iconSize: [16, 16]});

    for (var i = 0; i < json.length; i++) {

      var marker = new L.marker(
        [json[i].latLng[0], json[i].latLng[1]],
        {
          'title': json[i].name,
          'icon': json[i].type == 'clinic' ? clinicIcon : hospitalIcon
        });

      var popupString = '<span class="head">' + json[i].name + '</span><br/>';
      popupString += '<b>Location:</b> ' + json[i].location + '<br/>';
      popupString += '<b>Authority:</b> ' + json[i].authority + '<br/>';
      popupString += '<b>Class:</b> ' + json[i].classification;

      if(json[i].manager) {
        popupString += '<br/><b>Manager:</b> ' + json[i].manager;
      }

      if(json[i].tel) {
        popupString += '<br/><b>Tel:</b> ' + json[i].tel;
      }

      if(json[i].email) {
        popupString += '<br/><b>Email:</b> ' + json[i].email;
      }

      if(json[i].clinicConsultingRooms > 0) {
        popupString += '<br/><b>Consulting Rooms:</b> ' + json[i].clinicConsultingRooms;
        marker.clinicConsultingRooms = json[i].clinicConsultingRooms;
      }

      if(json[i].procedureRooms > 0) {
        popupString += '<br/><b>Procedure Rooms:</b> ' + json[i].procedureRooms;
        marker.procedureRooms = json[i].procedureRooms;
      }

      if(json[i].outpatientRooms > 0) {
        popupString += '<br/><b>Outpatient Rooms:</b> ' + json[i].outpatientRooms;
        marker.outpatientRooms = json[i].outpatientRooms;
      }

      if(json[i].emergencyRooms > 0) {
        popupString += '<br/><b>Emergency Rooms:</b> ' + json[i].emergencyRooms;
        marker.emergencyRooms = json[i].emergencyRooms;
      }

      if(json[i].nurses > 0) {
        popupString += '<br/><b>Nurses:</b> ' + json[i].nurses;
        marker.nurses = json[i].nurses;
      }

      if(json[i].clinicians > 0) {
        popupString += '<br/><b>Clinicians:</b> ' + json[i].clinicians;
        marker.clinicians = json[i].clinicians;
      }

      if(json[i].midwives > 0) {
        popupString += '<br/><b>Midwives:</b> ' + json[i].midwives;
        marker.midwives = json[i].midwives;
      }

      if(json[i].pharmacists > 0) {
        popupString += '<br/><b>Pharmacists:</b> ' + json[i].pharmacists;
        marker.pharmacists = json[i].pharmacists;
      }

      marker.bindPopup(popupString);
      markers.push(marker);
    }
    facilities = markers;

    group = L.featureGroup(markers);
    group.addTo(map);
    map.fitBounds(group.getBounds());

    //console.log(markers);
  });
}

function getCheckedValues() {
  var boxes = $('.box');
  var values = {};

  for(var i = 0; i < boxes.length; i++) {
    if($(boxes[i]).is(":checked")) {
      values[$(boxes[i]).attr('id')] = true;
    } else {
      values[$(boxes[i]).attr('id')] = false;
    }
  }

  return values;
}

function applyFilter(map) {
  var checkedValues = getCheckedValues();

  map.removeLayer(group);

  var filteredList = [];

  for(var i = 0; i < facilities.length; i++) {
    var marker = facilities[i];

    var satisfiesFilter = true;

    for (var key in checkedValues) {
      if (checkedValues.hasOwnProperty(key)) {
        if(checkedValues[key]) {
          satisfiesFilter &= (marker[key] > 0);
        }
      }
    }

    if(satisfiesFilter) {
      filteredList.push(marker);
    }
  }

  if(filteredList.length > 0) {
    group = L.featureGroup(filteredList);
    group.addTo(map);
    map.fitBounds(group.getBounds(), {maxZoom: 10});
  }
}

// Initialise the map
var map = L.map('map', {scrollWheelZoom: false}).setView([-33.9253, 18.4239], 13);

L.tileLayer('http://{s}.tiles.mapbox.com/v4/{mapId}/{z}/{x}/{y}.png?access_token={token}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 25,
    subdomains: ['a','b','c','d'],
    mapId: 'psbrandt.4abd808b',
    token: 'pk.eyJ1IjoicHNicmFuZHQiLCJhIjoidmU1VGRUMCJ9.Evajrp_rIIoqaeXBjNbVDA'
}).addTo(map);

addHealthCentres(map);

$('.box').on('change', function() {
  applyFilter(map);
});






