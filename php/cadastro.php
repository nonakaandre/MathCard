<?php 
require_once("conexao.php");
$nome = htmlspecialchars($_POST["nome"]);
$email = filter_var($_POST["email"], FILTER_VALIDATE_EMAIL);
$password = password_hash($_POST["password"], PASSWORD_DEFAULT);

$sql = " INSERT INTO usuarios (nome, email, senha) " . "VALUES (?, ?, ?)";
 
    $comando = $pdo->prepare($sql);
    $comando->bindValue(1, $nome);
    $comando->bindValue(2, $email);
    $comando->bindValue(3, $password); 
        

    try {
    $sucesso = $comando->execute();
    header("Location: boasvindas.php");
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo "Esse nome ou e-mail já está em uso";
    } else {
        echo "Erro ao cadastrar, tente novamente";
    }
}
?>