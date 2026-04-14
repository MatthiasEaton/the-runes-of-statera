export const music = {
    current: null,
    isMuted: false,
    volume: 0.5,
  
    play(src, loop = true) {
      if (this.current && this.current.src.includes(src)) return;
  
      const newAudio = new Audio(src);
      newAudio.loop = loop;
      newAudio.volume = this.isMuted ? 0 : 0;
  
      newAudio.play().catch(() => {});
  
      // fade in only if not muted
      if (!this.isMuted) {
        this.fadeIn(newAudio, 1000);
      }
  
      if (this.current) {
        this.fadeOut(this.current, 1000);
      }
  
      this.current = newAudio;
    },
  
    toggleMute() {
      this.isMuted = !this.isMuted;
  
      if (this.current) {
        this.current.volume = this.isMuted ? 0 : this.volume;
      }
  
      return this.isMuted;
    },
  
    setMute(state) {
      this.isMuted = state;
  
      if (this.current) {
        this.current.volume = this.isMuted ? 0 : this.volume;
      }
    },
  
    fadeIn(audio, duration = 1000) {
      if (this.isMuted) return;
  
      const step = 0.05;
      const interval = duration * step;
  
      const fade = setInterval(() => {
        if (audio.volume < this.volume) {
          audio.volume = Math.min(audio.volume + step, this.volume);
        } else {
          clearInterval(fade);
        }
      }, interval);
    },
  
    fadeOut(audio, duration = 1000) {
      const step = 0.05;
      const interval = duration * step;
  
      const fade = setInterval(() => {
        if (audio.volume > step) {
          audio.volume -= step;
        } else {
          audio.pause();
          audio.currentTime = 0;
          clearInterval(fade);
        }
      }, interval);
    }
  };