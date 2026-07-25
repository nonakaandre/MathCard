<?php 
    require_once 'php/montar_perguntas.php';
    session_start();
    
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/style1.css">
    <title>MathCard</title>
</head>

<body>
    <header class="jogo">
        <h1>MathCard</h1>
        <p>Jogador:
            <?php echo $_SESSION['nome'] ?? 'Visitante'; ?>
        </p>
    </header>
    <div class="principal">
        <div class="top">
            <div class="questao">
                <h3 id="tituloQuestao" class="TituloQuest">Questão 1:</h3>
                <p id="pergunta" class="pergunta"></p>
                <p id="DicaPergunta" class="dica" style="color: gray;"></p>
                <div id="alternativas"></div>
            </div>
            <div class="tabela">
                <span>Pontos: <span id="score">0</span></span>
                <span>Tempo: <span id="tempo">30</span></span>
                <span>Nível: <span id="nivel">Iniciante</span></span>
            </div>
        </div>
         <div class="resposta">
            <form id="formResposta">
                <input type="number" id="respostaInput" placeholder="Resposta" step="0.1" select>
                <input type="submit" value="Enviar"  id="btnEnviar">
            </form>
        </div> 
        <div id= "mensagemResposta">
            <p></p>
        </div>
        <div class="cartas">
            <div class="carta" id="btnDica" onclick="usarDica()">
                Dica
            </div>
            <div class="carta" id="btnMult" onclick="usarMult()">
                MultiEscolha
            </div>
            <div class="carta" id="btnSkip" onclick="usarPular()">
                Pular
            </div>
        </div>
        <div id="dica"></div>
        <div id="Escolhas" style="display: none; margin-top:10px;">
            <input type="number">
        </div>
    </div>
    <button id="btnMute">🔊</button>
    <script src="js/audio.js"></script>
    <script>
        const questoes = <?php echo json_encode($todasPerguntas); ?>;
    </script>
    <script src="js/mensagens.js"></script>
    <script src="js/pontuacao.js"></script>
    <script src="js/cronometro.js"></script>
    <script src="js/perguntas.js"></script>
    <script src="js/cartas.js"></script>
    <script src="js/main.js"></script>
</body>

</html>