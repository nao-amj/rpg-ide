# スクリプトリファレンス

## 概要

RPG開発環境のスクリプトシステムは、JavaScriptを使用してゲームロジックを記述できます。このドキュメントでは、利用可能なAPIと一般的な使用例を説明します。

## 基本構造

RPGスクリプトは以下の基本構造に従います：

```javascript
// ゲームの初期化
function initGame() {
    // 初期化コード
}

// メインゲームループ
function gameLoop() {
    // 毎フレーム実行されるコード
    updateGameState();
    renderGame();
    requestAnimationFrame(gameLoop);
}

// ゲーム状態の更新
function updateGameState() {
    // ゲームの状態を更新するコード
}

// ゲーム画面の描画
function renderGame() {
    // 描画処理を行うコード
}
```

## RPGエンジンAPI

### ゲーム初期化

```javascript
const engine = new RPGEngine();

engine.initialize({
    rendering: {
        canvas: document.getElementById('game-canvas'),
        tileSize: 32
    },
    input: {
        // 入力設定
    },
    physics: {
        collision: 'grid',
        gravity: 0
    },
    battle: {
        type: 'turn-based'
    },
    initialState: {
        player: {
            name: 'Hero',
            level: 1,
            hp: 100,
            mp: 50,
            x: 5,
            y: 5,
            width: 32,
            height: 32,
            color: '#0000ff'
        },
        characters: [
            {
                name: 'NPC1',
                x: 10,
                y: 8,
                width: 32,
                height: 32,
                color: '#ff0000',
                onInteract: function(gameState) {
                    engine.showDialog({
                        speaker: 'NPC',
                        text: 'こんにちは、冒険者さん！'
                    });
                }
            }
        ]
    }
});

engine.startGameLoop();
```

### マップ操作

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
            ...
        ],
        // オブジェクトレイヤー
        [
            [0, 0, 0, 2, ...],
            [0, 0, 2, 0, ...],
            ...
        ]
    ],
    collision: [
        [0, 0, 0, 1, ...],
        [0, 0, 1, 0, ...],
        ...
    ],
    // ランダムエンカウント設定
    randomEncounters: [
        {
            enemies: [
                { name: 'スライム', hp: 20, strength: 5, defense: 2, expReward: 10, goldReward: 5 },
                { name: 'ゴブリン', hp: 30, strength: 8, defense: 3, expReward: 15, goldReward: 10 }
            ],
            rate: 0.05 // エンカウント率（5%）
        }
    ],
    // イベント
    events: [
        {
            id: 'treasure_chest',
            x: 10,
            y: 5,
            condition: function(gameState) {
                return !gameState.flags.treasureOpened;
            },
            action: function(gameState) {
                engine.showDialog({
                    text: '宝箱を開けた！ポーションを手に入れた！'
                });
                gameState.flags.treasureOpened = true;
                // アイテムをインベントリに追加
                gameState.player.items.push({ name: 'ポーション', type: 'item', effect: 'heal', value: 50 });
            },
            once: true // 一度だけ実行
        }
    ]
};

// マップの読み込み
engine.loadMap(mapData);
```

### キャラクター操作

```javascript
// キャラクターの移動
function moveCharacter(character, direction, distance) {
    switch(direction) {
        case 'up':
            character.y -= distance;
            break;
        case 'down':
            character.y += distance;
            break;
        case 'left':
            character.x -= distance;
            break;
        case 'right':
            character.x += distance;
            break;
    }
}

// NPCのAI設定例
const npcWithAI = {
    name: 'Guard',
    x: 100,
    y: 100,
    width: 32,
    height: 32,
    color: '#ff0000',
    patrolPoints: [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: 100, y: 200 }
    ],
    currentPatrolIndex: 0,
    moveSpeed: 1,
    // AIロジック
    ai: function(character, deltaTime, gameState) {
        const target = character.patrolPoints[character.currentPatrolIndex];
        const dx = target.x - character.x;
        const dy = target.y - character.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 2) {
            // 次のパトロールポイントへ
            character.currentPatrolIndex = (character.currentPatrolIndex + 1) % character.patrolPoints.length;
        } else {
            // ポイントに向かって移動
            const moveX = dx / distance * character.moveSpeed;
            const moveY = dy / distance * character.moveSpeed;
            character.x += moveX;
            character.y += moveY;
        }
    },
    onInteract: function(gameState) {
        engine.showDialog({
            speaker: 'Guard',
            text: '立ち入り禁止だ！'
        });
    }
};

