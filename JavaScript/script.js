// Obtém as referências dos elementos HTML
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
const img_hamburguer = document.getElementById("img-hamburguer");
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

// Variáveis de Controle
var reconhecimento;
var comandoVoz = false;

var btn_alura = false;
var btn_alvorecer = true;

var btn_escrever = true;
var btn_voz = false;

var btn_criptografia = false;
var btn_descriptografia = false;

var deslocamento;

// Função para detectar o texto digitado ou colado no campo de entrada
function detectaTexto(){ 
    // Aguarda 10ms antes de executar o código
    setTimeout(function(){
        if (input.value == "") {
            // Se o valor de input for vazio, exibe a imgem de saída e a mensagem de saída
            img_saida.style.display = "flex"; 
            mensagem_saida.style.display = "flex"; 
            texto_saida.style.display = "none"; 

            // Verifica se os botões de criptografia ou descriptografia estão desativados
            if(btn_criptografia == false || btn_criptografia == false){
                output.value = input.value;
            }
        }
        else{
            // Se o valor de input não for vazio
            img_saida.style.display = "none";
            mensagem_saida.style.display = "none";
            texto_saida.style.display = "flex";
            
            // Normaliza o valor de input removendo acentos e espaços em excesso
            input.value = input.value
                .normalize("NFD")
                .replace(/[\u0300-\u036f^`´~¨]/gi, "")
                .replace(/\s+/g, " ")
                .toLowerCase()
                .trimLeft();

            // Verifica se os botões de criptografia ou descriptografia estão desativados
            if(btn_criptografia == false || btn_criptografia == false){
                output.value = input.value;
            }
        }
    }, 10);
}

// Este trecho de código adiciona um ouvinte de eventos ao elemento `input` para capturar o evento de colar ('paste')
input.addEventListener('paste', function(event) {
    // Acessa os dados colados do evento
    var clipboardData = event.clipboardData || window.clipboardData;
    var pastedText = clipboardData.getData('text');
  
    // Verifica se o texto colado não está vazio
    if (pastedText !== "") {
      // O evento de colar foi detectado, chama a função detectaTexto()
      detectaTexto();
    }
});    

// Função para copiar o texto
function copiarTexto(){
    // Selecionar o conteúdo do elemento
    output.select();
    output.setSelectionRange(0, 99999); // Para dispositivos móveis*/

    // Copiar o texto para área de transferência
    navigator.clipboard.writeText(output.value)
    .then(function() {
        // Se o texto for copiado com sucesso, chama a função ('copiarMensagem')
       copiarMensagem();
      })
      .catch(function(error) {
        // Se o texto não for copiado, é exibido um alert com a mensagem de erro
        alert("Erro ao copiar o texto: " + error);
      });
}

// Cria a mensagem ('mensagem copiada') ao lado do cursor do mouse
function copiarMensagem() {
    let mensagem = "Mensagem Copiada";
    let originalCursor = document.body.style.cursor;
    document.body.style.cursor = "text";

    // Cria um elemento <span> para simular a digitação da mensagem
    let digitacao = document.createElement("span");
    digitacao.id = "digitacao";
    document.body.appendChild(digitacao);
    digitacao = document.getElementById("digitacao");
    digitacao.className = "cursor";

    // Define a cor do texto da digitação dependendo do estado do botão alura
    if(btn_alura == true){
        digitacao.style.color = "#0A3871";
    }

    // Atualiza a posição do elemento de digitação com base no movimento do mouse
    document.addEventListener("mousemove", function(event){
        digitacao.style.left = (event.clientX + 20) + "px";
        digitacao.style.top = (event.clientY + 0) + "px";
    });

    let i = 0;
    let Intervalodigitacao = setInterval(function() {
        // Adiciona cada caractere da mensagem ao elemento de digitação
        digitacao.innerHTML += mensagem.charAt(i);
        i++;
        if (i > mensagem.length) {
            clearInterval(Intervalodigitacao);
            setTimeout(function() {
                // Remove o elemento da digitação e restaura o cursor original
                digitacao.remove();
                document.body.style.cursor = originalCursor;
            }, 800); // Tempo em milissegundos para o cursor voltar ao normal (neste caso, 800 ms)
        }
    }, 100); // Intervalo em milissegundos para cada letra aparecer (neste caso, 100 ms)
}

function trocaEstado(botao){
    if(botao == 'escrever'){
        // Atualiza os estados dos botões para escrever e voz
        btn_escrever = true;
        btn_voz = false;
    }
    if(botao == 'voz'){
        // Atualiza os estados dos botões para voz e escrever
        btn_escrever = false;
        btn_voz = true;
    }
}

function controleBotao(){
    if(btn_escrever == true){
        // Se o estado do botão "escrever" for true, chama a função controleEscrever()
        controleEscrever();
    }
    if(btn_voz == true){
        // Se o estado do botão "voz" for true, chama a função controleVoz()
        controleVoz();
    }
}

function controleEscrever(){
    if(btn_alura == true){
        if(btn_escrever == true){
            // Configura o estilo do botão "escrever" para o tema Alura
            escrever.style.background = "url(./Imagens/Texto_White.svg),#0A3871";
            escrever.style.backgroundPosition = "center";
            escrever.style.backgroundRepeat = "no-repeat";

            if(comandoVoz == false){
                // Se o comando de voz estiver desativado, configura o estilo so botão "voz" para o tema desativado
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
            else{
                 // Se o comando de voz estiver ativado, configura o estilo so botão "voz" para o tema ativado
                voz.style.background = "url('./Imagens/Alura_Voz_Blue.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat"; 
            }
        }
    }

    if(btn_alvorecer == true){
        if(btn_escrever == true){
            // Configura o estilo do botão "escrever" para o tema Code_Alvorecer
            escrever.style.background = "url(./Imagens/Alvorecer_Texto_Black.svg),#fff";
            escrever.style.backgroundPosition = "center";
            escrever.style.backgroundRepeat = "no-repeat";

            if(comandoVoz == false){
                // Se o comando de voz estiver desativado, configura o estilo so botão "voz" para o tema desativado
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
            else{
                // Se o comando de voz estiver ativado, configura o estilo so botão "voz" para o tema ativado
                voz.style.background = "url('./Imagens/Voz_White.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
        }
    }
   
    if(comandoVoz == true){
        reconhecimento.stop();
    }
}

function controleVoz(){
    if(btn_alura == true){
        if(btn_voz == true){
            // Configura o estilo do botão "escrever" para o tema Alura
            escrever.style.background = "url(./Imagens/Alura_Texto_Blue.svg),transparent";
            escrever.style.backgroundPosition = "center";
            escrever.style.backgroundRepeat = "no-repeat";

            if(comandoVoz == false){
                // Configura o estilo do botão "voz" desabiitado para o tema Alura
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            } else{
                // Configura o estilo do botão "voz" habilitado para o tema Alura
                voz.style.background = "url('./Imagens/Voz_White.svg'),#0A3871";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            }
        }
    }

    if(btn_alvorecer == true){
        if(btn_voz == true){
            // Configura o estilo do botão "escrever" para o tema Code_Alvorecer
            escrever.style.background = "url(./Imagens/Texto_White.svg),transparent";
            escrever.style.backgroundPosition = "center";
            escrever.style.backgroundRepeat = "no-repeat";

            if(comandoVoz == false){
                // Configura o estilo do botão "voz" desabilitado para o tema Code_Alvorecer
                voz.style.background = "url('./Imagens/Alvorecer_Voz_Disable.svg'),transparent";
                voz.style.backgroundPosition = "center";
                voz.style.backgroundRepeat = "no-repeat";
            } else{
                // Coanfigura o estilo do botão "voz" habilitado para o tema Code_Alvorecer
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

    // Define se o reconhecimento de fala é contínuo
    reconhecimento.continuous = false;

    //Define se os resultado intermediários são retornado durantente o resultado da fala
    reconhecimento.interimResults = true;
    
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
        // Obtém o texto transcrito a partir do evento

        const resultado = event.results[0][0].transcript
            .normalize("NFD")
            .replace(/[\u0300-\u036f^`´~]/gi, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .trimLeft();
        
        // Define o valor do campo de entrada de texto com o resultado da fala
        input.value = resultado;

        // Chama a função que irá precessar o texto transcrito
        detectaTexto();
    };
}

function Criptografar(){
    if(btn_alura == true){
        // Configura a opção de criptografia ativada para o tema alura
        btn_criptografia = true;
        btn_descriptografia = false;

        // Chama a função de criptografia específica para o tema Alura
        criptografia_Alura();
    }

    if(btn_alvorecer == true){
        // Configura a opção de criptografia ativada para o tema Code_Alvorecer
        btn_criptografia = true;
        btn_descriptografia = false;

        // Gera um número aleatório para o deslocamento da cifra
        deslocamento = SortearChaveCifra();

        // Obtém o texto a ser criptografado do campo de entrada
        let crip = input.value;

        // Chama a função de criptografia específica para o tema Code_Alvorecer
        criptografia_Alvorecer(crip, deslocamento);
    }
}

function criptografia_Alura(){
    // Obtém o texto do campo de entrada
    let texto = input.value;

    // Define as substituições para a criptografia no tema Alura
    let substituicoes = {
        a: "ai",
        e: "enter",
        i: "imes",
        o: "ober",
        u: "ufat"
    };

    // Aplica as substituições ai texto utilizando expressão relugar
    let resultado = texto.replace(/(a|e|i|o|u)/gi, function(match){
        let substituicao = substituicoes[match.toLowerCase()];
        return substituicao;
    });

    // Define o resultado da criptografia no campo de saída
    output.value = resultado;
}

function criptografia_Alvorecer(mensagem, chave){
    let mensagemCriptograda = "";

    // Itera sobre cada letra da mensagem
    for(let i = 0; i < mensagem.length; i++){
        let letra = mensagem[i];
        
        // Verifica se a letra é uma letra do alfabeto
        if (letra.match(/[a-zA-Z]/)) {
            let codigo = letra.charCodeAt(0);
            let limite = letra.match(/[a-z]/) ? 97 : 65;

            // Aplica a fórmula de deslocamento para obter o novo código da letra criptografada
            let novoCodigo = ((codigo - limite + chave) % 26) + limite;

            // Converte o novo código para a letra correspondente
            let letraCriptografada = String.fromCharCode(novoCodigo);

            // Adiciona a letra criptografada à mensagem criptografada
            mensagemCriptograda += letraCriptografada;
          } else {
            // Mantém caracteres não alfabéticos
            mensagemCriptograda += letra;
          }
    }

    // Define o resultado da criptografia no campo de saída
    output.value = mensagemCriptograda;
}

function Descriptografar(){
    // Verifica se o tema selecionado é Alura
    if(btn_alura == true){
        btn_criptografia = false;
        btn_descriptografia = true;

        // Chama a função de descriptografia do tema Alura
        descriptografia_Alura();
    }

    // Verifica se o tema selecionado é Code_Alvorecer
    if(btn_alvorecer == true){
        btn_criptografia = false;
        btn_descriptografia = true;

        // Obtém a mensagem criptografada do campo de input
        let descript = input.value;

        // Chama a função de descriptografia do tema Code_Alvorecer,
        // passando a mensagem criptografada e a chave de deslocamento
        descriptografia_Alvorecer(descript, deslocamento);
    }
}

function descriptografia_Alura(){
    let texto = input.value;

    // Mapeia as substituições para a descriptografia
    let substituicoes = {
        ai: "a",
        enter: "e",
        imes: "i",
        ober: "o",
        ufat: "u"
    };

    // Realiza a substituição de cada padrão correspondente na mensagem
    let saida = texto.replace(/(ai|enter|imes|ober|ufat)/gi, function(match){
        let substituicao = substituicoes[match.toLowerCase()];
        return substituicao;
    });

    // Define o valor da área de saída como mensagem descriptografada
    output.value = saida;
}

function descriptografia_Alvorecer(mensagem, chave){
  // Variável ara armazenar a mensagem descriptografa
  let mensagemDescriptografada = "";

  // Percorre cada caractere da mensagem
  for (let i = 0; i < mensagem.length; i++) {
    let letra = mensagem[i];

    // Verifica se a letra é uma letra do alfabeto
    if (letra.match(/[a-zA-Z]/)) {
      let codigo = letra.charCodeAt(0);
      let limite = letra.match(/[a-z]/) ? 97 : 65;

      // Aplica a fórmula de descriptografia da Cifra de César
      let novoCodigo = ((codigo - limite - chave + 26) % 26) + limite;

      // Converte o novo código de volta para a letra descriptografada
      let letraDescriptografada = String.fromCharCode(novoCodigo);

      // Adiciona a letra descriptografada à mensagem final
      mensagemDescriptografada += letraDescriptografada;
    } else {
      // Mantém caracteres não alfabéticos na mensagem descriptografada
      mensagemDescriptografada += letra;
    }
  }

  // Define o valor da área de saída como a mensagem descriptografada
  output.value = mensagemDescriptografada;
}

function SortearChaveCifra(){
    // Gera um número inteiro aleatório entre 0 e 25
    let chave = Math.floor(Math.random() * 26);

    // Retorna o valor sorteado como a chave de deslocamento
    return chave;
}

function updateCSS(cor){
   // Verifica se a cor é 'Code_Alvorecer'
   if(cor == 'Code_Alvorecer'){
    // Atualiza as variáveis de controle dos botões
    btn_alura = false;
    btn_alvorecer = true;

    // Atualiza o estilo do background e dos menus
    background.style.background = "#000";
    menus.forEach(function(menu) {
        menu.style.backgroundColor = '#262626';
    });

    // Atualiza o logo, link da imagem e ícones
    logo.src = './Imagens/Code_Alvorecer.png';
    link_img.href = 'https://www.instagram.com/code_alvorecer/';
    img_hamburguer.src = './Imagens/collapse_White.svg';
    img_aviso.src = './Imagens/Alvorecer_Aviso.svg';

    // Remove as classes de seleção e estilo dos elementos de seleção
    texto_aviso.style.color = '#fff';
    textos.forEach(function(texto) {
        texto.style.color = '#fff';
        texto.classList.remove('placeholder-alura');  
    });

    // Remove as classes de seleção e estilo dos elementos de seleção
    selecao.forEach(function(elemento) {
        elemento.classList.remove('selection-alura');  
        elemento.classList.remove('alura-scrollbar-thumb');
        elemento.classList.remove('alura-scrollbar-thumb-hover');
    });

    // Atualiza o estilo do botão de criptografar
    btn_criptografar.style.background = '#fff';
    btn_criptografar.style.color = '#000';

    // Atualizar o estilo do botão de descriptografar
    btn_descriptografar.style.background = '#000';
    btn_descriptografar.style.color = '#fff';
    btn_descriptografar.style.border = '1px solid #fff';

    // Atualiza o estilo da área de saída
    saida.style.background = '#262626';
    imagem_saida.src = './Imagens/Alvorecer_figura.svg';
    mensagem_saida.style.color = '#fff';
    saida_textos.style.color = '#fff';
    botao_saida.style.color = '#fff';
    botao_saida.style.border = '1px solid #fff';

    // Atualiza o estilo do ícone da Alura
    alura.style.background = "url(./Imagens/Alura_Icon_White.svg),transparent";
    alura.style.backgroundPosition = "center";
    alura.style.backgroundRepeat = "no-repeat";

    // Atualiza o estilo do ícone do Code_Alvorecer
    code_alvorecer.style.background = "url('./Imagens/Alvorecer_Icon_Black.svg'),#fff";
    code_alvorecer.style.backgroundPosition = "center";
    code_alvorecer.style.backgroundRepeat = "no-repeat";
   }

   // Caso contrátio, assume que a cor é 'Alura'
   else{
    // Atualiza as variáveis de controle dos botões
    btn_alura = true;
    btn_alvorecer = false;

    // Atualiza o estilo do background e dos menus
    background.style.background = "#F3F5FC";
    menus.forEach(function(menu) {
        menu.style.backgroundColor = '#fff';
    });

    // Atualiza o logo,link da imagem  e ícones
    logo.src = './Imagens/Alura.png';
    link_img.href = 'https://www.alura.com.br';
    img_hamburguer.src ='./Imagens/collapse_Blue.svg';
    img_aviso.src = './Imagens/Alura_Aviso.svg';

    // Atualiza as cores do texto do aviso e dos elementos de texto
    texto_aviso.style.color = '#495057';
    textos.forEach(function(texto) {
        texto.style.color = '#0A3871';
        texto.classList.add('placeholder-alura');  
    });

    // Adiciona as classes de seleção e estilo aos elementos de seleção
    selecao.forEach(function(elemento) {
        elemento.classList.add('selection-alura');  
        elemento.classList.add('alura-scrollbar-thumb');
        elemento.classList.add('alura-scrollbar-thumb-hover');
    });

    // Atualiza o estilo do botão de criptografar
    btn_criptografar.style.background = '#0A3871';
    btn_criptografar.style.color = '#fff';

    // Atualiza o estilo do botão de descriptografar
    btn_descriptografar.style.background = '#D8DFE8';
    btn_descriptografar.style.color = '#0A3871';
    btn_descriptografar.style.border = '1px solid #0A3871';

    // Atualiza o estilo da área de saída
    saida.style.background = '#fff';
    imagem_saida.src = './Imagens/Alura_figura.svg';
    mensagem_saida.style.color = '#343A40';
    saida_textos.style.color = '#495057';
    botao_saida.style.color = '#0A3871';
    botao_saida.style.border = '1px solid #0A3871';

    // Atualiza o estilo do ícone da Alura
    alura.style.background = "url(./Imagens/Alura_Icon_White.svg), #0A3871";
    alura.style.backgroundPosition = "center";
    alura.style.backgroundRepeat = "no-repeat";

    // Atualiza o estilo do ícone do Code_Alvorecer
    code_alvorecer.style.background = "url('./Imagens/Alvorecer_Icon_Blue.svg'),transparent";
    code_alvorecer.style.backgroundPosition = "center";
    code_alvorecer.style.backgroundRepeat = "no-repeat";
   }
   controleBotao();
}

window.addEventListener("DOMContentLoaded", function(){
    if("webkitSpeechRecognition" in window) {
        // Verifica se o navegaro suporta o Reconhecimento de Fala usando a propriedade "webkitSpeechRecognition"
        reconhecimento = new webkitSpeechRecognition();
        comandoVoz = true;
    } else{
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