import { AttackType, NFCCard, Player, BattleResult } from '@/types/game';

// Attack effectiveness chart: attacker -> defender -> multiplier
const EFFECTIVENESS_CHART: Record<AttackType, Record<AttackType, number>> = {
  slash: { burst: 2, guts: 1, slash: 1 },
  burst: { guts: 2, slash: 1, burst: 1 },
  guts: { slash: 2, burst: 1, guts: 1 }
};

// Use exact attack damage from character card (no multipliers)
function getExactAttackDamage(character: any, attackType: AttackType): number {
  if (!character) {
    return 0;
  }
  
  const exactDamage = character[attackType] || 0;
  console.log(`Using exact attack damage: ${attackType} = ${exactDamage}`);
  return exactDamage;
}

// Use exact HP from character card (no boosts)
function getExactHP(character: any): number {
  if (!character) {
    return 0;
  }
  
  const exactHP = character.hp || 0;
  console.log(`Using exact HP: ${exactHP}`);
  return exactHP;
}

export function calculateDamage(
  attacker: Player,
  defender: Player,
  attackerAttack: AttackType,
  defenderAttack: AttackType
): BattleResult {
  // Use exact attack damage from character card (no multipliers)
  const exactDamage = getExactAttackDamage(
    attacker.selectedCharacterCard, 
    attackerAttack
  );

  console.log(`Damage calculation: ${attackerAttack} attack deals exactly ${exactDamage} damage`);

  return {
    attacker,
    defender,
    damage: exactDamage,
    wasEffective: false, // No effectiveness system, all attacks are normal
    attackerWon: true
  };
}

// Helper function to get player's exact card stats
export function calculatePlayerStats(player: Player): { hp: number; burst: number; guts: number; slash: number } {
  const character = player.selectedCharacterCard;

  if (!character) {
    return { hp: 0, burst: 0, guts: 0, slash: 0 };
  }

  return {
    hp: getExactHP(character),
    burst: getExactAttackDamage(character, 'burst'),
    guts: getExactAttackDamage(character, 'guts'),
    slash: getExactAttackDamage(character, 'slash')
  };
}

export function determineRoundWinner(
  player1: Player,
  player2: Player
): { winner: Player; loser: Player } | null {
  // Use RPS choice to determine who becomes the attacker
  if (!player1.rpsChoice || !player2.rpsChoice) {
    return null;
  }

  const p1Choice = player1.rpsChoice;
  const p2Choice = player2.rpsChoice;

  // Standard rock-paper-scissors logic to determine attacker
  if (p1Choice === p2Choice) {
    // Tie - random attacker
    return Math.random() < 0.5 
      ? { winner: player1, loser: player2 }
      : { winner: player2, loser: player1 };
  }

  const p1Wins = 
    (p1Choice === 'rock' && p2Choice === 'scissors') ||
    (p1Choice === 'paper' && p2Choice === 'rock') ||
    (p1Choice === 'scissors' && p2Choice === 'paper');

  return p1Wins 
    ? { winner: player1, loser: player2 }
    : { winner: player2, loser: player1 };
}

export function getRPSWinReason(winnerChoice: string, loserChoice: string): string {
  if (winnerChoice === loserChoice) {
    return 'Random winner (tie)!';
  }
  
  const reasons = {
    rock: { scissors: 'Rock crushes Scissors!' },
    paper: { rock: 'Paper covers Rock!' },
    scissors: { paper: 'Scissors cuts Paper!' }
  };
  
  return (reasons as any)[winnerChoice]?.[loserChoice] || 'RPS Winner!';
}

export function getAttackName(attack: AttackType): string {
  return attack.charAt(0).toUpperCase() + attack.slice(1);
}

export function getAttackColor(attack: AttackType): string {
  switch (attack) {
    case 'burst': return 'bg-red-500';
    case 'guts': return 'bg-green-500';
    case 'slash': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
}

export function getEffectivenessText(attackType: AttackType, defenseType: AttackType): string {
  const multiplier = EFFECTIVENESS_CHART[attackType][defenseType];
  if (multiplier > 1) return 'SUPER EFFECTIVE!';
  if (multiplier < 1) return 'Not very effective...';
  return 'Normal damage';
}

export function getWinReason(winnerRPS: string, loserRPS: string): string {
  return getRPSWinReason(winnerRPS, loserRPS);
}

export function createMockNFCCard(playerId: 1 | 2) {
  const cards = [
    { name: 'Fire Warrior', element: 'burst' as AttackType, hp: 100, burst: 80, guts: 40, slash: 60, imageUrl: '/textures/grass.png' },
    { name: 'Earth Guardian', element: 'guts' as AttackType, hp: 120, burst: 40, guts: 80, slash: 50, imageUrl: '/textures/grass.png' },
    { name: 'Wind Blade', element: 'slash' as AttackType, hp: 90, burst: 50, guts: 60, slash: 70, imageUrl: '/textures/grass.png' },
    { name: 'Lightning Strike', element: 'burst' as AttackType, hp: 85, burst: 90, guts: 30, slash: 55, imageUrl: '/textures/grass.png' },
    { name: 'Stone Wall', element: 'guts' as AttackType, hp: 140, burst: 30, guts: 90, slash: 40, imageUrl: '/textures/grass.png' },
    { name: 'Swift Assassin', element: 'slash' as AttackType, hp: 80, burst: 55, guts: 45, slash: 85, imageUrl: '/textures/grass.png' }
  ];

  const card = cards[Math.floor(Math.random() * cards.length)];
  return {
    id: `card_${playerId}_${Date.now()}`,
    name: card.name,
    hp: card.hp,
    burst: card.burst,
    guts: card.guts,
    slash: card.slash,
    imageUrl: card.imageUrl,
    element: card.element,
    // Legacy fields for backward compatibility
    attack: card.burst, // Use burst as default attack
    defense: card.hp / 2, // Derive defense from HP
    image: card.imageUrl
  };
}