// キャラクターをゲームに追加
engine.gameState.characters.push(npcWithAI);
```

### バトルシステム

```javascript
// 敵キャラクターの定義
const enemies = [
    {
        name: 'ドラゴン',
        hp: 200,
        maxHP: 200,
        strength: 25,
        defense: 15,
        speed: 5,
        width: 100,
        height: 100,
        color: '#ff0000',
        expReward: 100,
        goldReward: 500,
        dropItems: [
            { item: { name: '竜の鱗', type: 'material', value: 1000 }, rate: 0.3 },
            { item: { name: 'ドラゴンソード', type: 'weapon', attack: 30 }, rate: 0.1 }
        ],
        skills: [
            { id: 'fire_breath', name: '火炎ブレス', type: 'skill', targetType: 'all_enemies', power: 20, mpCost: 10 }
        ]
    }
];

// バトル開始
engine.startBattle(enemies, {
    type: 'boss', // 'normal', 'boss', 'event' など
    escapeRate: 0.2, // 逃走成功率（20%）
    background: 'mountain', // バトル背景
    music: 'battle_boss' // バトルBGM
});

// バトルイベントのリスナー
document.addEventListener('battle-start', (e) => {
    console.log('バトル開始:', e.detail);
    // バトル開始時の処理
});

document.addEventListener('battle-end', (e) => {
    console.log('バトル終了:', e.detail);
    
    if (e.detail.result === 'player') {
        console.log('勝利！');
        console.log('獲得経験値:', e.detail.rewards.exp);
        console.log('獲得ゴールド:', e.detail.rewards.gold);
        
        // レベルアップ処理などを実装
        if (e.detail.rewards.exp > 0) {
            const player = engine.gameState.player;
            player.exp += e.detail.rewards.exp;
            
            if (player.exp >= player.level * 100) {
                player.level += 1;
                player.maxHP += 10;
                player.hp = player.maxHP;
                player.strength += 2;
                player.defense += 1;
                
                engine.showDialog({
                    text: `${player.name}はレベル${player.level}になった！`
                });
            }
        }
    } else if (e.detail.result === 'enemy') {
        console.log('敗北...');
        // ゲームオーバー処理
    } else {
        console.log('逃走成功');
    }
});
```

### ダイアログとイベント

```javascript
// ダイアログの表示
engine.showDialog({
    speaker: 'Old Man',
    text: '若者よ、この洞窟には危険がいっぱいじゃ。気をつけるのじゃ。'
});

// 選択肢付きダイアログ
function showChoiceDialog(text, choices) {
    // UIを表示する処理
    const dialogElement = document.createElement('div');
    dialogElement.classList.add('dialog');
    dialogElement.textContent = text;
    
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.addEventListener('click', () => {
            // 選択肢の処理を実行
            choice.action();
            dialogElement.remove();
        });
        dialogElement.appendChild(button);
    });
    
    document.body.appendChild(dialogElement);
}

// 使用例
showChoiceDialog('どうする？', [
    { 
        text: '洞窟に入る', 
        action: () => {
            engine.loadMap(cavemap);
        }
    },
    { 
        text: '街に戻る', 
        action: () => {
            engine.loadMap(townmap);
        }
    }
]);

// イベントの作成と登録
const eventTrigger = {
    id: 'boss_trigger',
    condition: function(gameState) {
        // プレイヤーが特定の位置に到達したらボス戦開始
        return gameState.player.x > 500 && gameState.player.y > 300 && !gameState.flags.bossDefeated;
    },
    action: function(gameState) {
        engine.showDialog({
            speaker: 'ボス',
            text: 'よくここまで来たな、勇者よ。これより先には進ません！'
        });
        
        const bossEnemy = {
            name: 'ダークロード',
            hp: 500,
            maxHP: 500,
            strength: 40,
            defense: 25,
            speed: 10,
            expReward: 1000,
            goldReward: 5000
        };
        
        setTimeout(() => {
            engine.startBattle([bossEnemy], { type: 'boss' });
        }, 2000);
    },
    once: true
};

engine.gameState.events.push(eventTrigger);
```

### セーブとロード

```javascript
// ゲームの保存
engine.saveGame(1); // スロット1に保存

// ゲームのロード
engine.loadGame(1); // スロット1からロード

// セーブデータの確認
function checkSaveData() {
    const saveExists = [];
    
    for (let i = 1; i <= 3; i++) {
        const saveKey = `rpg_save_${i}`;
        const saveData = localStorage.getItem(saveKey);
        
        if (saveData) {
            const parsedData = JSON.parse(saveData);
            saveExists.push({
                slot: i,
                playerName: parsedData.player.name,
                level: parsedData.player.level,
                timestamp: new Date(parsedData.timestamp).toLocaleString()
            });
        }
    }
    
    return saveExists;
}

