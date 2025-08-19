import { AttackType, Player, BattleResult } from '@/types/game';

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
  if (!player1.rouletteValue || !player2.rouletteValue) {
    return null;
  }
  
  if (player1.rouletteValue > player2.rouletteValue) {
    return { winner: player1, loser: player2 };
  } else if (player2.rouletteValue > player1.rouletteValue) {
    return { winner: player2, loser: player1 };
  } else {
    // Tie - re-spin needed, but for simplicity, let's just pick randomly
    return Math.random() > 0.5 
      ? { winner: player1, loser: player2 }
      : { winner: player2, loser: player1 };
  }
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

export function generateRouletteValue(): number {
  return Math.floor(Math.random() * 100) + 1; // 1-100
}

export function createMockNFCCard(playerId: 1 | 2) {
  const cards = [
    { name: 'Fire Warrior', element: 'burst' as AttackType, attack: 80, defense: 60 },
    { name: 'Earth Guardian', element: 'guts' as AttackType, attack: 60, defense: 80 },
    { name: 'Wind Blade', element: 'slash' as AttackType, attack: 70, defense: 70 },
    { name: 'Lightning Strike', element: 'burst' as AttackType, attack: 90, defense: 50 },
    { name: 'Stone Wall', element: 'guts' as AttackType, attack: 50, defense: 90 },
    { name: 'Swift Assassin', element: 'slash' as AttackType, attack: 85, defense: 55 }
  ];
  
  const card = cards[Math.floor(Math.random() * cards.length)];
  return {
    id: `card_${playerId}_${Date.now()}`,
    name: card.name,
    attack: card.attack,
    defense: card.defense,
    element: card.element,
    image: `/textures/grass.png` // Using available texture as placeholder
  };
}
