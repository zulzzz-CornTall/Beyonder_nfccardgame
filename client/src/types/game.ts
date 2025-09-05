export type AttackType = 'burst' | 'guts' | 'slash';

export type GamePhase = 'menu' | 'preparation' | 'character-selection' | 'battle' | 'results' | 'rules' | 'character-battle';

export type GameMode = 'pvp' | 'vs-robot' | 'character-battle';

export interface Player {
  id: 1 | 2;
  name: string;
  health: number;
  maxHealth: number;
  selectedAttack?: AttackType;
  scannedCards: NFCCard[];  // Array of character and power cards
  selectedCharacterCard?: CharacterCard;   // The character they chose for battle
  selectedPowerCard?: PowerCard;           // The power card they chose for battle
  rpsChoice?: RPSChoice;
  disabledAttacks?: AttackType[];  // Attacks disabled for this turn
  isRobot?: boolean;  // True if this player is controlled by AI
  aiOpponent?: AIOpponent;  // AI opponent data from AZTEC code
}

export interface AIOpponent {
  name: string;
  imageUrl: string;
  character: CharacterCard;
  power: PowerCard;
  dialogues: {
    intro: string;
    battle1: string;
    battle2: string;
    win: string;
    lose: string;
  };
}

export type CardType = 'character' | 'power';

export interface CharacterCard {
  id: string;
  type: 'character';
  name: string;
  hp: number;
  currentHp: number;  // Current health during battle - starts same as hp
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

export interface PowerCard {
  id: string;
  type: 'power';
  name: string;
  hp: number;  // HP percentage multiplier
  rock: number;  // Rock power level
  paper: number; // Paper power level
  scizor: number; // Scissor power level
  imageUrl: string; // Imgurl from NFC
}

export type NFCCard = CharacterCard | PowerCard;

export interface BattleState {
  players: [Player, Player];
  currentRound: number;
  phase: 'selecting' | 'rps' | 'resolving' | 'ended';
  winner?: 1 | 2;
  lastBattleResult?: BattleResult;
  gameMode: GameMode;
}

export interface BattleResult {
  attacker: Player;
  defender: Player;
  damage: number;
  wasEffective: boolean;
  attackerWon: boolean;
}

export type RPSChoice = 'rock' | 'paper' | 'scissors';