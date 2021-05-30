// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(population) {
  return population / 40;
}

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  //createFeatures(data.features);
  console.log(data.features)

  //
  for (var i = 0; i < data.features.length; i++) {
    
    //data.features[i].geometry.coordinates.slice(0,2)
    var location = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]]
    var depth = data.features[i].geometry.coordinates[2];
    var mag = data.features[i].properties.mag;
    var place = data.features[i].properties.place;

    console.log(location);
    L.circle(location, {
      opacity: .5,
      fillOpacity: 0.75,
      color: "black",
      fillColor: markercolor(depth),
      // Setting our circle's radius equal to the output of our markerSize function
      // This will make our marker's size proportionate to its population
      radius: 15000 * data.features[i].properties.mag
    }).bindPopup("<h1> Magnitude: " + mag + "</h1> <hr> <h3>Population: " + place + "</h3>").addTo(myMap);
  }
  //
  function markercolor(depth){
    
              if (depth > -10 && depth < 10)
                  color = 'rgb(19, 235, 45)'
              else if (depth >= 10 && depth < 30)
                  color = 'rgb(138, 206, 0)'
              else if (depth >= 30 && depth < 50)
                  color = 'rgb(186, 174, 0)'
              else if(depth >= 50 && depth < 70)
                  color = 'rgb(218, 136, 0)'
              else if ( depth >= 70 && depth < 90)
                  color = 'rgb(237, 91, 0)'
              else if (depth >= 90)
                  color = 'rgb(242, 24, 31)'
               
          
      return color
  };

});

newMarker = L.layer
//function to create the legend
function CreateLegend(){
    var div = L.DomUtil.create('div', 'info legend');
    var grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    var colors = ['rgb(19, 235, 45)','rgb(138, 206, 0)','rgb(186, 174, 0)','rgb(218, 136, 0)','rgb(237, 91, 0)','rgb(242, 24, 31)'];
    var labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    grades.forEach(function(grade, index){
        labels.push("<div> <li style=\"background-color: "  + colors[index] +  "; width: 20px"+ "; height: 20px" + "\"  ></li>" + "<li>" + grade + "</li></div>");
    })
    div.innerHTML += "<ul >" + labels.join("") +"</ul>";
    return div;
};
//adding a legend to the map
var legend = L.control({position: 'bottomright'});
legend.onAdd = CreateLegend
legend.addTo(myMap)
