const input = document.getElementById("texto-entrada");
const img_saida = document.getElementById("img-saida");
const mensagem_saida = document.getElementById("mensagem");
const texto_saida = document.getElementById("texto-saida");
const output = document.getElementById("valor_saida");

const escrever = document.getElementById("escrever");
const voz = document.getElementById("voz");
const code_alvorecer = document.getElementById("code_alvorecer");
const alura = document.getElementById("alura");

const background = document.querySelector('section');
const menus = document.querySelectorAll('.menu');
const logo = document.querySelector("#logo");
const link_img = document.getElementById("link-img");
const textos = document.querySelectorAll('textarea');
const selecao = document.querySelectorAll('*');
const img_aviso = document.querySelector("#img-aviso");
const texto_aviso = document.querySelector('#aviso span');
const btn_criptografar =  document.querySelector("#botoes button#criptografar");
const btn_descriptografar =  document.querySelector("#botoes button#descriptografar");
const saida = document.getElementById("saida");
const imagem_saida = document.querySelector("#img-saida img");
const saida_textos = document.querySelector('#saida textarea');
const botao_saida = document.querySelector("#texto-saida button");

var reconhecimento;
var comandoVoz = false;

var btn_alura = false;
var btn_alvorecer = true;

var btn_escrever = true;
var btn_voz = false;

var btn_criptografia = false;
var btn_descriptografia = false;

var deslocamento;

