// MOSTRA A MENSAGEM NA TELA AO INVÉS DE UM ALERT

function mostrarMensagem(texto, callback, estilo) {
    document.getElementById("mensagemResposta").classList.add(estilo);
    document.getElementById("mensagemResposta").innerHTML = texto;

    document.getElementById("mensagemResposta").style.display = "block";

    setTimeout(() => {
        document.getElementById("mensagemResposta").style.display = "none";
        callback();
        document.getElementById("mensagemResposta").classList.remove(estilo);
    }, 2000);
}

