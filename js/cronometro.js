const tempoE1 = document.getElementById("tempo");


let tempo = 30000;
let cronometro = null;
let totalTempo = tempo;


function atualizarTempo() {
    tempoE1.textContent = tempo;
}

function addTempo() {
    tempo += 20;
    atualizarTempo();
    atualizarBarraTempo();
}

function atualizarBarraTempo() {
    const porcentagem = (tempo / totalTempo) * 100;
    const barra = document.getElementById("barraTempo");

    barra.style.width = `${porcentagem}%`;

    if (porcentagem > 50) {
        document.getElementById('barraTempo').style.backgroundColor = '#22c55e';
    } else if (porcentagem > 20) {
        document.getElementById('barraTempo').style.backgroundColor = '#d4c111';
    } else {
        document.getElementById('barraTempo').style.backgroundColor = '#c52222';
    }
}

function iniciarCronometro() {
    cronometro = setInterval(() => {
        tempo--;

        atualizarBarraTempo();
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
    totalTempo = tempo
    atualizarTempo();
    iniciarCronometro();
}

function tempoEsgotado() {
    alert("Tempo esgotado!");
}

atualizarTempo();
iniciarCronometro();