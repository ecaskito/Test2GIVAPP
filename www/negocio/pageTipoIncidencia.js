var sId='';
var sDescItem='';
var dicImagenes = {};
var dicAyuda = {};
var dicItem={};
var nImgTotal = 0;
//hgs abans 5 Si disminueixo surten les fletxes
var nImgPorPanel = 10;
var nPrimeraImgVisible = 1;
var nNumCalle =0;
var bPrimera;


function inicioPaginaTipoIncidencia() {

    //cargo los iconos
    leeXMLIconos();

    //totalImg();  			//la primera vez informa esta var con el total de imagenes ...
    mostrarImagenes("");

}



function leeXMLIconos(){
   // alert('leo xml');
    $.ajax({
        type: "GET",
        url: "tablas/iconosTemas.xml",
        dataType: "xml",
        success: function(xml){
            $(xml).find('icoTema').each(function(){
                dicImagenes[$(this).find('id').text()] = "imagenes/"+$(this).find('img').text();
                dicAyuda[$(this).find('id').text()] = $(this).find('desc').text();
                //guardem l'item del seleccionat
                dicItem[$(this).find('id').text()] = $(this).find('img').text().substr(0,$(this).find('img').text().indexOf("_"));
            });
        },
        error: function() {
            alert("Error processant arxiu XML");
        },async:false
    });
}

// 'Activa' una imagen y desactiva todas las demas y actualiza el divImagenes con las que toque (según sea inicio, derecha o izquierda)
function mostrarImagenes()	{
        var sTagImg = "";
        var nInd = 0;
        var nIndVis = 0;
        for (sImagen in dicImagenes) {
                //sTagImg += "<img src='" + dicImagenes[sImagen] + "' id='" + sImagen + "' class='img-swap' alt='" + dicImagenes[sImagen] + "' width='54' height='70' /> "


            sTagImg += "<a href='' onclick='" + "selectTipo(" + sImagen + ")' data-mini='false' data-inline='false' data-role='button' data-theme='c' data-corners='true' data-shadow='true' data-iconshadow='true' data-wrapperels='span' class='ui-btn ui-shadow ui-btn-corner-all ui-fullsize ui-btn-block ui-first-child ui-btn-up-c'>"
            sTagImg +="<span class='ui-btn-inner'>"
            sTagImg +="<span class='ui-btn-text'>"
                sTagImg +="<img alt='' src='" + dicImagenes[sImagen] + "' style='float:left;width:30px' />"
            sTagImg += "<div style='padding-top:7px;padding-left:35px'>" + dicAyuda[sImagen] + "</div>"
            sTagImg +="</span></span></a>"
        }
        $('#divTipoInci').html(sTagImg);

};

function selectTipo(p_tipo) {
    abrirPagina('pageDatosIncidencia', false);
}
