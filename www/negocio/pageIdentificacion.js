function inicioPaginaIdentificacion() {
    try{
        cargaDatosCiudadano();
    }
    catch (ex){
        alert(ex.message);
    }
}

function cargaDatosCiudadano(){
    var objUsu = getDatosUsuario();
    if(objUsu != null)
    {
        $('#inputNOM').val(objUsu.NOM) ;
        $('#inputCOGNOM1').val(objUsu.COGNOM1);
        $('#inputCOGNOM2').val(objUsu.COGNOM2);
        $('#inputDNI').val(objUsu.DNI);
        $('#inputEMAIL').val(objUsu.EMAIL);
        $('#inputTELEFON').val(objUsu.TELEFON);

    }
}


function guardaDatosCiudadano(){
    try
    {
        if (esTelefono($('#inputTELEFON').val())){

        // NOM, COGNOM1, COGNOM2, DNI, EMAIL, TELEFON
        var idCiutada = 0;
        var nom='';
        var cognom1='';
        var cognom2='';
        var dni='';
        var email='';
        var telefon='';

        //recojo los datos del usuario que ya están guardados en la tabla CIUTADA
        //si todavía no existe el usuario se devuelve un objeto usuari vacio
        var objUsu = getDatosUsuario();

        //Si ha modificado algún dato lo recojo para actualizar , pero si lo ha dejado en blanco cojo lo que ya tenía en la tabla guardado
        //if($('#inputNOM').val() != '')     nom =     $('#inputNOM').val();     else nom =     objUsu.NOM;
        //if($('#inputCOGNOM1').val() != '') cognom1 = $('#inputCOGNOM1').val(); else cognom1 = objUsu.COGNOM1 ;
        //if($('#inputCOGNOM2').val() != '') cognom2 = $('#inputCOGNOM2').val(); else cognom2 = objUsu.COGNOM2 ;
        //if($('#inputDNI').val() != '')     dni =     $('#inputDNI').val();     else dni =     objUsu.DNI ;
        //if($('#inputEMAIL').val() != '')   email=    $('#inputEMAIL').val();   else email =   objUsu.EMAIL ;
        //if($('#inputTELEFON').val() != '') telefon = $('#inputTELEFON').val(); else telefon = objUsu.TELEFON ;

        nom =     $('#inputNOM').val();
        cognom1 = $('#inputCOGNOM1').val();
        cognom2 = $('#inputCOGNOM2').val();
        dni =     $('#inputDNI').val();
        email=    $('#inputEMAIL').val();
        telefon = $('#inputTELEFON').val();

        objUsu = new usuari();
        objUsu.ID = 0;
        objUsu.NOM = nom;
        objUsu.COGNOM1 = cognom1;
        objUsu.COGNOM2 = cognom2;
        objUsu.DNI = dni;
        objUsu.EMAIL = email;
        objUsu.TELEFON = telefon;

        guardaObjetoLocal('CIUTADA' , objUsu);

        abrirPagina("pageIndex", false);
        }
        else
        {
            mensaje(e.message , 'telefon no vàlid');
        }
    }
    catch (e)
    {
        mensaje(e.message , 'error');
    }
}

function LimpiarDatosCiudadano(){
        $('#inputNOM').val('') ;
        $('#inputCOGNOM1').val('');
        $('#inputCOGNOM2').val('');
        $('#inputDNI').val('');
        $('#inputEMAIL').val('');
        $('#inputTELEFON').val('');

}

function SinDatosCiudadano()
{
    var objUsu = getDatosUsuario();
    if (objUsu==null) {
        return true;
    }
    else{
        if (objUsu.NOM != '') return false;
        if (objUsu.COGNOM1 != '') return false;
        if (objUsu.COGNOM2 != '') return false;
        if (objUsu.DNI != '') return false;
        if (objUsu.EMAIL != '') return false;
        if (objUsu.TELEFON != '') return false;
        return true;
    }

}

