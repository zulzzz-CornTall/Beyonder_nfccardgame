import { NFCCard, AttackType } from '@/types/game';

// NFC text format parser
// Expected format:
// Imgurl: (image URL)
// Name: (character name)
// HP: (character hp)
// B: (burst attack damage)
// G: (guts attack damage)
// S: (slash attack damage)

export interface ParsedCharacterData {
  imageUrl: string;
  name: string;
  hp: number;
  burst: number;
  guts: number;
  slash: number;
}

export interface ParsedPowerData {
  name: string;
  hp: number;
  rock: number;
  paper: number;
  scizor: number;
}

export type ParsedNFCData = ParsedCharacterData | ParsedPowerData;

export function parseNFCText(text: string): ParsedNFCData | null {
  try {
    console.log('Raw NFC text received:', text);

    // Clean the text
    const cleanText = text
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .replace(/\r/g, '\n')    // Handle old Mac line endings
      .trim();

    console.log('Cleaned text:', cleanText);

    // Split into lines
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    console.log('Split into lines:', lines);

    // Detect card type by looking for "Power" at the start
    const isPowerCard = lines.length > 0 && lines[0].toLowerCase().trim() === 'power';
    console.log('Is Power Card:', isPowerCard);

    if (isPowerCard) {
      // Parse Power card format
      const powerData: Partial<ParsedPowerData> = {};

      for (const line of lines.slice(1)) { // Skip first "Power" line
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim().toLowerCase();
        const value = line.substring(colonIndex + 1).trim();

        console.log(`Power card - Key: "${key}", Value: "${value}"`);

        if (key === 'name') {
          powerData.name = value;
        } else if (key === 'hp') {
          const hp = parseInt(value);
          if (!isNaN(hp)) powerData.hp = hp;
        } else if (key === 'rock') {
          const rock = parseInt(value);
          if (!isNaN(rock)) powerData.rock = rock;
        } else if (key === 'paper') {
          const paper = parseInt(value);
          if (!isNaN(paper)) powerData.paper = paper;
        } else if (key === 'scizor') {
          const scizor = parseInt(value);
          if (!isNaN(scizor)) powerData.scizor = scizor;
        }
      }

      const result: ParsedPowerData = {
        name: powerData.name || '',
        hp: powerData.hp ?? 0,
        rock: powerData.rock ?? 0,
        paper: powerData.paper ?? 0,
        scizor: powerData.scizor ?? 0
      };

      console.log('Power card parsed result:', result);
      return result;
    } else {
      // Parse Character card format (existing format)
      const characterData: Partial<ParsedCharacterData> = {};

      for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.substring(0, colonIndex).trim().toLowerCase().replace(/\s+/g, '');
        const value = line.substring(colonIndex + 1).trim();

        console.log(`Character card - Key: "${key}", Value: "${value}"`);

        if (key === 'imgurl' || key.includes('img')) {
          characterData.imageUrl = value;
        } else if (key === 'name') {
          characterData.name = value;
        } else if (key === 'hp') {
          const hp = parseInt(value);
          if (!isNaN(hp)) characterData.hp = hp;
        } else if (key === 'b') {
          const burst = parseInt(value);
          if (!isNaN(burst)) characterData.burst = burst;
        } else if (key === 'g') {
          const guts = parseInt(value);
          if (!isNaN(guts)) characterData.guts = guts;
        } else if (key === 's') {
          const slash = parseInt(value);
          if (!isNaN(slash)) characterData.slash = slash;
        }
      }

      const result: ParsedCharacterData = {
        imageUrl: characterData.imageUrl || '',
        name: characterData.name || '',
        hp: characterData.hp ?? 0,
        burst: characterData.burst ?? 0,
        guts: characterData.guts ?? 0,
        slash: characterData.slash ?? 0
      };

      console.log('Character card parsed result:', result);
      return result;
    }
  } catch (error) {
    console.error('Error parsing NFC text:', error);
    return null;
  }
}

export function createNFCCardFromParsedData(data: ParsedNFCData, playerId: 1 | 2): NFCCard {
  const timestamp = Date.now();

  // Check if it's character data or power data
  if ('burst' in data) {
    // Character card
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
      id: `character_${playerId}_${timestamp}`,
      type: 'character',
      name: data.name,
      hp: data.hp,
      currentHp: data.hp,  // Initialize current HP to max HP
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
  } else {
    // Power card - use actual NFC data
    return {
      type: 'power' as const,
      id: `power_${playerId}_${Date.now()}`,
      name: data.name,
      hp: data.hp,
      rock: data.rock,
      paper: data.paper,
      scizor: data.scizor,
      imageUrl: data.imageUrl || '/textures/sand.jpg' // Fallback image if none provided
    };
  }
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