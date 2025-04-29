# RPGエンジン API リファレンス

このドキュメントでは、RPG開発環境で使用できるRPGエンジンのAPIについて説明します。このAPIを使用することで、ゲームの動作やロジックをカスタマイズできます。

## 目次

1. [RPGエンジンの初期化](#rpgエンジンの初期化)
2. [ゲームループの制御](#ゲームループの制御)
3. [ゲーム状態の管理](#ゲーム状態の管理)
4. [マップの操作](#マップの操作)
5. [キャラクターの操作](#キャラクターの操作)
6. [バトルシステム](#バトルシステム)
7. [ダイアログシステム](#ダイアログシステム)
8. [インベントリシステム](#インベントリシステム)
9. [セーブ＆ロード](#セーブロード)

## RPGエンジンの初期化

RPGエンジンを使用するには、まず初期化する必要があります。

```javascript
// RPGエンジンのインスタンスを作成
const engine = new RPGEngine();

// エンジンを初期化
engine.initialize({
    // レンダリング設定
    rendering: {
        canvas: document.getElementById('game-canvas'),
        tileSize: 32
    },
    // 物理設定
    physics: {
        collision: 'grid',
        gravity: 0
    },
    // バトル設定
    battle: {
        type: 'turn-based',
        encounterRate: 0.1
    },
    // 初期ゲーム状態
    initialState: {
        player: {
            name: 'Hero',
            hp: 100,
            mp: 50,
            x: 5,
            y: 5,
            width: 32,
            height: 32
        }
    }
});
```

## ゲームループの制御

ゲームを開始するには、ゲームループを開始します。

```javascript
// ゲームループを開始
engine.startGameLoop();

// ゲームループの内部で行われる処理（参照用）
function gameLoop(timestamp) {
    // ゲーム状態の更新
    engine.update(deltaTime);
    
    // 画面の描画
    engine.render();
    
    // 次のフレームを要求
    requestAnimationFrame(gameLoop);
}
```

## ゲーム状態の管理

ゲーム状態は `engine.gameState` オブジェクトで管理されます。

```javascript
// プレイヤー情報の取得
const player = engine.gameState.player;

// フラグの設定
engine.gameState.flags.doorOpened = true;

// フラグの確認
if (engine.gameState.flags.talkedToVillager) {
    // 村人と会話済みの場合の処理
}
```

## マップの操作

マップの読み込みや操作を行います。

```javascript
// マップデータの例
const mapData = {
    id: 'town_map',
    name: '街マップ',
    width: 20,
    height: 15,
    tileSize: 32,
    layers: [
        // 背景レイヤー
        [
            [1, 1, 1, 1, ...],
            [1, 1, 1, 1, ...],
            // ...
        ],
        // オブジェクトレイヤー
        [
            [0, 0, 0, 0, ...],
            [0, 2, 0, 0, ...],
            // ...
        ]
    ],
    collision: [
        [0, 0, 0, 1, ...],
        [0, 1, 0, 1, ...],
        // ...
    ],
    events: [
        {
            id: 'door_event',
            x: 5,
            y: 7,
            condition: (gameState) => !gameState.flags.doorOpened,
            action: (gameState) => {
                gameState.flags.doorOpened = true;
                // ドアを開く処理
            },
            once: true
        }
    ],
    randomEncounters: [
        {
            rate: 0.1, // 10%の確率でエンカウント
            enemies: [
                { name: 'スライム', hp: 20, strength: 5, defense: 2, expReward: 10 },
                { name: 'ゴブリン', hp: 30, strength: 8, defense: 3, expReward: 15 }
            ]
        }
    ]
};

// マップの読み込み
engine.loadMap(mapData);

// カメラの位置設定
engine.systems.rendering.camera.x = 100;
engine.systems.rendering.camera.y = 50;
```

## キャラクターの操作

プレイヤーやNPCなどのキャラクターを操作します。

```javascript
// NPCの追加
const npc = {
    name: '村人',
    x: 200,
    y: 150,
    width: 32,
    height: 32,
    color: '#ff0000',
    onInteract: function(gameState) {
        engine.showDialog({
            speaker: '村人',
            text: 'こんにちは、冒険者さん！'
        });
        gameState.flags.talkedToVillager = true;
    }
};

engine.gameState.characters.push(npc);

// プレイヤーの移動（手動制御の場合）
engine.gameState.player.x += 5;
engine.gameState.player.y -= 10;

// プレイヤーのステータス変更
engine.gameState.player.hp = Math.min(engine.gameState.player.maxHP, engine.gameState.player.hp + 20);
```

## バトルシステム

バトルの開始や操作を行います。

```javascript
// バトルの開始
const enemies = [
    { 
        name: 'ドラゴン', 
        hp: 100, 
        maxHP: 100,
        strength: 15, 
        defense: 10,
        speed: 5,
        expReward: 50,
        goldReward: 100,
        dropItems: [
            { item: { id: 'dragon_scale', name: 'ドラゴンの鱗' }, rate: 0.3 }
        ]
    }
];

engine.startBattle(enemies, { 
    background: 'cave',
    canEscape: true 
});

// バトルイベントのリスニング
document.addEventListener('battle-start', (e) => {
    console.log('バトルが開始されました', e.detail);
});

document.addEventListener('battle-end', (e) => {
    if (e.detail.result === 'player') {
        console.log('勝利！獲得報酬:', e.detail.rewards);
    }
});

// プレイヤーの行動を処理（UIからの入力）
function handlePlayerAction(character, action, target) {
    engine.systems.battle.handlePlayerAction(character, action, target);
}
```

## ダイアログシステム

会話やメッセージの表示を制御します。

```javascript
// ダイアログの表示
engine.showDialog({
    speaker: '老人',
    text: '昔々、この村には伝説の剣が祀られていたという...'
});

// ダイアログを閉じる
engine.closeDialog();

// 選択肢付きダイアログ（カスタム実装例）
function showChoiceDialog(text, choices) {
    engine.showDialog({
        text: text,
        choices: choices
    });
    
    // 選択肢UIの表示（独自実装が必要）
    renderChoiceUI(choices);
}

showChoiceDialog('どうしますか？', [
    { text: '話を聞く', action: () => { /* 処理 */ } },
    { text: '断る', action: () => { /* 処理 */ } }
]);
```

## インベントリシステム

アイテムの管理を行います。

```javascript
// アイテムの追加
const potion = {
    id: 'potion',
    name: 'ポーション',
    type: 'item',
    effect: (target) => {
        target.hp = Math.min(target.maxHP, target.hp + 50);
        return `${target.name}のHPが50回復した！`;
    }
};

// プレイヤーのインベントリにアイテムを追加
engine.gameState.player.items.push(potion);

// アイテムの使用
function useItem(itemId, target) {
    const itemIndex = engine.gameState.player.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const item = engine.gameState.player.items[itemIndex];
        const message = item.effect(target);
        
        // 消費アイテムの場合は削除
        if (item.consumable) {
            engine.gameState.player.items.splice(itemIndex, 1);
        }
        
        return message;
    }
    return null;
}
```

## セーブ＆ロード

ゲームのセーブとロードを行います。

```javascript
// ゲームのセーブ
const saveSuccess = engine.saveGame(1); // スロット1に保存

if (saveSuccess) {
    console.log('ゲームが正常に保存されました');
} else {
    console.error('ゲームの保存に失敗しました');
}

// ゲームのロード
const loadSuccess = engine.loadGame(1); // スロット1からロード

if (loadSuccess) {
    console.log('ゲームが正常にロードされました');
} else {
    console.error('ゲームのロードに失敗しました');
}
```

## カスタムシステムの追加

RPGエンジンは拡張可能な設計になっています。独自のシステムを追加することも可能です。

```javascript
// カスタムクエストシステムの例
class QuestSystem {
    constructor(engine) {
        this.engine = engine;
        this.quests = [];
        this.activeQuests = [];
        this.completedQuests = [];
    }
    
    addQuest(quest) {
        this.quests.push(quest);
    }
    
    startQuest(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && !this.activeQuests.includes(quest)) {
            this.activeQuests.push(quest);
            return true;
        }
        return false;
    }
    
    completeQuest(questId) {
        const questIndex = this.activeQuests.findIndex(q => q.id === questId);
        if (questIndex !== -1) {
            const quest = this.activeQuests[questIndex];
            this.activeQuests.splice(questIndex, 1);
            this.completedQuests.push(quest);
            
            // 報酬の付与
            if (quest.rewards) {
                // 経験値
                if (quest.rewards.exp) {
                    this.engine.gameState.player.exp += quest.rewards.exp;
                }
                
                // ゴールド
                if (quest.rewards.gold) {
                    this.engine.gameState.player.gold += quest.rewards.gold;
                }
                
                // アイテム
                if (quest.rewards.items) {
                    for (const item of quest.rewards.items) {
                        this.engine.gameState.player.items.push(item);
                    }
                }
            }
            
            return true;
        }
        return false;
    }
}

// カスタムシステムをエンジンに追加
engine.systems.quest = new QuestSystem(engine);

// クエストの追加と開始
engine.systems.quest.addQuest({
    id: 'village_help',
    name: '村の手伝い',
    description: '村長の依頼でゴブリンを退治する',
    objectives: [
        { id: 'defeat_goblins', description: 'ゴブリンを5体倒す', count: 0, target: 5 }
    ],
    rewards: {
        exp: 100,
        gold: 50,
        items: [{ id: 'healing_potion', name: '回復薬', type: 'item' }]
    }
});

engine.systems.quest.startQuest('village_help');
```

このAPIリファレンスを参考に、独自のRPGゲームを開発してください。RPGエンジンのAPIは柔軟に拡張でき、様々なタイプのRPGゲームを作成できます。