function detectaTexto(){ 
    setTimeout(function(){
        if (input.value == "") {
            img_saida.style.display = "flex";
            mensagem_saida.style.display = "flex";
            texto_saida.style.display = "none";
            if(btn_criptografia == false || btn_criptografia == false){
                output.value = input.value;
            }
        }
        else{
            img_saida.style.display = "none";
            mensagem_saida.style.display = "none";
            texto_saida.style.display = "flex";
            input.value = input.value.normalize("NFD").replace(/[\u0300-\u036f^`´~¨]/gi, "").replace(/\s+/g, " ").toLowerCase().trimLeft();
            if(btn_criptografia == false || btn_criptografia == false){
                output.value = input.value;
            }
        }
    }, 10);
}

input.addEventListener('paste', function(event) {
    // Acessa os dados colados do evento
    var clipboardData = event.clipboardData || window.clipboardData;
    var pastedText = clipboardData.getData('text');
  
    // Verifica se o texto colado não está vazio
    if (pastedText !== "") {
      // O evento de colar foi detectado
      detectaTexto();
    }
});    

function copiarTexto(){
    // Selecionar o conteúdo do elemento
    output.select();
    output.setSelectionRange(0, 99999); // Para dispositivos móveis*/

    // Copiar o texto para área de transferência
    navigator.clipboard.writeText(output.value)
    .then(function() {
        // Sucesso
       copiarMensagem();
       console.log("Mensagem Copiada");
      })
      .catch(function(error) {
        // Tratar erros
        alert("Erro ao copiar o texto: " + error);
      });
}

function copiarMensagem() {
    let mensagem = "Mensagem Copiada";
    let originalCursor = document.body.style.cursor;
    document.body.style.cursor = "text";
    let digitacao = document.createElement("span");
    digitacao.id = "digitacao";
    document.body.appendChild(digitacao);
    digitacao = document.getElementById("digitacao");
    digitacao.className = "cursor";

    if(btn_alura == true){
        digitacao.style.color = "#0A3871";
    }

    document.addEventListener("mousemove", function(event){
        digitacao.style.left = (event.clientX + 20) + "px";
        digitacao.style.top = (event.clientY + 0) + "px";
    });

    let i = 0;
    let Intervalodigitacao = setInterval(function() {
        digitacao.innerHTML += mensagem.charAt(i);
        i++;
        if (i > mensagem.length) {
            clearInterval(Intervalodigitacao);
            setTimeout(function() {
                digitacao.remove();
                document.body.style.cursor = originalCursor;
            }, 800); // Tempo em milissegundos para o cursor voltar ao normal (neste caso, 1 segundo)
        }
    }, 100); // Intervalo em milissegundos para cada letra aparecer (neste caso, 0.1 segundo)
}

function trocaEstado(botao){
    if(botao == 'escrever'){
        btn_escrever = true;
        btn_voz = false;
    }
    if(botao == 'voz'){
        btn_escrever = false;
        btn_voz = true;
    }
}

function controleBotao(){
    if(btn_escrever == true){
        controleEscrever();
    }
    if(btn_voz == true){
        controleVoz();
    }
}

function controleEscrever(){
    if(btn_alura == true){
        if(btn_escrever == true){
            escrever.style.background = "url(./Imagens/Texto_White.svg),#0A3871";
            escrever.style.backgroundPosition = "center";
            escrever.style.backgroundRepeat = "no-repeat";

            if(comandoVoz == false){
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
            else{
                voz.style.background = "url('./Imagens/Alura_Voz_Blue.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat"; 
            }
        }
    }

    if(btn_alvorecer == true){
        if(btn_escrever == true){
            escrever.style.background = "url(./Imagens/Alvorecer_Texto_Black.svg),#fff";
            escrever.style.backgroundPosition = "center";
            escrever.style.backgroundRepeat = "no-repeat";

            if(comandoVoz == false){
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
            else{
                voz.style.background = "url('./Imagens/Voz_White.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
        }
    }
   
    reconhecimento.stop();
}

window.addEventListener("DOMContentLoaded", function(){
    if("webkitSpeechRecognition" in window) {
        reconhecimento = new webkitSpeechRecognition();
        comandoVoz = true;
    }
    else{
        // Navegador não suporta o Reconhecimento de Fala
        console.log("O navegador não suporta o Reconhecimento de Fala.");
        comandoVoz = false;
        voz.disabled = true;
        voz.style.cursor = 'default';
        voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
        voz.style.backgroundPosition = "center";
        voz.style.backgroundRepeat = "no-repeat";
    }
});

function controleVoz(){
    if(btn_alura == true){
        if(btn_voz == true){
            escrever.style.background = "url(./Imagens/Alura_Texto_Blue.svg),transparent";
            escrever.style.backgroundPosition = "center";
            escrever.style.backgroundRepeat = "no-repeat";

            if(comandoVoz == false){
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
            else{
                voz.style.background = "url('./Imagens/Voz_White.svg'),#0A3871";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
        }
    }

    if(btn_alvorecer == true){
        if(btn_voz == true){
            escrever.style.background = "url(./Imagens/Texto_White.svg),transparent";
            escrever.style.backgroundPosition = "center";
            escrever.style.backgroundRepeat = "no-repeat";

            if(comandoVoz == false){
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
            else{
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Black.svg'),#fff";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
        }
    }

    /* ----- Reconhecimento de voz ----- */

    // Verifica se o navegador suporta a API de Reconhecimento de Fala
    reconhecimento = new webkitSpeechRecognition();
    reconhecimento.start();
    
    // Configurações opcionais
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;
    
    // Função chamada quando o reconhecimento é iniciado
    reconhecimento.onstart = function() {
        input.value = "O reconhecimento de fala foi iniciado.";
    };
    
    // Função chamada quando o reconhecimento é encerrado
    reconhecimento.onend = function() {
        console.log("O reconhecimento de fala foi encerrado.");
    };
    
    // Função chamada quando um resultado é retornado
    reconhecimento.onresult = function(event) {
        const resultado = event.results[0][0].transcript.normalize("NFD").replace(/[\u0300-\u036f^`´~]/gi, "").replace(/\s+/g, " ").toLowerCase().trimLeft();
        input.value = resultado;
        detectaTexto();
        console.log("Resultado: ", resultado);
    };
}

function Criptografar(){
    if(btn_alura == true){
        btn_criptografia = true;
        btn_descriptografia = false;
        criptografia_Alura();
    }

    if(btn_alvorecer == true){
        btn_criptografia = true;
        btn_descriptografia = false;
        deslocamento = SortearChaveCifra();
        let crip = input.value;
        criptografia_Alvorecer(crip, deslocamento);
    }
}

function criptografia_Alura(){
    let texto = input.value;

    let substituicoes = {
        a: "ai",
        e: "enter",
        i: "imes",
        o: "ober",
        u: "ufat"
    };

    let resultado = texto.replace(/(a|e|i|o|u)/gi, function(match){
        let substituicao = substituicoes[match.toLowerCase()];
        return substituicao;
    });

    output.value = resultado;
}

function criptografia_Alvorecer(mensagem, chave){
    let mensagemCriptograda = "";
    for(let i = 0; i < mensagem.length; i++){
        let letra = mensagem[i];
        
        if (letra.match(/[a-zA-Z]/)) {
            let codigo = letra.charCodeAt(0);
            let limite = letra.match(/[a-z]/) ? 97 : 65;
            let novoCodigo = ((codigo - limite + chave) % 26) + limite;
            let letraCriptografada = String.fromCharCode(novoCodigo);
            mensagemCriptograda += letraCriptografada;
          } else {
            // Mantém caracteres não alfabéticos
            mensagemCriptograda += letra;
          }
       
    }

    output.value = mensagemCriptograda;
}

function Descriptografar(){
    if(btn_alura == true){
        btn_criptografia = false;
        btn_descriptografia = true;
        descriptografia_Alura();
    }

    if(btn_alvorecer == true){
        btn_criptografia = false;
        btn_descriptografia = true;
        let descript = input.value;
        descriptografia_Alvorecer(descript, deslocamento);
    }

}

function descriptografia_Alura(){
    let texto = input.value;

    let substituicoes = {
        ai: "a",
        enter: "e",
        imes: "i",
        ober: "o",
        ufat: "u"
    };

    let saida = texto.replace(/(ai|enter|imes|ober|ufat)/gi, function(match){
        let substituicao = substituicoes[match.toLowerCase()];
        return substituicao;
    });

    output.value = saida;
}

function descriptografia_Alvorecer(mensagem, chave){
  let mensagemDescriptografada = "";

  for (let i = 0; i < mensagem.length; i++) {
    let letra = mensagem[i];

    if (letra.match(/[a-zA-Z]/)) {
      let codigo = letra.charCodeAt(0);
      let limite = letra.match(/[a-z]/) ? 97 : 65;
      let novoCodigo = ((codigo - limite - chave + 26) % 26) + limite;
      let letraDescriptografada = String.fromCharCode(novoCodigo);
      mensagemDescriptografada += letraDescriptografada;
    } else {
      mensagemDescriptografada += letra;
    }
  }

  output.value = mensagemDescriptografada;
}

function SortearChaveCifra(){
    let chave = Math.floor(Math.random() * 26);
    return chave;
}

function updateCSS(cor){
   if(cor == 'Code_Alvorecer'){
    console.log("Code_Alvorecer");
    btn_alura = false;
    btn_alvorecer = true;

    background.style.background = "#000";
    menus.forEach(function(menu) {
        menu.style.backgroundColor = '#262626';
    });

    logo.src = './Imagens/Code_Alvorecer.png';
    link_img.href = 'https://www.instagram.com/code_alvorecer/';
    img_aviso.src = './Imagens/Alvorecer_Aviso.svg';

    texto_aviso.style.color = '#fff';

    textos.forEach(function(texto) {
        texto.style.color = '#fff';
        texto.classList.remove('placeholder-alura');  
    });

    selecao.forEach(function(elemento) {
        elemento.classList.remove('selection-alura');  
        elemento.classList.remove('alura-scrollbar-thumb');
        elemento.classList.remove('alura-scrollbar-thumb-hover');
    });

    btn_criptografar.style.background = '#fff';
    btn_criptografar.style.color = '#000';

    btn_descriptografar.style.background = '#000';
    btn_descriptografar.style.color = '#fff';
    btn_descriptografar.style.border = '1px solid #fff';

    saida.style.background = '#262626';
    imagem_saida.src = './Imagens/Alvorecer_figura.svg';
    mensagem_saida.style.color = '#fff';
    saida_textos.style.color = '#fff';
    botao_saida.style.color = '#fff';
    botao_saida.style.border = '1px solid #fff';

    alura.style.background = "url(./Imagens/Alura_Icon_White.svg),transparent";
    alura.style.backgroundPosition = "center";
    alura.style.backgroundRepeat = "no-repeat";

    code_alvorecer.style.background = "url('./Imagens/Alvorecer_Icon_Black.svg'),#fff";
    code_alvorecer.style.backgroundPosition = "center";
    code_alvorecer.style.backgroundRepeat = "no-repeat";
   }
   else{
    console.log("Alura");
    btn_alura = true;
    btn_alvorecer = false;
    background.style.background = "#F3F5FC";
    menus.forEach(function(menu) {
        menu.style.backgroundColor = '#fff';
    });

    logo.src = './Imagens/Alura.svg';
    link_img.href = 'https://www.alura.com.br';
    img_aviso.src = './Imagens/Alura_Aviso.svg';

    texto_aviso.style.color = '#495057';

    textos.forEach(function(texto) {
        texto.style.color = '#0A3871';
        texto.classList.add('placeholder-alura');  
    });

    selecao.forEach(function(elemento) {
        elemento.classList.add('selection-alura');  
        elemento.classList.add('alura-scrollbar-thumb');
        elemento.classList.add('alura-scrollbar-thumb-hover');
    });

    btn_criptografar.style.background = '#0A3871';
    btn_criptografar.style.color = '#fff';

    btn_descriptografar.style.background = '#D8DFE8';
    btn_descriptografar.style.color = '#0A3871';
    btn_descriptografar.style.border = '1px solid #0A3871';

    saida.style.background = '#fff';
    imagem_saida.src = './Imagens/Alura_figura.svg';
    mensagem_saida.style.color = '#343A40';
    saida_textos.style.color = '#495057';
    botao_saida.style.color = '#0A3871';
    botao_saida.style.border = '1px solid #0A3871';

    alura.style.background = "url(./Imagens/Alura_Icon_White.svg), #0A3871";
    alura.style.backgroundPosition = "center";
    alura.style.backgroundRepeat = "no-repeat";

    code_alvorecer.style.background = "url('./Imagens/Alvorecer_Icon_Blue.svg'),transparent";
    code_alvorecer.style.backgroundPosition = "center";
    code_alvorecer.style.backgroundRepeat = "no-repeat";
   }
   controleBotao();
}