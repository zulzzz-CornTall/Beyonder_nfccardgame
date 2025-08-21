import { AttackType, NFCCard, Player, BattleResult } from '@/types/game';

// Attack effectiveness chart: attacker -> defender -> multiplier
const EFFECTIVENESS_CHART: Record<AttackType, Record<AttackType, number>> = {
  slash: { burst: 2, guts: 1, slash: 1 },
  burst: { guts: 2, slash: 1, burst: 1 },
  guts: { slash: 2, burst: 1, guts: 1 }
};

// Calculate attack damage with power card buffs
function getAttackDamageWithPowerBuff(character: any, powerCard: any, attackType: AttackType): number {
  if (!character) {
    return 0;
  }
  
  const baseDamage = character[attackType] || 0;
  let buffedDamage = baseDamage;
  
  // Apply power card buff if available
  if (powerCard) {
    // Power cards have rock, paper, scizor stats that boost corresponding attacks
    // Map attack types to power card stats
    const powerMapping = {
      'guts': 'rock',     // Guts = Rock
      'burst': 'paper',   // Burst = Paper  
      'slash': 'scizor'   // Slash = Scissors
    };
    
    const powerStat = powerMapping[attackType];
    if (powerStat && powerCard[powerStat]) {
      const powerBoost = powerCard[powerStat];
      buffedDamage = baseDamage + powerBoost;
      console.log(`Power buff applied: ${attackType} ${baseDamage} + ${powerBoost} = ${buffedDamage}`);
    }
  }
  
  console.log(`Attack damage with power buff: ${attackType} = ${buffedDamage}`);
  return buffedDamage;
}

// Calculate HP with power card buffs
function getHPWithPowerBuff(character: any, powerCard: any): number {
  if (!character) {
    return 0;
  }
  
  const baseHP = character.hp || 0;
  let buffedHP = baseHP;
  
  // Apply power card HP buff if available
  if (powerCard && powerCard.hp) {
    // Power card HP is a percentage boost
    const hpBoost = Math.floor(baseHP * (powerCard.hp / 100));
    buffedHP = baseHP + hpBoost;
    console.log(`HP buff applied: ${baseHP} + ${hpBoost} (${powerCard.hp}%) = ${buffedHP}`);
  }
  
  console.log(`HP with power buff: ${buffedHP}`);
  return buffedHP;
}

export function calculateDamage(
  attacker: Player,
  defender: Player,
  attackerAttack: AttackType,
  defenderAttack: AttackType
): BattleResult {
  // Calculate buffed attack damage
  const buffedDamage = getAttackDamageWithPowerBuff(
    attacker.selectedCharacterCard, 
    attacker.selectedPowerCard,
    attackerAttack
  );

  // Apply type effectiveness multiplier
  const effectiveness = EFFECTIVENESS_CHART[attackerAttack][defenderAttack];
  const finalDamage = Math.floor(buffedDamage * effectiveness);
  
  const wasEffective = effectiveness > 1;
  const wasNotVeryEffective = effectiveness < 1;
  
  console.log(`Damage calculation: ${attackerAttack} (${buffedDamage}) vs ${defenderAttack} = ${finalDamage} (${effectiveness}x effectiveness)`);

  return {
    attacker,
    defender,
    damage: finalDamage,
    wasEffective,
    attackerWon: true
  };
}

// Helper function to get player's buffed card stats
export function calculatePlayerStats(player: Player): { hp: number; burst: number; guts: number; slash: number } {
  const character = player.selectedCharacterCard;
  const powerCard = player.selectedPowerCard;

  if (!character) {
    return { hp: 0, burst: 0, guts: 0, slash: 0 };
  }

  return {
    hp: getHPWithPowerBuff(character, powerCard),
    burst: getAttackDamageWithPowerBuff(character, powerCard, 'burst'),
    guts: getAttackDamageWithPowerBuff(character, powerCard, 'guts'),
    slash: getAttackDamageWithPowerBuff(character, powerCard, 'slash')
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

export function getEffectivenessMultiplier(attackType: AttackType, defenseType: AttackType): number {
  return EFFECTIVENESS_CHART[attackType][defenseType];
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