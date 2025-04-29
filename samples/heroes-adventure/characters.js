/**
 * 勇者の冒険 - キャラクター定義
 */

// キャラクターオブジェクト
const CHARACTERS = {
  // プレイヤーキャラクター（勇者）
  hero: {
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
  },

  // 村長キャラクター
  villageChief: {
    name: "村長",
    type: "character",
    x: 10,
    y: 7,
    width: 32,
    height: 32,
    color: "#880000",
    onInteract: function(gameState) {
      // 会話イベント
      gameState.engine.showDialog({
        speaker: "村長",
        text: "勇者よ、我々の村は魔物に襲われています。森の奥にある洞窟に行き、失われた秘宝を取り戻してください。"
      });
      
      // クエスト追加
      gameState.flags.mainQuestStarted = true;
    }
  },

  // 店主キャラクター
  shopkeeper: {
    name: "店主",
    type: "character",
    x: 15,
    y: 3,
    width: 32,
    height: 32,
    color: "#008800",
    onInteract: function(gameState) {
      // 会話イベント
      gameState.engine.showDialog({
        speaker: "店主",
        text: "いらっしゃい。何か必要なものはあるかい？"
      });
      
      // TODO: ショップメニューを開く処理
      setTimeout(() => {
        gameState.engine.openShop([
          { item: ITEMS.potion, price: 50 },
          { item: ITEMS.hiPotion, price: 120 },
          { item: ITEMS.sword, price: 500 },
          { item: ITEMS.shield, price: 300 }
        ]);
      }, 1000);
    }
  },

  // 敵キャラクター
  enemies: {
    // 雑魚敵: スライム
    slime: {
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
        { item: ITEMS.potion, rate: 0.3 }
      ]
    },

    // 雑魚敵: コウモリ
    bat: {
      name: "コウモリ",
      type: "enemy",
      width: 32,
      height: 32,
      color: "#550055",
      level: 2,
      maxHP: 15,
      hp: 15,
      strength: 10,
      defense: 2,
      speed: 12,
      expReward: 12,
      goldReward: 8,
      dropItems: []
    },

    // 雑魚敵: ゴブリン
    goblin: {
      name: "ゴブリン",
      type: "enemy",
      width: 32,
      height: 32,
      color: "#885500",
      level: 3,
      maxHP: 35,
      hp: 35,
      strength: 12,
      defense: 5,
      speed: 7,
      expReward: 20,
      goldReward: 15,
      dropItems: [
        { item: ITEMS.potion, rate: 0.2 },
        { item: ITEMS.hiPotion, rate: 0.1 }
      ]
    },

    // ボスキャラクター: 魔王
    demonLord: {
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
        { item: ITEMS.treasure, rate: 1.0 }
      ],
      skills: [
        { id: 'fire', name: '炎魔法', type: 'magic', mpCost: 10, targetType: 'enemy', description: '強力な炎の魔法' }
      ]
    }
  }
};

// プレイヤーオブジェクト（エンジン初期化時に使用）
const PLAYER = CHARACTERS.hero;
