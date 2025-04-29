/**
 * 勇者の冒険 - アイテム定義
 */

// アイテムオブジェクト
const ITEMS = {
  // 回復アイテム
  potion: {
    id: 'potion',
    name: '回復薬',
    type: 'item',
    description: 'HPを30回復する',
    effect: function(target) {
      const healAmount = 30;
      target.hp = Math.min(target.hp + healAmount, target.maxHP);
      return `${target.name}のHPが${healAmount}回復した！`;
    },
    price: 50
  },
  
  // 上位回復アイテム
  hiPotion: {
    id: 'hiPotion',
    name: '上質な回復薬',
    type: 'item',
    description: 'HPを70回復する',
    effect: function(target) {
      const healAmount = 70;
      target.hp = Math.min(target.hp + healAmount, target.maxHP);
      return `${target.name}のHPが${healAmount}回復した！`;
    },
    price: 120
  },
  
  // MP回復アイテム
  ether: {
    id: 'ether',
    name: 'エーテル',
    type: 'item',
    description: 'MPを20回復する',
    effect: function(target) {
      const healAmount = 20;
      target.mp = Math.min(target.mp + healAmount, target.maxMP);
      return `${target.name}のMPが${healAmount}回復した！`;
    },
    price: 100
  },
  
  // 全回復アイテム
  elixir: {
    id: 'elixir',
    name: 'エリクサー',
    type: 'item',
    description: 'HPとMPを完全に回復する',
    effect: function(target) {
      target.hp = target.maxHP;
      target.mp = target.maxMP;
      return `${target.name}のHPとMPが完全に回復した！`;
    },
    price: 500
  },
  
  // 武器
  sword: {
    id: 'sword',
    name: '鋼の剣',
    type: 'weapon',
    description: '攻撃力+10',
    effect: {
      strength: 10
    },
    price: 500
  },
  
  // 上位武器
  silverSword: {
    id: 'silverSword',
    name: '銀の剣',
    type: 'weapon',
    description: '攻撃力+20',
    effect: {
      strength: 20
    },
    price: 1500
  },
  
  // 防具
  shield: {
    id: 'shield',
    name: '盾',
    type: 'armor',
    description: '防御力+5',
    effect: {
      defense: 5
    },
    price: 300
  },
  
  // 上位防具
  plateArmor: {
    id: 'plateArmor',
    name: '鋼の鎧',
    type: 'armor',
    description: '防御力+15',
    effect: {
      defense: 15
    },
    price: 1200
  },
  
  // アクセサリー
  speedRing: {
    id: 'speedRing',
    name: '俊敏の指輪',
    type: 'accessory',
    description: '素早さ+5',
    effect: {
      speed: 5
    },
    price: 800
  },
  
  // 鍵アイテム
  dungeonKey: {
    id: 'dungeon_key',
    name: '洞窟の鍵',
    type: 'key-item',
    description: '魔王城への扉を開けるための鍵',
    usable: false
  },
  
  // クエストアイテム
  treasure: {
    id: 'treasure',
    name: '失われた秘宝',
    type: 'key-item',
    description: '古代の秘宝。村を守る力を持つと言われている',
    usable: false
  }
};
