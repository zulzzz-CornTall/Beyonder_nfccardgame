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
  selectCharacterCard: (playerId: 1 | 2, cardIndex: number) => void;
  selectPowerCard: (playerId: 1 | 2, cardIndex: number) => void;
}

const createInitialPlayer = (id: 1 | 2): Player => ({
  id,
  name: `Player ${id}`,
  health: 100,
  maxHealth: 100,
  scannedCards: [],  // Start with no scanned cards
  selectedCharacterCard: undefined,  // No character selected yet
  selectedPowerCard: undefined       // No power card selected yet
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
      // Clear selected attacks and RPS choices, but preserve health and selected character
      const updatedPlayers = battleState.players.map(player => ({
        ...player,
        selectedAttack: undefined,
        rpsChoice: undefined
      })) as [Player, Player];

      set({
        gamePhase: 'character-selection',
        battleState: {
          ...battleState,
          players: updatedPlayers,
          phase: 'selecting'
        }
      });
    },

    startBattle: () => {
      const { battleState } = get();
      // Only start battle if both players have selected both character and power cards
      const bothPlayersReady = battleState.players.every(p => p.selectedCharacterCard && p.selectedPowerCard);
      
      if (!bothPlayersReady) {
        alert('Both players must select a character card AND a power card before starting the battle!');
        return;
      }

      // Use exact HP from character card (no boosts)
      const updatedPlayers = battleState.players.map(player => {
        const exactHP = player.selectedCharacterCard!.currentHp;
        
        return {
          ...player,
          health: exactHP,
          maxHealth: exactHP
        };
      }) as [Player, Player];

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

      // Get current health values before any updates
      const [currentPlayer1, currentPlayer2] = battleState.players;

      // Apply damage only to the selected card of the losing player
      const updatedPlayers = battleState.players.map(player => {
        if (player.id === loser.id) {
          // Update the selected card's health and sync player health
          const selectedCard = player.selectedCharacterCard!;
          const newCardHealth = Math.max(0, selectedCard.currentHp - battleResult.damage);
          
          // Update the selected card in the scannedCards array
          const updatedScannedCards = player.scannedCards.map(card => 
            card.id === selectedCard.id 
              ? { ...card, currentHp: newCardHealth }
              : card  // Other cards remain unchanged
          );
          
          // Update the selected character card reference
          const updatedSelectedCharacterCard = {
            ...selectedCard,
            currentHp: newCardHealth
          };
          
          console.log(`Player ${player.id} (${selectedCard.name}) took ${battleResult.damage} damage. Health: ${selectedCard.currentHp} -> ${newCardHealth}`);
          console.log(`Other cards in Player ${player.id}'s collection remain unaffected`);
          
          return {
            ...player,
            health: newCardHealth,  // Sync player health with selected card
            scannedCards: updatedScannedCards,
            selectedCharacterCard: updatedSelectedCharacterCard,
            selectedAttack: undefined,
            rpsChoice: undefined,
          };
        } else {
          console.log(`Player ${player.id} (${player.selectedCharacterCard?.name}) won and took no damage. Health remains: ${player.selectedCharacterCard?.currentHp}`);
          return {
            ...player,
            selectedAttack: undefined,
            rpsChoice: undefined,
          };
        }
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
      } else {
        // After each round, allow players to change characters
        setTimeout(() => {
          get().startCharacterSelection();
        }, 2000);
      }
    },

    resetBattle: () => {
      // Reset all card health back to max when resetting battle
      const resetPlayers = initialBattleState.players.map(player => ({
        ...player,
        scannedCards: player.scannedCards.map(card => ({
          ...card,
          currentHp: card.hp  // Reset all cards to full health
        })),
        selectedCharacterCard: player.selectedCharacterCard ? {
          ...player.selectedCharacterCard,
          currentHp: player.selectedCharacterCard.hp
        } : undefined,
        selectedPowerCard: undefined  // Clear power card selection on reset
      })) as [Player, Player];

      set({
        battleState: {
          ...initialBattleState,
          players: resetPlayers
        },
        gamePhase: 'menu'
      });
    },

    selectCharacterCard: (playerId, cardIndex) => {
      const { battleState } = get();
      const updatedPlayers = battleState.players.map(player => {
        if (player.id === playerId) {
          const selectedCard = player.scannedCards[cardIndex];
          if (!selectedCard || selectedCard.type !== 'character') {
            console.error(`No character card found at index ${cardIndex} for player ${playerId}`);
            return player;
          }
          return { ...player, selectedCharacterCard: selectedCard };
        }
        return player;
      }) as [Player, Player];

      set({
        battleState: {
          ...battleState,
          players: updatedPlayers
        }
      });

      console.log(`Player ${playerId} selected character: ${updatedPlayers.find(p => p.id === playerId)?.selectedCharacterCard?.name}`);
    },

    selectPowerCard: (playerId, cardIndex) => {
      const { battleState } = get();
      const updatedPlayers = battleState.players.map(player => {
        if (player.id === playerId) {
          const selectedCard = player.scannedCards[cardIndex];
          if (!selectedCard || selectedCard.type !== 'power') {
            console.error(`No power card found at index ${cardIndex} for player ${playerId}`);
            return player;
          }
          return { ...player, selectedPowerCard: selectedCard };
        }
        return player;
      }) as [Player, Player];

      set({
        battleState: {
          ...battleState,
          players: updatedPlayers
        }
      });

      console.log(`Player ${playerId} selected power card: ${updatedPlayers.find(p => p.id === playerId)?.selectedPowerCard?.name}`);
    },


    scanNFCCard: async (playerId) => {
      try {
        const { battleState } = get();
        const currentPlayer = battleState.players.find(p => p.id === playerId);

        // Check if player already has 2 cards (1 character + 1 power)
        if (currentPlayer && currentPlayer.scannedCards.length >= 2) {
          alert('You can only scan 2 cards per player (1 character + 1 power)!');
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
              const newScannedCards = [...player.scannedCards, newCard];
              const newPlayer = { 
                ...player, 
                scannedCards: newScannedCards
              };
              
              // Auto-select cards based on type
              if (newCard.type === 'character' && !player.selectedCharacterCard) {
                newPlayer.selectedCharacterCard = newCard;
              } else if (newCard.type === 'power' && !player.selectedPowerCard) {
                newPlayer.selectedPowerCard = newCard;
              }
              
              return newPlayer;
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
          
          // Check if both players are ready for battle (have both character and power cards)
          const bothPlayersReady = updatedPlayers.every(p => p.selectedCharacterCard && p.selectedPowerCard);
          if (bothPlayersReady) {
            console.log('Both players ready, starting battle automatically!');
            // Auto-start battle
            setTimeout(() => get().startBattle(), 500); // Small delay for UI feedback
          }
          
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
            const newScannedCards = [...player.scannedCards, newCard];
            const newPlayer = { 
              ...player, 
              scannedCards: newScannedCards
            };
            
            // Auto-select cards based on type
            if (newCard.type === 'character' && !player.selectedCharacterCard) {
              newPlayer.selectedCharacterCard = newCard;
            } else if (newCard.type === 'power' && !player.selectedPowerCard) {
              newPlayer.selectedPowerCard = newCard;
            }
            
            return newPlayer;
          }
          return player;
        }) as [Player, Player];

        set({
          battleState: {
            ...battleState,
            players: updatedPlayers
          }
        });

        // Check if both players are ready for battle (have both character and power cards)
        const bothPlayersReady = updatedPlayers.every(p => p.selectedCharacterCard && p.selectedPowerCard);
        if (bothPlayersReady) {
          console.log('Both players ready, starting battle automatically!');
          // Auto-start battle
          setTimeout(() => get().startBattle(), 500); // Small delay for UI feedback
        }

        console.log(`NFC card scanned successfully for Player ${playerId}:`, newCard);
        console.log(`Player ${playerId} now has ${updatedPlayers.find(p => p.id === playerId)?.scannedCards.length} cards`);

      } catch (error) {
        console.error('NFC scan failed:', error);

        // Show user-friendly error and fallback to mock
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        alert(`NFC scan failed: ${errorMessage}. Using mock card for testing.`);

        const { battleState } = get();
        const currentPlayer = battleState.players.find(p => p.id === playerId);

        // Check if player already has 2 cards
        if (currentPlayer && currentPlayer.scannedCards.length >= 2) {
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