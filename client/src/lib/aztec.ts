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
    const lines = data.trim().split('\n');
    const parsed: any = {};
    
    for (const line of lines) {
      const [key, ...valueParts] = line.split(': ');
      const value = valueParts.join(': ');
      
      if (key.toLowerCase().includes('character:')) {
        // Parse character section
        const charLines = lines.slice(lines.indexOf(line));
        const character: any = {};
        
        for (const charLine of charLines) {
          if (charLine.startsWith('Power:')) break;
          
          const [charKey, charValue] = charLine.split(': ');
          if (charKey === 'Imgurl') character.imgurl = charValue;
          if (charKey === 'Name') character.name = charValue;
          if (charKey === 'HP') character.hp = parseInt(charValue);
          if (charKey === 'B') character.b = parseInt(charValue);
          if (charKey === 'G') character.g = parseInt(charValue);
          if (charKey === 'S') character.s = parseInt(charValue);
        }
        parsed.character = character;
        continue;
      }
      
      if (key.toLowerCase().includes('power:')) {
        // Parse power section
        const powerLines = lines.slice(lines.indexOf(line));
        const power: any = {};
        
        for (const powerLine of powerLines) {
          if (powerLine.startsWith('Dialouge')) break;
          
          const [powerKey, powerValue] = powerLine.split(': ');
          if (powerKey === 'Name') power.name = powerValue;
          if (powerKey === 'Hp') power.hp = powerValue;
          if (powerKey === 'Rock') power.rock = parseInt(powerValue);
          if (powerKey === 'Paper') power.paper = parseInt(powerValue);
          if (powerKey === 'Scizor') power.scizor = parseInt(powerValue);
        }
        parsed.power = power;
        continue;
      }
      
      // Parse simple key-value pairs
      if (key === 'Name') parsed.name = value;
      if (key === 'Imageurl') parsed.imageurl = value;
      if (key === 'DialougeIntro') parsed.dialougeIntro = value;
      if (key === 'Dialouge1') parsed.dialouge1 = value;
      if (key === 'Dialouge2') parsed.dialouge2 = value;
      if (key === 'DialougeWin') parsed.dialougeWin = value;
      if (key === 'DialougeLose') parsed.dialougeLose = value;
    }
    
    // Convert to AIOpponent format
    const characterCard: CharacterCard = {
      id: `ai_char_${Date.now()}`,
      type: 'character',
      name: parsed.character.name,
      hp: parsed.character.hp,
      currentHp: parsed.character.hp,
      burst: parsed.character.b,
      guts: parsed.character.g,
      slash: parsed.character.s,
      imageUrl: parsed.character.imgurl,
      element: 'burst', // Default element
      attack: parsed.character.b,
      defense: 0,
      image: parsed.character.imgurl
    };
    
    const powerCard: PowerCard = {
      id: `ai_power_${Date.now()}`,
      type: 'power',
      name: parsed.power.name,
      hp: parseInt(parsed.power.hp.replace('%', '')),
      rock: parsed.power.rock,
      paper: parsed.power.paper,
      scizor: parsed.power.scizor,
      imageUrl: parsed.imageurl
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

      const cleanup = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(overlay);
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