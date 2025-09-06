import { AIOpponent, CharacterCard, PowerCard } from '@/types/game';

export interface AztecData {
  name: string;
  imageurl: string;
  character: {
    imgurl: string;
    name: string;
    hp: number;
    b: number;
    g: number;
    s: number;
  };
  power: {
    name: string;
    hp: string;
    rock: number;
    paper: number;
    scizor: number;
  };
  dialougeIntro: string;
  dialouge1: string;
  dialouge2: string;
  dialougeWin: string;
  dialougeLose: string;
}

export function parseAztecCode(data: string): AIOpponent | null {
  try {
    const lines = data.trim().split('\n').filter(line => line.trim() !== '');
    const parsed: any = {};
    let currentSection = 'main';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Check for section headers
      if (line.startsWith('Character:')) {
        currentSection = 'character';
        parsed.character = {};
        continue;
      }
      
      if (line.startsWith('Power:')) {
        currentSection = 'power';
        parsed.power = {};
        continue;
      }
      
      // Parse key-value pairs
      const colonIndex = line.indexOf(': ');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 2).trim();
      
      if (currentSection === 'character') {
        switch (key) {
          case 'Imgurl':
            parsed.character.imgurl = value;
            break;
          case 'Name':
            parsed.character.name = value;
            break;
          case 'HP':
            parsed.character.hp = parseInt(value);
            break;
          case 'B':
            parsed.character.b = parseInt(value);
            break;
          case 'G':
            parsed.character.g = parseInt(value);
            break;
          case 'S':
            parsed.character.s = parseInt(value);
            break;
        }
      } else if (currentSection === 'power') {
        switch (key) {
          case 'Name':
            parsed.power.name = value;
            break;
          case 'Hp':
            parsed.power.hp = value;
            break;
          case 'Rock':
            parsed.power.rock = parseInt(value);
            break;
          case 'Paper':
            parsed.power.paper = parseInt(value);
            break;
          case 'Scizor':
            parsed.power.scizor = parseInt(value);
            break;
        }
      } else {
        // Main section
        switch (key) {
          case 'Name':
            parsed.name = value;
            break;
          case 'Imageurl':
            parsed.imageurl = value;
            break;
          case 'DialougeIntro':
            parsed.dialougeIntro = value;
            break;
          case 'Dialouge1':
            parsed.dialouge1 = value;
            break;
          case 'Dialouge2':
            parsed.dialouge2 = value;
            break;
          case 'DialougeWin':
            parsed.dialougeWin = value;
            break;
          case 'DialougeLose':
            parsed.dialougeLose = value;
            break;
        }
      }
    }
    
    // Validate required data
    if (!parsed.character || !parsed.power || !parsed.name) {
      console.error('Missing required data in AZTEC code:', parsed);
      return null;
    }
    
    // Convert to AIOpponent format
    const characterCard: CharacterCard = {
      id: `ai_char_${Date.now()}`,
      type: 'character',
      name: parsed.character.name || 'Unknown Character',
      hp: parsed.character.hp || 1000,
      currentHp: parsed.character.hp || 1000,
      burst: parsed.character.b || 100,
      guts: parsed.character.g || 100,
      slash: parsed.character.s || 100,
      imageUrl: parsed.character.imgurl || '',
      element: 'burst', // Default element
      attack: parsed.character.b || 100,
      defense: 0,
      image: parsed.character.imgurl || ''
    };
    
    const powerCard: PowerCard = {
      id: `ai_power_${Date.now()}`,
      type: 'power',
      name: parsed.power.name || 'Unknown Power',
      hp: parseInt((parsed.power.hp || '50%').replace('%', '')),
      rock: parsed.power.rock || 1,
      paper: parsed.power.paper || 1,
      scizor: parsed.power.scizor || 1,
      imageUrl: parsed.imageurl || ''
    };
    
    return {
      name: parsed.name,
      imageUrl: parsed.imageurl,
      character: characterCard,
      power: powerCard,
      dialogues: {
        intro: parsed.dialougeIntro,
        battle1: parsed.dialouge1,
        battle2: parsed.dialouge2,
        win: parsed.dialougeWin,
        lose: parsed.dialougeLose
      }
    };
    
  } catch (error) {
    console.error('Failed to parse AZTEC code:', error);
    return null;
  }
}

