class AudioManager {
    constructor() {
        this.music = new Audio('assets/audio/musica004.mp3');
        this.music.loop = true;
        this.music.volume = 0.4;
        // Armezena a opção de mutar o jogo, caso seja o primeiro acesso vai ser 'null' e a musica tocará normalmente.
        this.muted = localStorage.getItem('muted') === 'true';
        this.music.muted = this.muted; 
    }
    
    // Método para tocar efeitos sonoros
    playSfx(source) {
        const som = new Audio(source);
        som.volume = 0.1; // Ajuste o volume do efeito sonoro conforme necessário
        som.play().then(() => {
            console.log('Efeito sonoro iniciado');
        }).catch((error) => {
            console.error('Erro ao iniciar o efeito sonoro:', error);
        });
    } 
        
    
    play() {
        this.music.play().then(() => {
            console.log('Música de fundo iniciada');
        }).catch((error) => {
            console.error('Erro ao iniciar a música de fundo:', error);
        });
        
    }

    /* toggle ( String [, force] )
            Quando apenas um argumento está presente: Toggle class value; Ou seja, se a classe existir, em seguida, removê-lo e retornar false, se não, então adicioná-lo e retornar true. Quando um segundo argumento está presente: Se o segundo argumento é avaliado como true, adicione o valor especificado da classe e, se ele for avaliado como false, remova-o.*/
    
    toggleMute() {
    this.muted = !this.muted;              // Inverte o estado atual
    this.music.muted = this.muted;          // Aplica no objeto de áudio de fato
    localStorage.setItem('muted', this.muted); // Persiste a escolha pro futuro
}


}
