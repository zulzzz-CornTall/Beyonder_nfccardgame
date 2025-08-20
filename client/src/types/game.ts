export type AttackType = 'burst' | 'guts' | 'slash';

export type GamePhase = 'menu' | 'preparation' | 'character-selection' | 'battle' | 'results' | 'rules';

export interface Player {
  id: 1 | 2;
  name: string;
  health: number;
  maxHealth: number;
  selectedAttack?: AttackType;
  scannedCards: NFCCard[];  // Array of up to 3 scanned cards
  selectedCard?: NFCCard;   // The character they chose for battle
  rpsChoice?: RPSChoice;
}

export interface NFCCard {
  id: string;
  name: string;
  hp: number;
  burst: number;  // B: burst attack damage
  guts: number;   // G: guts attack damage
  slash: number;  // S: slash attack damage
  imageUrl: string; // Imgurl from NFC
  element: AttackType;
  // Legacy fields for backward compatibility
  attack: number;
  defense: number;
  image: string;
}

export interface BattleState {
  players: [Player, Player];
  currentRound: number;
  phase: 'selecting' | 'rps' | 'resolving' | 'ended';
  winner?: 1 | 2;
  lastBattleResult?: BattleResult;
}

export interface BattleResult {
  attacker: Player;
  defender: Player;
  damage: number;
  wasEffective: boolean;
  attackerWon: boolean;
}

export type RPSChoice = 'rock' | 'paper' | 'scissors';