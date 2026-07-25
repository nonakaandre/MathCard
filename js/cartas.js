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