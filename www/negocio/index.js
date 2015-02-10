// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;

var posicionGPS = null;
var wathID=null;

var bAbroPagina = true;
var aGlobalCarrers = null;
var aCarrers = null;
var aConfig = null;


var sId = '';
var sDescItem = '';
var dicImagenes = {};
var dicAyuda = {};
var dicItem = {};
var nImgTotal = 0;
//hgs abans 5 Si disminueixo surten les fletxes
var nImgPorPanel = 10;
var nPrimeraImgVisible = 1;
var nNumCalle = 0;
var bPrimera;

var TipoInciSel = "";
var GPSActivado=false;
var GPSErrorNum = 0;
// -------- Al INICIAR -----------------------------------------------------------------------
window.addEventListener('load', function () {
    if (phoneGapRun()) {
        document.addEventListener("deviceReady", deviceReady, false);
    } else {
        deviceReady();
    }
    if (SinDatosCiudadano())
    {
        abrirPagina("pageIdentificacion", false);
    }
    else
    {
        inicioPaginaTipoIncidencia();
    }
    getLocation();
}, false);

function deviceReady() {
    try {
        document.addEventListener("backbutton", handleBackButton, false);

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;

        if (phoneGapRun()) {
            pictureSource = navigator.camera.PictureSourceType;
            destinationType = navigator.camera.DestinationType;
        }
        else {
            //$('#labelInfo').text($('#labelInfo').text() + '\nAtenció : Phonegap no soportat');
        }

        //Hay localstorage ?
        if (!$.jStorage.storageAvailable()) {
            //estadoBoton('buttonALTA', false);
            //estadoBoton('buttonCONSULTA', false);
            //$('#labelInfo').text($('#labelInfo').text() + '\nAtenció : localStorage no soportat');
            return;
        }
        else {
            try {
                cargaConfigEnArray();
            }
            catch (e) { mensaje('exception carregant llista de carrers : ' + e.message, 'error'); }
        }
    }
    catch (ex) {
        //alert(ex.message);
    }
   

}
function handleBackButton() {
    try {
        //alert($.mobile.activePage.attr('id'));
        if ($.mobile.activePage.attr('id') == 'pageIndex') {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
        else if ($.mobile.activePage.attr('id') == 'pageIdentificacion' && SinDatosCiudadano()) {
            if (navigator.app) {
                navigator.app.exitApp();
            } else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
        else{
            if (navigator.app) {
                navigator.app.backHistory();
            } else if (navigator.device) {
                navigator.device.backHistory();
            }
            else {
                window.history.back();
            }
        }
    }
    catch (ex) {
        //alert(ex.message);
    }
}

// -------- COMUNES -----------------------------------------------------------------------

function abrirPagina(sPag, bComprueba) {

    if (bComprueba && SinDatosCiudadano()) {
            mensaje("El telefon es obligatori per utilitzar aquesta app","error")
   }
    else
    {
        $.mobile.changePage('#' + sPag, {
            transition: "none"
        });

        switch (sPag) {
            case 'pageIndex':
                $.doTimeout(1500, inicioPaginaTipoIncidencia());
                break;
            case 'pageIdentificacion':
                $.doTimeout(1500, inicioPaginaIdentificacion());
                break;
            case 'pageDatosIncidencia':
                $.doTimeout(1500, inicioPaginaDatosIncidencia());
                break;
            case 'pageInfoEnvio':
                $.doTimeout(1500, inicioPaginaInfoEnvio());
                break;
            case 'pageConsultaIncidencias':
                $.doTimeout(1000, inicioPaginaConsultaIncidencias());
                break;
            case 'pageConsultaIncidenciasFicha':
                break;
            case 'pageConsultaIncidenciasMapa':
                mostrarEnPlano();
                $.doTimeout(1000, estadoDelPlano());
                break;
            case 'pageZoomFoto' :
                var imagen = document.getElementById('imgZoomFoto');
                imagen.style.display = 'block';
                imagen.src = "data:image/jpeg;base64," + sFoto;
                break;
        }
    }
}

function limpiaVariables(sPag){
    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            sFoto = '';
            sDireccionAlta = '';
            posAlta = '';
            mapAlta = null;
            $('#IdItem').text('');
            $('#labelItem').text('');
            $('#textareaComentari').val('');
            $('#inputNUM').val('');
            $('#labelDireccion').text('');
            $('#selectCARRER').text('');
            break;

        case 'pageConsultaIncidencias' :
            sDireccionConsulta = '';
            posConsulta = '';
            mapConsulta = null;
            break;

    }
}

function reposicionaMapa(){
    actualizarComboCalle();
    iniciaMapaFoto(true);
}

function inicioPaginaTipoIncidencia() {

    //cargo los iconos
    leeXMLIconos();

    //totalImg();  			//la primera vez informa esta var con el total de imagenes ...
    mostrarImagenes("");

}



function leeXMLIconos() {
    // alert('leo xml');
    $.ajax({
        type: "GET",
        url: "tablas/iconosTemas.xml",
        dataType: "xml",
        success: function (xml) {
            $(xml).find('icoTema').each(function () {
                dicImagenes[$(this).find('id').text()] = "images/tipoInci/" + $(this).find('img').text();
                dicAyuda[$(this).find('id').text()] = $(this).find('desc').text();
                //guardem l'item del seleccionat
                dicItem[$(this).find('id').text()] = $(this).find('img').text().substr(0, $(this).find('img').text().indexOf("_"));
            });
        },
        error: function () {
            alert("Error processant arxiu XML");
        }, async: false
    });
}

// 'Activa' una imagen y desactiva todas las demas y actualiza el divImagenes con las que toque (según sea inicio, derecha o izquierda)
function mostrarImagenes() {
    var sTagImg = "";
    var nInd = 0;
    var nIndVis = 0;
    for (sImagen in dicImagenes) {
        //sTagImg += "<img src='" + dicImagenes[sImagen] + "' id='" + sImagen + "' class='img-swap' alt='" + dicImagenes[sImagen] + "' width='54' height='70' /> "


        sTagImg += "<a href='' onclick='" + "selectTipo(" + sImagen + ")' data-mini='false' data-inline='false' data-role='button' data-theme='c' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' class='ui-btn ui-shadow ui-btn-corner-all ui-fullsize ui-btn-block ui-first-child ui-btn-up-c'>"
        //sTagImg += "<span class='ui-btn-inner'>"
        //sTagImg += "<span class='ui-btn-text'>"
        //sTagImg += "<img alt='' src='" + dicImagenes[sImagen] + "' style='float:left;width:35px' />"
        //sTagImg += "<div style='padding-top:10px;padding-left:40px'>" + dicAyuda[sImagen] + "</div>"
        sTagImg += "<img alt='' src='" + dicImagenes[sImagen] + "' style='width:45px' />"
        sTagImg += "<div>" + dicAyuda[sImagen] + "</div>"
        //sTagImg += "</span></span></a>"
        sTagImg += "</a>"
    }
    $('#divTipoInci').html(sTagImg);

};

function selectTipo(p_tipo) {
    try{
        TipoInciSel = p_tipo;

        navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 20, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true,sourceType:  Camera.PictureSourceType.CAMERA,  saveToPhotoAlbum: false });
    }
    catch (ex){
        abrirPagina('pageDatosIncidencia', false);
    }
}

function hacerfotoOK(imageData) {
    try{
        posAlta = new google.maps.LatLng(posicionGPS.coords.latitude, posicionGPS.coords.longitude);
    }
    catch(ex) {}
    sFoto = imageData;
    abrirPagina('pageDatosIncidencia', false);
}
function hacerFotoERROR(mensaje) {
    sFoto = '';
    posAlta='';
}



function getLocation() {
    try {

        var locOptions = {
            maximumAge: 100,
            timeout: 1000,
            enableHighAccuracy: true
        };
        //get the current location
        wathID = navigator.geolocation.watchPosition(onLocationSuccess, onLocationError, locOptions);
    }
    catch (ex){
        alert(ex.message);
    }
}

function onLocationSuccess(loc) {
    try{
        GPSActivado=true;
        posicionGPS=loc;
    }
    catch(ex){
        alert(ex.message);
    }
}

function onLocationError(e) {
    GPSErrorNum=GPSErrorNum+1;
    if(GPSErrorNum>3)
    {
        GPSActivado=false;
        alert("GPS Desactivat");
    }
}


