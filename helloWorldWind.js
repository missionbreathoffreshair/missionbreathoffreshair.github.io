// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// Add a placemark
var placemarkLayer = new WorldWind.RenderableLayer();
wwd.addLayer(placemarkLayer);

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);

placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0);

placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";

var position = new WorldWind.Position(65.0, -166.0, 100.0);
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

placemark.label = "Placemark\n" +
    "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
    "Lon " + placemark.position.longitude.toPrecision(5).toString();
placemark.alwaysOnTop = true;

placemarkLayer.addRenderable(placemark);

/// polygon and duck here////

// Add WMS imagery
var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
//var layerNameVal = srt;
//var layerNameVal = "MODAL2_M_AER_RA";
//var layerNameVal;
//var layerNameVal = alert(dop);

var urlParams = new URLSearchParams(window.location.search);
var layerName = urlParams.has('selectedLayer') ? urlParams.get('selectedLayer') : null;

function onChangeLayer() {
	var e = document.getElementById("Ultra");
	var layerName = e.options[e.selectedIndex].value;
	var nameofLayer = e.options[e.selectedIndex].text;
	window.location = location.protocol + '//' + location.host + location.pathname + '?selectedLayer=' + layerName;
	alert("Your are about to view " + "<"+ nameofLayer + ">");
}

var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
	if (layerName !== null) {
	var wmsLayerCapabilities = wms.getNamedLayer(layerName);
	var viewSel = layerName;
	var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
	var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
	wwd.addLayer(wmsLayer);
	}
};

var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " +
        text +
    " exception: " + exception);
};

$.get(serviceAddress).done(createLayer).fail(logError);