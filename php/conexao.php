<?php 
 $tipo_banco = "mysql";
 $servidor = "localhost";
 $porta = "3306";
 $banco = "mathcard";
 $usuario = "mathcard_user";
 $senha = "uma_senha_aqui";

 $dsn = "$tipo_banco:host=$servidor;port=$porta;dbname=$banco";

try {
    $pdo = new PDO($dsn, $usuario, $senha);
} catch (PDOException $e) {
    echo "Erro ao conectar ao banco de dados:" . $e->getMessage();
    exit();
}
?>

<!-- $dsn = Data Source Name -->