var sFoto = '';

var mapAlta = null;
var posAlta = '';
var sDireccionAlta = '';
var sCoords = '';
var sCoord_X = '';
var sCoord_Y = '';
var sComentario = '';

function inicioPaginaDatosIncidencia() {
    $('#divCargarMapaAlta').show();
    $('#divMensajeMapa').hide();
    $('#divMapa').hide();
    try{

        navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 20, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true,sourceType:  Camera.PictureSourceType.CAMERA,  saveToPhotoAlbum: false });
    }
    catch (ex){
        alert(ex.message);
        cargarPaginaDatosIncidencia();
    }
}


function hacerfotoOK(imageData) {
    sFoto = imageData;
    cargarPaginaDatosIncidencia();
}
function hacerFotoERROR(mensaje) {
    sFoto = '';
    cargarPaginaDatosIncidencia();
}

function cargarPaginaDatosIncidencia() {
    try{
        //mostrar foto
        if (sFoto !=''){
            var imagen = document.getElementById('imgFoto');
            imagen.style.display = 'block';
            imagen.src = "data:image/jpeg;base64," + sFoto;
        }

        //tipo incidencia
        $('#TipusInciImg').attr({"src":dicImagenes[TipoInciSel]});
        $('#TipusInciText').html(dicAyuda[TipoInciSel]);

        //cargar mapa
        iniciaMapa();
    }
    catch(ex) {
        alert("cargarPaginaDatosIncidencia:"+ ex.message);
    }
}


function iniciaMapa() {
    try {
        // Try HTML5 geolocation
        if (navigator.geolocation) {
            var locOptions = {
                maximumAge : Infinity,
                timeout : 10000,
                enableHighAccuracy : true
            };

                navigator.geolocation.getCurrentPosition(posicionOK,posicionError,locOptions);

        } else {
            // Browser no soporta Geolocation
            alert("Browser no soporta Geolocation");
            $('#divCargarMapaAlta').hide();
            $('#divMapa').hide();
            $('#divMensajeMapa').show();
            //getCurrentPositionError(false);
        }
    }
    catch (ex) {
        alert(ex.message);
        $('#divCargarMapaAlta').hide();
        $('#divMapa').hide();
        $('#divMensajeMapa').show();
    }
}

function posicionOK(position){
    try {
        alert("posicionOK");
        $('#divCargarMapaAlta').hide();
        $('#divMensajeMapa').hide();
        $('#divMapa').show();
        posAlta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            accuracy: 5,
            enabledHighAccuracy: true,
            overviewMapControl: false,
            panControl: false,
            rotateControl: false,
            scaleControl: false,
            zoomControl: false,
            streetViewControl: false,
            center: posAlta
            , maximumAge: 0//,timeout:1000
        };
        mapAlta = new google.maps.Map(document.getElementById('divMapaAlta'), mapOptions);
        crearMarcadorEventoClick('ALTA', mapAlta, true, 'labelDireccion', true);

        //mapAlta.setCenter(posAlta);
        sDireccionAlta = cogerDireccion(posAlta, true);
        $('#labelDireccion').text(sDireccionAlta);
        $('#divMapaAlta').gmap('refresh');

    }
    catch(ex){alert(ex.message);}
}

function posicionError(mensaje){
    alert("posicionError: "+ mensaje);
    $('#divCargarMapaAlta').hide();
    $('#divMapa').hide();
    $('#divMensajeMapa').show();
}
function cogerDireccion(pos, bSoloCalleYnum) {
    var llamaWS = "http://maps.googleapis.com/maps/api/geocode/xml";
    var sParam = "latlng=" + pos.toString().replace(" ", "").replace("(", "").replace(")", "") + "&sensor=true";
    var sDireccion = '';
    try {
        //function LlamaWebService (sTipoLlamada,sUrl,   sParametros,sContentType,                        bCrossDom, sDataType, bProcData, bCache, nTimeOut, funcion,           pasaParam,      asincro, bProcesar, tag)
        var datos = LlamaWebService('GET', llamaWS, sParam, 'application/x-www-form-urlencoded', true, 'xml', false, false, 10000, direccionObtenida, bSoloCalleYnum, true, false, null);
    }
    catch (e) {
        mensaje('ERROR (exception) en cogerDireccion : \n' + e.code + '\n' + e.message);
    }
    //return sDireccion;
}

function direccionObtenida(datos, param) {
    if (datos == null) return;
    var sDireccion = $(datos).find('formatted_address').text();
    var n = 0;

    $(datos).find('formatted_address').each(function () {
        if (n == 0) sDireccion = $(this).text();
        n++;
    });

    if (indefinidoOnullToVacio(param) != '')
        if (param)
            sDireccion = cogerCalleNumDeDireccion(sDireccion);

    sDireccionAlta = sDireccion;
    var sTxt = '<div><table><tr><td style="font-size:x-small; font-weight:bold;">comunicat en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccionAlta + '</td></tr></table></div>';

    //alert('direccionObtenida. bPrimera: ' + bPrimera);
    if (bPrimera == true)
        nuevoMarcadorSobrePlanoClickInfoWindow('ALTA', mapAlta, posAlta, sTxt, null, 300, true, true, 'labelDireccion', false);
    else {
        if (bPrimera == false)
        { }
        else
        {
            nuevoMarcadorSobrePlanoClickInfoWindow('ALTA', mapAlta, posAlta, sTxt, null, 300, true, true, 'labelDireccion', true);
            bPrimera = true;
        }
    }

    $('#labelDireccion').text(sDireccionAlta);
    $('#divMapaAlta').gmap('refresh');

}
