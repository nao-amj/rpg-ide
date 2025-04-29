# RPGエンジンAPI

## 概要

RPGゲームエンジンは、RPGゲームの開発に必要な機能を提供するJavaScript APIです。このドキュメントでは、エンジンの主要なコンポーネントとその使用方法について説明します。

## 目次

1. [エンジン初期化](#エンジン初期化)
2. [ゲームループと更新](#ゲームループと更新)
3. [レンダリングシステム](#レンダリングシステム)
4. [入力システム](#入力システム)
5. [物理システム](#物理システム)
6. [バトルシステム](#バトルシステム)
7. [ダイアログシステム](#ダイアログシステム)
8. [インベントリシステム](#インベントリシステム)
9. [クエストシステム](#クエストシステム)
10. [セーブシステム](#セーブシステム)

## エンジン初期化

エンジンはゲームの開始時に初期化する必要があります。

```javascript
// エンジンのインスタンス化
const engine = new RPGEngine();

// エンジンの初期化
engine.initialize({
    // レンダリング設定
    rendering: {
        canvas: document.getElementById('game-canvas'),
        tileSize: 32
    },
    
    // 入力設定
    input: {
        keyboard: true,
        touch: false,
        gamepad: false
    },
    
    // 物理設定
    physics: {
        collision: 'grid', // 'grid' または 'aabb'
        gravity: 0,
        friction: 0.1
    },
    
    // バトル設定
    battle: {
        type: 'turn-based', // 'turn-based', 'active-time', 'real-time'
        encounterRate: 0.05,  // エンカウント率
        escapeRate: 0.5       // 逃走成功率
    },
    
    // ダイアログ設定
    dialogue: {
        container: document.getElementById('dialog-container'),
        speed: 30 // テキスト表示速度
    },
    
    // インベントリ設定
    inventory: {
        maxItems: 20,
        categories: ['item', 'weapon', 'armor', 'key']
    },
    
    // クエスト設定
    quest: {
        quests: [] // 初期クエスト
    },
    
    // セーブ設定
    save: {
        storage: 'localStorage', // 'localStorage' または 'indexedDB'
        slots: 3,
        prefix: 'rpg_save_'
    },
    
    // 初期ゲーム状態
    initialState: {
        player: {
            name: 'Hero',
            level: 1,
            exp: 0,
            hp: 100,
            maxHP: 100,
            mp: 50,
            maxMP: 50,
            strength: 10,
            defense: 5,
            speed: 5,
            x: 100,
            y: 100,
            width: 32,
            height: 32,
            items: []
        },
        playerTeam: [], // パーティメンバー
        currentMap: null, // 初期マップは別途読み込み
        characters: [], // NPCなど
        items: [], // フィールド上のアイテム
        events: [], // ゲームイベント
        flags: {} // ゲーム進行フラグ
    }
});

// ゲームループの開始
engine.startGameLoop();
```

## ゲームループと更新

ゲームループは `startGameLoop()` メソッドで開始され、内部的に以下のメソッドを呼び出します：

```javascript
// ゲームループ開始（自動的に実行）
engine.startGameLoop();

// ゲーム状態の更新（内部使用）
engine.update(deltaTime);

// プレイヤーの更新（内部使用）
engine.updatePlayer(deltaTime);

// NPCの更新（内部使用）
engine.updateCharacters(deltaTime);

// イベントの更新（内部使用）
engine.updateEvents(deltaTime);

// 物理・衝突判定の更新（内部使用）
engine.updatePhysics(deltaTime);

// ランダムエンカウントのチェック（内部使用）
engine.checkRandomEncounter(deltaTime);
```

## レンダリングシステム

ゲームの描画を処理します。

```javascript
// ゲームの描画（内部使用）
engine.render();

// マップの描画（内部使用）
engine.renderMap();

// キャラクターの描画（内部使用）
engine.renderCharacters();

// プレイヤーの描画（内部使用）
engine.renderPlayer();

// UIの描画（内部使用）
engine.renderUI();

// バトル画面の描画（内部使用）
engine.renderBattle();

// バトルUIの描画（内部使用）
engine.renderBattleUI();
```

## マップ操作

ゲームマップの読み込みと管理を行います。

```javascript
// マップの読み込み
engine.loadMap(mapData);

// マップデータの形式
const mapData = {
    id: 'town_map',      // マップID
    name: '街マップ',      // マップ名
    width: 20,          // マップ幅（タイル単位）
    height: 15,         // マップ高さ（タイル単位）
    tileSize: 32,       // タイルサイズ（ピクセル）
    // レイヤー（複数レイヤー対応）
    layers: [
        // 地形レイヤー
        [
            [1, 1, 1, 1, ...],
            [1, 1, 1, 1, ...],
            // ...
        ],
        // オブジェクトレイヤー
        [
            [0, 0, 0, 2, ...],
            [0, 0, 2, 0, ...],
            // ...
        ]
    ],
    // 衝突判定マップ（0=通行可能、1=通行不可）
    collision: [
        [0, 0, 0, 1, ...],
        [0, 0, 1, 0, ...],
        // ...
    ],
    // ランダムエンカウント設定
    randomEncounters: [
        {
            enemies: [/* 敵キャラクター配列 */],
            rate: 0.05 // エンカウント率
        }
    ],
    // マップイベント
    events: [
        {
            id: 'event1',
            condition: function(gameState) {
                // 発動条件
                return true;
            },
            action: function(gameState) {
                // 実行内容
            },
            once: true // 一度きりのイベントか
        }
    ]
};
```

## バトルシステム

ターンベースのバトルシステムを提供します。

```javascript
// バトル開始
engine.startBattle(enemies, options);

// 例：バトル開始
engine.startBattle(
    [
        {
            name: 'ゴブリン',
            hp: 50,
            maxHP: 50,
            strength: 8,
            defense: 3,
            speed: 5,
            expReward: 20,
            goldReward: 10,
            dropItems: [
                { item: { name: '回復薬', type: 'item' }, rate: 0.3 }
            ]
        }
    ],
    {
        type: 'normal', // 'normal', 'boss', 'event'
        escapeRate: 0.5, // 逃走成功率
        background: 'forest' // 背景
    }
);

// プレイヤーの行動を処理
engine.systems.battle.handlePlayerAction(character, action, target);

// 利用可能なアクションの取得
const actions = engine.systems.battle.getAvailableActions(character);
```

### バトルイベント

バトルシステムは以下のイベントを発火します：

```javascript
// バトル開始イベント
document.addEventListener('battle-start', (e) => {
    console.log('バトル開始:', e.detail);
    // e.detail: { playerTeam: [...], enemyTeam: [...] }
});

// バトル行動選択イベント
document.addEventListener('battle-action-menu', (e) => {
    console.log('行動選択:', e.detail);
    // e.detail: { character, availableActions }
});

// バトル行動実行イベント
document.addEventListener('battle-action-executed', (e) => {
    console.log('行動実行:', e.detail);
    // e.detail: { actor, action, target, result }
});

// バトル終了イベント
document.addEventListener('battle-end', (e) => {
    console.log('バトル終了:', e.detail);
    // e.detail: { result, rewards, battleLog }
    
    if (e.detail.result === 'player') {
        // プレイヤー勝利時の処理
    }
});
```

## ダイアログシステム

ゲーム内の会話や通知を表示します。

```javascript
// ダイアログを表示
engine.showDialog({
    speaker: 'NPC', // 話者名（省略可）
    text: 'こんにちは、冒険者さん！',
    portrait: 'npc_face', // キャラクター画像（省略可）
    position: 'bottom', // 'top', 'bottom', 'middle'（省略可）
    onComplete: function() {
        // ダイアログ表示完了時の処理
    }
});

// ダイアログを閉じる
engine.closeDialog();
```

## 入力システム

キーボードやタッチ入力を処理します。

```javascript
// キー入力の取得
if (engine.systems.input.keys['ArrowUp']) {
    // 上キーが押されている
}

// 入力コールバックの登録
engine.systems.input.callbacks['Space'] = function(isPressed) {
    if (isPressed) {
        // スペースキーが押された時の処理
    } else {
        // スペースキーが離された時の処理
    }
};
```

## 物理システム

衝突判定と物理演算を処理します。

```javascript
// エンティティ同士の衝突判定
const isColliding = engine.checkEntityCollision(entityA, entityB);

// マップとの衝突判定
engine.checkMapCollision(entity);
```

## インベントリシステム

プレイヤーのインベントリとアイテム管理を行います。

```javascript
// インベントリにアイテムを追加
function addItemToInventory(item) {
    const inventory = engine.gameState.player.items;
    
    if (inventory.length < engine.systems.inventory.maxItems) {
        inventory.push(item);
        return true;
    }
    
    return false; // インベントリがいっぱい
}

// アイテムを使用
function useItem(itemIndex) {
    const inventory = engine.gameState.player.items;
    const item = inventory[itemIndex];
    
    if (!item) return false;
    
    // アイテムタイプ別の処理
    switch (item.type) {
        case 'heal':
            // 回復処理
            engine.gameState.player.hp = Math.min(
                engine.gameState.player.hp + item.value,
                engine.gameState.player.maxHP
            );
            break;
        // その他のアイテムタイプ
    }
    
    // 消費アイテムならインベントリから削除
    if (item.consumable !== false) {
        inventory.splice(itemIndex, 1);
    }
    
    return true;
}
```

## セーブシステム

ゲームの保存と読み込みを処理します。

```javascript
// ゲームの保存
engine.saveGame(slotId);

// ゲームの読み込み
engine.loadGame(slotId);

// セーブデータの例
{
    player: {
        name: 'Hero',
        level: 5,
        exp: 250,
        hp: 120,
        maxHP: 120,
        mp: 35,
        maxMP: 50,
        strength: 15,
        defense: 8,
        items: [/* アイテム配列 */]
    },
    playerTeam: [/* パーティメンバー配列 */],
    currentMap: {
        id: 'forest_map',
        name: '森のマップ'
    },
    flags: {
        metVillageElder: true,
        defeatedFirstBoss: true,
        // その他のゲームフラグ
    },
    timestamp: 1619123456789 // 保存日時
}
```

## イベントシステム

ゲーム内イベントの処理を行います。

```javascript
// イベントの追加
engine.gameState.events.push({
    id: 'treasure_chest',
    condition: function(gameState) {
        // プレイヤーが宝箱の位置に近づいた＆まだ開けていない
        const dx = Math.abs(gameState.player.x - 500);
        const dy = Math.abs(gameState.player.y - 300);
        return dx < 50 && dy < 50 && !gameState.flags.treasureOpened;
    },
    action: function(gameState) {
        engine.showDialog({
            text: '宝箱を見つけた！開けますか？',
            choices: [
                {
                    text: 'はい',
                    action: function() {
                        engine.showDialog({
                            text: '金貨を50枚手に入れた！'
                        });
                        gameState.player.gold += 50;
                        gameState.flags.treasureOpened = true;
                    }
                },
                {
                    text: 'いいえ',
                    action: function() {
                        engine.showDialog({
                            text: '宝箱はそのままにしておいた。'
                        });
                    }
                }
            ]
        });
    },
    once: false // プレイヤーが「いいえ」を選んだ場合、再度トリガーできるようにする
});
```

## ユーティリティ関数

便利な補助関数も用意されています。

```javascript
// 二点間の距離を計算
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

// 乱数生成（min以上max未満）
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// 整数の乱数生成（min以上max以下）
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 確率チェック
function chance(probability) {
    return Math.random() < probability;
}

// 角度計算（ラジアン）
function angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}

// 指定方向への移動計算
function moveInDirection(entity, angle, speed) {
    entity.x += Math.cos(angle) * speed;
    entity.y += Math.sin(angle) * speed;
}
```

## ゲームオブジェクトの構造

### プレイヤー

```javascript
const player = {
    name: 'Hero',
    level: 1,
    exp: 0,
    hp: 100,
    maxHP: 100,
    mp: 50,
    maxMP: 50,
    strength: 10,
    defense: 5,
    speed: 5,
    x: 100,
    y: 100,
    width: 32,
    height: 32,
    direction: 'down', // 'up', 'down', 'left', 'right'
    sprite: 'hero', // スプライト名
    animation: 'idle', // 現在のアニメーション
    items: [], // インベントリ
    equipment: {
        weapon: null,
        armor: null,
        accessory: null
    },
    skills: [] // 習得したスキル
};
```

### キャラクター（NPC/敵）

```javascript
const character = {
    id: 'villager1',
    name: '村人A',
    type: 'npc', // 'npc', 'enemy', 'ally'
    x: 200,
    y: 150,
    width: 32,
    height: 32,
    direction: 'down',
    sprite: 'villager',
    animation: 'idle',
    
    // 戦闘用ステータス（敵/味方の場合）
    hp: 50,
    maxHP: 50,
    mp: 0,
    maxMP: 0,
    strength: 5,
    defense: 2,
    speed: 3,
    
    // NPCの場合の会話
    dialog: {
        text: 'こんにちは、旅人さん！',
        choices: [
            {
                text: '村の情報を教えて',
                next: 'village_info'
            },
            {
                text: '何もない',
                next: null
            }
        ],
        // 選択肢による分岐
        branches: {
            village_info: {
                text: 'この村は平和な農村です。北に行くと森があります。',
                next: null
            }
        }
    },
    
    // AIの動作（NPC/敵の場合）
    ai: function(character, deltaTime, gameState) {
        // AIの行動ロジック
    },
    
    // プレイヤーとの接触時の動作
    onInteract: function(gameState) {
        engine.showDialog(this.dialog);
    }
};
```

### アイテム

```javascript
const item = {
    id: 'potion',
    name: '回復薬',
    type: 'item', // 'item', 'weapon', 'armor', 'key'
    description: 'HPを30回復する',
    icon: 'potion_icon',
    effect: 'heal',
    value: 30,
    price: 50,
    consumable: true,
    
    // アイテム使用時の効果
    use: function(target) {
        target.hp = Math.min(target.hp + this.value, target.maxHP);
        return true;
    }
};
```

### スキル

```javascript
const skill = {
    id: 'fireball',
    name: 'ファイアボール',
    type: 'magic', // 'magic', 'physical', 'healing'
    description: '炎の玉を放ち、敵に15〜20のダメージを与える',
    mpCost: 5,
    targetType: 'single_enemy', // 'single_enemy', 'all_enemies', 'self', 'ally', 'all_allies'
    power: 15,
    variance: 5, // ダメージ変動幅
    element: 'fire',
    
    // スキル使用時の効果
    execute: function(user, target, battleSystem) {
        if (user.mp < this.mpCost) {
            return {
                success: false,
                message: 'MPが足りない！'
            };
        }
        
        user.mp -= this.mpCost;
        
        const baseDamage = this.power + Math.floor(Math.random() * this.variance);
        const damage = Math.max(1, Math.floor(baseDamage * user.strength / target.defense));
        
        target.hp = Math.max(0, target.hp - damage);
        
        return {
            success: true,
            damage: damage,
            critical: false,
            targetHP: target.hp,
            message: `${user.name}は${this.name}を唱えた！${target.name}に${damage}のダメージ！`
        };
    }
};
```

このドキュメントは基本的なAPIの概要を説明したものです。さらに詳細な情報やカスタマイズ方法については、ソースコードを参照してください。