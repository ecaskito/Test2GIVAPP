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
    $('#divDireccion').hide();
    try{

        navigator.camera.getPicture(hacerfotoOK, hacerFotoERROR, { quality: 20, destinationType: Camera.DestinationType.DATA_URL, correctOrientation: true,sourceType:  Camera.PictureSourceType.CAMERA,  saveToPhotoAlbum: false });
    }
    catch (ex){
        //alert(ex.message);
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
        else {
            var imagen = document.getElementById('imgFoto');
            imagen.style.display = 'block';
            imagen.src = "images/sinFoto.png";
        }

        //tipo incidencia
        $('#TipusInciImg').attr({"src":dicImagenes[TipoInciSel]});
        $('#TipusInciText').html(dicAyuda[TipoInciSel]);

        //cargar mapa
        iniciaMapa();

        var nLetra = 65;
        var combo = $('#selectLletraIniCARRER');
        cargaLetrasAbcdario(combo, 'lletra inicial' , nLetra );
    }
    catch(ex) {
        //alert("cargarPaginaDatosIncidencia:"+ ex.message);
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
        //alert(ex.message);
        $('#divCargarMapaAlta').hide();
        $('#divMapa').hide();
        $('#divMensajeMapa').show();
    }
}

function posicionOK(position){
    try {
        //alert("posicionOK");
        $('#divCargarMapaAlta').hide();
        $('#divMensajeMapa').hide();
        $('#divMapa').show();
        posAlta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            accuracy: 5,
            enabledHighAccuracy: true,
            overviewMapControl: false,
            panControl: false,
            rotateControl: false,
            scaleControl: false,
            zoomControl: false,
            streetViewControl: false,
            center: posAlta,
            maximumAge: 0//,timeout:1000
        };
        mapAlta = new google.maps.Map(document.getElementById('divMapaAlta'), mapOptions);
        crearMarcadorEventoClick('ALTA', mapAlta, true, 'labelDireccion', false);

        //mapAlta.setCenter(posAlta);
        sDireccionAlta = cogerDireccion(posAlta, true);
        $('#labelDireccion').text(sDireccionAlta);
        $('#divMapaAlta').gmap('refresh');

    }
    catch(ex){
    //alert(ex.message);
    }
}