export async function scanAztecFromCamera(): Promise<string | null> {
  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment', // Use back camera if available
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    });

    return new Promise((resolve, reject) => {
      // Create video element
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      video.srcObject = stream;
      video.play();

      // Create camera overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;

      const videoContainer = document.createElement('div');
      videoContainer.style.cssText = `
        position: relative;
        width: 320px;
        height: 240px;
        border: 2px solid #10b981;
        border-radius: 8px;
        overflow: hidden;
      `;

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close Camera';
      closeButton.style.cssText = `
        margin-top: 20px;
        padding: 10px 20px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      `;

      video.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
      `;

      videoContainer.appendChild(video);
      overlay.appendChild(videoContainer);
      overlay.appendChild(closeButton);
      document.body.appendChild(overlay);

      let isCleanedUp = false;
      const cleanup = () => {
        if (isCleanedUp) return;
        isCleanedUp = true;
        stream.getTracks().forEach(track => track.stop());
        if (overlay && overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      };

      closeButton.onclick = () => {
        cleanup();
        reject(new Error('Camera scan cancelled'));
      };

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const scanInterval = setInterval(() => {
          if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            // For now, simulate AZTEC detection after 3 seconds
            // In a real implementation, you would use a library like @zxing/library
            // to decode AZTEC codes from the imageData
            setTimeout(() => {
              clearInterval(scanInterval);
              cleanup();
              
              // Return example data - replace with actual AZTEC decoding
              const exampleData = `Name: Great
Imageurl: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Q4h8kmYhdtsQwoC6sBjZCqSeLYYZV7fPr5mtEbq09tjcWdtbQarzisc&s=10

Character: Imgurl: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV_BgDLaZ6xXrXpf2LCdNQ1iZHrNYZEEJKi5CBUuA0e8G6S3rihLllnX4I&s=10
Name: Monkey D Luffy
HP: 1500
B: 300
G: 150
S: 250

Power: Power
Name: heart of will
Hp: 50%
Rock: 4
Paper: 2
Scizor: 3

DialougeIntro: Hello
Dialouge1: battle
Dialouge2: Wow
DialougeWin: Haha fek u
DialougeLose: Dang`;
              resolve(exampleData);
            }, 3000);
          }
        }, 500);
      };

      // Timeout after 30 seconds
      setTimeout(() => {
        cleanup();
        reject(new Error('Camera scan timeout'));
      }, 30000);
    });
  } catch (error) {
    console.error('Failed to access camera:', error);
    throw new Error('Camera access denied or not available');
  }
}

export async function uploadImageForAztecScan(file: File): Promise<string | null> {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas to process the image
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          
          // Get image data for processing
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          // For now, simulate processing - in a real implementation, 
          // you would use a library like @zxing/library to decode AZTEC codes
          setTimeout(() => {
            // Return example data - replace with actual AZTEC decoding
            const exampleData = `Name: Great
Imageurl: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4Q4h8kmYhdtsQwoC6sBjZCqSeLYYZV7fPr5mtEbq09tjcWdtbQarzisc&s=10

Character: Imgurl: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV_BgDLaZ6xXrXpf2LCdNQ1iZHrNYZEEJKi5CBUuA0e8G6S3rihLllnX4I&s=10
Name: Monkey D Luffy
HP: 1500
B: 300
G: 150
S: 250

Power: Power
Name: heart of will
Hp: 50%
Rock: 4
Paper: 2
Scizor: 3

DialougeIntro: Hello
Dialouge1: battle
Dialouge2: Wow
DialougeWin: Haha fek u
DialougeLose: Dang`;
            resolve(exampleData);
          }, 2000);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = event.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Failed to process image:', error);
    return null;
  }
}