// 使用例
const saves = checkSaveData();
console.log('利用可能なセーブデータ:', saves);
```

## カスタムゲームロジックの例

### 時間経過システム

```javascript
// ゲーム内時間システム
const timeSystem = {
    currentTime: 0, // 分単位
    timeSpeed: 1, // 実時間1秒あたりのゲーム内時間（分）
    
    update: function(deltaTime) {
        // deltaTimeはミリ秒単位
        this.currentTime += (deltaTime / 1000) * this.timeSpeed;
        
        // 日付と時刻の計算
        const minutes = Math.floor(this.currentTime % 60);
        const hours = Math.floor(this.currentTime / 60) % 24;
        const days = Math.floor(this.currentTime / (60 * 24));
        
        // 時間帯に応じた処理
        if (hours >= 6 && hours < 18) {
            // 昼間の処理
            this.setDayTime();
        } else {
            // 夜間の処理
            this.setNightTime();
        }
        
        return { days, hours, minutes };
    },
    
    setDayTime: function() {
        // 昼間の設定（明るさ、NPCの行動など）
        // 例：背景色の変更
        document.body.style.backgroundColor = '#87CEEB';
    },
    
    setNightTime: function() {
        // 夜間の設定（暗さ、モンスターの出現率増加など）
        // 例：背景色の変更
        document.body.style.backgroundColor = '#191970';
    }
};

// ゲームループでの使用
function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // 時間の更新
    const gameTime = timeSystem.update(deltaTime);
    
    // UI表示の更新
    document.getElementById('game-time').textContent = 
        `${gameTime.days}日目 ${gameTime.hours}:${gameTime.minutes < 10 ? '0' : ''}${gameTime.minutes}`;
    
    // その他のゲーム更新処理
    updateGameState();
    renderGame();
    
    requestAnimationFrame(gameLoop);
}
```

### クエストシステム

```javascript
// クエストシステム
const questSystem = {
    quests: [
        {
            id: 'quest1',
            title: '行方不明の子供を探せ',
            description: '村の子供が森で迷子になりました。探し出して安全に連れ帰ってください。',
            objectives: [
                { id: 'find_child', description: '子供を見つける', completed: false },
                { id: 'return_child', description: '子供を村に連れ帰る', completed: false }
            ],
            rewards: {
                exp: 100,
                gold: 50,
                items: [{ name: '回復薬', type: 'item', effect: 'heal', value: 30 }]
            },
            isCompleted: false,
            isActive: false
        }
    ],
    
    activateQuest: function(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && !quest.isActive && !quest.isCompleted) {
            quest.isActive = true;
            console.log(`クエスト「${quest.title}」が開始されました`);
            return true;
        }
        return false;
    },
    
    completeObjective: function(questId, objectiveId) {
        const quest = this.quests.find(q => q.id === questId);
        if (!quest || !quest.isActive || quest.isCompleted) return false;
        
        const objective = quest.objectives.find(o => o.id === objectiveId);
        if (objective && !objective.completed) {
            objective.completed = true;
            console.log(`目標「${objective.description}」を達成しました`);
            
            // すべての目標が達成されたか確認
            const allCompleted = quest.objectives.every(o => o.completed);
            if (allCompleted) {
                this.completeQuest(questId);
            }
            
            return true;
        }
        return false;
    },
    
    completeQuest: function(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (!quest || !quest.isActive || quest.isCompleted) return false;
        
        quest.isCompleted = true;
        quest.isActive = false;
        
        // 報酬の付与
        const player = engine.gameState.player;
        player.exp += quest.rewards.exp;
        player.gold += quest.rewards.gold;
        
        // アイテムの追加
        if (quest.rewards.items && quest.rewards.items.length > 0) {
            player.items.push(...quest.rewards.items);
        }
        
        console.log(`クエスト「${quest.title}」が完了しました！報酬を獲得しました。`);
        return true;
    },
    
    getActiveQuests: function() {
        return this.quests.filter(q => q.isActive);
    },
    
    getCompletedQuests: function() {
        return this.quests.filter(q => q.isCompleted);
    }
};

// 使用例
questSystem.activateQuest('quest1');

// イベントで目標を達成
document.addEventListener('player-find-child', () => {
    questSystem.completeObjective('quest1', 'find_child');
});

document.addEventListener('player-return-village', () => {
    if (engine.gameState.flags.childFound) {
        questSystem.completeObjective('quest1', 'return_child');
    }
});
```

これらのAPIと例を使用して、複雑なRPGゲームロジックを実装することができます。さらなる詳細については、エンジンAPIのドキュメントを参照してください。