function posicionError(mensaje){
    //alert("posicionError: "+ mensaje);
    posAlta="";
    $('#divCargarMapaAlta').hide();
    $('#divMapa').hide();
    $('#divMensajeMapa').hide();
    $('#divDireccion').show();
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

function cargaCalles(){
    if(aCarrers == null)
        mensaje("No s'han trobat carrers","informació");
    else
    {
        $('#selectCARRER').children().remove('li');
        $('#selectCARRER').empty();
        $('#selectCARRER').children().remove();

        var calles = [];
        calles.push("<option value='-1' data-placeholder='true'>Seleccioni el carrer</option>");
        for (var x = 0; x < aCarrers.length; x++)
        {
            calles.push("<option value='" + aCarrers[x][0][1] + "'>" + aCarrers[x][2][1] + " (" +  aCarrers[x][1][1] + ")</option>"); // [" + aCarrers[x][3][1] + "]</option>");
        }
        $('#selectCARRER').append(calles.join('')).selectmenu('refresh');
    }
}

function enviarIncidencia(){
    try{
        //Tipo de incidencia
        sId=TipoInciSel;
        sDescItem=dicAyuda[TipoInciSel];

        //Comentario
        sComentario = $('#textareaComentari').val();

        //Coordenadas
        sCoords="";
        if (posAlta !="") {
            sCoords = posAlta.toString().replace(" ", "").replace("(", "").replace(")", "");
            if (sCoords != null && sCoords.trim() != '') {
                sCoord_X = sCoords.split(",")[0];
                sCoord_Y = sCoords.split(",")[1];
            }
        }

        //Dirección
        if (indefinidoOnullToVacio($('#selectCARRER').val()) != '' && $('#selectCARRER').val() != '-1') //o sea, si han seleccionado una calle en el combo ...
        {
            sDireccionAlta = $('#selectCARRER').find(":selected").text() + ', ' + $('#inputNUM').val();
        }

        //Validar Datos

        //Construir parámetros
        //var  sParams = {sId:$('#IdItem').val()+'',sDescItem:$('#labelItem').text()+'' ,sNom:$('#inputNOM').val() + '',sCognom1:$('#inputCOGNOM1').val() + '',sCognom2:$('#inputCOGNOM2').val() + '',sDni:$('#inputDNI').val() + '',sEmail:$('#inputEMAIL').val() + '',sTelefon:$('#inputTELEFON').val() + '',sObs:sComentario + '',sCoord:sCoords + '',sCodCarrer:$('#selectCARRER').val() + '',sCarrer:$('#selectCARRER').find(':selected').text() + '',sNumPortal:$('#inputNUM').val() + '',sFoto: sFoto};

        var objUsu = getDatosUsuario();

        var  sParams = {sId:TipoInciSel+'',sDescItem:sDescItem+'' ,sNom:objUsu.NOM + '',sCognom1:objUsu.COGNOM1 + '',sCognom2:objUsu.COGNOM2 + '',sDni:objUsu.DNI + '',sEmail:objUsu.EMAIL + '',sTelefon:objUsu.TELEFON + '',sObs:sComentario + '',sCoord:sCoords + '',sCodCarrer:$('#selectCARRER').val() + '',sCarrer:$('#selectCARRER').find(':selected').text() + '',sNumPortal:$('#inputNUM').val() + '',sFoto: sFoto};

        //Enviar
        var ref = enviarComunicat_WS(sParams, true);

    }
    catch (ex){
        alert("enviarIncidencia: "+ex.message);
    }
}

function enviarComunicat_WS(sParams,bNuevoComunicat){
    //dmz
    var llamaWS = "http://80.39.72.44:8000/wsAPPGIV/wsIncidentNotifierGIV.asmx/IncidenciaTipus";
    //vila
    //var llamaWS = "http://www.vilafranca.cat/wsAPPGIV/wsIncidentNotifierGIV.asmx/IncidenciaTipus";

    //alert ('sParams en enviarcomunicat ' + sParams.sId + ','+ sParams.sDescItem +','+sParams.sCoord + ',' + sParams.sObs);
    //alert('llamaWS ' + llamaWS + 'bNuevoComunicat ' + bNuevoComunicat);
    //alert('sParams en enviarcomunicat ' + sParams.sId );
    try
    {
        var bEnvioCorrecto = true;
        var sEstado = "";
        var sMensaje ="";
        var sTitulo = "";
        var sReferen = "";

        $.post(llamaWS, sParams).done(function(datos) {
            try
            {
                if(datos == null)  //==> ha habido error
                {
                    mensaje("No hi ha confirmació de l'enviament de la comunicació " ,'error');
                    sReferen = "-";
                    sMensaje = "Comunicació guardada en el dispositiu";
                    sTitulo = "error enviant";
                    bEnvioCorrecto = false;
                }
                else  //==> el WS ha devuelto algo
                {
                    sReferen = $(datos).find('resultado').text().trim();
                    if(sReferen.indexOf('|') > 0)
                    {
                        sMensaje = 'La seva comunicació ha estat rebuda però amb problemes : \n ' + sReferen.substr(sReferen.indexOf('|') + 1);
                        sTitulo = "atenció";
                        sReferen = sReferen.substr(0,sReferen.indexOf('|'));
                    }
                    else
                    {
                        if(sReferen.indexOf('|') == 0)
                        {
                            sMensaje = "La seva comunicació no s'ha processat correctament. [" + sReferen.substr(1) + "]\n";
                            sTitulo = "error";
                            sReferen = "ERROR";
                            bEnvioCorrecto = false;
                        }
                        else
                        {
                            sMensaje = 'Comunicació notificada [' + sReferen + ']\n' + 'Gràcies per la seva col·laboració';
                            sTitulo = "info";
                        }
                    }
                }

                if(bNuevoComunicat){

                    if(bEnvioCorrecto)
                        sEstado = "NOTIFICAT";
                    else
                        sEstado = "PENDENT_ENVIAMENT";

                    var nIdCom = guardaIncidencia(sReferen, sEstado);

                    if(!bEnvioCorrecto)
                    {
                        guardaFotoEnLocal(nIdCom, sFoto);
                    }

                    eliminarFoto();
                    limpiaVariables('pageNuevaIncidencia');
                    mensaje(sMensaje, sTitulo);
                    abrirPagina('pageInfoEnvio', false);
                }
                else
                {
                    if(!bEnvioCorrecto)
                        mensaje(sMensaje, sTitulo);
                }
            }
            catch(ex){
                mensaje('ERROR (exception) en resultadoEnvio : \n' + ex.code + '\n' + ex.message , 'error');
                return null;
            }
        }).fail(function() {
            if (bNuevoComunicat){
                var nIdCom = guardaIncidencia("-","PENDENT_ENVIAMENT");
                //hgs afegit aquest if
                if (sFoto != null) {guardaFotoEnLocal(nIdCom, sFoto);}
                limpiaVariables('pageNuevaIncidencia');
            }
            sMensaje = "La seva comunicació no s'ha pogut enviar \n ";
            if(sReferen.trim().length > 0 ) sMensaje += sReferen.substr(1) + '\n';
            sMensaje += "Quan tingui connexió pot enviar-la des de 'Els meus comunicats'" ;
            sTitulo = "atenció";
            sReferen = "ERROR";
            mensaje(sMensaje, sTitulo);
            abrirPagina('pageInfoEnvio', false);
        });
    }
    catch(e)
    {
        mensaje('ERROR (exception) en enviarComunicat_WS : \n' + e.code + '\n' + e.message);
    }
}

function guardaIncidencia(sReferen, sEstado){
    try
    {
        var nId = leeObjetoLocal('COMUNICATS_NEXTVAL' , -1) + 1;
        var fecha = FechaHoy() + ' ' + HoraAhora();
        var carrer = sDireccionAlta.split(",")[0];
        var num = sDireccionAlta.split(",")[1];

        //INSERT INTO COMUNICATS (ID, REFERENCIA, ESTAT, DATA, CARRER, NUM, COORD_X, COORD_Y, COMENTARI) VALUES (?,?,?,?,?,?,?,?,?);
        //var fila = [nId, sReferen, 'PENDENT', fecha,carrer , num, sCoord_X, sCoord_Y, sComentario, null, null, null];

        var objComunicat = new comunicat();
        objComunicat.ID = nId;
        objComunicat.REFERENCIA = sReferen.trim();
        objComunicat.ESTAT = sEstado;
        objComunicat.DATA = fecha;
        objComunicat.CARRER = carrer;
        objComunicat.NUM = num;
        objComunicat.COORD_X = sCoord_X + '';
        objComunicat.COORD_Y = sCoord_Y + '';
        objComunicat.COMENTARI = sComentario;
        objComunicat.ITE_ID = sId;
        objComunicat.ITE_DESC = sDescItem;
        objComunicat.ID_MSG_MOV = sReferen.trim();
        guardaObjetoLocal('COMUNICAT_' + nId.toString().trim() , objComunicat);

        guardaObjetoLocal('COMUNICATS_NEXTVAL', nId);

        return nId;
    }
    catch(e)
    {
        mensaje('ERROR (exception) en guardaIncidencia : \n' + e.code + '\n' + e.message);
        return -1;
    }
}
function guardaFotoEnLocal(nId,sFoto){
    guardaObjetoLocal('FOTO_' + nId.toString().trim() , sFoto);
}
