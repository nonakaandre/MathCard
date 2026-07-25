<?php 
require_once 'conexao.php';
require_once 'funcoes_perguntas.php';

$perguntasFund = buscaPerguntasPorNivel($pdo, 'fundamental');
$perguntasMed = buscaPerguntasPorNivel($pdo, 'medio');
$perguntasSup = buscaPerguntasPorNivel($pdo, 'superior');
$todasPerguntas = array_merge($perguntasFund, $perguntasMed, $perguntasSup);

?>