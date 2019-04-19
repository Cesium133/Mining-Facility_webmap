var mymap;
var lyrMapboxStreets;
var lyrImagery;
var objBasemaps;
var overlays;
var lyrLACmining;    
var clrMine; 
var ctlSidebar;
var ctlEasyButton;

mymap = L.map('mapid').setView([-6,-70], 3.5);

lyrMapboxStreets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiY2hlcml5YW4iLCJhIjoiY2pyMTJranNsMHZqdDN5czc3eXBldWxneCJ9.JMi0vO_gz_7Pcr80f0Meag'
})

lyrMapboxStreets.addTo(mymap);

// add mouse position plug-in
ctlMousePosition = L.control.mousePosition({position:'bottomleft'}).addTo(mymap);

// add polyline measure plug-in
ctlPolyLine = L.control.polylineMeasure().addTo(mymap);

lyrImagery = L.tileLayer.provider('Esri.WorldImagery');

// add basemap layers
objBasemaps = {
    "Satellite Imagery" :lyrImagery,
    "Mapbox Basemap": lyrMapboxStreets
}

lyrLACmining = L.geoJSON.ajax('data/minfac_lac.json', {pointToLayer:returnLACMarker}).addTo(mymap);

// add search button 
mymap.addControl(new L.Control.Search({
    layer:lyrLACmining, 
    container:'search',
    propertyName:'LOCNAME',
    collapsed: false,
    zoom:10
}));

// lyrLACmining.on('data:loaded', function (){
//     mymap.fitBounds(lyrLACmining.getBounds());
// })

overlays = {
    "Mining Facilities": lyrLACmining
}

L.control.layers(objBasemaps, overlays).addTo(mymap);

ctlSidebar = L.control.sidebar('sidebar', {
    position: 'left'
}).addTo(mymap);

ctlEasyButton = L.easyButton('fas fa-globe', function(){
    ctlSidebar.toggle(); 
}).addTo(mymap);


// Get value from dropdown menu in sidebar
function SelectCommodityValue() {
    var commFilter = document.getElementById("commFilter")
    var commVal = commFilter.options[commFilter.selectedIndex].text;
    document.getElementById("commOutput").innerHTML = commVal;
    lyrLACmining.refilter(function(feature) {
        // mymap.fitBounds(feature.properties.getBounds())
        return feature.properties.COMMODITY === commVal;
    })
    
}

function returnLACMarker(json, latlng) {
    var att = json.properties;

    // if (att.COMMODITY == 'Cement') {
    //     clrMine = '#ce27ad';
    // } else if (att.COMMODITY == 'Gold') {
    //     clrMine = 'yellow';
    // } else {
    //     clrMine = '#c6450d'
    // }

    att.COMMODITY == 'Cement' ? (clrMine = '#3d0363'):
    att.COMMODITY == 'Gold' ? (clrMine = 'orange'):
    att.COMMODITY == 'Petroleum' ? (clrMine = '#383333'):
    att.COMMODITY == 'Natural gas' ? (clrMine = '#820303'):
    att.COMMODITY == 'Zinc' ? (clrMine = '#bbcc20'):
    att.COMMODITY == 'Copper' ? (clrMine = '#20ccaf'):
    att.COMMODITY == 'Silver' ? (clrMine = '#c620cc'):
    att.COMMODITY == 'Coal' ? (clrMine = '#1c13c4'):
    att.COMMODITY == 'Iron and steel' ? (clrMine = '#a34608'):
    clrMine = '#ff1d00'
    
    var mineralstyle = {
        color: clrMine, 
        // fillColor: "#37dfef",
        weight: 2,
        opacity: 2.5,
        radius: 3
    }
    return L.circleMarker(latlng, mineralstyle).bindPopup("<strong>Mineral Commodity: </strong>" + att.COMMODITY + "<br>" + "<strong>Facility name: </strong>" + 
    att.LOCNAME + "<br>" + "<strong>Operator name: </strong>" + att.OPERATOR + "<br>" + "<strong>Annual Production Capacity: </strong>" + att.ANNCAP + " " + att.UNITS).openPopup();
}

