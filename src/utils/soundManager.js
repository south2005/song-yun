// 音频管理器
class SoundManager {
    constructor() {
        this.clickSound = new Audio();
        this.clickSound.src = '/click.mp3';
        this.clickSound.volume = 0.3;

        this.snapSound = new Audio();
        this.snapSound.src = '/snap.mp3';
        this.snapSound.volume = 0.4;
    }

    playClick() {
        this.clickSound.currentTime = 0;
        this.clickSound.play().catch(err => console.log('音频播放失败:', err));
    }

    playSnap() {
        this.snapSound.currentTime = 0;
        this.snapSound.play().catch(err => console.log('音频播放失败:', err));
    }
}

export const soundManager = new SoundManager();