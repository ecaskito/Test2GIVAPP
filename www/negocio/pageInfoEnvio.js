

function inicioPaginaInfoEnvio() {
    try
    {
        $('#divInfoEspera').show();
        $('#divInfoResultado').hide();

        var objUsu = getDatosUsuario();

        var  sParams = {sId:TipoInciSel+'',sDescItem:sDescItem+'' ,sNom:objUsu.NOM + '',sCognom1:objUsu.COGNOM1 + '',sCognom2:objUsu.COGNOM2 + '',sDni:objUsu.DNI + '',sEmail:objUsu.EMAIL + '',sTelefon:objUsu.TELEFON + '',sObs:sComentario + '',sCoord:sCoords + '',sCodCarrer:$('#selectCARRER').val() + '',sCarrer:$('#selectCARRER').find(':selected').text() + '',sNumPortal:$('#inputNUM').val() + '',sFoto: sFoto};

        //Enviar
        var ref = enviarComunicat_WS(sParams, true);

    }
    catch (ex){
        alert(ex.message);
    }
    $('#divInfoEspera').hide();
    $('#divInfoResultado').show();

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
                    $('#lblInfoEnvioText').text(sMensaje);
                    //mensaje(sMensaje, sTitulo);
                    //abrirPagina('pageInfoEnvio', false);
                }
                else
                {
                    if(!bEnvioCorrecto)
                    {
                        $('#lblInfoEnvioText').text(sMensaje);
                        //mensaje(sMensaje, sTitulo);
                    }
                }
            }
            catch(ex){
                $('#lblInfoEnvioText').text('ERROR (exception) en resultadoEnvio : \n' + ex.code + '\n' + ex.message , 'error');
                //mensaje('ERROR (exception) en resultadoEnvio : \n' + ex.code + '\n' + ex.message , 'error');
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
            $('#lblInfoEnvioText').text(sMensaje);
            //mensaje(sMensaje, sTitulo);
            //abrirPagina('pageInfoEnvio', false);
        });
    }
    catch(e)
    {
        $('#lblInfoEnvioText').text('ERROR (exception) en enviarComunicat_WS : \n' + e.code + '\n' + e.message);
        //mensaje('ERROR (exception) en enviarComunicat_WS : \n' + e.code + '\n' + e.message);
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


