// ==UserScript==
// @name         Endeca Tools
// @version      0.3
// @author       Erick Luiz
// @match        http://localhost:8006/ifcr/sites*
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_getResourceURL
// @grant GM_addStyle
// ==/UserScript==

(function() {
    // Resource Fácil by Érick Luiz
    'use strict';
    function addGlobalStyle(css) {
        let head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }

    // ******************** Functions of Unicode ****************************** //
    // Converter Text to Unicode by Nardon //
    // This function is of internet //
   var converter = function() {
        var str = unicodeEntrada.value;
        var highsurrogate = 0;
        var suppCP;
        var pad;
        var n = 0;
        var outputString = '';
        for (var i = 0; i < str.length; i++) {
            var cc = str.charCodeAt(i);
            if (cc < 0 || cc > 0xFFFF) {
                outputString += '!Error in convertCharStr2UTF16: unexpected charCodeAt result, cc=' + cc + '!';
            }
            if (highsurrogate != 0) {
                if (0xDC00 <= cc && cc <= 0xDFFF) {
                    suppCP = 0x10000 + ((highsurrogate - 0xD800) << 10) + (cc - 0xDC00);
                    suppCP -= 0x10000;
                    outputString += '\\u'+ dec2hex4(0xD800 | (suppCP >> 10)) +'\\u'+ dec2hex4(0xDC00 | (suppCP & 0x3FF));
                    highsurrogate = 0;
                    continue;
                }
                else {
                    outputString += 'Error in convertCharStr2UTF16: low surrogate expected, cc=' + cc + '!';
                    highsurrogate = 0;
                }
            }
            if (0xD800 <= cc && cc <= 0xDBFF) {
                highsurrogate = cc;
            }
            else {
                switch (cc) {
                    case 0: outputString += '\0'; break;
                    case 8: outputString += '\b'; break;
                    case 9: outputString += '\t'; break;
                    case 10: outputString += '\n'; break;
                    case 13: outputString += '\r'; break;
                    case 11: outputString += '\v'; break;
                    case 12: outputString += '\f'; break;
                    case 34: outputString += '\"'; break;
                    case 39: outputString += '\''; break;
                    case 92: outputString += '\\'; break;
                    default:
                        if (cc > 0x1f && cc < 0x7F) { outputString += String.fromCharCode(cc); }
                        else {
                            pad = cc.toString(16).toUpperCase();
                            while (pad.length < 4) { pad = '0'+pad; }
                            outputString += '\\u'+pad;
                        }
                }
            }
        }
        document.querySelector('#unicodeSaida').value = outputString;
    }


let style = `
ul.menu{
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
}

ul.menu li {
    float: left;
}

ul.menu li a, .dropbtn {
    display: inline-block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

ul.menu li a:hover, .dropdown:hover .dropbtn {
    background-color: red;
}

ul.menu li.dropdown {
    display: inline-block;
}
.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
}

.dropdown-content a:hover {background-color: #f1f1f1}

.dropdown:hover .dropdown-content {
    display: block;
}
.modal{
    z-index: 5;
    position: absolute;
    margin:0;
    padding: 0;
    top:0;
    left: 0;
    bottom: 0;
    right: 0;
    border: 1px solid black;
    transition-duration: 2s;
  }
  .modal-dialog{
    display: block;
    position:relative;
    margin: auto;
    padding: 5%;
    height: 70%;
    width:  70%;
  }
  .modal-dialog .modal-head{
    position: absolute;
    background-color: #333;
    color:#f9f9f9;
    font-size: 1.5em;
    text-align: center;
    width: 85.7%;
    min-height: 26px;
  }
  .modal-dialog .modal-head .title h1{
    margin: 0;
    color: #f9f9f9;
  }
  .modal-dialog .modal-body{
    padding-top:5%;
    background-color: #f9f9f9;
    height: 100%;
    border: 1px solid black;
  }
  .modal-dialog button.modal-close{
    position: absolute;
    top: 0;
    right: 0;
    border:none;
    background:none;
    color:red;
  }
`;
GM_addStyle(style);

let encodeHTML =`<div id="unicode" style="min-width:400px;display:none;min-height: 400px;margin:1%">
      <textarea id="unicodeEntrada" placeholder="Entrada do texto a ser formatado!" style="width: 50%;max-width:50%; min-height: 300px; border:solid 1px;margin:20px 0;traslation:all 2s;"></textarea>
      <textarea id="unicodeSaida" placeholder="Texto formatado em Unicode" style="width: 59%;max-width:49%; min-height: 300px; border:solid 1px; margin:20px 0;traslation:all 2s;"></textarea>
    </div>`;


let divResourceFacil = `<div id='resource-facil' style="min-width:400px;display:none; min-height: 400px;margin:1%">
         <textarea id="entradaResourceFacil" placeholder="Entrada do XML do Cartucho" style="width: 50%; min-height: 300px; border:solid 1px;margin:20px 0;traslation:all 2s;"></textarea>
         <textarea id="saidaResourceFacil" placeholder="Saída: Resource a ser preenchido" style="width: 49%; min-height: 300px; border:solid 1px;margin:20px 0;traslation:all 2s;"></textarea>
     <div>`;

let html =`
<ul class="menu">
  <li><a href="#resource-facil" class="modal-open" id="resourceFacil">Resource Fácil</a></li>
  <li><a href="#encode" class="modal-open" id="encode">Encode</a></li>
</ul>
<div class="modal" id="" role="dialog" style="display: none;">
    <div class="modal-dialog">
      <div class="modal-head">
        <div class="title"><h1></h1></div>
        <button class="modal-close">X</button>
      </div>
      <div class="modal-body">
         ${encodeHTML}
         ${divResourceFacil}
      </div>
    </div>
  </div>
`;

let divA = document.createElement('div');
divA.innerHTML = html;
document.querySelector('Body').insertBefore(divA, document.querySelector('#workbenchContainer'));
//document.querySelector('Body').insertBefore(divA, document.querySelector('.skiplinks'));

    function openAndClose(element, button, listElements = []){
        button.addEventListener("click", function(){
            if(element.style.display == ""){
                element.style.display = "none";
            }else{
                for(var i = 0; i < listElements.length; i++){
                    listElements[i].style.display = "none";
                }
                element.style.display = "";
            }
        });
    }
    console.log(GM_getResourceURL('https://exame.abril.com.br/noticias-sobre/sites/'));

    var contentHtml = {
        resourceFacil:'resource-facil',
        resourceFacilTitle:`Resource Fácil - Cole o cartucho e pegue o Resource`,
        encode:'unicode',
        encodeTitle: `Formatação do encode para código de acentuação`
    }

    let modal = document.querySelector('.modal');
    let btnModalClose = document.querySelector('.modal-close');
    let anchorsModalOpen = document.querySelectorAll('.modal-open');
    let modalHead = document.querySelector('.modal-head h1');
    let modalBody = document.querySelector('.modal-body');

    function retornaResources(string){
        var resources = [];

        for(var i = 0; i < string.length; i++){
            if(string[i] == "$" && string[++i] == "{"){
                var palavra = "";
                while(string[++i] != "}"){

                    if(i >= string.length) break;
                    if(string[i] == "$" && string[i+1] == "{") {
                        i = i + 1;
                        resources.push(palavra.replace('\n',""));
                        palavra = "";
                        continue;
                    }
                    palavra += string[i];
                }
                resources.push(palavra.replace('\n',""));
            }
        }
        return resources;
    }

    function apresentaResources(array, textarea){
        var saida = "";
        for(var i = 0; i < array.length; i++){
            if(array[i].indexOf('group') > -1 && saida != ""){
                 saida += '\n';
            }
            saida += array[i] + "=\n";
        }
        textarea.value = saida;
    }
let setEvents = (function(){
    let elementActive;
    for(let i = 0; i < anchorsModalOpen.length; i++){
        anchorsModalOpen[i].addEventListener('click',function(evt){
            evt.preventDefault();
            modalHead.innerText = contentHtml[this.id + 'Title'];

            elementActive = document.querySelector('#'+contentHtml[this.id]);
            elementActive.style.display = '';

            modal.style.display = '';
        });
    }
    btnModalClose.addEventListener('click',function(){
        elementActive.style.display = 'none';
        modal.style.display = 'none';
    });
    document.querySelector('#entradaResourceFacil').addEventListener("change", function(){
        apresentaResources(retornaResources(this.value),document.querySelector('#saidaResourceFacil'));
    });

    document.querySelector('#entradaResourceFacil').addEventListener("keyup", function(){
        apresentaResources(retornaResources(this.value),document.querySelector('#saidaResourceFacil'));
    });

    document.querySelector('#unicodeEntrada').addEventListener("keyup", function(){
        converter();
    });

});

setEvents();



})();
