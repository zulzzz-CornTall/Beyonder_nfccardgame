import { AttackType, NFCCard, Player, BattleResult } from '@/types/game';

// Attack effectiveness chart: attacker -> defender -> multiplier
const EFFECTIVENESS_CHART: Record<AttackType, Record<AttackType, number>> = {
  slash: { burst: 2, guts: 1, slash: 1 },
  burst: { guts: 2, slash: 1, burst: 1 },
  guts: { slash: 2, burst: 1, guts: 1 }
};

export function calculateDamage(
  attacker: Player,
  defender: Player,
  attackerAttack: AttackType,
  defenderAttack: AttackType
): BattleResult {
  const baseDamage = 25; // Base damage amount
  const effectiveness = EFFECTIVENESS_CHART[attackerAttack][defenderAttack];
  const finalDamage = Math.floor(baseDamage * effectiveness);

  console.log(`Damage calculation: ${attackerAttack} vs ${defenderAttack}, effectiveness: ${effectiveness}, damage: ${finalDamage}`);

  return {
    attacker,
    defender,
    damage: finalDamage,
    wasEffective: effectiveness > 1,
    attackerWon: true
  };
}

export function determineRoundWinner(
  player1: Player,
  player2: Player
): { winner: Player; loser: Player } | null {
  if (!player1.selectedAttack || !player2.selectedAttack) {
    return null;
  }

  const p1Attack = player1.selectedAttack;
  const p2Attack = player2.selectedAttack;

  // Rock-paper-scissors logic using attack effectiveness
  const p1BeatsP2 = EFFECTIVENESS_CHART[p1Attack][p2Attack] > 1;
  const p2BeatsP1 = EFFECTIVENESS_CHART[p2Attack][p1Attack] > 1;

  if (p1BeatsP2) {
    return { winner: player1, loser: player2 };
  } else if (p2BeatsP1) {
    return { winner: player2, loser: player1 };
  } else {
    // Tie - random winner
    return Math.random() < 0.5 
      ? { winner: player1, loser: player2 }
      : { winner: player2, loser: player1 };
  }
}

export function determineRPSWinner(
  player1: Player,
  player2: Player
): { winner: Player; loser: Player } | null {
  if (!player1.rpsChoice || !player2.rpsChoice) {
    return null;
  }

  const p1Choice = player1.rpsChoice;
  const p2Choice = player2.rpsChoice;

  // Standard rock-paper-scissors logic
  if (p1Choice === p2Choice) {
    // Tie - random winner
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

export function getWinReason(winnerAttack: AttackType, loserAttack: AttackType): string {
  if (EFFECTIVENESS_CHART[winnerAttack][loserAttack] > 1) {
    return `${getAttackName(winnerAttack)} beats ${getAttackName(loserAttack)}!`;
  }
  return 'Random winner (tie)!';
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