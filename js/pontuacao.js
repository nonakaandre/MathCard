let pontuacao = 0;
let nivel = "Iniciante";
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