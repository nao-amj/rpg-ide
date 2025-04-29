/**
 * 勇者の冒険 - RPG-IDE サンプルゲーム
 */

// ゲーム初期化スクリプト
function initializeGame() {
  // RPGエンジンを初期化
  const engine = new RPGEngine();
  
  // プレイヤーキャラクター定義
  const player = {
    name: "勇者",
    type: "character",
    x: 10,
    y: 8,
    width: 32,
    height: 32,
    color: "#0000ff",
    level: 1,
    maxHP: 100,
    hp: 100,
    maxMP: 50,
    mp: 50,
    strength: 15,
    defense: 10,
    speed: 10,
    experience: 0,
    nextLevel: 100,
    items: [],
    equipment: {
      weapon: null,
      armor: null,
      accessory: null
    },
    skills: [
      { id: 'heal', name: '回復', type: 'magic', mpCost: 5, targetType: 'self', description: 'HPを回復する' }
    ]
  };

  // 村長キャラクター
  const villageChief = {
    name: "村長",
    type: "character",
    x: 10,
    y: 7,
    width: 32,
    height: 32,
    color: "#880000",
    onInteract: function(gameState) {
      // 会話イベント
      engine.showDialog({
        speaker: "村長",
        text: "勇者よ、我々の村は魔物に襲われています。森の奥にある洞窟に行き、失われた秘宝を取り戻してください。"
      });
      
      // クエスト追加
      gameState.flags.mainQuestStarted = true;
    }
  };

  // 敵キャラクター: スライム
  const slime = {
    name: "スライム",
    type: "enemy",
    width: 32,
    height: 32,
    color: "#00aa00",
    level: 1,
    maxHP: 20,
    hp: 20,
    strength: 8,
    defense: 3,
    speed: 5,
    expReward: 10,
    goldReward: 5,
    dropItems: [
      { item: { id: 'potion', name: '回復薬', type: 'item' }, rate: 0.3 }
    ]
  };

  // ボスキャラクター: 魔王
  const demonLord = {
    name: "魔王",
    type: "enemy",
    width: 64,
    height: 64,
    color: "#aa0000",
    level: 10,
    maxHP: 300,
    hp: 300,
    strength: 25,
    defense: 15,
    speed: 12,
    expReward: 500,
    goldReward: 1000,
    dropItems: [
      { item: { id: 'treasure', name: '失われた秘宝', type: 'key-item' }, rate: 1.0 }
    ],
    skills: [
      { id: 'fire', name: '炎魔法', type: 'magic', mpCost: 10, targetType: 'enemy', description: '強力な炎の魔法' }
    ]
  };

  // アイテム定義
  // 回復アイテム
  const potion = {
    id: 'potion',
    name: '回復薬',
    type: 'item',
    description: 'HPを30回復する',
    effect: function(target) {
      target.hp = Math.min(target.hp + 30, target.maxHP);
      return `${target.name}のHPが30回復した！`;
    },
    price: 50
  };

  // 武器
  const sword = {
    id: 'sword',
    name: '鋼の剣',
    type: 'weapon',
    description: '攻撃力+10',
    effect: {
      strength: 10
    },
    price: 500
  };

  // 防具
  const shield = {
    id: 'shield',
    name: '盾',
    type: 'armor',
    description: '防御力+5',
    effect: {
      defense: 5
    },
    price: 300
  };

  // 鍵アイテム
  const dungeonKey = {
    id: 'dungeon_key',
    name: '洞窟の鍵',
    type: 'key-item',
    description: '魔王城への扉を開けるための鍵',
    usable: false
  };

  // マップ定義
  // 村マップ
  const villageMap = {
    id: "village",
    name: "平和な村",
    width: 20,
    height: 15,
    tileSize: 32,
    tileSet: "town",
    layers: [
      // 背景レイヤー
      [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
      // オブジェクトレイヤー
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]
    ],
    // 衝突判定マップ
    collision: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    // 村から森への出口
    exits: [
      { x: 10, y: 0, targetMap: "forest", targetX: 10, targetY: 14 }
    ],
    // エンカウント設定
    encounterRate: 0, // 村ではエンカウントなし
  };

  // 簡略化のため、森のマップは省略形で定義
  const forestMap = {
    id: "forest",
    name: "神秘の森",
    width: 20,
    height: 15,
    tileSize: 32,
    tileSet: "basic",
    // 森から洞窟への出口
    exits: [
      { x: 10, y: 0, targetMap: "cave", targetX: 10, targetY: 14 },
      { x: 10, y: 14, targetMap: "village", targetX: 10, targetY: 1 }
    ],
    // 森でのエンカウント率
    encounterRate: 0.03, // 3%
  };

  // 森でのランダムエンカウンター
  const forestEncounters = [
    {
      enemies: [slime, slime],
      options: { 
        background: "forest"
      }
    },
    {
      enemies: [slime, slime, slime],
      options: { 
        background: "forest"
      }
    }
  ];

  // イベント定義
  // 洞窟でのイベント: 鍵を見つける
  const findKeyEvent = {
    condition: function(gameState) {
      // プレイヤーが洞窟の奥に到達 & 鍵をまだ持っていない
      return gameState.currentMap.id === "cave" && 
             gameState.player.x > 15 && 
             gameState.player.y > 12 && 
             !gameState.flags.hasKey;
    },
    action: function(gameState) {
      // 会話イベント
      engine.showDialog({
        text: "あなたは洞窟の奥で光る鍵を見つけた！"
      });
      
      // アイテム追加
      gameState.player.items.push(dungeonKey);
      gameState.flags.hasKey = true;
    },
    once: true // 一度だけ実行
  };

  // 魔王城への入口イベント
  const castleEntranceEvent = {
    condition: function(gameState) {
      // プレイヤーが城の入口に到達
      return gameState.currentMap.id === "castle" && 
             Math.abs(gameState.player.x - 10) < 2 && 
             Math.abs(gameState.player.y - 14) < 2;
    },
    action: function(gameState) {
      if (gameState.flags.hasKey) {
        // 鍵を持っている場合は入場可能
        engine.showDialog({
          text: "あなたは洞窟で見つけた鍵で扉を開けた。魔王城の中へ進む..."
        });
        
        // 位置を移動
        gameState.player.x = 10;
        gameState.player.y = 12;
      } else {
        // 鍵を持っていない場合
        engine.showDialog({
          text: "城の扉は固く閉ざされています。何か鍵が必要なようだ..."
        });
        
        // プレイヤーを少し戻す
        gameState.player.y += 1;
      }
    },
    once: false // 何度でも実行可能
  };

  // 最終ボス戦
  const bossEvent = {
    condition: function(gameState) {
      // 魔王の部屋に入った時
      return gameState.currentMap.id === "castle" && 
             gameState.player.x > 8 && 
             gameState.player.x < 12 && 
             gameState.player.y < 4 && 
             !gameState.flags.bossDefeated;
    },
    action: function(gameState) {
      engine.showDialog({
        speaker: "魔王",
        text: "よくぞここまで来たな、勇者よ。だがここがお前の墓場となる！"
      });
      
      // ボス戦開始
      setTimeout(() => {
        engine.startBattle([demonLord], { type: 'boss', background: 'throne-room' });
      }, 2000);
    },
    once: true
  };

  // エンディングイベント
  const endingEvent = {
    condition: function(gameState) {
      return gameState.flags.bossDefeated && 
             gameState.player.items.some(item => item.id === 'treasure');
    },
    action: function(gameState) {
      // エンディングシーン
      engine.showDialog({
        speaker: "村長",
        text: "勇者よ、よくぞ魔王を倒し秘宝を取り戻してくれた！あなたは我々の村の英雄です！"
      });
      
      // エンディングフラグを立てる
      gameState.flags.gameCompleted = true;
    },
    once: true
  };

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
      characters: [villageChief],
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
  
  // ゲームループ開始
  engine.startGameLoop();
  
  return engine;
}

// ゲーム開始
window.onload = function() {
  window.gameEngine = initializeGame();
};