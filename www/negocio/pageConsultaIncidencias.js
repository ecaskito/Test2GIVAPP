var mapConsulta = null;
var posConsulta = '';
var sDireccionConsulta = '';
var aComs=null;

function inicioPaginaConsultaIncidencias(){
    aComs=(getComunicats());
    cargaListaComunicats();
}

function cargaListaComunicats(){
    $('#listviewLista').children().remove('li');

    if(aComs == null || aComs.length == 0) {
        try{
            $('#listviewLista').listview('refresh');
        }
        catch (ex){}
        document.getElementById("buttonMostrarEnPlano").style.visibility="hidden";
        document.getElementById("buttonBorrarHistoricoComunicados").style.visibility="hidden";
        document.getElementById("buttonEnviamentDePendents").style.visibility="hidden";
        return ;
    }

    document.getElementById("buttonMostrarEnPlano").style.visibility="visible";
    document.getElementById("buttonBorrarHistoricoComunicados").style.visibility="visible";
    document.getElementById("buttonEnviamentDePendents").style.visibility="visible";

    var sFila = "";
    var sDatos = "";
    var separador = "#";
    var sFotoInci='';

    for(var x=0; x<aComs.length; x++)
    {
        sDatos = getCadenaComunicat(aComs[x] , separador);
        sDatos = sDatos.replace(/'/g, "´");

        sFotoInci = leeObjetoLocal('FOTO_' + aComs[x].ID , '');
        if(sFotoInci==''){
            sFotoInci="images/sinFoto.png";
        }
        else{
            sFotoInci="data:image/jpeg;base64," + sFotoInci;
        }
        sFila ="<div style='width:27%;height:80px;float: left;background-color: #efefef;border: 1px solid #efefef;margin: 2px;line-height: 78px;text-align: center'>";
        sFila +="<img src='"+sFotoInci+"' style='max-width:100%;max-height:78px;display: inline-block;vertical-align:middle' />";
        sFila +="</div>"
        sFila +=" <div style='width:70%;float: right'>";
        sFila +=" <table cellpadding='0' cellspacing='0' border='0' style='width: 100%;table-layout: fixed'>";
        sFila +=" <tr><td style='font-weight: bold'>"+aComs[x].ITE_DESC+"</td></tr>";
        sFila +=" <tr><td style='overflow: hidden;text-overflow: ellipsis;white-space: nowrap' >"+aComs[x].CARRER+" "+aComs[x].NUM+"</td></tr>";
        //sFila +=" <tr><td><div style='width:40%;float: left'><b>id:</b> "+aComs[x].ID+"</div><div style='width: 60%;float: right' ><b>ref:</b> "+aComs[x].REFERENCIA+"</div></td></tr>";
        sFila +=" <tr><td><b style='font-size: 0.85em' >id:</b> "+aComs[x].ID+"</td></tr>";
        sFila +=" <tr><td><b style='font-size: 0.85em'>ref:</b> "+aComs[x].REFERENCIA+"</td></tr>";
        sFila +=" <tr><td style='text-align: right;color:#DB0D36'>"+ParseEstado(aComs[x].ESTAT)+"</td></tr>";
        //sFila +=" <tr><td style='text-align: right;font-size: 0.75em'>"+aComs[x].DATA+"</td></tr>";
        sFila +=" </table></div>";




        $('#listviewLista').append($('<li/>', {
            'id': "fila_" + aComs[x].ID
        }).append($('<a/>', {
                'href': '',
                'onclick': "verDatosComunicat('" + x + "','" + separador + "')",
            'data-mini':"true",
            'data-inline':"false",
            'data-role':"button",
            'data-theme':"c",
            'class':"ui-link ui-btn ui-btn-c ui-shadow ui-corner-all ui-mini",
                'html': sFila
        })));
    }
    try{
        $('#listviewLista').listview('refresh');
    }
    catch (ex){}
}

function verDatosComunicat(x){
    try {

        $('#labelCOMUNICAT_TIPUS').text('');
        $('#labelCOMUNICAT_CARRER').text('');
        $('#labelCOMUNICAT_ID').text('');
        $('#labelCOMUNICAT_REFERENCIA').text('');
        //$('#labelCOMUNICAT_NUM').text('');
        $('#labelCOMUNICAT_COMENTARI').text('');
        $('#labelCOMUNICAT_DATA').text('');
        $('#labelCOMUNICAT_ESTAT').text('');

        var sFotoInci = leeObjetoLocal('FOTO_' + aComs[x].ID, '');
        var imagen = document.getElementById('imgCOMUNICAT_FOTO');
        if (sFotoInci == '') {
            imagen.src = sFotoInci = "images/sinFoto.png";
        }
        else {
            imagen.src = "data:image/jpeg;base64," + sFotoInci;
        }

        abrirPagina("pageConsultaIncidenciasFicha", false);

        $('#labelCOMUNICAT_ID').text(aComs[x].ID);
        $('#labelCOMUNICAT_REFERENCIA').text(aComs[x].REFERENCIA);
        $('#labelCOMUNICAT_ESTAT').text(aComs[x].ESTAT);
        $('#labelCOMUNICAT_DATA').text(aComs[x].DATA);
        $('#labelCOMUNICAT_CARRER').text(aComs[x].CARRER + " " + aComs[x].NUM);
        $('#labelCOMUNICAT_COMENTARI').text(aComs[x].COMENTARI);
        $('#labelCOMUNICAT_COORDENADES').text(aComs[x].COORD_X + " , " + aComs[x].COORD_Y);
        $('#labelCOMUNICAT_TIPUS').text(aComs[x].ITE_DESC);
    }
    catch (ex){
        mensaje('exception en verDatosComunicat : ' + e.message , 'error');
    }

}

function mostrarEnPlano() {
    try {
        if (aComs == null || aComs.length == 0) {
            return false;
        }

        var paramPosInicial = new google.maps.LatLng(posicionGPS.coords.latitude, posicionGPS.coords.longitude);

        var mapOptions = {
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            enabledHighAccuracy: true,
            panControl: false,
            rotateControl: false,
            scaleControl: false,
            zoomControl: false,
            streetViewControl: false,
            center: paramPosInicial
        };
        mapConsulta = new google.maps.Map(document.getElementById('divMapaConsulta'), mapOptions);

        var pos = null;
        for (var x = 0; x < aComs.length; x++) {
            try {
                pos = new google.maps.LatLng(aComs[x].COORD_X, aComs[x].COORD_Y);

                //centrar el mapa en el comunicado más reciente.
                if (x == 0) paramPosInicial = pos;


                var sTxt = x;
                nuevoMarcadorSobrePlanoClickInfoWindow('CONSULTA', mapConsulta, pos, sTxt, aComs[x].ID,'');

            } catch (ex) {alert(ex.message);
            }
        }
        mapConsulta.setCenter(paramPosInicial);
        try {
            $('#divMapaConsulta').gmap('refresh');
        } catch (ex) {
        }
    }
    catch (ex) {
        mensaje(ex.message, "error");
    }
}

function borrarHistoricoComunicadosConfirm() {
    var v_mensaje = "Vol el·liminar l'historial?";
    var v_titulo = "El·liminar historial";
    var v_botones = "SI,NO";

    if(navigator.notification && navigator.notification.confirm){
        navigator.notification.confirm(v_mensaje,borrarHistoricoComunicados,v_titulo,v_botones);
    }
    else
    {
        var v_retorno = confirm(v_mensaje);
        if (v_retorno){
            borrarHistoricoComunicados(1);
        }
        else {
            borrarHistoricoComunicados(2);
        }
    }
}

function borrarHistoricoComunicados(respuesta){
    if (respuesta==1) {

        var nComunicats = leeObjetoLocal('COMUNICATS_NEXTVAL', -1);
        //alert('A eliminar comunicats');
        if (nComunicats != -1) {
            //Eliminar de la B.D.
            nComunicats += 1;
            var bBorrado = false;
            for (var x = 0; x < nComunicats; x++) {
                bBorrado = borraObjetoLocal('COMUNICAT_' + x.toString().trim());
                if (!bBorrado) mensaje('El comunicat ' + x.toString().trim() + " no s'ha pogut esborrar", "info");
            }
            //Actualizar la 'sequence'
            guardaObjetoLocal('COMUNICATS_NEXTVAL', -1);

            //limpiar/actualizar la lista
            inicioPaginaConsultaIncidencias();


        }
    }
}

function enviamentDePendents() {
    try {

        var v_bError=false;
        var sIdsActualizar = "";
        var nIndexAct = 0;

        var aComs = new Array();
        aComs = getComunicats();

        var objUsu = getDatosUsuario();

        var objComunicat = null;
        var bBorrado = false;
        var sParams = {};


        for (var x = 0; x < aComs.length; x++) {
            if (aComs[x].ESTAT == 'PENDENT_ENVIAMENT' || aComs[x].ESTAT == 'ERROR_ENVIAMENT') {

                sSuFoto = leeObjetoLocal('FOTO_' + aComs[x].ID, '');

                var v_sObs=aComs[x].COMENTARI+ '';
                var v_sCoord=aComs[x].COORD_X+ ',' + aComs[x].COORD_Y+ '';
                var v_sCodCarrer=aComs[x].CODCARRER+ '';
                var v_sNumPortal=aComs[x].NUM+ '';
                sParams = {
                    p_sIdTipoInci: aComs[x].ITE_ID,
                    p_sNom: objUsu.NOM.toString().trim() + '',
                    p_sCognom1: objUsu.COGNOM1.toString().trim() + '',
                    p_sCognom2: objUsu.COGNOM2.toString().trim() + '',
                    p_sDni: objUsu.DNI.toString().trim() + '',
                    p_sEmail: objUsu.EMAIL.toString().trim() + '',
                    p_sTelefon: objUsu.TELEFON.toString().trim() + '',
                    p_sObs: v_sObs.toString().trim() + '',
                    p_sCoord:v_sCoord.toString().trim()+ '',
                    p_sCodCarrer: v_sCodCarrer.toString().trim()+ '',
                    p_sNumPortal: v_sNumPortal.toString().trim() + '',
                    p_sFoto: sSuFoto + '',
                    p_sVoz: ''
                };
                var v_sRet = enviarComunicatPendienteWS(sParams);
                if (v_sRet[2] == 2) {
                    //mensaje(v_sRet[3],"error");
                    //break;
                    v_bError=true;
                }
                else {
                    //si ha retornado un codigo ...
                    objComunicat = new comunicat();
                    objComunicat.ID = aComs[x].ID;
                    objComunicat.REFERENCIA = v_sRet[0];
                    objComunicat.ESTAT = 'NOTIFICAT';
                    objComunicat.DATA = v_sRet[1];
                    objComunicat.CODCARRER = aComs[x].CODCARRER;
                    objComunicat.CARRER = aComs[x].CARRER;
                    objComunicat.NUM = aComs[x].NUM;
                    objComunicat.COORD_X = aComs[x].COORD_X;
                    objComunicat.COORD_Y = aComs[x].COORD_Y;
                    objComunicat.COMENTARI = aComs[x].COMENTARI;
                    objComunicat.ITE_ID = aComs[x].ITE_ID;
                    objComunicat.ITE_DESC = aComs[x].ITE_DESC;
                    objComunicat.ID_MSG_MOV = v_sRet[1];
                    //Actualizo con nuevo estado

                    bBorrado = borraObjetoLocal('COMUNICAT_' + aComs[x].ID);

                    guardaObjetoLocal('COMUNICAT_' + aComs[x].ID, objComunicat);

                    //Elimino la foto que había guardado
                    //bBorrado = borraObjetoLocal('FOTO_' + aComs[x].ID);
                }

            }
            else //Actualizar el estado del comunicado (de las que están en cualquier estado excepto TANCADES)
            {
                if (aComs[x].ESTAT != 'TANCAT') {
                    sIdsActualizar += aComs[x].ID_MSG_MOV + "|" + aComs[x].ID + ",";
                }
            }
        }

        //Si hay posibles actualizaciones de comunicats
        if (sIdsActualizar.length > 0) {
            sIdsActualizar = sIdsActualizar.substr(0, sIdsActualizar.length - 1);
            ActualitzaComunicats(sIdsActualizar);
        }
        //y recargo la lista
        inicioPaginaConsultaIncidencias();
        if(v_bError)
        {
            mensaje("Actualització feta amb errors","avis");
        }
    }
    catch (ex) {
        alert(ex.message);
    }

}

function enviarComunicatPendienteWS(sParams) {
    var v_Campo = new Array(4);
    try {

        $.ajax({
            type: 'POST',
            url: _wsURLCrearIncidencia,
            data: sParams,
            success: function (datos) {
                if (datos == null)  //==> ha habido error
                {
                    v_Campo[2] = "2";
                    v_Campo[3] = "No hi ha confirmació de l'enviament de la comunicació";
                }
                else { //==> el WS ha devuelto algo

                    $(datos).find("resultado").each(function () {
                        $(this).children().each(function () {
                            if (this.tagName == "id") {
                                v_Campo[0] = $(this).text();
                            }
                            else if (this.tagName == "fecha") {
                                v_Campo[1] = $(this).text();
                            }
                            else if (this.tagName == "codError") {
                                v_Campo[2] = $(this).text();
                            }
                            else if (this.tagName == "desError") {
                                v_Campo[3] = $(this).text();
                            }
                        });
                    });
                }
            },
            error: function (error) {
                v_Campo[2] = "2";
                v_Campo[3] = 'ERROR en enviarComunicatPendienteWS : \n' + error.responseText;
            },
            async: false
        });
    }
    catch (ex) {
        v_Campo[2] = "2";
        v_Campo[3] = 'ERROR (exception) en enviarComunicatPendienteWS : \n' + ex.message;
    }

    return v_Campo;
}

function ActualitzaComunicats(sParams){
    //Llamar al WS 'ConsultaEstadoComunicats' pasandole un string con los id's separados por comas
    if(sParams.indexOf(',') == 0) sParams = sParams.substr(1);
    if(sParams.indexOf(',') == sParams.length-1) sParams = sParams.substr(0, sParms.length - 1);

    var aParams = {sIds:sParams};
    $.ajax({
        type: 'POST',
        url: _wsURLConsultaIncidencia,
        data: aParams,
        success:function(datos) {
            try
            {
                if(datos == null)  //==> ha habido error
                {
                    mensaje("L'actualització no ha estat posible\n" ,"pot ser no hi ha connexió");
                    return;
                }
                else     //==> el WS ha devuelto algo
                {
                    var aResultados = new Array();
                    var r = 0;
                    var c = 0;

                    //el XML que devuelve tiene uno o varios :
                    //<resultado>
                    //  <id></id>
                    //  <estado></estado>
                    //  <refUlls></refUlls>
                    //  <idLocal></idLocal>
                    //  <fecha></fecha>
                    //</resultado>

                    $(datos).find("resultado").each(function () {
                        c = 0;
                        aRegistro = new Array();
                        $(this).children().each(function () {
                            var aCampo = new Array(2);
                            aCampo[0] = this.tagName;
                            aCampo[1] = $(this).text();
                            aRegistro[c++] = aCampo;

                        });
                        aResultados[r++] = aRegistro;
                    });
                }
                if(aResultados.length > 0)
                {
                    //actualizo en BD local
                    GuardaActualizacionComunicats(aResultados);
                }
            }
            catch(e)
            {
                mensaje("ERROR (exception) en 'actualitzaComunicats' : \n" + e.code + "\n" + e.message);
            }
        },
        error: function (error) {
            mensaje("ERROR (exception) en 'actualitzaComunicats' : \n" + error.code + "\n" + error.message);
        },
        async: false
    });

}

function GuardaActualizacionComunicats(aResultados){
    var aRegistro = new Array();
    var aDatos = new Array();

    try{

        //  <id></id>
        //  <estado></estado>
        //  <refUlls></refUlls>
        //  <idLocal></idLocal>
        //  <fecha></fecha>
        var nPosId = 0;
        var nPosEstado = 1;
        var nPosRefUlls = 2;
        var nPosIdLocal = 3;
        var nPosFecha = 4;

        for(x=0; x<aResultados.length; x++)
        {
            aRegistro = aResultados[x];

            aDatos = new Array();

            //recupero los datos que ya tenia guardados pq los machacará al guardar ....
            var objComunicatEXISTENTE = null;
            objComunicatEXISTENTE = leeObjetoLocal('COMUNICAT_' + aRegistro[nPosIdLocal][1].toString().trim(),'');

            aDatos['id'] = aRegistro[nPosIdLocal][1].toString().trim();
            aDatos['referencia'] = aRegistro[nPosRefUlls][1] + '';
            if(aRegistro[nPosEstado][1]=="T"){
                aDatos['estat'] = 'TANCAT';
                aDatos['data'] = aRegistro[nPosFecha][1] + '';
            }
            else{
                aDatos['estat'] = 'NOTIFICAT';
                aDatos['data'] = objComunicatEXISTENTE.DATA + '';
            }
            aDatos['codcarrer'] = objComunicatEXISTENTE.CODCARRER + '';
            aDatos['carrer'] = objComunicatEXISTENTE.CARRER + '';
            aDatos['num'] = objComunicatEXISTENTE.NUM + '';
            aDatos['coord_x'] = objComunicatEXISTENTE.COORD_X + '';
            aDatos['coord_y'] = objComunicatEXISTENTE.COORD_Y + '';
            aDatos['comentari'] = objComunicatEXISTENTE.COMENTARI + '';
            aDatos['ite_id'] = objComunicatEXISTENTE.ITE_ID + '';
            aDatos['ite_desc'] = objComunicatEXISTENTE.ITE_DESC + '';
            aDatos['id_msg_mov'] = aRegistro[nPosId][1] + '';

            var objComunicatACTUALIZADO = new comunicat(aDatos);

            //y actualizo (machaco) con la nueva info
            guardaObjetoLocal('COMUNICAT_' + aRegistro[nPosIdLocal][1].toString().trim() , objComunicatACTUALIZADO);
        }
    }
    catch(e)
    {
         mensaje('ERROR (exception) en GuardaActualizacionComunicats : \n' + e.code + '\n' + e.message);
    }
}







