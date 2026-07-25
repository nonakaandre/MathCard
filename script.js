//Tempo

const tempoE1 = document.getElementById("tempo");


let tempo = 30000;
let cronometro = null;
let nivel = "Iniciante";

function atualizarTempo() {
    tempoE1.textContent = tempo;
}

function iniciarCronometro() {
    cronometro = setInterval(() => {
        tempo--;

        atualizarTempo();

        if (tempo <= 0) {
            tempo = 0;
            atualizarTempo();
            clearInterval(cronometro);
            tempoEsgotado();
        }
    }, 1000);

}


function reiniciarCronometro(novoTempo = 30) {
    clearInterval(cronometro);
    tempo = novoTempo;
    atualizarTempo();
    iniciarCronometro();
}

function tempoEsgotado() {
    alert("Tempo esgotado!");
}

atualizarTempo();
iniciarCronometro();


//Perguntas



let indiceAtual = 0;

const titulo = document.getElementById("tituloQuestao");
const texto = document.getElementById("pergunta");
const inputResposta = document.getElementById("respostaInput");

function mostrarQuestao() {

    atualizarNivel();

    if (indiceAtual < questoes.length) {

        document.getElementById("DicaPergunta").innerText = "";

        titulo.innerText = `Questão ${indiceAtual + 1}`;
        texto.innerText = questoes[indiceAtual].pergunta;

    } else {
        titulo.innerText = "Fim do Quiz";
        texto.innerText = "Você respondeu todas as questões.";

        document.querySelector(".resposta").style.display = "none";
    }

}

// Verifica a resposta com clique no "ENTER".

// "function" aqui é uma função de callback
// "event.preventDefault()" é um método que diz ao navegador: "não execute esse comportamento padrão dessa vez".
/* Resumo do fluxo completo, na ordem real de execução
1. Jogador digita um número no campo e aperta Enter
2. O navegador detecta que isso deveria disparar um "submit" no form
3. Como existe um listener registrado pra esse evento, a função é chamada, recebendo o objeto event
4. event.preventDefault() roda primeiro, cancelando o recarregamento de página que aconteceria por padrão
5. verificarResposta() roda em seguida, processando a resposta normalmente — exatamente como se o botão "Enviar" tivesse sido clicado*/

document.getElementById("formResposta").addEventListener("submit", function (event) {
    event.preventDefault();
    verificarResposta();
}

);


//Função para verificar se a resposta está correta

function verificarResposta() {

    const respostaUsuario = Number(inputResposta.value);

    const respostaCorreta = Number(questoes[indiceAtual].resposta);

    if (respostaUsuario === respostaCorreta) {

        audioManager.playSfx('assets/audio/correct.mp3');
        let pontosGanhos = pontuacao_dica ? 50 : 100;

        pontuacao += pontosGanhos;


        atualizarPontuacao();

        mostrarMensagem(`Resposta Correta! + ${pontosGanhos} pontos`, () => {
            if (pontuacao_dica == true) {
                document.getElementById("btnDica").classList.add("usada");
                document.getElementById("btnDica").innerHTML = "";
            }
            // as 4 linhas que precisam esperar a mensagem sumir
            indiceAtual++;
            inputResposta.value = "";
            pontuacao_dica = false;
            mostrarQuestao();
        }, "sucesso");


    } else {

        audioManager.playSfx('assets/audio/failure.mp3');

        mostrarMensagem(`Resposta incorreta! A resposta correta é: ${respostaCorreta}`, () => {
            if (pontuacao_dica == true) {
                document.getElementById("btnDica").classList.add("usada");
                document.getElementById("btnDica").innerHTML = "";
            }
            // as 4 linhas que precisam esperar a mensagem sumir
            indiceAtual++;
            inputResposta.value = "";
            pontuacao_dica = false;
            mostrarQuestao();
        }, "erro");


    }


}

mostrarQuestao();

