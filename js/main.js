
const audioManager = new AudioManager();
document.addEventListener('click', function desbloquearAudio() {
    audioManager.play();
    document.removeEventListener('click', desbloquearAudio);
});

document.getElementById('btnMute').textContent = audioManager.muted ? '🔇' : '🔊';

document.getElementById('btnMute').addEventListener('click', function () {
    audioManager.toggleMute();
    this.textContent = audioManager.muted ? '🔇' : '🔊';
});
