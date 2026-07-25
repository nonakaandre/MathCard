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