import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  mainTheme: HTMLAudioElement | null;
  battleTheme: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  clickSound: HTMLAudioElement | null;
  attackSound: HTMLAudioElement | null;
  rouletteSpinSound: HTMLAudioElement | null;
  rpsSelectSound: HTMLAudioElement | null;
  victorySound: HTMLAudioElement | null;
  defeatSound: HTMLAudioElement | null;
  cardSelectSound: HTMLAudioElement | null;
  isMuted: boolean;
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement) => void;
  setMainTheme: (music: HTMLAudioElement) => void;
  setBattleTheme: (music: HTMLAudioElement) => void;
  setHitSound: (sound: HTMLAudioElement) => void;
  setSuccessSound: (sound: HTMLAudioElement) => void;
  setClickSound: (sound: HTMLAudioElement) => void;
  setAttackSound: (sound: HTMLAudioElement) => void;
  setRouletteSpinSound: (sound: HTMLAudioElement) => void;
  setRpsSelectSound: (sound: HTMLAudioElement) => void;
  setVictorySound: (sound: HTMLAudioElement) => void;
  setDefeatSound: (sound: HTMLAudioElement) => void;
  setCardSelectSound: (sound: HTMLAudioElement) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  playBackgroundMusic: () => void;
  playMainTheme: () => void;
  playBattleTheme: () => void;
  stopBattleTheme: () => void;
  playClick: () => void;
  playAttack: () => void;
  playRouletteSpinning: () => void;
  playRpsSelect: () => void;
  playVictory: () => void;
  playDefeat: () => void;
  playCardSelect: () => void;
}

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  mainTheme: null,
  battleTheme: null,
  hitSound: null,
  successSound: null,
  clickSound: null,
  attackSound: null,
  rouletteSpinSound: null,
  rpsSelectSound: null,
  victorySound: null,
  defeatSound: null,
  cardSelectSound: null,
  isMuted: false, // Start unmuted by default
  
  setBackgroundMusic: (music) => set({ backgroundMusic: music }),
  setMainTheme: (music) => set({ mainTheme: music }),
  setBattleTheme: (music) => set({ battleTheme: music }),
  setHitSound: (sound) => set({ hitSound: sound }),
  setSuccessSound: (sound) => set({ successSound: sound }),
  setClickSound: (sound) => set({ clickSound: sound }),
  setAttackSound: (sound) => set({ attackSound: sound }),
  setRouletteSpinSound: (sound) => set({ rouletteSpinSound: sound }),
  setRpsSelectSound: (sound) => set({ rpsSelectSound: sound }),
  setVictorySound: (sound) => set({ victorySound: sound }),
  setDefeatSound: (sound) => set({ defeatSound: sound }),
  setCardSelectSound: (sound) => set({ cardSelectSound: sound }),
  
  toggleMute: () => {
    const { isMuted } = get();
    const newMutedState = !isMuted;
    
    // Update the muted state and handle background music
    set({ isMuted: newMutedState });
    
    const { mainTheme } = get();
    if (mainTheme) {
      if (newMutedState) {
        mainTheme.pause();
      } else {
        mainTheme.play().catch(error => {
          console.log("Main theme play prevented:", error);
        });
      }
    }
    
    // Log the change
    console.log(`Sound ${newMutedState ? 'muted' : 'unmuted'}`);
  },
  
  playHit: () => {
    const { hitSound, isMuted } = get();
    if (hitSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Hit sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Hit sound play prevented:", error);
      });
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted } = get();
    if (successSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Success sound skipped (muted)");
        return;
      }
      
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Success sound play prevented:", error);
      });
    }
  },
  
  playBackgroundMusic: () => {
    const { backgroundMusic, isMuted } = get();
    if (backgroundMusic) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Background music skipped (muted)");
        return;
      }
      
      backgroundMusic.currentTime = 0;
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }
  },
  
  playMainTheme: () => {
    const { mainTheme, isMuted } = get();
    if (mainTheme) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Main theme skipped (muted)");
        return;
      }
      
      mainTheme.loop = true;
      mainTheme.volume = 0.6;
      mainTheme.currentTime = 0;
      mainTheme.play().catch(error => {
        console.log("Main theme play prevented:", error);
      });
    }
  },

  playBattleTheme: () => {
    const { battleTheme, isMuted } = get();
    if (battleTheme) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Battle theme skipped (muted)");
        return;
      }
      
      battleTheme.loop = true;
      battleTheme.volume = 0.4;
      battleTheme.currentTime = 0;
      battleTheme.play().catch(error => {
        console.log("Battle theme play prevented:", error);
      });
    }
  },

  stopBattleTheme: () => {
    const { battleTheme } = get();
    if (battleTheme) {
      battleTheme.pause();
      battleTheme.currentTime = 0;
    }
  },
  
  playClick: () => {
    const { clickSound, isMuted } = get();
    if (clickSound) {
      // If sound is muted, don't play anything
      if (isMuted) {
        console.log("Click sound skipped (muted)");
        return;
      }
      
      // Clone the sound to allow overlapping playback
      const soundClone = clickSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.2;
      soundClone.play().catch(error => {
        console.log("Click sound play prevented:", error);
      });
    }
  },
  
  playAttack: () => {
    const { attackSound, isMuted } = get();
    if (attackSound) {
      if (isMuted) {
        console.log("Attack sound skipped (muted)");
        return;
      }
      
      const soundClone = attackSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.4;
      soundClone.play().catch(error => {
        console.log("Attack sound play prevented:", error);
      });
    }
  },
  
  playRouletteSpinning: () => {
    const { rouletteSpinSound, isMuted } = get();
    if (rouletteSpinSound) {
      if (isMuted) {
        console.log("Roulette spin sound skipped (muted)");
        return;
      }
      
      const soundClone = rouletteSpinSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Roulette spin sound play prevented:", error);
      });
    }
  },
  
  playRpsSelect: () => {
    const { rpsSelectSound, isMuted } = get();
    if (rpsSelectSound) {
      if (isMuted) {
        console.log("RPS select sound skipped (muted)");
        return;
      }
      
      const soundClone = rpsSelectSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("RPS select sound play prevented:", error);
      });
    }
  },
  
  playVictory: () => {
    const { victorySound, isMuted } = get();
    if (victorySound) {
      if (isMuted) {
        console.log("Victory sound skipped (muted)");
        return;
      }
      
      victorySound.currentTime = 0;
      victorySound.volume = 0.5;
      victorySound.play().catch(error => {
        console.log("Victory sound play prevented:", error);
      });
    }
  },
  
  playDefeat: () => {
    const { defeatSound, isMuted } = get();
    if (defeatSound) {
      if (isMuted) {
        console.log("Defeat sound skipped (muted)");
        return;
      }
      
      defeatSound.currentTime = 0;
      defeatSound.volume = 0.4;
      defeatSound.play().catch(error => {
        console.log("Defeat sound play prevented:", error);
      });
    }
  },
  
  playCardSelect: () => {
    const { cardSelectSound, isMuted } = get();
    if (cardSelectSound) {
      if (isMuted) {
        console.log("Card select sound skipped (muted)");
        return;
      }
      
      const soundClone = cardSelectSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        console.log("Card select sound play prevented:", error);
      });
    }
  }
}));
