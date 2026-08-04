<?php 
session_start();
require_once("conexao.php");
$dadosBrutos = file_get_contents('php://input');

$dados = json_decode($dadosBrutos, true);

$pontuacao = $dados['pontuacao'];


if (!isset($_SESSION["id"])) {
    header("Location: index.php");
    exit();
    }
    
$usuario_id = $_SESSION["id"];

$sql = " INSERT INTO pontuacoes (usuario_id, pontuacao)  VALUES (?, ?)";

$comando = $pdo->prepare($sql);
$comando->bindValue(1, $usuario_id);
$comando->bindValue(2, $pontuacao);
$comando->execute();
?>