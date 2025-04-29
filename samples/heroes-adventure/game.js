/**
 * 勇者の冒険 - サンプルRPGゲーム
 * RPG-IDE を使用して作成されたサンプルゲーム
 */

// ゲーム初期化スクリプト
function initializeGame() {
  // RPGエンジンを初期化
  const engine = new RPGEngine();
  
  // エンジン設定
  engine.initialize({
    rendering: {
      canvas: document.getElementById('game-canvas'),
      tileSize: 32
    },
    initialState: {
      player: PLAYER,
      playerTeam: [],
      currentMap: MAPS.village,
      characters: [CHARACTERS.villageChief, CHARACTERS.shopkeeper],
      items: [ITEMS.potion, ITEMS.hiPotion, ITEMS.sword, ITEMS.shield],
      events: [
        EVENTS.findKeyEvent, 
        EVENTS.castleEntranceEvent, 
        EVENTS.bossEvent, 
        EVENTS.endingEvent
      ],
      flags: {
        mainQuestStarted: false,
        hasKey: false,
        bossDefeated: false,
        gameCompleted: false
      }
    }
  });
  
  // マップにエンカウント設定を追加
  MAPS.forest.randomEncounters = ENCOUNTERS.forest;
  MAPS.forest.encounterRate = 0.03; // 3%のエンカウント率
  
  MAPS.cave.randomEncounters = ENCOUNTERS.cave;
  MAPS.cave.encounterRate = 0.05; // 5%のエンカウント率
  
  // ゲームループ開始
  engine.startGameLoop();
  
  return engine;
}

// ゲーム開始
window.onload = function() {
  window.gameEngine = initializeGame();
};