// MOSTRA A MENSAGEM NA TELA AO INVÉS DE UM ALERT
function mostrarMensagem(texto, callback, estilo, usadaCard) {
    document.getElementById("mensagemResposta").classList.add(estilo);
    document.getElementById("mensagemResposta").innerHTML = texto;

    document.getElementById("mensagemResposta").style.display = "block";

    setTimeout(() => {
        document.getElementById("mensagemResposta").style.display = "none";
        callback();
        document.getElementById("mensagemResposta").classList.remove(estilo);
    }, 2000);


}

let cartaDicaUsada = false;
let cartaMultUsada = false;
let cartaPularUsada = false;

function usarDica() {
    if (cartaDicaUsada) {
        alert("Você já usou esta carta!");
        return;
    }

    cartaDicaUsada = true;

    pontuacao_dica = true;

    // document.getElementById("DicaPergunta").innerText = questoes[indiceAtual].dica;

    document.getElementById("btnDica").innerHTML = questoes[indiceAtual].dica;

}

function usarPular() {

    if (cartaPularUsada) {
        alert("Você já usou esta carta!");
        return;
    }

    audioManager.playSfx('assets/audio/fast.mp3');
    cartaPularUsada = true;

    indiceAtual++;

    document.getElementById("DicaPergunta").innerText = "";

    mostrarQuestao();

    document.getElementById("btnSkip").classList.add("usada");

}

function usarMult() {

    if (cartaMultUsada) {
        alert("Você já usou esta carta!");
        return;
    }

    cartaMultUsada = true;

    const alternativas = questoes[indiceAtual].alternativas;

    const div = document.getElementById("alternativas");

    div.innerHTML = "";

    for (let i = 0; i < alternativas.length; i++) {
        const botao = document.createElement("button");

        botao.innerText = alternativas[i];

        botao.onclick = function () {
            verificarRespostaMultipla(alternativas[i]);
        };

        div.appendChild(botao);
    }

    document.getElementById("btnMult").innerHTML = "Escolha uma alternativa";
}

function verificarRespostaMultipla(respostaEscolhida) {

    const respostaCorreta = Number(questoes[indiceAtual].resposta);

    if (respostaEscolhida === respostaCorreta) {

        audioManager.playSfx('assets/audio/correct.mp3');
        pontuacao += 50;


        atualizarPontuacao();

        mostrarMensagem(`Resposta Correta! + 50 pontos`, () => {
            if (cartaMultUsada == true) {
                document.getElementById("btnMult").classList.add("usada");
                document.getElementById("btnMult").innerHTML = "";
            }
            indiceAtual++;
            document.getElementById("alternativas").innerHTML = "";
            mostrarQuestao();
        }, "sucesso");

        // alert("Correto!");
    } else {

        audioManager.playSfx('assets/audio/failure.mp3');
        mostrarMensagem(`Resposta incorreta! A resposta correta é: ${respostaCorreta}`, () => {
            if (cartaMultUsada == true) {
                document.getElementById("btnMult").classList.add("usada");
                document.getElementById("btnMult").innerHTML = "";
            }
            indiceAtual++;
            document.getElementById("alternativas").innerHTML = "";
            mostrarQuestao();
        }, "erro");

        // alert("Errado!");
    }
}

//Pontuação

let pontuacao = 0;

let pontuacao_dica = false;

function atualizarPontuacao() {
    document.getElementById("score").innerText =
        `${pontuacao}`;
}


function atualizarNivel() {

    if (indiceAtual >= 10) {

        nivel = "Avançado";

    } else if (indiceAtual >= 5) {

        nivel = "Intermediário";

    } else {

        nivel = "Iniciante";

    }

    document.getElementById("nivel").innerText = nivel;
}


const audioManager = new AudioManager();
document.addEventListener('click', function desbloquearAudio() {
    audioManager.play();
    document.removeEventListener('click', desbloquearAudio);
});

document.getElementById('btnMute').textContent = audioManager.muted ? '🔇' : '🔊';

document.getElementById('btnMute').addEventListener('click', function () {
    audioManager.toggleMute();
    this.textContent = audioManager.muted ? '🔇' : '🔊';
});
