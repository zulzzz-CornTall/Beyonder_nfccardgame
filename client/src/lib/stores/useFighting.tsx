import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { GamePhase, Player, BattleState, BattleResult, AttackType, RPSChoice } from '@/types/game';
import { calculateDamage, determineRoundWinner, createMockNFCCard, getWinReason } from '@/lib/gameLogic';
import { scanNFCCard, isNFCSupported, requestNFCPermission, createNFCCardFromParsedData, mockNFCScan } from '@/lib/nfc';

interface FightingState {
  gamePhase: GamePhase;
  battleState: BattleState;
  
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  startPreparation: () => void;
  startCharacterSelection: () => void;
  startBattle: () => void;
  selectAttack: (playerId: 1 | 2, attack: AttackType) => void;
  selectRPS: (playerId: 1 | 2, choice: RPSChoice) => void;
  resolveRound: () => void;
  resetBattle: () => void;
  scanNFCCard: (playerId: 1 | 2) => Promise<void>;
  selectCharacter: (playerId: 1 | 2, cardIndex: number) => void;
}

const createInitialPlayer = (id: 1 | 2): Player => ({
  id,
  name: `Player ${id}`,
  health: 100,
  maxHealth: 100,
  scannedCards: [],  // Start with no scanned cards
  selectedCard: undefined  // No character selected yet
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
    
    startPreparation: () => {
      set({
        gamePhase: 'preparation',
        battleState: {
          ...initialBattleState,
          players: [createInitialPlayer(1), createInitialPlayer(2)]
        }
      });
    },
    
    startCharacterSelection: () => {
      const { battleState } = get();
      // Only start character selection if both players have at least 1 scanned card
      const bothPlayersHaveCards = battleState.players.every(p => p.scannedCards.length > 0);
      
      if (!bothPlayersHaveCards) {
        alert('Both players must scan at least one NFC card before character selection!');
        return;
      }

      set({
        gamePhase: 'character-selection'
      });
    },
    
    startBattle: () => {
      const { battleState } = get();
      // Only start battle if both players have selected their characters
      const bothPlayersSelectedCharacters = battleState.players.every(p => p.selectedCard);
      
      if (!bothPlayersSelectedCharacters) {
        alert('Both players must select their characters before starting the battle!');
        return;
      }

      // Set health based on selected character's HP
      const updatedPlayers = battleState.players.map(player => ({
        ...player,
        health: player.selectedCard!.hp,
        maxHealth: player.selectedCard!.hp
      })) as [Player, Player];

      set({
        gamePhase: 'battle',
        battleState: {
          ...battleState,
          players: updatedPlayers,
          phase: 'selecting'
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
          phase: bothSelected ? 'rps' : 'selecting'
        }
      });
    },

    selectRPS: (playerId, choice) => {
      const { battleState } = get();
      const updatedPlayers = battleState.players.map(player => 
        player.id === playerId ? { ...player, rpsChoice: choice } : player
      ) as [Player, Player];
      
      const bothSelectedRPS = updatedPlayers.every(p => p.rpsChoice);
      
      set({
        battleState: {
          ...battleState,
          players: updatedPlayers,
          phase: bothSelectedRPS ? 'resolving' : 'rps'
        }
      });

      // Auto-resolve after both players select RPS
      if (bothSelectedRPS) {
        setTimeout(() => {
          get().resolveRound();
        }, 1000);
      }
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
            rpsChoice: undefined,
          };
        }
        return { 
          ...player, 
          selectedAttack: undefined,
          rpsChoice: undefined,
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
    
    selectCharacter: (playerId, cardIndex) => {
      const { battleState } = get();
      const updatedPlayers = battleState.players.map(player => {
        if (player.id === playerId) {
          const selectedCard = player.scannedCards[cardIndex];
          if (!selectedCard) {
            console.error(`No card found at index ${cardIndex} for player ${playerId}`);
            return player;
          }
          return { ...player, selectedCard };
        }
        return player;
      }) as [Player, Player];
      
      set({
        battleState: {
          ...battleState,
          players: updatedPlayers
        }
      });
      
      console.log(`Player ${playerId} selected character: ${updatedPlayers.find(p => p.id === playerId)?.selectedCard?.name}`);
    },
    
    
    scanNFCCard: async (playerId) => {
      try {
        const { battleState } = get();
        const currentPlayer = battleState.players.find(p => p.id === playerId);
        
        // Check if player already has 3 cards
        if (currentPlayer && currentPlayer.scannedCards.length >= 3) {
          alert('You can only scan up to 3 cards per player!');
          return;
        }
        
        // Check if NFC is supported
        if (!isNFCSupported()) {
          console.log('NFC not supported, using mock scan');
          // Fallback to mock for testing
          const parsedData = await mockNFCScan();
          console.log('Mock scan result:', parsedData);
          const newCard = createNFCCardFromParsedData(parsedData, playerId);
          console.log('Created NFC card:', newCard);
          
          const updatedPlayers = battleState.players.map(player => {
            if (player.id === playerId) {
              return { 
                ...player, 
                scannedCards: [...player.scannedCards, newCard]
              };
            }
            return player;
          }) as [Player, Player];
          
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
        
        const updatedPlayers = battleState.players.map(player => {
          if (player.id === playerId) {
            return { 
              ...player, 
              scannedCards: [...player.scannedCards, newCard]
            };
          }
          return player;
        }) as [Player, Player];
        
        set({
          battleState: {
            ...battleState,
            players: updatedPlayers
          }
        });

        console.log(`NFC card scanned successfully for Player ${playerId}:`, newCard);
        console.log(`Player ${playerId} now has ${updatedPlayers.find(p => p.id === playerId)?.scannedCards.length} cards`);
        
      } catch (error) {
        console.error('NFC scan failed:', error);
        
        // Show user-friendly error and fallback to mock
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`NFC scan failed: ${errorMessage}. Using mock card for testing.`);
        
        const { battleState } = get();
        const currentPlayer = battleState.players.find(p => p.id === playerId);
        
        // Check if player already has 3 cards
        if (currentPlayer && currentPlayer.scannedCards.length >= 3) {
          return;
        }
        
        const parsedData = await mockNFCScan();
        const newCard = createNFCCardFromParsedData(parsedData, playerId);
        
        const updatedPlayers = battleState.players.map(player => {
          if (player.id === playerId) {
            return { 
              ...player, 
              scannedCards: [...player.scannedCards, newCard]
            };
          }
          return player;
        }) as [Player, Player];
        
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
