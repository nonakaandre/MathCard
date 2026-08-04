<?php
$erro = isset($_GET['erro']);
?>

<!DOCTYPE html>
<html lang="pt-br" data-bs-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <link rel="stylesheet" href="./css/boot.css">
    <title>Iniciar Sessão</title>
</head>

<body class="d-flex align-items-center py4 bg-body-tertiary">
    <main class="w-100 m-auto form-container">
        <div class="row mt-3">
            <div class="col" style="width: 100%; max-width: 400px; margin: 0 auto;">
                <?php if ($erro): ?>
                <div id="msgErro" class="alert alert-danger">
                    Email ou senha inválidos.
                </div>
                <?php endif; ?>          
                <form action="php/validar.php" method="post">
                    <label class="form-label" for="email">Email</label>
                    <input type="email" name="email" id="email" class="form-control">
                    <label class="form=label" for="senha">Senha</label>
                    <input type="password" name="senha" id="senha" class="form-control">
                    <div class="row mb-4">
                        <div class="col dflex justify-content-center">
                            <div class="form-check">
                                <input class="form=check-input" type="checkbox" name="lembre" id="lembre" value=""
                                    checked>
                                <label class="form-check-label" for="lembre">Lembre-me</label>
                            </div>
                        </div>
                        <div class="col">
                            <a href="#">Esqueci minha senha</a>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn lock w-100 m-2">Entrar</button>
                    <div class="text-center">
                        <p>Não está inscrito? <a href="cadastro.html">Faça sua inscrição</a></p>
                    </div>
                </form>

            </div>

        </div>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
        crossorigin="anonymous"></script>
</body>

</html>