export type AttackType = 'burst' | 'guts' | 'slash';

export type GamePhase = 'menu' | 'battle' | 'results';
export type BattlePhase = 'selecting' | 'rps-selecting' | 'resolving' | 'ended';
export type RPSChoice = 'rock' | 'paper' | 'scissors';

export interface Player {
  id: 1 | 2;
  name: string;
  health: number;
  maxHealth: number;
  selectedAttack?: AttackType;
  rpsChoice?: RPSChoice;
  nfcCard: NFCCard;
}

export interface NFCCard {
  id: string;
  name: string;
  attack: number;
  defense: number;
  element: AttackType;
  image: string;
}

export interface BattleState {
  players: [Player, Player];
  currentRound: number;
  phase: 'selecting' | 'resolving' | 'ended';
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