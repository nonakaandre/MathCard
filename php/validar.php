<?php
session_start();
require_once("conexao.php");

$email = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL);
$senha = $_POST["senha"];

$sql = "SELECT id, nome, senha
        FROM usuarios
        WHERE email = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$email]);

$usuario = $stmt->fetch(PDO::FETCH_ASSOC);


// Faz a comparação entre a senha digitada e a do banco.
if ($usuario && password_verify($senha, $usuario["senha"])) {

    $_SESSION["id"] = $usuario["id"];
    $_SESSION["nome"] = $usuario["nome"];

    header("Location: boasvindas.php");
    exit();

} else {

    header("Location: ../index.php?erro=1");
    exit();
}
?>