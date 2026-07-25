<?php 
session_start();
$_SESSION['nome'] = ($_POST['nome']) ; 
?>
<!DOCTYPE html>
<html lang="pt-br" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <title>Iniciar Sessão</title>
    <link rel="stylesheet" href="../css/boot.css">
</head>

<body class="d-flex justify-content-center align-items-center bg-body-tertiary col-12">
    <main class="form-container">
        <div class="card p-3 bg-info bg-opacity-10 border border-info border-start-0 rounded-end"
            style="width: 40rem; ">
            <div class="card-body text-center">
                <h1 class="card-title">Bem-vindo ao MathCard
                    <?php echo $_SESSION['nome']; ?>
                </h1>

                <p class="card-text">
                    Entre em uma batalha matemática cheia de desafios,
                    estratégia e raciocínio rápido. Acha que domina
                    os números? Prove isso — mas cuidado, este jogo
                    pode te deixar de cabelos brancos!
                </p>

                <a href="../jogo.php" class="btn btn-primary">
                    Clique aqui quando estiver pronto para o desafio!
                </a>
            </div>
        </div>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous" src="script.js">
        
    </script>
</body>

</html>