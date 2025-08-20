import { NFCCard, AttackType } from '@/types/game';

// NFC text format parser
// Expected format:
// Imgurl: (image URL)
// Name: (character name)
// HP: (character hp)
// B: (burst attack damage)
// G: (guts attack damage)
// S: (slash attack damage)

export interface ParsedNFCData {
  imageUrl: string;
  name: string;
  hp: number;
  burst: number;
  guts: number;
  slash: number;
}

export function parseNFCText(text: string): ParsedNFCData | null {
  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const data: Partial<ParsedNFCData> = {};

    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();

      switch (key) {
        case 'imgurl':
          data.imageUrl = value;
          break;
        case 'name':
          data.name = value;
          break;
        case 'hp':
          const hp = parseInt(value);
          if (!isNaN(hp)) data.hp = hp;
          break;
        case 'b':
          const burst = parseInt(value);
          if (!isNaN(burst)) data.burst = burst;
          break;
        case 'g':
          const guts = parseInt(value);
          if (!isNaN(guts)) data.guts = guts;
          break;
        case 's':
          const slash = parseInt(value);
          if (!isNaN(slash)) data.slash = slash;
          break;
      }
    }

    // Validate all required fields are present
    if (data.imageUrl && data.name && 
        typeof data.hp === 'number' && 
        typeof data.burst === 'number' && 
        typeof data.guts === 'number' && 
        typeof data.slash === 'number') {
      return data as ParsedNFCData;
    }

    return null;
  } catch (error) {
    console.error('Error parsing NFC text:', error);
    return null;
  }
}

export function createNFCCardFromParsedData(data: ParsedNFCData, playerId: 1 | 2): NFCCard {
  // Determine element based on highest attack value
  let element: AttackType = 'burst';
  let highestValue = data.burst;
  
  if (data.guts > highestValue) {
    element = 'guts';
    highestValue = data.guts;
  }
  
  if (data.slash > highestValue) {
    element = 'slash';
  }

  return {
    id: `nfc_${playerId}_${Date.now()}`,
    name: data.name,
    hp: data.hp,
    burst: data.burst,
    guts: data.guts,
    slash: data.slash,
    imageUrl: data.imageUrl,
    element: element,
    // Legacy fields for backward compatibility
    attack: highestValue,
    defense: Math.floor(data.hp / 2),
    image: data.imageUrl
  };
}

// Check if Web NFC is supported
export function isNFCSupported(): boolean {
  return 'NDEFReader' in window;
}

// Request NFC permissions
export async function requestNFCPermission(): Promise<boolean> {
  try {
    if (!isNFCSupported()) {
      throw new Error('NFC is not supported on this device/browser');
    }

    // Request permission
    const permission = await navigator.permissions.query({ name: 'nfc' as PermissionName });
    
    if (permission.state === 'denied') {
      throw new Error('NFC permission denied');
    }

    return true;
  } catch (error) {
    console.error('NFC permission error:', error);
    return false;
  }
}

// Scan NFC card and parse the data
export async function scanNFCCard(): Promise<ParsedNFCData | null> {
  try {
    if (!isNFCSupported()) {
      throw new Error('NFC is not supported on this device/browser');
    }

    const ndef = new (window as any).NDEFReader();
    
    // Start scanning
    await ndef.scan();
    console.log('NFC scan started. Please tap your NFC card...');

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('NFC scan timeout'));
      }, 30000); // 30 second timeout

      ndef.addEventListener('readingerror', () => {
        clearTimeout(timeout);
        reject(new Error('Cannot read data from the NFC tag. Try again.'));
      });

      ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
        clearTimeout(timeout);
        console.log(`NFC tag read: ${serialNumber}`);
        
        // Parse the NDEF message
        for (const record of message.records) {
          if (record.recordType === 'text') {
            const textDecoder = new TextDecoder(record.encoding || 'utf-8');
            const text = textDecoder.decode(record.data);
            
            console.log('NFC text content:', text);
            const parsedData = parseNFCText(text);
            
            if (parsedData) {
              resolve(parsedData);
              return;
            }
          }
        }
        
        reject(new Error('Could not parse NFC card data. Please check the card format.'));
      });
    });
  } catch (error) {
    console.error('NFC scan error:', error);
    throw error;
  }
}

// Mock NFC scan for testing (simulates the text format)
export function mockNFCScan(): Promise<ParsedNFCData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockText = `Imgurl: /textures/grass.png
Name: Test Warrior
HP: 100
B: 75
G: 60
S: 80`;
      
      const parsed = parseNFCText(mockText);
      if (parsed) {
        resolve(parsed);
      } else {
        resolve({
          imageUrl: '/textures/grass.png',
          name: 'Test Warrior',
          hp: 100,
          burst: 75,
          guts: 60,
          slash: 80
        });
      }
    }, 1000); // Simulate scan delay
  });
}