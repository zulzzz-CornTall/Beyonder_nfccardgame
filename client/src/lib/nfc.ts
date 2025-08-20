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
    console.log('Raw NFC text received:', JSON.stringify(text));
    
    // Extremely aggressive text cleaning - remove ALL problematic Unicode characters
    const cleanText = text
      // Remove all control characters, zero-width characters, and weird spaces
      .replace(/[\u0000-\u001F\u007F-\u009F\u00A0\u1680\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/g, ' ')
      // Replace multiple spaces/tabs with single space
      .replace(/\s+/g, ' ')
      // Remove any remaining invisible characters
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
      .trim();

    console.log('Cleaned text:', JSON.stringify(cleanText));

    // Very flexible line splitting - handle any kind of line breaks
    const lines = cleanText
      .split(/[\r\n\u2028\u2029]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const data: Partial<ParsedNFCData> = {};

    console.log('Split into lines:', lines);

    for (const line of lines) {
      // Look for colon anywhere in the line
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        console.log('Skipping line without colon:', line);
        continue;
      }

      let key = line.substring(0, colonIndex).trim().toLowerCase();
      let value = line.substring(colonIndex + 1).trim();

      // Clean key and value more aggressively
      key = key.replace(/[^\w]/g, '').toLowerCase();
      value = value.replace(/^\s+|\s+$/g, '');

      console.log(`Parsed - Key: "${key}", Value: "${value}"`);

      // More flexible key matching
      if (key.includes('img') || key.includes('url')) {
        data.imageUrl = value;
      } else if (key.includes('name')) {
        data.name = value;
      } else if (key === 'hp' || key.includes('health')) {
        const hp = parseInt(value.replace(/\D/g, ''));
        if (!isNaN(hp)) data.hp = hp;
      } else if (key === 'b' || key.includes('burst')) {
        const burst = parseInt(value.replace(/\D/g, ''));
        if (!isNaN(burst)) data.burst = burst;
      } else if (key === 'g' || key.includes('gut')) {
        const guts = parseInt(value.replace(/\D/g, ''));
        if (!isNaN(guts)) data.guts = guts;
      } else if (key === 's' || key.includes('slash')) {
        const slash = parseInt(value.replace(/\D/g, ''));
        if (!isNaN(slash)) data.slash = slash;
      }
    }

    console.log('Parsed data:', data);

    // Only validate essential fields - imageUrl is optional
    if (data.name && 
        typeof data.hp === 'number' && 
        typeof data.burst === 'number' && 
        typeof data.guts === 'number' && 
        typeof data.slash === 'number') {
      
      // Use default image if no imageUrl provided
      if (!data.imageUrl) {
        data.imageUrl = '/textures/grass.png'; // Default fallback image
      }
      
      console.log('NFC parsing successful:', data);
      return data as ParsedNFCData;
    }

    console.error('NFC parsing failed - missing required fields:', {
      hasName: !!data.name,
      hasHP: typeof data.hp === 'number',
      hasBurst: typeof data.burst === 'number',
      hasGuts: typeof data.guts === 'number',
      hasSlash: typeof data.slash === 'number',
      actualData: data
    });

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