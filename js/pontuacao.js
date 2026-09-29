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
        reiniciarCronometro(60);

    } else if (indiceAtual >= 5) {

        nivel = "Intermediário";
        reiniciarCronometro(45);
    } else {

        nivel = "Iniciante";
        reiniciarCronometro(30000);
    }

    document.getElementById("nivel").innerText = nivel;
}