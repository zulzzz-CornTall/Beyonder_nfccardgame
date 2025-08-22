
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
    loading: "Loading..."
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
    loading: "Chargement..."
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
    loading: "Memuat..."
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
    loading: "Carregando..."
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
    loading: "Cargando..."
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
    loading: "جاري التحميل..."
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
    loading: "Naglo-load..."
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
    loading: "กำลังโหลด..."
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
    loading: "読み込み中..."
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
    loading: "加载中..."
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
    loading: "로딩 중..."
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
    loading: "Загрузка..."
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
