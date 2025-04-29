/**
 * 勇者の冒険 - サンプルRPGゲーム
 * RPG-IDE で作成
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
      player: player,
      playerTeam: [],
      currentMap: villageMap,
      characters: [villageChief, shopkeeper],
      items: [potion, sword, shield],
      events: [findKeyEvent, castleEntranceEvent, bossEvent, endingEvent],
      flags: {
        mainQuestStarted: false,
        hasKey: false,
        bossDefeated: false,
        gameCompleted: false
      }
    }
  });
  
  // マップにエンカウント設定を追加
  forestMap.randomEncounters = forestEncounters;
  forestMap.encounterRate = 0.03; // 3%のエンカウント率
  
  caveMap.randomEncounters = caveEncounters;
  caveMap.encounterRate = 0.05; // 5%のエンカウント率
  
  // ゲームループ開始
  engine.startGameLoop();
  
  return engine;
}

// ゲーム開始
window.onload = function() {
  window.gameEngine = initializeGame();
};
