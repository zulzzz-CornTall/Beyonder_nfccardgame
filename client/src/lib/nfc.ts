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
    console.log('Raw NFC text received:', text);
    console.log('Raw NFC text length:', text.length);
    console.log('Raw NFC text bytes:', Array.from(text).map(c => c.charCodeAt(0)));
    
    // Much simpler cleaning - only handle basic whitespace
    const cleanText = text
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .replace(/\r/g, '\n')    // Handle old Mac line endings
      .trim();

    console.log('Cleaned text:', cleanText);
    console.log('Cleaned text length:', cleanText.length);

    // Simple line splitting
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const data: Partial<ParsedNFCData> = {};

    console.log('Split into lines:', lines);
    console.log('Number of lines:', lines.length);

    for (const line of lines) {
      console.log(`Processing line: "${line}"`);
      
      // Look for colon anywhere in the line
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        console.log('Skipping line without colon:', line);
        continue;
      }

      let key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      console.log(`Raw key: "${key}", Raw value: "${value}"`);

      // Simpler key normalization
      const normalizedKey = key.toLowerCase().replace(/\s+/g, '');

      console.log(`Normalized key: "${normalizedKey}"`);

      // Direct key matching
      if (normalizedKey === 'imgurl' || normalizedKey.includes('img')) {
        console.log('Matched imageUrl field, value:', value);
        data.imageUrl = value;
      } else if (normalizedKey === 'name') {
        console.log('Matched name field');
        data.name = value;
      } else if (normalizedKey === 'hp') {
        console.log('Matched HP field');
        const hp = parseInt(value);
        console.log(`Parsed HP: ${hp}`);
        if (!isNaN(hp)) data.hp = hp;
      } else if (normalizedKey === 'b') {
        console.log('Matched B (burst) field');
        const burst = parseInt(value);
        console.log(`Parsed burst: ${burst}`);
        if (!isNaN(burst)) data.burst = burst;
      } else if (normalizedKey === 'g') {
        console.log('Matched G (guts) field');
        const guts = parseInt(value);
        console.log(`Parsed guts: ${guts}`);
        if (!isNaN(guts)) data.guts = guts;
      } else if (normalizedKey === 's') {
        console.log('Matched S (slash) field');
        const slash = parseInt(value);
        console.log(`Parsed slash: ${slash}`);
        if (!isNaN(slash)) data.slash = slash;
      } else {
        console.log(`Unknown key: "${normalizedKey}"`);
      }
    }

    console.log('Parsed data:', data);

    // Return the actual parsed data
    const result: ParsedNFCData = {
      imageUrl: data.imageUrl || '',
      name: data.name || '',
      hp: data.hp ?? 0,
      burst: data.burst ?? 0,
      guts: data.guts ?? 0,
      slash: data.slash ?? 0
    };

    console.log('Final result being returned:', result);
    
    // Only return if we have at least a name or some stats
    if (data.name || data.hp || data.burst || data.guts || data.slash) {
      return result;
    }
    
    console.error('No valid data found in NFC card');
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
      // Directly return the expected data structure instead of parsing text
      const mockData: ParsedNFCData = {
        imageUrl: 'https://picsum.photos/64/64?random=1',
        name: 'Test Warrior',
        hp: 100,
        burst: 75,
        guts: 60,
        slash: 80
      };
      
      console.log('Mock NFC data created:', mockData);
      resolve(mockData);
    }, 1000); // Simulate scan delay
  });
}