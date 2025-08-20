import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GamePhase, Player, BattleState, BattleResult, AttackType } from '@/types/game';
import { calculateDamage, determineRoundWinner, createMockNFCCard, getWinReason } from '@/lib/gameLogic';
import { scanNFCCard, isNFCSupported, requestNFCPermission, createNFCCardFromParsedData, mockNFCScan } from '@/lib/nfc';

interface FightingState {
  gamePhase: GamePhase;
  battleState: BattleState;
  
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  startBattle: () => void;
  selectAttack: (playerId: 1 | 2, attack: AttackType) => void;
  resolveRound: () => void;
  resetBattle: () => void;
  scanNFCCard: (playerId: 1 | 2) => Promise<void>;
}

const createInitialPlayer = (id: 1 | 2): Player => ({
  id,
  name: `Player ${id}`,
  health: 100,
  maxHealth: 100,
  nfcCard: undefined  // Start without NFC card - players must scan to get one
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
    },
    
    
    
    resolveRound: () => {
      const { battleState } = get();
      const [player1, player2] = battleState.players;
      
      if (!player1.selectedAttack || !player2.selectedAttack) {
        return;
      }
      
      // Determine winner based on rock-paper-scissors choices
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
            selectedAttack: undefined,
          };
        }
        return { 
          ...player, 
          selectedAttack: undefined,
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
    
    
    scanNFCCard: async (playerId) => {
      try {
        const { battleState } = get();
        
        // Check if NFC is supported
        if (!isNFCSupported()) {
          console.log('NFC not supported, using mock scan');
          // Fallback to mock for testing
          const parsedData = await mockNFCScan();
          console.log('Mock scan result:', parsedData);
          const newCard = createNFCCardFromParsedData(parsedData, playerId);
          console.log('Created NFC card:', newCard);
          
          const updatedPlayers = battleState.players.map(player => 
            player.id === playerId ? { ...player, nfcCard: newCard } : player
          ) as [Player, Player];
          
          console.log('Updated players:', updatedPlayers);
          
          set({
            battleState: {
              ...battleState,
              players: updatedPlayers
            }
          });
          return;
        }

        // Request NFC permission first
        const hasPermission = await requestNFCPermission();
        if (!hasPermission) {
          throw new Error('NFC permission not granted');
        }

        // Scan the NFC card
        const parsedData = await scanNFCCard();
        if (!parsedData) {
          throw new Error('Could not read NFC card data');
        }

        // Create NFC card from parsed data
        const newCard = createNFCCardFromParsedData(parsedData, playerId);
        
        const updatedPlayers = battleState.players.map(player => 
          player.id === playerId ? { ...player, nfcCard: newCard } : player
        ) as [Player, Player];
        
        set({
          battleState: {
            ...battleState,
            players: updatedPlayers
          }
        });

        console.log(`NFC card scanned successfully for Player ${playerId}:`, newCard);
        
      } catch (error) {
        console.error('NFC scan failed:', error);
        
        // Show user-friendly error and fallback to mock
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`NFC scan failed: ${errorMessage}. Using mock card for testing.`);
        
        const { battleState } = get();
        const parsedData = await mockNFCScan();
        const newCard = createNFCCardFromParsedData(parsedData, playerId);
        
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
    }
  }))
);
