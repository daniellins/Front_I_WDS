
$(document).ready(function () {

         window.drawnItems = new L.FeatureGroup();
         initmap();
     });


function getServerData(wkt_name) {


    window.resultItems.clearLayers();

    $.ajax({
        url: 'http://localhost:5000/usgs/metadata'
        , type: 'GET'
        , data: {q: wkt_name}
        , dataType: 'json'
        , success: function (json, statusText, xhr) {
            data = json;

            var x = 0, i = 0;

            var geojsonDoc = [];

            for(x in data){
                geojsonDoc.push({
                    "type": "Feature",
                    "properties": { "id" : data[x].properties.id},
                    "geometry": {
                        "type": "Point",
                        "coordinates": data[x].geometry.coordinates
                    }
                })
            }

            window.resultItems.addLayer(L.geoJson(geojsonDoc));

            /*var geojsonFeature = {
                "type": "Feature",
                "properties": {
                    "name": "Coors Field",
                    "amenity": "Baseball Stadium",
                    "popupContent": "This is where the Rockies play!"
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-104.99404, 39.75621]
                }
            };

            window.resultItems.addLayer(L.geoJson(geojsonFeature));*/



        }
        , error: function (xhr, message, error) {
            console.error("Error while loading data.", message);
        }
    });


}


function initmap() {

    var defaultBaseLayer = L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
        attribution: "Map data &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>, imagery &copy; <a href='http://cartodb.com/attributions'>CartoDB</a>",
        subdomains: "abcd",
        mapid: "",
        token: ""
    });

    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution: osmAttrib});
    //var ggl1 = new L.Google('TERRAIN');
    //var ggl2 = new L.Google('HYBRID');
    // for all possible values and explanations see "Template Parameters" in https://msdn.microsoft.com/en-us/library/ff701716.aspx
    var imagerySet1 = "Road"; // AerialWithLabels | Birdseye | BirdseyeWithLabels | Road
    var bing_road = new L.BingLayer("LfO3DMI9S6GnXD7d0WGs~bq2DRVkmIAzSOFdodzZLvw~Arx8dclDxmZA0Y38tHIJlJfnMbGq5GXeYmrGOUIbS2VLFzRKCK0Yv_bAl6oe-DOc", {type: imagerySet1});
    //window.map.addLayer(bing_aerial);

    //var imagerySet2 = "AerialWithLabels"; // AerialWithLabels | Birdseye | BirdseyeWithLabels | Road
    //var bing_aerial_labels = new L.BingLayer("LfO3DMI9S6GnXD7d0WGs~bq2DRVkmIAzSOFdodzZLvw~Arx8dclDxmZA0Y38tHIJlJfnMbGq5GXeYmrGOUIbS2VLFzRKCK0Yv_bAl6oe-DOc", {type: imagerySet2});
    //window.map.addLayer(bing_aerial_labels);

    //window.drawnItems = new L.FeatureGroup();

    window.resultItems = new L.FeatureGroup();

    //window.map.addLayer(window.resultItems);


    // Initialise the FeatureGroup to store editable layers
    //window.drawnItems = new L.FeatureGroup();


    window.map = new L.Map('map', {
        center: new L.LatLng(-14.052958, -52.085304),
        zoom: 4,
        minZoom: 2,
        maxZoom: 19,
        layers: [bing_road,window.resultItems,window.drawnItems]
    });

    window.map.addLayer(window.drawnItems);


    var baseMaps = {
        "Bing Estradas": bing_road,
        //"Bing Híbrido": bing_aerial_labels,
        //"Google Terreno": ggl1,
        //"Google Satélite": ggl2,
        "OpenStreetMap": osm,
        "Mínimo": defaultBaseLayer
    };

    var overlayMaps = {
        "Projetos": window.resultItems,
        "Filtro": window.drawnItems
    };


    L.control.layers(baseMaps, overlayMaps, {position: 'topright'}).addTo(window.map);


    // create fullscreen control
    var fsControl = new L.Control.Fullscreen();
    // add fullscreen control to the map
    window.map.addControl(fsControl);


    drawOptions = {
        marker: false,
        circle: false,
        polyline: false
    };

    window.drawControl = new L.Control.Draw({
        edit: {
            featureGroup: window.drawnItems
        },
        draw: drawOptions
    });
    window.map.addControl(window.drawControl);


    //L.marker([50.5, 30.5]).addTo(map);

    window.map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;

        layer.bindPopup($('<a id="btnSearchMap" href="#" style="font-size: 15px; font-weight: bold" class="drawnLink">Search selected area</a>').click(function() {
            getServerData(Terraformer.WKT.convert(window.drawnItems.toGeoJSON().features[0].geometry));
            window.map.closePopup();

/*            if(!$("#mapTag").length){
                jQuery("label[for='searchFilters']").html("Filtros: ");

                $("#tags").append("<div id='mapTag' class='chip'><img src='images/location3.png' " +
                    "alt='polygon'>Polígono<i id='mapTagBtn' class='material-icons'>close</i></div>");
            }*/
        })[0]);

        window.drawnItems.addLayer(layer);




        /*        window.drawControl = new L.Control.Draw({
         edit: {
         featureGroup: window.drawnItems
         },
         draw: drawOptions
         });*/

        //var drwControl = window.drawControl;


/*        window.drawControl.setDrawingOptions({
            polygon: false,
            rectangle: false
        });

        window.map.removeControl(window.drawControl);
        window.map.addControl(window.drawControl);*/

        //e.bringToFront();

        //window.drawControl = drwControl;
        //TODO Popup implementation (Daniel)
        //getFeaturesServer(window.searchData,window.drawnItems);

        // Do whatever else you need to. (save to db, add to map etc)
        //map.addLayer(layer);

        //window.drawnItems.addLayer(layer);
        //window.drawnItems = drawnItems.toGeoJSON();


    });



}