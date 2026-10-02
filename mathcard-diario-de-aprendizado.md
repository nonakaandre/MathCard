# MathCard — Diário de Aprendizado

Documento vivo com tudo que foi construído no projeto MathCard, organizado por tema, com as dúvidas que surgiram no caminho e as explicações dadas. Serve como material de consulta rápida.

## Índice

1. [Música de fundo (AudioManager)](#1-música-de-fundo-audiomanager)
2. [Efeitos sonoros (playSfx)](#2-efeitos-sonoros-playsfx)
3. [Mensagens não bloqueantes (substituindo alert)](#3-mensagens-não-bloqueantes-substituindo-alert)
4. [Cartas de bônus e estado "usada"](#4-cartas-de-bônus-e-estado-usada)
5. [Formulário com Enter (event.preventDefault)](#5-formulário-com-enter-eventpreventdefault)
6. [Banco de dados — perguntas](#6-banco-de-dados--perguntas)
7. [Cronômetro visual, duplo-clique e carta Tempo Extra](#7-cronômetro-visual-duplo-clique-e-carta-tempo-extra)
8. [Usuários, login e comunicação JS ↔ PHP](#8-usuários-login-e-comunicação-js--php)
9. [Glossário rápido](#9-glossário-rápido)

---

## 1. Música de fundo (AudioManager)

**Arquivo:** `audio.js`

### O que foi construído
Uma classe `AudioManager` que encapsula toda a lógica de tocar música de fundo, contornando o bloqueio de autoplay dos navegadores.

```javascript
class AudioManager {
    constructor() {
        this.music = new Audio('assets/audio/musica002.mp3');
        this.music.loop = true;
        this.music.volume = 0.4;
        this.muted = localStorage.getItem('muted') === 'true';
        this.music.muted = this.muted;
    }

    play() {
        this.music.play().then(() => {
            console.log('Música de fundo iniciada');
        }).catch((error) => {
            console.error('Erro ao iniciar a música de fundo:', error);
        });
    }

    toggleMute() {
        this.muted = !this.muted;
        this.music.muted = this.muted;
        localStorage.setItem('muted', this.muted);
    }

    playSfx(source) {
        const som = new Audio(source);
        som.play().then(() => {
            console.log('Efeito sonoro iniciado');
        }).catch((error) => {
            console.error('Erro ao iniciar o efeito sonoro:', error);
        });
    }
}
```

### Dúvidas resolvidas

**"Por que a música não toca sozinha ao carregar a página?"**
Navegadores bloqueiam autoplay com som até haver uma interação real do usuário (clique, toque, tecla). Isso é política do navegador, não bug do código.

**Solução aplicada:** um listener de clique no `document`, que se **auto-remove** depois da primeira execução:
```javascript
const audioManager = new AudioManager();
document.addEventListener('click', function desbloquearAudio() {
    audioManager.play();
    document.removeEventListener('click', desbloquearAudio);
});
```
`removeEventListener` precisa da **mesma referência de função** usada no `addEventListener` — por isso a função precisa ter nome (não pode ser anônima) quando planeja remover a si mesma depois.

**"Por que `boasvindas.php` não pode simplesmente tocar a música e continuar em `jogo.php`?"**
Porque cada navegação de página (`<a href="...">`) descarta toda a memória JavaScript da página anterior — incluindo qualquer objeto `Audio` em execução. A interação precisa acontecer **na mesma página** onde o áudio vai tocar.

**"O que é `localStorage.getItem('muted') === 'true'`?"**
`localStorage` só guarda **strings**, nunca booleanos de verdade. Se nunca foi salvo nada, `getItem` retorna `null`, e `null === 'true'` é `false` — ou seja, na primeira visita o som começa ligado por padrão.

---

## 2. Efeitos sonoros (playSfx)

### Por que uma nova instância de `Audio` a cada chamada?
Se dois efeitos precisarem tocar sobrepostos (ex: jogador responde rápido demais), reutilizar um único objeto `Audio` faria o segundo som **cortar** o primeiro. Criar uma instância nova a cada chamada de `playSfx(source)` permite sons simultâneos, cada um com seu próprio objeto independente.

### Uso no jogo
```javascript
audioManager.playSfx('assets/audio/correct.mp3'); // ao acertar
audioManager.playSfx('assets/audio/failure.mp3'); // ao errar
```

---

## 3. Mensagens não bloqueantes (substituindo alert)

### O problema original
`alert()` **pausa toda a execução do JavaScript**, inclusive a reprodução de áudio — por isso o efeito sonoro só era percebido depois de fechar o alerta.

### A solução: `mostrarMensagem` com callback

```javascript
function mostrarMensagem(texto, callback, estilo) {
    document.getElementById("mensagemResposta").classList.add(estilo);
    document.getElementById("mensagemResposta").innerHTML = texto;
    document.getElementById("mensagemResposta").style.display = "block";

    setTimeout(() => {
        document.getElementById("mensagemResposta").style.display = "none";
        callback();
        document.getElementById("mensagemResposta").classList.remove(estilo);
    }, 3000);
}
```

Uso:
```javascript
mostrarMensagem(`Resposta Correta! + ${pontosGanhos} pontos`, () => {
    indiceAtual++;
    inputResposta.value = "";
    pontuacao_dica = false;
    mostrarQuestao();
}, "sucesso");
```

### Dúvidas resolvidas

**"O que é um callback?"**
Uma função passada como argumento para outra função, para ser executada depois que algo terminar. Aqui, o callback só roda **depois** que o `setTimeout` esconder a mensagem — resolvendo o problema de sincronismo (a próxima pergunta só aparece depois que a mensagem some).

**"Por que `setTimeout` e não `alert`?"**
`setTimeout` **não bloqueia** o resto do código — ele só agenda uma ação para o futuro e o JavaScript continua rodando enquanto espera.

**"Por que a cor da mensagem não mudava mesmo com a classe CSS aplicada?"**
Especificidade CSS: uma regra usando **ID** (`#mensagemResposta { color: ... }`) tem prioridade maior que uma regra usando **classe** (`.sucesso { color: ... }`), mesmo que a classe seja aplicada depois via JS. Solução: remover a definição de `color` do seletor de ID, deixando as classes livres para controlar a cor.

---

## 4. Cartas de bônus e estado "usada"

### Arquitetura: dado separado de visual
- **Estado (fonte da verdade):** variáveis booleanas (`cartaDicaUsada`, `cartaMultUsada`, `cartaPularUsada`), decidindo se a carta pode ser usada.
- **Visual (reflexo do estado):** classe CSS `.usada`, aplicada via `classList.add()` **depois** que a jogada é confirmada (não no clique inicial).

### Dúvida importante: quando aplicar o selo "usada"?
O selo só deve aparecer **depois** que o jogador responde a pergunta (não no momento do clique na carta), porque no clique a carta ainda está mostrando seu efeito (dica ou alternativas) — aplicar o selo cedo demais sobrepõe essa informação. Por isso, `classList.add("usada")` foi movido para **dentro do callback** de `mostrarMensagem`, sincronizado com a troca de pergunta.

### Decisão de design: uso único por partida
As cartas de bônus (Dica, MultiEscolha) são de uso único por partida inteira — por isso as variáveis de controle (`cartaDicaUsada`, `cartaMultUsada`) **não são resetadas** depois de usadas. (Observação: "Pular" é candidata a virar reutilizável no futuro — decisão em aberto.)

> **Pendência registrada:** André decidiu usar **duplo-clique como confirmação** antes de gastar uma carta de bônus — ainda a ser implementado.

---

## 5. Formulário com Enter (event.preventDefault)

### O problema
Um `<form>` com um único campo de input dispara **submissão implícita** ao apertar Enter — mesmo sem um botão `type="submit"`. Sem `action` definido, isso recarrega a própria página, apagando o texto digitado.

### A solução
```javascript
document.getElementById("formResposta").addEventListener("submit", function (event) {
    event.preventDefault();
    verificarResposta();
});
```

- `event.preventDefault()` cancela o comportamento padrão do evento (o reload), sem impedir que a função de verificação rode.
- Isso também é a base correta para quando o formulário se comunicar com o banco de dados no futuro — comunicação via `fetch()` também depende de `preventDefault()` para não recarregar a página.

### Bug relacionado: dupla execução
Ter **ao mesmo tempo** `onclick="verificarResposta()"` no botão **e** o listener de `submit` no formulário causava disparo duplo (pulando perguntas, resposta certa "dando erro"). Solução: manter só o listener de `submit` (que já cobre clique no botão de submit **e** Enter).

---

## 6. Banco de dados — perguntas

### Estrutura da tabela
```sql
CREATE TABLE perguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nivel ENUM('fundamental', 'medio', 'superior') NOT NULL,
    pergunta TEXT NOT NULL,
    resposta DECIMAL(10,2) NOT NULL,
    dica TEXT,
    alternativas JSON NOT NULL
);
```

### Decisão: JSON vs tabela separada para alternativas
Como as alternativas são um array pequeno e fixo, só usado para **exibir** (nunca consultado individualmente), uma coluna JSON é suficiente — evita `JOIN`s desnecessários. Uma tabela separada só valeria a pena se um dia fosse necessário fazer analytics sobre alternativas individuais.

### Arquivos criados
- `conexao.php` — conexão PDO com o banco (única responsabilidade: abrir conexão)
- `funcoes_perguntas.php` — define `buscaPerguntasPorNivel($pdo, $nivel)`, reutilizável
- `montar_pergunta.php` — usa a função 3x (fundamental, médio, superior) e junta tudo com `array_merge`

```php
function buscaPerguntasPorNivel($pdo, $nivel) {
    $stmt = $pdo->prepare("SELECT * FROM perguntas WHERE nivel = :nivel ORDER BY RAND() LIMIT 5");
    $stmt->execute(['nivel' => $nivel]);
    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($resultado as $indice => $questao) {
        $alternativasDecodificadas = json_decode($questao["alternativas"], true);
        $resultado[$indice]["alternativas"] = $alternativasDecodificadas;
    }

    return $resultado;
}
```

```php
$perguntasFund = buscaPerguntasPorNivel($pdo, 'fundamental');
$perguntasMed = buscaPerguntasPorNivel($pdo, 'medio');
$perguntasSup = buscaPerguntasPorNivel($pdo, 'superior');
$todasPerguntas = array_merge($perguntasFund, $perguntasMed, $perguntasSup);
```

### Ponte PHP → JavaScript
```html
<script>
    const questoes = <?php echo json_encode($todasPerguntas); ?>;
</script>
<script src="script.js"></script>
```

### Dúvidas resolvidas

**"O que é JSON e por que a coluna `alternativas` chegava como texto no PHP?"**
JSON é texto formatado de um jeito específico para representar listas/objetos (ex: `"[10, 12, 30, 46]"`). O MySQL guarda e devolve isso como **string**, não como array de verdade — por isso era necessário `json_decode($string, true)` para converter de volta para um array PHP utilizável.

**"Por que `$questao["alternativas"] = ...` dentro do `foreach` não funcionava?"**
Por padrão, `foreach ($resultado as $indice => $questao)` entrega uma **cópia** de cada item, não uma referência ao original. Mudar `$questao` não afeta `$resultado`. Solução: escrever de volta usando o índice — `$resultado[$indice]["alternativas"] = $alternativasDecodificadas;` — que acessa e modifica o array original de verdade.

**`json_encode` vs `json_decode`:** `decode` converte texto JSON → estrutura de dados (PHP ou JS). `encode` faz o caminho inverso: estrutura de dados → texto JSON. Usado aqui para entregar o array PHP `$todasPerguntas` como uma variável JavaScript utilizável.

**"Por que separar `conexao.php`, `funcoes_perguntas.php` e `montar_pergunta.php`?"**
Cada arquivo tem uma responsabilidade única: conexão, definição de lógica reutilizável, e uso/montagem dos dados finais. Isso evita duplicação e facilita reaproveitar a função de busca em outros contextos no futuro (ex: um painel administrativo).

**"Por que resposta certa estava dando erro depois da integração com o banco?"**
O valor de `resposta` no banco (`DECIMAL`) chegava ao JavaScript como possível string, enquanto `respostaUsuario` era convertido com `Number(...)`. A comparação `===` (estrita) falhava por diferença de tipo. Solução robusta: converter `respostaCorreta` também com `Number(...)`, ao invés de trocar `===` por `==` (que mascararia o problema e traria riscos de comparações inesperadas no futuro).

---

## 7. Cronômetro visual, duplo-clique e carta Tempo Extra

### Cronômetro escalando por nível
`atualizarNivel()` já sabia decidir a faixa de nível pelo `indiceAtual` — foi reaproveitada para também chamar `reiniciarCronometro(60/45/30)`, evitando duplicar a lógica de "qual faixa é essa".

### Barra de progresso visual
Uma variável extra, `totalTempo`, guarda o tempo cheio da pergunta atual (definida dentro de `reiniciarCronometro`). A cada segundo, a porcentagem `(tempo / totalTempo) * 100` decide a largura da barra e a cor (verde > 50%, amarelo 20–50%, vermelho < 20%).

**Dúvida resolvida — "por que a barra ficava 'dura', mesmo com `transition`?"**
A curva `ease` desacelera no fim de cada transição — como a barra atualiza a cada 1 segundo (uma transição atrás da outra), cada desaceleração criava uma sensação de soluço. Trocar para `transition-timing-function: linear` resolveu, porque o ritmo constante da curva combina com o ritmo constante do `setInterval`.

### Duplo-clique de confirmação nas cartas
Um objeto único (`cartasArmadas = { dica: false, mult: false, pular: false }`) guarda se cada carta está "armada" (esperando o segundo clique). Uma função genérica, `confirmarUsoCarta(nomeCarta, funcaoOriginal)`, decide: primeiro clique arma (com `setTimeout` de segurança que desarma sozinho após alguns segundos); segundo clique dentro do prazo confirma e executa a ação real.

**Dúvida resolvida — "como ligar o nome da carta ('dica') ao id do HTML ('btnDica')?"**
Um objeto de mapeamento (`idsCartas`) traduz a string da carta para o id do elemento, permitindo aplicar/remover a classe visual `.armada` no elemento certo.

**`@keyframes` (feedback visual de "armada")**
Diferente de `transition` (anima só de um estado a outro), `@keyframes` descreve múltiplos estágios ao longo de um ciclo (ex: `0%`, `50%`, `100%`), repetido via `animation: nome duração timing infinite;`. Pontos iguais podem ser agrupados com vírgula (`0%, 100% { ... }`), e o navegador interpola suavemente entre os estágios definidos.

### Carta "Tempo Extra"
Soma tempo ao cronômetro já em execução (`tempo += 20`), sem reiniciar. Segue o mesmo padrão de uso único das outras cartas. A função `addTempo()` foi colocada em `cronometro.js` (fora do `setInterval`, já que deve rodar uma única vez, sob demanda) e chama `atualizarTempo()`/`atualizarBarraTempo()` manualmente para refletir a mudança imediatamente na tela.

---

## 8. Usuários, login e comunicação JS ↔ PHP

### Schema
```sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pontuacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    pontuacao INT NOT NULL,
    jogado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```
**Decisão:** guardar o histórico completo de partidas (não só o "top 10"), porque o ranking vira apenas uma consulta (`ORDER BY pontuacao DESC LIMIT 10`), sem lógica extra de apagar/substituir linhas.

### Senhas com hash
Senha nunca é salva em texto puro. `password_hash($senha, PASSWORD_DEFAULT)` gera um hash irreversível (por isso a coluna precisa de `VARCHAR(255)`). No login, `password_verify($senhaDigitada, $hashSalvo)` compara com segurança, sem nunca "desfazer" o hash.

### Duplicidade tratada via PDOException
Como `nome` e `email` são `UNIQUE`, uma tentativa de cadastro duplicado lança uma `PDOException` com código `23000`. Tratado com `try/catch`, verificando `$e->getCode() == 23000` para dar uma mensagem amigável, ao invés de expor o erro técnico do banco.

### Sessão como "prova" de login
```php
$_SESSION["id"] = $usuario["id"];
$_SESSION["nome"] = $usuario["nome"];
```
Páginas protegidas (ex: `boasvindas.php`) verificam `isset($_SESSION["id"])` — se não existir, redirecionam de volta ao login.

### Comunicação JS → PHP sem reload: `fetch()`
Até aqui, os dados só tinham fluído PHP → JS (perguntas entregues via `json_encode` num `<script>` inline, uma vez, no carregamento da página). Para **salvar a pontuação** ao fim de uma partida sem recarregar o jogo, é necessário o caminho inverso.

`fetch()` é a ferramenta: faz uma requisição HTTP "por trás dos panos", sem reload — o mesmo papel de um `<form>`, só que disparado via JavaScript e sem navegar para outra página.

```javascript
fetch('salvar_pontuacao.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pontuacao: pontuacao })
});
```

**A dupla de funções, nas duas pontas:**
- `JSON.stringify(...)` (JS) — transforma um objeto/valor em texto JSON, pronto para envio (irmã de `JSON.parse`, equivalente do `json_encode` do PHP)
- `json_decode(...)` (PHP) — recebe esse texto e reconstrói a estrutura de dados no servidor

### `salvar_pontuacao.php` — recebendo o lado do servidor

Dados enviados via `fetch()` com JSON **não** chegam em `$_POST` (isso só funciona para formulários tradicionais). É necessário ler o corpo bruto da requisição:

```php
$dadosBrutos = file_get_contents('php://input');
$dados = json_decode($dadosBrutos, true);
$pontuacao = $dados['pontuacao'];
```

`php://input` é um canal especial que representa o corpo da requisição recebida, seja lá o que tiver sido enviado.

**Ordem importa:** primeiro verificar `isset($_SESSION["id"])` (usuário está logado?), só então ler o valor — evita trabalhar com um dado que talvez nem exista.

```javascript
// no fim do quiz (mostrarQuestao)
fetch('php/salvar_pontuacao.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pontuacao: pontuacao })
});
```

**Bug identificado e corrigido:** o cronômetro continuava rodando mesmo depois do fim do quiz — faltava `clearInterval(cronometro)` dentro do bloco de "fim de jogo" em `mostrarQuestao()`, já que nada além de `reiniciarCronometro()`/`tempoEsgotado()` mandava ele parar.

> **Pendências registradas para as próximas etapas:** delay/bloqueio entre perguntas (evitar duplo Enter acidental confirmando a pergunta seguinte); aumentar o número de perguntas no banco; transformar `boasvindas.php` em tela de seleção de nível (fundamental/médio/superior/misto); colocar o MathCard online (deploy).

---

## 9. Glossário rápido

| Termo | Definição curta |
|---|---|
| **Callback** | Função passada como argumento, executada depois que outra ação terminar |
| **Promise** | Objeto que representa uma operação assíncrona (pode ter sucesso ou falhar) |
| **`.then()` / `.catch()`** | Tratam sucesso/falha de uma Promise |
| **`event.preventDefault()`** | Cancela o comportamento padrão de um evento (ex: recarregar página) |
| **`classList.add/remove`** | Adiciona/remove uma classe CSS de um elemento via JS |
| **PDO** | Camada do PHP para conectar a bancos de dados com segurança (prepared statements) |
| **Prepared statement** | Query SQL com placeholders (`:nome`), protege contra SQL injection |
| **`json_encode` / `json_decode`** | Convertem entre estrutura de dados e texto JSON |
| **`array_merge`** | Junta múltiplos arrays PHP em um só, preservando a ordem |
| **Especificidade CSS** | Regra que define qual seletor "vence" quando há conflito (ID > classe) |
| **`@keyframes`** | Define estágios de uma animação ao longo de um ciclo (diferente de `transition`, que só anima de um estado a outro) |
| **Closure** | Uma função interna "lembra" das variáveis do escopo onde foi criada (ex: `setTimeout` dentro de outra função ainda acessa os parâmetros dela) |
| **`password_hash` / `password_verify`** | Geram e conferem hash seguro de senha, sem nunca salvar em texto puro |
| **`fetch()`** | Faz requisições HTTP via JavaScript sem recarregar a página — caminho JS → PHP |
| **`JSON.stringify`** | Converte um valor/objeto JS em texto JSON (inverso de `JSON.parse`, equivalente ao `json_encode` do PHP) |

---

*Documento em construção — próxima seção: exibição do ranking (top 10).*
