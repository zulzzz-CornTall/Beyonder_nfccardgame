
import { create } from 'zustand';

export type SupportedLanguage = 
  | 'en' | 'fr' | 'id' | 'pt' | 'es' | 'ar' | 'tl' | 'th' | 'ja' | 'zh' | 'ko' | 'ru';

export interface Translation {
  // Main Menu
  mainTitle: string;
  startGame: string;
  howToPlay: string;
  
  // Game phases
  preparation: string;
  characterSelection: string;
  battle: string;
  
  // Battle
  selectAttack: string;
  rock: string;
  paper: string;
  scissors: string;
  waiting: string;
  round: string;
  
  // Results
  victory: string;
  wins: string;
  finalStats: string;
  hpRemaining: string;
  card: string;
  battleLasted: string;
  rounds: string;
  playAgain: string;
  
  // NFC
  scanCard: string;
  cardScanned: string;
  scanFailed: string;
  
  // Common
  player: string;
  health: string;
  name: string;
  cancel: string;
  confirm: string;
  loading: string;
  
  // Attack types
  burst: string;
  guts: string;
  slash: string;
  burstDescription: string;
  gutsDescription: string;
  slashDescription: string;
  
  // UI elements
  backToMenu: string;
  reset: string;
  attack: string;
  selectYourAttacks: string;
  chooserps: string;
  determiningWinner: string;
  battleComplete: string;
  
  // Battle Results
  winnerAnnouncement: string;
  
  // NFC Card Display
  noCardsScanned: string;
  cardsScanned: string;
  maximumReached: string;
  
  // Preparation Screen
  preparationPhase: string;
  bothPlayersMustScan: string;
  bothPlayersReady: string;
  clickStartBattle: string;
  waitingForPlayers: string;
  howToPrepare: string;
  eachPlayerMustScan: string;
  youCanScanUpTo: string;
  onceBothPlayersHave: string;
  yourFirstScanned: string;
  battleWillBegin: string;
  startBattle: string;
  
  // Character Selection Screen
  selectionStatus: string;
  characterCard: string;
  powerCard: string;
  notSelected: string;
  selected: string;
  eachPlayerMustSelect: string;
  powerCardsOptional: string;
  powerCardsBoost: string;
  characterCards: string;
  powerCards: string;
  noCharacterCards: string;
  noPowerCards: string;
  
  // Game Rules
  gameRules: string;
  basicGameplay: string;
  attackTypes: string;
  
  // Status messages
  cardsReady: string;
  needCharacter: string;
  noCards: string;
  
  // Rock Paper Scissors
  spinningRoulette: string;
  readyToSpin: string;
  startRoulette: string;
  
  // Battle Results
  attackUsed: string;
  effectiveness: string;
  damageDealt: string;
  criticalHit: string;
  continuingIn3Seconds: string;
  
  // NFC Card Display
  cannotScanDuringBattle: string;
  scanFirstCard: string;
  scanAnotherCard: string;
  maxCardsReached: string;
}

