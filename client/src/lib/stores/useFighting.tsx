import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GamePhase, Player, BattleState, BattleResult, AttackType } from '@/types/game';
import { calculateDamage, determineRoundWinner, createMockNFCCard, getWinReason } from '@/lib/gameLogic';

interface FightingState {
  gamePhase: GamePhase;
  battleState: BattleState;
  
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  startBattle: () => void;
  selectAttack: (playerId: 1 | 2, attack: AttackType) => void;
  resolveRound: () => void;
  resetBattle: () => void;
  scanNFCCard: (playerId: 1 | 2) => void;
}

const createInitialPlayer = (id: 1 | 2): Player => ({
  id,
  name: `Player ${id}`,
  health: 100,
  maxHealth: 100,
  nfcCard: createMockNFCCard(id)
});

const initialBattleState: BattleState = {
  players: [createInitialPlayer(1), createInitialPlayer(2)],
  currentRound: 1,
  phase: 'selecting'
};

export const useFighting = create<FightingState>()(
  subscribeWithSelector((set, get) => ({
    gamePhase: 'menu',
    battleState: initialBattleState,
    
    setGamePhase: (phase) => set({ gamePhase: phase }),
    
    startBattle: () => {
      set({
        gamePhase: 'battle',
        battleState: {
          ...initialBattleState,
          players: [createInitialPlayer(1), createInitialPlayer(2)]
        }
      });
    },
    
    selectAttack: (playerId, attack) => {
      const { battleState } = get();
      const updatedPlayers = battleState.players.map(player => 
        player.id === playerId ? { ...player, selectedAttack: attack } : player
      ) as [Player, Player];
      
      const bothSelected = updatedPlayers.every(p => p.selectedAttack);
      
      set({
        battleState: {
          ...battleState,
          players: updatedPlayers,
          phase: bothSelected ? 'resolving' : 'selecting'
        }
      });
      
      // Auto-resolve when both players have selected
      if (bothSelected) {
        setTimeout(() => {
          get().resolveRound();
        }, 1500); // 1.5 second delay to show selections
      }
    },
    
    
    resolveRound: () => {
      const { battleState } = get();
      const [player1, player2] = battleState.players;
      
      if (!player1.selectedAttack || !player2.selectedAttack) {
        return;
      }
      
      // Determine winner based on rock-paper-scissors rules
      const roundResult = determineRoundWinner(player1, player2);
      if (!roundResult) return;
      
      const { winner, loser } = roundResult;
      
      // Winner (highest roulette) attacks the loser
      const battleResult = calculateDamage(
        winner,
        loser,
        winner.selectedAttack!,
        loser.selectedAttack!
      );
      
      // Apply damage to the player who had the lower roulette value
      const updatedPlayers = battleState.players.map(player => {
        if (player.id === loser.id) {
          const newHealth = Math.max(0, player.health - battleResult.damage);
          console.log(`Player ${player.id} took ${battleResult.damage} damage. Health: ${player.health} -> ${newHealth}`);
          return { 
            ...player, 
            health: newHealth,
            selectedAttack: undefined
          };
        }
        return { 
          ...player, 
          selectedAttack: undefined
        };
      }) as [Player, Player];
      
      const gameWinner = updatedPlayers.find(p => p.health <= 0) 
        ? (updatedPlayers.find(p => p.health > 0)?.id as 1 | 2)
        : undefined;
      
      set({
        battleState: {
          ...battleState,
          players: updatedPlayers,
          currentRound: battleState.currentRound + 1,
          phase: gameWinner ? 'ended' : 'selecting',
          winner: gameWinner,
          lastBattleResult: battleResult
        }
      });
      
      if (gameWinner) {
        setTimeout(() => set({ gamePhase: 'results' }), 2000);
      }
    },
    
    resetBattle: () => {
      set({
        battleState: initialBattleState,
        gamePhase: 'menu'
      });
    },
    
    scanNFCCard: (playerId) => {
      // Mock NFC card scanning
      const { battleState } = get();
      const newCard = createMockNFCCard(playerId);
      
      const updatedPlayers = battleState.players.map(player => 
        player.id === playerId ? { ...player, nfcCard: newCard } : player
      ) as [Player, Player];
      
      set({
        battleState: {
          ...battleState,
          players: updatedPlayers
        }
      });
    }
  }))
);
