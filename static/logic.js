// query URL
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// get request
d3.json(queryURL, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude " + feature.properties.mag + "</h3>" +
                "<h3>Location: " + feature.properties.place + "</h3>" +
                "<hr><p>" + new Date(feature.properties.time) + "</p>"
                );
        },

        pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, {
                radius: markerRadius(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                fillOpacity: 0.65,
                color: "#000",
                stroke: true,
                weight: 1
            })
        } 
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiYW5kcmV3aG9hbmcwOSIsImEiOiJjamt1Zno2ejcwNTFkM3FwZGJrOXk1bWxxIn0.BCVeyxRcjhsbOLVqnx5uTQ");

    var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiYW5kcmV3aG9hbmcwOSIsImEiOiJjamt1Zno2ejcwNTFkM3FwZGJrOXk1bWxxIn0.BCVeyxRcjhsbOLVqnx5uTQ");

    var baseMaps = {
        "Satellite" : satellite,
        "Dark" : darkMap
    };

    var overlayMaps = {
        "Earthquakes" : earthquakes
    };

    var myMap = L.map("map", {
        center: [37.8044, -122.2711],
        zoom: 4,
        layers: [satellite, darkMap, earthquakes]
    });

    // layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitudes = [0, 1, 2, 3, 4, 5],
            labels = [];

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + markerColor(magnitudes[i] + 1) + '"></i> ' +
                magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
        }
        return div;  
    };
    legend.addTo(myMap);
}

// marker colors
function markerColor(x) {
    return x > 5 ? "#cc0000":
    x > 4 ? "#cc3300":
    x > 3 ? "#cc6600":
    x > 2 ? "#cc9900":
    x > 1 ? "#cccc00":
        "#ccff00";
}

// increase marker size for visibility
function markerRadius(value) {
    return value*12500
}