const translations: Record<SupportedLanguage, Translation> = {
  en: {
    mainTitle: "Battle Arena",
    startGame: "Start Game",
    howToPlay: "How to Play",
    preparation: "Preparation",
    characterSelection: "Character Selection",
    battle: "Battle",
    selectAttack: "Select Your Attack",
    rock: "Rock",
    paper: "Paper",
    scissors: "Scissors",
    waiting: "Waiting for opponent...",
    round: "Round",
    victory: "VICTORY!",
    wins: "Wins!",
    finalStats: "Final Stats",
    hpRemaining: "HP Remaining",
    card: "Card",
    battleLasted: "Battle lasted",
    rounds: "rounds",
    playAgain: "Play Again",
    scanCard: "Scan Card",
    cardScanned: "Card Scanned",
    scanFailed: "Scan Failed",
    player: "Player",
    health: "Health",
    name: "Name",
    cancel: "Cancel",
    confirm: "Confirm",
    loading: "Loading...",
    
    // Attack types
    burst: "Burst",
    guts: "Guts",
    slash: "Slash",
    burstDescription: "Explosive energy attack - Strong vs Guts",
    gutsDescription: "Defensive power strike - Strong vs Slash",
    slashDescription: "Swift cutting attack - Strong vs Burst",
    
    // UI elements
    backToMenu: "Back to Menu",
    reset: "Reset",
    attack: "Attack",
    selectYourAttacks: "Select your attacks",
    chooserps: "Choose Rock, Paper, or Scissors!",
    determiningWinner: "Determining winner...",
    battleComplete: "Battle Complete!",
    
    // Battle Results
    winnerAnnouncement: "Wins!",
    
    // NFC Card Display
    noCardsScanned: "No cards scanned yet",
    cardsScanned: "cards scanned",
    maximumReached: "cards scanned (maximum reached)",
    
    // Preparation Screen
    preparationPhase: "Preparation Phase",
    bothPlayersMustScan: "Both players must scan their NFC cards before battle",
    bothPlayersReady: "Both players ready - Click Start Battle to begin fighting!",
    clickStartBattle: "Click Start Battle to begin!",
    waitingForPlayers: "Waiting for both players to scan at least one character card each",
    howToPrepare: "How to Prepare:",
    eachPlayerMustScan: "Each player must scan at least one character card using the 'Scan NFC Card' button",
    youCanScanUpTo: "You can scan up to 3 cards total (character and power cards)",
    onceBothPlayersHave: "Once both players have character cards, click 'Start Battle' to begin!",
    yourFirstScanned: "Your first scanned character card will be automatically used in battle",
    battleWillBegin: "Battle will begin immediately with roulette-based combat",
    startBattle: "Start Battle",
    
    // Character Selection Screen
    selectionStatus: "Selection Status:",
    characterCard: "Character Card:",
    powerCard: "Power Card:",
    notSelected: "Not selected",
    selected: "Selected",
    eachPlayerMustSelect: "Each player must select one character card to battle. Power cards are optional but recommended.",
    powerCardsOptional: "Power cards are optional but recommended.",
    powerCardsBoost: "Power cards will boost your character's attacks and HP during battle.",
    characterCards: "Character Cards",
    powerCards: "Power Cards",
    noCharacterCards: "No character cards scanned",
    noPowerCards: "No power cards scanned",
    
    // Game Rules
    gameRules: "Game Rules",
    basicGameplay: "Basic Gameplay",
    attackTypes: "Attack Types",
    
    // Status messages
    cardsReady: "Cards (Character Ready)",
    needCharacter: "Cards (Need Character)",
    noCards: "No Cards",
    
    // Rock Paper Scissors
    spinningRoulette: "Spinning Roulette",
    readyToSpin: "Ready to spin",
    startRoulette: "Start Roulette",
    
    // Battle Results
    attackUsed: "Attack Used",
    effectiveness: "Effectiveness",
    damageDealt: "Damage Dealt",
    criticalHit: "CRITICAL HIT",
    continuingIn3Seconds: "Continuing in 3 seconds",
    
    // NFC Card Display
    cannotScanDuringBattle: "Cannot scan cards during battle! Please wait until the battle ends.",
    scanFirstCard: "Scan First Card",
    scanAnotherCard: "Scan Another Card",
    maxCardsReached: "You can only scan up to 3 cards per player!"
  },
  fr: {
    mainTitle: "Arène de Combat",
    startGame: "Commencer le Jeu",
    howToPlay: "Comment Jouer",
    preparation: "Préparation",
    characterSelection: "Sélection de Personnage",
    battle: "Combat",
    selectAttack: "Sélectionnez Votre Attaque",
    rock: "Pierre",
    paper: "Papier",
    scissors: "Ciseaux",
    waiting: "En attente de l'adversaire...",
    round: "Manche",
    victory: "VICTOIRE!",
    wins: "Gagne!",
    finalStats: "Statistiques Finales",
    hpRemaining: "PV Restants",
    card: "Carte",
    battleLasted: "Le combat a duré",
    rounds: "manches",
    playAgain: "Rejouer",
    scanCard: "Scanner la Carte",
    cardScanned: "Carte Scannée",
    scanFailed: "Échec du Scan",
    player: "Joueur",
    health: "Santé",
    name: "Nom",
    cancel: "Annuler",
    confirm: "Confirmer",
    loading: "Chargement...",
    
    // Attack types
    burst: "Explosion",
    guts: "Courage",
    slash: "Tranche",
    burstDescription: "Attaque d'énergie explosive - Fort contre Courage",
    gutsDescription: "Frappe de puissance défensive - Fort contre Tranche",
    slashDescription: "Attaque de coupe rapide - Fort contre Explosion",
    
    // UI elements
    backToMenu: "Retour au Menu",
    reset: "Réinitialiser",
    attack: "Attaque",
    selectYourAttacks: "Sélectionnez vos attaques",
    chooserps: "Choisissez Pierre, Papier ou Ciseaux!",
    determiningWinner: "Détermination du gagnant...",
    battleComplete: "Combat Terminé!",
    
    // Battle Results
    winnerAnnouncement: "Gagne!",
    
    // NFC Card Display
    noCardsScanned: "Aucune carte scannée",
    cardsScanned: "cartes scannées",
    maximumReached: "cartes scannées (maximum atteint)",
    
    // Preparation Screen
    preparationPhase: "Phase de Préparation",
    bothPlayersMustScan: "Les deux joueurs doivent scanner leurs cartes NFC avant le combat",
    bothPlayersReady: "Les deux joueurs sont prêts - Cliquez sur Commencer le Combat pour commencer!",
    clickStartBattle: "Cliquez sur Commencer le Combat!",
    waitingForPlayers: "En attente que les deux joueurs scannent au moins une carte de personnage chacun",
    howToPrepare: "Comment se Préparer:",
    eachPlayerMustScan: "Chaque joueur doit scanner au moins une carte de personnage en utilisant le bouton 'Scanner Carte NFC'",
    youCanScanUpTo: "Vous pouvez scanner jusqu'à 3 cartes au total (cartes de personnage et de pouvoir)",
    onceBothPlayersHave: "Une fois que les deux joueurs ont des cartes de personnage, cliquez sur 'Commencer le Combat'!",
    yourFirstScanned: "Votre première carte de personnage scannée sera automatiquement utilisée en combat",
    battleWillBegin: "Le combat commencera immédiatement avec un combat basé sur la roulette",
    startBattle: "Commencer le Combat",
    
    // Character Selection Screen
    selectionStatus: "Statut de Sélection:",
    characterCard: "Carte de Personnage:",
    powerCard: "Carte de Pouvoir:",
    notSelected: "Non sélectionné",
    selected: "Sélectionné",
    eachPlayerMustSelect: "Chaque joueur doit sélectionner une carte de personnage pour combattre. Les cartes de pouvoir sont optionnelles mais recommandées.",
    powerCardsOptional: "Les cartes de pouvoir sont optionnelles mais recommandées.",
    powerCardsBoost: "Les cartes de pouvoir augmenteront les attaques et HP de votre personnage pendant le combat.",
    characterCards: "Cartes de Personnage",
    powerCards: "Cartes de Pouvoir",
    noCharacterCards: "Aucune carte de personnage scannée",
    noPowerCards: "Aucune carte de pouvoir scannée",
    
    // Game Rules
    gameRules: "Règles du Jeu",
    basicGameplay: "Gameplay de Base",
    attackTypes: "Types d'Attaque",
    
    // Status messages
    cardsReady: "Cartes (Personnage Prêt)",
    needCharacter: "Cartes (Besoin de Personnage)",
    noCards: "Aucune Carte"
  },
  id: {
    mainTitle: "Arena Pertempuran",
    startGame: "Mulai Permainan",
    howToPlay: "Cara Bermain",
    preparation: "Persiapan",
    characterSelection: "Pemilihan Karakter",
    battle: "Pertempuran",
    selectAttack: "Pilih Serangan Anda",
    rock: "Batu",
    paper: "Kertas",
    scissors: "Gunting",
    waiting: "Menunggu lawan...",
    round: "Ronde",
    victory: "KEMENANGAN!",
    wins: "Menang!",
    finalStats: "Statistik Akhir",
    hpRemaining: "HP Tersisa",
    card: "Kartu",
    battleLasted: "Pertempuran berlangsung",
    rounds: "ronde",
    playAgain: "Main Lagi",
    scanCard: "Pindai Kartu",
    cardScanned: "Kartu Dipindai",
    scanFailed: "Gagal Memindai",
    player: "Pemain",
    health: "Kesehatan",
    name: "Nama",
    cancel: "Batal",
    confirm: "Konfirmasi",
    loading: "Memuat...",
    
    // Attack types
    burst: "Ledakan",
    guts: "Keberanian",
    slash: "Tebasan",
    burstDescription: "Serangan energi eksplosif - Kuat melawan Keberanian",
    gutsDescription: "Pukulan kekuatan defensif - Kuat melawan Tebasan",
    slashDescription: "Serangan potong cepat - Kuat melawan Ledakan",
    
    // UI elements
    backToMenu: "Kembali ke Menu",
    reset: "Reset",
    attack: "Serangan",
    selectYourAttacks: "Pilih serangan Anda",
    chooserps: "Pilih Batu, Kertas, atau Gunting!",
    determiningWinner: "Menentukan pemenang...",
    battleComplete: "Pertempuran Selesai!",
    
    // Battle Results
    winnerAnnouncement: "Menang!",
    
    // NFC Card Display
    noCardsScanned: "Belum ada kartu yang dipindai",
    cardsScanned: "kartu dipindai",
    maximumReached: "kartu dipindai (maksimum tercapai)",
    
    // Preparation Screen
    preparationPhase: "Fase Persiapan",
    bothPlayersMustScan: "Kedua pemain harus memindai kartu NFC mereka sebelum pertempuran",
    bothPlayersReady: "Kedua pemain siap - Klik Mulai Pertempuran untuk memulai!",
    clickStartBattle: "Klik Mulai Pertempuran!",
    waitingForPlayers: "Menunggu kedua pemain memindai setidaknya satu kartu karakter",
    howToPrepare: "Cara Bersiap:",
    eachPlayerMustScan: "Setiap pemain harus memindai setidaknya satu kartu karakter menggunakan tombol 'Pindai Kartu NFC'",
    youCanScanUpTo: "Anda dapat memindai hingga 3 kartu total (kartu karakter dan kekuatan)",
    onceBothPlayersHave: "Setelah kedua pemain memiliki kartu karakter, klik 'Mulai Pertempuran'!",
    yourFirstScanned: "Kartu karakter pertama yang dipindai akan otomatis digunakan dalam pertempuran",
    battleWillBegin: "Pertempuran akan dimulai langsung dengan pertarungan berbasis roulette",
    startBattle: "Mulai Pertempuran",
    
    // Character Selection Screen
    selectionStatus: "Status Seleksi:",
    characterCard: "Kartu Karakter:",
    powerCard: "Kartu Kekuatan:",
    notSelected: "Tidak dipilih",
    selected: "Dipilih",
    eachPlayerMustSelect: "Setiap pemain harus memilih satu kartu karakter untuk bertarung. Kartu kekuatan opsional tetapi direkomendasikan.",
    powerCardsOptional: "Kartu kekuatan opsional tetapi direkomendasikan.",
    powerCardsBoost: "Kartu kekuatan akan meningkatkan serangan dan HP karakter Anda selama pertempuran.",
    characterCards: "Kartu Karakter",
    powerCards: "Kartu Kekuatan",
    noCharacterCards: "Tidak ada kartu karakter yang dipindai",
    noPowerCards: "Tidak ada kartu kekuatan yang dipindai",
    
    // Game Rules
    gameRules: "Aturan Permainan",
    basicGameplay: "Gameplay Dasar",
    attackTypes: "Jenis Serangan",
    
    // Status messages
    cardsReady: "Kartu (Karakter Siap)",
    needCharacter: "Kartu (Perlu Karakter)",
    noCards: "Tidak Ada Kartu"
  },
  pt: {
    mainTitle: "Arena de Batalha",
    startGame: "Iniciar Jogo",
    howToPlay: "Como Jogar",
    preparation: "Preparação",
    characterSelection: "Seleção de Personagem",
    battle: "Batalha",
    selectAttack: "Selecione Seu Ataque",
    rock: "Pedra",
    paper: "Papel",
    scissors: "Tesoura",
    waiting: "Aguardando oponente...",
    round: "Rodada",
    victory: "VITÓRIA!",
    wins: "Vence!",
    finalStats: "Estatísticas Finais",
    hpRemaining: "HP Restante",
    card: "Carta",
    battleLasted: "Batalha durou",
    rounds: "rodadas",
    playAgain: "Jogar Novamente",
    scanCard: "Escanear Carta",
    cardScanned: "Carta Escaneada",
    scanFailed: "Falha no Escaneamento",
    player: "Jogador",
    health: "Saúde",
    name: "Nome",
    cancel: "Cancelar",
    confirm: "Confirmar",
    loading: "Carregando...",
    
    // Attack types
    burst: "Explosão",
    guts: "Coragem",
    slash: "Corte",
    burstDescription: "Ataque de energia explosiva - Forte contra Coragem",
    gutsDescription: "Golpe de poder defensivo - Forte contra Corte",
    slashDescription: "Ataque de corte rápido - Forte contra Explosão",
    
    // UI elements
    backToMenu: "Voltar ao Menu",
    reset: "Resetar",
    attack: "Ataque",
    selectYourAttacks: "Selecione seus ataques",
    chooserps: "Escolha Pedra, Papel ou Tesoura!",
    determiningWinner: "Determinando vencedor...",
    battleComplete: "Batalha Completa!",
    
    // Battle Results
    winnerAnnouncement: "Vence!",
    
    // NFC Card Display
    noCardsScanned: "Nenhuma carta escaneada",
    cardsScanned: "cartas escaneadas",
    maximumReached: "cartas escaneadas (máximo atingido)",
    
    // Preparation Screen
    preparationPhase: "Fase de Preparação",
    bothPlayersMustScan: "Ambos os jogadores devem escanear suas cartas NFC antes da batalha",
    bothPlayersReady: "Ambos os jogadores prontos - Clique em Iniciar Batalha para começar!",
    clickStartBattle: "Clique em Iniciar Batalha!",
    waitingForPlayers: "Aguardando ambos os jogadores escanearem pelo menos uma carta de personagem",
    howToPrepare: "Como se Preparar:",
    eachPlayerMustScan: "Cada jogador deve escanear pelo menos uma carta de personagem usando o botão 'Escanear Carta NFC'",
    youCanScanUpTo: "Você pode escanear até 3 cartas no total (cartas de personagem e poder)",
    onceBothPlayersHave: "Uma vez que ambos os jogadores tenham cartas de personagem, clique em 'Iniciar Batalha'!",
    yourFirstScanned: "Sua primeira carta de personagem escaneada será automaticamente usada na batalha",
    battleWillBegin: "A batalha começará imediatamente com combate baseado em roleta",
    startBattle: "Iniciar Batalha",
    
    // Character Selection Screen
    selectionStatus: "Status de Seleção:",
    characterCard: "Carta de Personagem:",
    powerCard: "Carta de Poder:",
    notSelected: "Não selecionado",
    selected: "Selecionado",
    eachPlayerMustSelect: "Cada jogador deve selecionar uma carta de personagem para batalhar. Cartas de poder são opcionais mas recomendadas.",
    powerCardsOptional: "Cartas de poder são opcionais mas recomendadas.",
    powerCardsBoost: "Cartas de poder irão aumentar os ataques e HP do seu personagem durante a batalha.",
    characterCards: "Cartas de Personagem",
    powerCards: "Cartas de Poder",
    noCharacterCards: "Nenhuma carta de personagem escaneada",
    noPowerCards: "Nenhuma carta de poder escaneada",
    
    // Game Rules
    gameRules: "Regras do Jogo",
    basicGameplay: "Jogabilidade Básica",
    attackTypes: "Tipos de Ataque",
    
    // Status messages
    cardsReady: "Cartas (Personagem Pronto)",
    needCharacter: "Cartas (Precisa de Personagem)",
    noCards: "Sem Cartas"
  },
  es: {
    mainTitle: "Arena de Batalla",
    startGame: "Iniciar Juego",
    howToPlay: "Cómo Jugar",
    preparation: "Preparación",
    characterSelection: "Selección de Personaje",
    battle: "Batalla",
    selectAttack: "Selecciona Tu Ataque",
    rock: "Piedra",
    paper: "Papel",
    scissors: "Tijeras",
    waiting: "Esperando oponente...",
    round: "Ronda",
    victory: "¡VICTORIA!",
    wins: "¡Gana!",
    finalStats: "Estadísticas Finales",
    hpRemaining: "HP Restante",
    card: "Carta",
    battleLasted: "La batalla duró",
    rounds: "rondas",
    playAgain: "Jugar de Nuevo",
    scanCard: "Escanear Carta",
    cardScanned: "Carta Escaneada",
    scanFailed: "Fallo al Escanear",
    player: "Jugador",
    health: "Salud",
    name: "Nombre",
    cancel: "Cancelar",
    confirm: "Confirmar",
    loading: "Cargando...",
    
    // Attack types
    burst: "Explosión",
    guts: "Valor",
    slash: "Corte",
    burstDescription: "Ataque de energía explosiva - Fuerte contra Valor",
    gutsDescription: "Golpe de poder defensivo - Fuerte contra Corte",
    slashDescription: "Ataque de corte rápido - Fuerte contra Explosión",
    
    // UI elements
    backToMenu: "Volver al Menú",
    reset: "Reiniciar",
    attack: "Ataque",
    selectYourAttacks: "Selecciona tus ataques",
    chooserps: "¡Elige Piedra, Papel o Tijeras!",
    determiningWinner: "Determinando ganador...",
    battleComplete: "¡Batalla Completa!",
    
    // Battle Results
    winnerAnnouncement: "¡Gana!",
    
    // NFC Card Display
    noCardsScanned: "No hay cartas escaneadas",
    cardsScanned: "cartas escaneadas",
    maximumReached: "cartas escaneadas (máximo alcanzado)",
    
    // Preparation Screen
    preparationPhase: "Fase de Preparación",
    bothPlayersMustScan: "Ambos jugadores deben escanear sus cartas NFC antes de la batalla",
    bothPlayersReady: "Ambos jugadores listos - ¡Haz clic en Iniciar Batalla para comenzar!",
    clickStartBattle: "¡Haz clic en Iniciar Batalla!",
    waitingForPlayers: "Esperando que ambos jugadores escaneen al menos una carta de personaje",
    howToPrepare: "Cómo Prepararse:",
    eachPlayerMustScan: "Cada jugador debe escanear al menos una carta de personaje usando el botón 'Escanear Carta NFC'",
    youCanScanUpTo: "Puedes escanear hasta 3 cartas en total (cartas de personaje y poder)",
    onceBothPlayersHave: "Una vez que ambos jugadores tengan cartas de personaje, ¡haz clic en 'Iniciar Batalla'!",
    yourFirstScanned: "Tu primera carta de personaje escaneada se usará automáticamente en batalla",
    battleWillBegin: "La batalla comenzará inmediatamente con combate basado en ruleta",
    startBattle: "Iniciar Batalla",
    
    // Character Selection Screen
    selectionStatus: "Estado de Selección:",
    characterCard: "Carta de Personaje:",
    powerCard: "Carta de Poder:",
    notSelected: "No seleccionado",
    selected: "Seleccionado",
    eachPlayerMustSelect: "Cada jugador debe seleccionar una carta de personaje para batallar. Las cartas de poder son opcionales pero recomendadas.",
    powerCardsOptional: "Las cartas de poder son opcionales pero recomendadas.",
    powerCardsBoost: "Las cartas de poder aumentarán los ataques y HP de tu personaje durante la batalla.",
    characterCards: "Cartas de Personaje",
    powerCards: "Cartas de Poder",
    noCharacterCards: "No hay cartas de personaje escaneadas",
    noPowerCards: "No hay cartas de poder escaneadas",
    
    // Game Rules
    gameRules: "Reglas del Juego",
    basicGameplay: "Jugabilidad Básica",
    attackTypes: "Tipos de Ataque",
    
    // Status messages
    cardsReady: "Cartas (Personaje Listo)",
    needCharacter: "Cartas (Necesita Personaje)",
    noCards: "Sin Cartas"
  },
  ar: {
    mainTitle: "حلبة المعركة",
    startGame: "ابدأ اللعبة",
    howToPlay: "كيفية اللعب",
    preparation: "التحضير",
    characterSelection: "اختيار الشخصية",
    battle: "المعركة",
    selectAttack: "اختر هجومك",
    rock: "حجر",
    paper: "ورقة",
    scissors: "مقص",
    waiting: "في انتظار الخصم...",
    round: "الجولة",
    victory: "النصر!",
    wins: "يفوز!",
    finalStats: "الإحصائيات النهائية",
    hpRemaining: "النقاط المتبقية",
    card: "البطاقة",
    battleLasted: "استمرت المعركة",
    rounds: "جولات",
    playAgain: "العب مرة أخرى",
    scanCard: "مسح البطاقة",
    cardScanned: "تم مسح البطاقة",
    scanFailed: "فشل المسح",
    player: "اللاعب",
    health: "الصحة",
    name: "الاسم",
    cancel: "إلغاء",
    confirm: "تأكيد",
    loading: "جاري التحميل...",
    
    // Attack types
    burst: "انفجار",
    guts: "شجاعة",
    slash: "قطع",
    burstDescription: "هجوم طاقة متفجرة - قوي ضد الشجاعة",
    gutsDescription: "ضربة قوة دفاعية - قوية ضد القطع",
    slashDescription: "هجوم قطع سريع - قوي ضد الانفجار",
    
    // UI elements
    backToMenu: "العودة للقائمة",
    reset: "إعادة تعيين",
    attack: "هجوم",
    selectYourAttacks: "اختر هجماتك",
    chooserps: "اختر حجر أو ورقة أو مقص!",
    determiningWinner: "تحديد الفائز...",
    battleComplete: "المعركة مكتملة!",
    
    // Battle Results
    winnerAnnouncement: "يفوز!",
    
    // NFC Card Display
    noCardsScanned: "لم يتم مسح أي بطاقات",
    cardsScanned: "بطاقات تم مسحها",
    maximumReached: "بطاقات تم مسحها (الحد الأقصى)",
    
    // Preparation Screen
    preparationPhase: "مرحلة التحضير",
    bothPlayersMustScan: "يجب على كلا اللاعبين مسح بطاقات NFC قبل المعركة",
    bothPlayersReady: "كلا اللاعبين جاهزان - انقر ابدأ المعركة للبدء!",
    clickStartBattle: "انقر ابدأ المعركة!",
    waitingForPlayers: "انتظار كلا اللاعبين لمسح بطاقة شخصية واحدة على الأقل",
    howToPrepare: "كيفية التحضير:",
    eachPlayerMustScan: "يجب على كل لاعب مسح بطاقة شخصية واحدة على الأقل باستخدام زر 'مسح بطاقة NFC'",
    youCanScanUpTo: "يمكنك مسح حتى 3 بطاقات إجمالي (بطاقات الشخصية والقوة)",
    onceBothPlayersHave: "بمجرد أن يكون لدى كلا اللاعبين بطاقات شخصية، انقر 'ابدأ المعركة'!",
    yourFirstScanned: "أول بطاقة شخصية تم مسحها ستستخدم تلقائياً في المعركة",
    battleWillBegin: "ستبدأ المعركة فوراً مع قتال مبني على الروليت",
    startBattle: "ابدأ المعركة",
    
    // Character Selection Screen
    selectionStatus: "حالة الاختيار:",
    characterCard: "بطاقة الشخصية:",
    powerCard: "بطاقة القوة:",
    notSelected: "غير محدد",
    selected: "محدد",
    eachPlayerMustSelect: "يجب على كل لاعب اختيار بطاقة شخصية واحدة للمعركة. بطاقات القوة اختيارية لكن مستحسنة.",
    powerCardsOptional: "بطاقات القوة اختيارية لكن مستحسنة.",
    powerCardsBoost: "بطاقات القوة ستعزز هجمات شخصيتك ونقاط الحياة أثناء المعركة.",
    characterCards: "بطاقات الشخصية",
    powerCards: "بطاقات القوة",
    noCharacterCards: "لا توجد بطاقات شخصية تم مسحها",
    noPowerCards: "لا توجد بطاقات قوة تم مسحها",
    
    // Game Rules
    gameRules: "قواعد اللعبة",
    basicGameplay: "اللعب الأساسي",
    attackTypes: "أنواع الهجمات",
    
    // Status messages
    cardsReady: "البطاقات (الشخصية جاهزة)",
    needCharacter: "البطاقات (تحتاج شخصية)",
    noCards: "لا توجد بطاقات"
  },
  tl: {
    mainTitle: "Arena ng Labanan",
    startGame: "Simulan ang Laro",
    howToPlay: "Paano Maglaro",
    preparation: "Paghahanda",
    characterSelection: "Pagpili ng Karakter",
    battle: "Labanan",
    selectAttack: "Piliin ang Inyong Atake",
    rock: "Bato",
    paper: "Papel",
    scissors: "Gunting",
    waiting: "Naghihintay sa kalaban...",
    round: "Round",
    victory: "TAGUMPAY!",
    wins: "Nanalo!",
    finalStats: "Huling Estadistika",
    hpRemaining: "HP na Natira",
    card: "Kard",
    battleLasted: "Tumagal ang labanan ng",
    rounds: "rounds",
    playAgain: "Maglaro Ulit",
    scanCard: "I-scan ang Kard",
    cardScanned: "Na-scan ang Kard",
    scanFailed: "Hindi Na-scan",
    player: "Manlalaro",
    health: "Kalusugan",
    name: "Pangalan",
    cancel: "Kanselahin",
    confirm: "Kumpirmahin",
    loading: "Naglo-load...",
    
    // Attack types
    burst: "Pagsabog",
    guts: "Tapang",
    slash: "Hiwa",
    burstDescription: "Explosive energy attack - Malakas laban sa Tapang",
    gutsDescription: "Defensive power strike - Malakas laban sa Hiwa",
    slashDescription: "Swift cutting attack - Malakas laban sa Pagsabog",
    
    // UI elements
    backToMenu: "Bumalik sa Menu",
    reset: "I-reset",
    attack: "Atake",
    selectYourAttacks: "Piliin ang inyong mga atake",
    chooserps: "Pumili ng Bato, Papel, o Gunting!",
    determiningWinner: "Tinutukoy ang nanalo...",
    battleComplete: "Tapos na ang Labanan!",
    
    // Battle Results
    winnerAnnouncement: "Nanalo!",
    
    // NFC Card Display
    noCardsScanned: "Walang naka-scan na mga kard",
    cardsScanned: "mga kard na naka-scan",
    maximumReached: "mga kard na naka-scan (naabot na ang maximum)",
    
    // Preparation Screen
    preparationPhase: "Panahon ng Paghahanda",
    bothPlayersMustScan: "Dapat mag-scan ang dalawang manlalaro ng kanilang mga NFC card bago ang labanan",
    bothPlayersReady: "Handa na ang dalawang manlalaro - I-click ang Simulan ang Labanan para magsimula!",
    clickStartBattle: "I-click ang Simulan ang Labanan!",
    waitingForPlayers: "Naghihintay na mag-scan ang dalawang manlalaro ng hindi bababa sa isang character card",
    howToPrepare: "Paano Maghanda:",
    eachPlayerMustScan: "Dapat mag-scan ang bawat manlalaro ng hindi bababa sa isang character card gamit ang 'Scan NFC Card' button",
    youCanScanUpTo: "Maaari kayong mag-scan ng hanggang 3 kard (character at power cards)",
    onceBothPlayersHave: "Kapag may character cards na ang dalawang manlalaro, i-click ang 'Simulan ang Labanan'!",
    yourFirstScanned: "Ang inyong unang na-scan na character card ay gagamitin sa labanan",
    battleWillBegin: "Magsisimula agad ang labanan na nakabatay sa roulette",
    startBattle: "Simulan ang Labanan",
    
    // Character Selection Screen
    selectionStatus: "Status ng Pagpili:",
    characterCard: "Character Card:",
    powerCard: "Power Card:",
    notSelected: "Hindi napili",
    selected: "Napili",
    eachPlayerMustSelect: "Dapat pumili ang bawat manlalaro ng isang character card para sa labanan. Ang mga power card ay opsyonal ngunit inirerekomenda.",
    powerCardsOptional: "Ang mga power card ay opsyonal ngunit inirerekomenda.",
    powerCardsBoost: "Ang mga power card ay magpapalakas sa mga atake at HP ng inyong character sa labanan.",
    characterCards: "Mga Character Card",
    powerCards: "Mga Power Card",
    noCharacterCards: "Walang na-scan na character cards",
    noPowerCards: "Walang na-scan na power cards",
    
    // Game Rules
    gameRules: "Mga Patakaran ng Laro",
    basicGameplay: "Pangunahing Paglalaro",
    attackTypes: "Mga Uri ng Atake",
    
    // Status messages
    cardsReady: "Mga Kard (Handa na ang Character)",
    needCharacter: "Mga Kard (Kailangan ng Character)",
    noCards: "Walang mga Kard"
  },
  th: {
    mainTitle: "สนามรบ",
    startGame: "เริ่มเกม",
    howToPlay: "วิธีเล่น",
    preparation: "การเตรียมตัว",
    characterSelection: "การเลือกตัวละคร",
    battle: "การต่อสู้",
    selectAttack: "เลือกการโจมตีของคุณ",
    rock: "หิน",
    paper: "กระดาษ",
    scissors: "กรรไกร",
    waiting: "กำลังรอคู่ต่อสู้...",
    round: "ยก",
    victory: "ชัยชนะ!",
    wins: "ชนะ!",
    finalStats: "สถิติสุดท้าย",
    hpRemaining: "HP ที่เหลือ",
    card: "การ์ด",
    battleLasted: "การต่อสู้กินเวลา",
    rounds: "ยก",
    playAgain: "เล่นอีกครั้ง",
    scanCard: "สแกนการ์ด",
    cardScanned: "สแกนการ์ดแล้ว",
    scanFailed: "สแกนไม่สำเร็จ",
    player: "ผู้เล่น",
    health: "พลังชีวิต",
    name: "ชื่อ",
    cancel: "ยกเลิก",
    confirm: "ยืนยัน",
    loading: "กำลังโหลด...",
    
    // Attack types
    burst: "ระเบิด",
    guts: "ความกล้า",
    slash: "ฟัน",
    burstDescription: "การโจมตีพลังงานระเบิด - แข็งแกร่งต่อต้านความกล้า",
    gutsDescription: "การโจมตีป้องกัน - แข็งแกร่งต่อต้านการฟัน",
    slashDescription: "การโจมตีฟันที่รวดเร็ว - แข็งแกร่งต่อต้านการระเบิด",
    
    // UI elements
    backToMenu: "กลับไปยังเมนู",
    reset: "รีเซ็ต",
    attack: "การโจมตี",
    selectYourAttacks: "เลือกการโจมตีของคุณ",
    chooserps: "เลือกหิน กระดาษ หรือกรรไกร!",
    determiningWinner: "กำลังหาผู้ชนะ...",
    battleComplete: "การต่อสู้เสร็จสิ้น!",
    
    // Battle Results
    winnerAnnouncement: "ชนะ!",
    
    // NFC Card Display
    noCardsScanned: "ยังไม่ได้สแกนการ์ด",
    cardsScanned: "การ์ดที่สแกนแล้ว",
    maximumReached: "การ์ดที่สแกนแล้ว (ถึงขีดจำกัด)",
    
    // Preparation Screen
    preparationPhase: "ขั้นตอนการเตรียมตัว",
    bothPlayersMustScan: "ผู้เล่นทั้งสองต้องสแกนการ์ด NFC ก่อนการต่อสู้",
    bothPlayersReady: "ผู้เล่นทั้งสองพร้อมแล้ว - คลิกเริ่มการต่อสู้เพื่อเริ่ม!",
    clickStartBattle: "คลิกเริ่มการต่อสู้!",
    waitingForPlayers: "รอให้ผู้เล่นทั้งสองสแกนการ์ดตัวละครอย่างน้อยหนึ่งใบ",
    howToPrepare: "วิธีเตรียมตัว:",
    eachPlayerMustScan: "ผู้เล่นแต่ละคนต้องสแกนการ์ดตัวละครอย่างน้อยหนึ่งใบโดยใช้ปุ่ม 'สแกนการ์ด NFC'",
    youCanScanUpTo: "คุณสามารถสแกนได้สูงสุด 3 การ์ด (การ์ดตัวละครและพลัง)",
    onceBothPlayersHave: "เมื่อผู้เล่นทั้งสองมีการ์ดตัวละครแล้ว ให้คลิก 'เริ่มการต่อสู้'!",
    yourFirstScanned: "การ์ดตัวละครแรกที่สแกนจะถูกใช้ในการต่อสู้โดยอัตโนมัติ",
    battleWillBegin: "การต่อสู้จะเริ่มทันทีด้วยการต่อสู้แบบรูเล็ต",
    startBattle: "เริ่มการต่อสู้",
    
    // Character Selection Screen
    selectionStatus: "สถานะการเลือก:",
    characterCard: "การ์ดตัวละคร:",
    powerCard: "การ์ดพลัง:",
    notSelected: "ไม่ได้เลือก",
    selected: "เลือกแล้ว",
    eachPlayerMustSelect: "ผู้เล่นแต่ละคนต้องเลือกการ์ดตัวละครหนึ่งใบสำหรับการต่อสู้ การ์ดพลังเป็นทางเลือกแต่แนะนำ",
    powerCardsOptional: "การ์ดพลังเป็นทางเลือกแต่แนะนำ",
    powerCardsBoost: "การ์ดพลังจะเพิ่มการโจมตีและ HP ของตัวละครในการต่อสู้",
    characterCards: "การ์ดตัวละคร",
    powerCards: "การ์ดพลัง",
    noCharacterCards: "ไม่ได้สแกนการ์ดตัวละคร",
    noPowerCards: "ไม่ได้สแกนการ์ดพลัง",
    
    // Game Rules
    gameRules: "กฎของเกม",
    basicGameplay: "การเล่นพื้นฐาน",
    attackTypes: "ประเภทการโจมตี",
    
    // Status messages
    cardsReady: "การ์ด (ตัวละครพร้อม)",
    needCharacter: "การ์ด (ต้องการตัวละคร)",
    noCards: "ไม่มีการ์ด"
  },
  ja: {
    mainTitle: "バトルアリーナ",
    startGame: "ゲーム開始",
    howToPlay: "遊び方",
    preparation: "準備",
    characterSelection: "キャラクター選択",
    battle: "バトル",
    selectAttack: "攻撃を選択",
    rock: "グー",
    paper: "パー",
    scissors: "チョキ",
    waiting: "相手を待っています...",
    round: "ラウンド",
    victory: "勝利！",
    wins: "勝利！",
    finalStats: "最終統計",
    hpRemaining: "残りHP",
    card: "カード",
    battleLasted: "バトル時間",
    rounds: "ラウンド",
    playAgain: "もう一度プレイ",
    scanCard: "カードスキャン",
    cardScanned: "カードスキャン完了",
    scanFailed: "スキャン失敗",
    player: "プレイヤー",
    health: "体力",
    name: "名前",
    cancel: "キャンセル",
    confirm: "確認",
    loading: "読み込み中...",
    
    // Attack types
    burst: "バースト",
    guts: "ガッツ",
    slash: "スラッシュ",
    burstDescription: "爆発的エネルギー攻撃 - ガッツに有効",
    gutsDescription: "防御的パワー攻撃 - スラッシュに有効",
    slashDescription: "素早い切り攻撃 - バーストに有効",
    
    // UI elements
    backToMenu: "メニューに戻る",
    reset: "リセット",
    attack: "攻撃",
    selectYourAttacks: "攻撃を選択",
    chooserps: "グー、パー、チョキを選択！",
    determiningWinner: "勝者を決定中...",
    battleComplete: "バトル終了！",
    
    // Battle Results
    winnerAnnouncement: "勝利！",
    
    // NFC Card Display
    noCardsScanned: "スキャンされたカードなし",
    cardsScanned: "カードスキャン済み",
    maximumReached: "カードスキャン済み（上限達成）",
    
    // Preparation Screen
    preparationPhase: "準備フェーズ",
    bothPlayersMustScan: "バトル前に両プレイヤーがNFCカードをスキャンする必要があります",
    bothPlayersReady: "両プレイヤー準備完了 - バトル開始をクリックして開始！",
    clickStartBattle: "バトル開始をクリック！",
    waitingForPlayers: "両プレイヤーが少なくとも1枚のキャラクターカードをスキャンするのを待っています",
    howToPrepare: "準備方法：",
    eachPlayerMustScan: "各プレイヤーは'NFCカードスキャン'ボタンを使用して少なくとも1枚のキャラクターカードをスキャンする必要があります",
    youCanScanUpTo: "最大3枚までカードをスキャンできます（キャラクターとパワーカード）",
    onceBothPlayersHave: "両プレイヤーがキャラクターカードを持ったら、'バトル開始'をクリック！",
    yourFirstScanned: "最初にスキャンしたキャラクターカードがバトルで自動使用されます",
    battleWillBegin: "バトルはルーレットベースの戦闘ですぐに開始されます",
    startBattle: "バトル開始",
    
    // Character Selection Screen
    selectionStatus: "選択状態：",
    characterCard: "キャラクターカード：",
    powerCard: "パワーカード：",
    notSelected: "未選択",
    selected: "選択済み",
    eachPlayerMustSelect: "各プレイヤーはバトル用に1枚のキャラクターカードを選択する必要があります。パワーカードは任意ですが推奨します。",
    powerCardsOptional: "パワーカードは任意ですが推奨します。",
    powerCardsBoost: "パワーカードはバトル中にキャラクターの攻撃とHPを強化します。",
    characterCards: "キャラクターカード",
    powerCards: "パワーカード",
    noCharacterCards: "キャラクターカードがスキャンされていません",
    noPowerCards: "パワーカードがスキャンされていません",
    
    // Game Rules
    gameRules: "ゲームルール",
    basicGameplay: "基本ゲームプレイ",
    attackTypes: "攻撃タイプ",
    
    // Status messages
    cardsReady: "カード（キャラクター準備完了）",
    needCharacter: "カード（キャラクターが必要）",
    noCards: "カードなし"
  },
  zh: {
    mainTitle: "战斗竞技场",
    startGame: "开始游戏",
    howToPlay: "游戏规则",
    preparation: "准备阶段",
    characterSelection: "角色选择",
    battle: "战斗",
    selectAttack: "选择攻击",
    rock: "石头",
    paper: "布",
    scissors: "剪刀",
    waiting: "等待对手...",
    round: "回合",
    victory: "胜利！",
    wins: "获胜！",
    finalStats: "最终统计",
    hpRemaining: "剩余血量",
    card: "卡片",
    battleLasted: "战斗持续了",
    rounds: "回合",
    playAgain: "再玩一次",
    scanCard: "扫描卡片",
    cardScanned: "卡片已扫描",
    scanFailed: "扫描失败",
    player: "玩家",
    health: "生命值",
    name: "名称",
    cancel: "取消",
    confirm: "确认",
    loading: "加载中...",
    
    // Attack types
    burst: "爆裂",
    guts: "勇气",
    slash: "斩击",
    burstDescription: "爆炸性能量攻击 - 对勇气有效",
    gutsDescription: "防御性力量攻击 - 对斩击有效",
    slashDescription: "快速切割攻击 - 对爆裂有效",
    
    // UI elements
    backToMenu: "返回菜单",
    reset: "重置",
    attack: "攻击",
    selectYourAttacks: "选择你的攻击",
    chooserps: "选择石头、布或剪刀！",
    determiningWinner: "决定胜者中...",
    battleComplete: "战斗完成！",
    
    // Battle Results
    winnerAnnouncement: "获胜！",
    
    // NFC Card Display
    noCardsScanned: "尚未扫描卡片",
    cardsScanned: "张卡片已扫描",
    maximumReached: "张卡片已扫描（已达上限）",
    
    // Preparation Screen
    preparationPhase: "准备阶段",
    bothPlayersMustScan: "两名玩家必须在战斗前扫描他们的NFC卡片",
    bothPlayersReady: "两名玩家准备就绪 - 点击开始战斗开始！",
    clickStartBattle: "点击开始战斗！",
    waitingForPlayers: "等待两名玩家各自扫描至少一张角色卡",
    howToPrepare: "如何准备：",
    eachPlayerMustScan: "每名玩家必须使用'扫描NFC卡片'按钮扫描至少一张角色卡",
    youCanScanUpTo: "您最多可以扫描3张卡片（角色卡和力量卡）",
    onceBothPlayersHave: "一旦两名玩家都有角色卡，点击'开始战斗'！",
    yourFirstScanned: "您第一张扫描的角色卡将自动在战斗中使用",
    battleWillBegin: "战斗将立即以轮盘式战斗开始",
    startBattle: "开始战斗",
    
    // Character Selection Screen
    selectionStatus: "选择状态：",
    characterCard: "角色卡：",
    powerCard: "力量卡：",
    notSelected: "未选择",
    selected: "已选择",
    eachPlayerMustSelect: "每名玩家必须选择一张角色卡进行战斗。力量卡是可选的但推荐使用。",
    powerCardsOptional: "力量卡是可选的但推荐使用。",
    powerCardsBoost: "力量卡将在战斗中增强你角色的攻击和生命值。",
    characterCards: "角色卡",
    powerCards: "力量卡",
    noCharacterCards: "未扫描角色卡",
    noPowerCards: "未扫描力量卡",
    
    // Game Rules
    gameRules: "游戏规则",
    basicGameplay: "基本玩法",
    attackTypes: "攻击类型",
    
    // Status messages
    cardsReady: "卡片（角色就绪）",
    needCharacter: "卡片（需要角色）",
    noCards: "无卡片"
  },
  ko: {
    mainTitle: "배틀 아레나",
    startGame: "게임 시작",
    howToPlay: "게임 방법",
    preparation: "준비",
    characterSelection: "캐릭터 선택",
    battle: "전투",
    selectAttack: "공격 선택",
    rock: "바위",
    paper: "보",
    scissors: "가위",
    waiting: "상대방을 기다리는 중...",
    round: "라운드",
    victory: "승리!",
    wins: "승리!",
    finalStats: "최종 통계",
    hpRemaining: "남은 HP",
    card: "카드",
    battleLasted: "전투 지속 시간",
    rounds: "라운드",
    playAgain: "다시 플레이",
    scanCard: "카드 스캔",
    cardScanned: "카드 스캔 완료",
    scanFailed: "스캔 실패",
    player: "플레이어",
    health: "체력",
    name: "이름",
    cancel: "취소",
    confirm: "확인",
    loading: "로딩 중...",
    
    // Attack types
    burst: "버스트",
    guts: "강인함",
    slash: "슬래시",
    burstDescription: "폭발적 에너지 공격 - 강인함에 강함",
    gutsDescription: "방어적 힘 샷 - 슬래시에 강함",
    slashDescription: "빠른 커팅 공격 - 버스트에 강함",
    
    // UI elements
    backToMenu: "메뉴로 돌아가기",
    reset: "리셋",
    attack: "공격",
    selectYourAttacks: "공격을 선택하세요",
    chooserps: "바위, 보, 가위를 선택하세요!",
    determiningWinner: "승자를 결정하는 중...",
    battleComplete: "전투 완료!",
    
    // Battle Results
    winnerAnnouncement: "승리!",
    
    // NFC Card Display
    noCardsScanned: "아직 스캔된 카드가 없습니다",
    cardsScanned: "장의 카드가 스캔됨",
    maximumReached: "장의 카드가 스캔됨 (최대 달성)",
    
    // Preparation Screen
    preparationPhase: "준비 단계",
    bothPlayersMustScan: "두 플레이어 모두 전투 전에 NFC 카드를 스캔해야 합니다",
    bothPlayersReady: "두 플레이어 준비 완료 - 전투 시작을 클릭하여 시작하세요!",
    clickStartBattle: "전투 시작을 클릭하세요!",
    waitingForPlayers: "두 플레이어가 각각 최소 한 장의 캐릭터 카드를 스캔하기를 기다리는 중",
    howToPrepare: "준비 방법:",
    eachPlayerMustScan: "각 플레이어는 'NFC 카드 스캔' 버튼을 사용하여 최소 한 장의 캐릭터 카드를 스캔해야 합니다",
    youCanScanUpTo: "최대 3장의 카드를 스캔할 수 있습니다 (캐릭터 및 파워 카드)",
    onceBothPlayersHave: "두 플레이어 모두 캐릭터 카드를 가지면 '전투 시작'을 클릭하세요!",
    yourFirstScanned: "처음 스캔한 캐릭터 카드가 전투에서 자동으로 사용됩니다",
    battleWillBegin: "전투는 룰렛 기반 전투로 즉시 시작됩니다",
    startBattle: "전투 시작",
    
    // Character Selection Screen
    selectionStatus: "선택 상태:",
    characterCard: "캐릭터 카드:",
    powerCard: "파워 카드:",
    notSelected: "선택되지 않음",
    selected: "선택됨",
    eachPlayerMustSelect: "각 플레이어는 전투를 위해 한 장의 캐릭터 카드를 선택해야 합니다. 파워 카드는 선택 사항이지만 추천됩니다.",
    powerCardsOptional: "파워 카드는 선택 사항이지만 추천됩니다.",
    powerCardsBoost: "파워 카드는 전투 중 캐릭터의 공격과 HP를 강화시킵니다.",
    characterCards: "캐릭터 카드",
    powerCards: "파워 카드",
    noCharacterCards: "스캔된 캐릭터 카드가 없습니다",
    noPowerCards: "스캔된 파워 카드가 없습니다",
    
    // Game Rules
    gameRules: "게임 규칙",
    basicGameplay: "기본 게임플레이",
    attackTypes: "공격 유형",
    
    // Status messages
    cardsReady: "카드 (캐릭터 준비 완료)",
    needCharacter: "카드 (캐릭터 필요)",
    noCards: "카드 없음"
  },
  ru: {
    mainTitle: "Боевая Арена",
    startGame: "Начать Игру",
    howToPlay: "Как Играть",
    preparation: "Подготовка",
    characterSelection: "Выбор Персонажа",
    battle: "Битва",
    selectAttack: "Выберите Атаку",
    rock: "Камень",
    paper: "Бумага",
    scissors: "Ножницы",
    waiting: "Ожидание противника...",
    round: "Раунд",
    victory: "ПОБЕДА!",
    wins: "Побеждает!",
    finalStats: "Финальная Статистика",
    hpRemaining: "Оставшееся HP",
    card: "Карта",
    battleLasted: "Битва длилась",
    rounds: "раундов",
    playAgain: "Играть Снова",
    scanCard: "Сканировать Карту",
    cardScanned: "Карта Отсканирована",
    scanFailed: "Ошибка Сканирования",
    player: "Игрок",
    health: "Здоровье",
    name: "Имя",
    cancel: "Отмена",
    confirm: "Подтвердить",
    loading: "Загрузка...",
    
    // Attack types
    burst: "Взрыв",
    guts: "Мужество",
    slash: "Удар",
    burstDescription: "Взрывная энергетическая атака - Сильна против Мужества",
    gutsDescription: "Оборонительный удар силы - Сильный против Удара",
    slashDescription: "Быстрая режущая атака - Сильная против Взрыва",
    
    // UI elements
    backToMenu: "Назад к Меню",
    reset: "Сброс",
    attack: "Атака",
    selectYourAttacks: "Выберите ваши атаки",
    chooserps: "Выберите Камень, Бумага или Ножницы!",
    determiningWinner: "Определение победителя...",
    battleComplete: "Битва Завершена!",
    
    // Battle Results
    winnerAnnouncement: "Побеждает!",
    
    // NFC Card Display
    noCardsScanned: "Карты ещё не отсканированы",
    cardsScanned: "карт отсканировано",
    maximumReached: "карт отсканировано (достигнут максимум)",
    
    // Preparation Screen
    preparationPhase: "Фаза Подготовки",
    bothPlayersMustScan: "Оба игрока должны отсканировать свои NFC карты перед битвой",
    bothPlayersReady: "Оба игрока готовы - Нажмите 'Начать Битву' чтобы начать!",
    clickStartBattle: "Нажмите 'Начать Битву'!",
    waitingForPlayers: "Ожидание пока оба игрока отсканируют как минимум одну карту персонажа",
    howToPrepare: "Как Подготовиться:",
    eachPlayerMustScan: "Каждый игрок должен отсканировать как минимум одну карту персонажа с помощью кнопки 'Отсканировать NFC Карту'",
    youCanScanUpTo: "Вы можете отсканировать до 3 карт всего (карты персонажей и силы)",
    onceBothPlayersHave: "Как только у обоих игроков будут карты персонажей, нажмите 'Начать Битву'!",
    yourFirstScanned: "Ваша первая отсканированная карта персонажа будет автоматически использована в битве",
    battleWillBegin: "Битва начнётся немедленно с боём на основе рулетки",
    startBattle: "Начать Битву",
    
    // Character Selection Screen
    selectionStatus: "Статус Выбора:",
    characterCard: "Карта Персонажа:",
    powerCard: "Карта Силы:",
    notSelected: "Не выбрано",
    selected: "Выбрано",
    eachPlayerMustSelect: "Каждый игрок должен выбрать одну карту персонажа для битвы. Карты силы необязательны, но рекомендуются.",
    powerCardsOptional: "Карты силы необязательны, но рекомендуются.",
    powerCardsBoost: "Карты силы усилят атаки и HP вашего персонажа во время битвы.",
    characterCards: "Карты Персонажей",
    powerCards: "Карты Силы",
    noCharacterCards: "Нет отсканированных карт персонажей",
    noPowerCards: "Нет отсканированных карт силы",
    
    // Game Rules
    gameRules: "Правила Игры",
    basicGameplay: "Основной Геймплей",
    attackTypes: "Типы Атак",
    
    // Status messages
    cardsReady: "Карты (Персонаж Готов)",
    needCharacter: "Карты (Нужен Персонаж)",
    noCards: "Нет Карт"
  }
};

const languageNames: Record<SupportedLanguage, string> = {
  en: "English",
  fr: "Français",
  id: "Indonesia",
  pt: "Português",
  es: "Español",
  ar: "العربية",
  tl: "Tagalog",
  th: "ไทย",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
  ru: "Русский"
};

interface LanguageState {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translation;
  getLanguageName: (language: SupportedLanguage) => string;
  getSupportedLanguages: () => { code: SupportedLanguage; name: string }[];
}

export const useLanguage = create<LanguageState>((set, get) => ({
  currentLanguage: 'en',
  setLanguage: (language: SupportedLanguage) => 
    set({ 
      currentLanguage: language, 
      t: translations[language] 
    }),
  t: translations.en,
  getLanguageName: (language: SupportedLanguage) => languageNames[language],
  getSupportedLanguages: () => 
    Object.entries(languageNames).map(([code, name]) => ({ 
      code: code as SupportedLanguage, 
      name 
    }))
}));
