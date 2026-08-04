<?php
function buscarRanking($pdo, $limite) {
    $sql = "SELECT usuarios.nome, pontuacoes.pontuacao
            FROM pontuacoes
            JOIN usuarios ON pontuacoes.usuario_id = usuarios.id
            ORDER BY pontuacoes.pontuacao DESC
            LIMIT :limite";

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':limite', $limite, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}