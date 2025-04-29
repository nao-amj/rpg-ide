/**
 * RPGゲームエンジンクラス
 */
import { BattleSystem } from './battle-system.js';

class RPGEngine {
    constructor() {
        this.gameState = {
            player: null,
            playerTeam: [],
            currentMap: null,
            characters: [],
            items: [],
            events: [],
            flags: {},
            quests: []
        };
        
        this.systems = {
            rendering: null,
            input: null,
            physics: null,
            battle: null,
            dialogue: null,
            inventory: null,
            quest: null,
            save: null
        };
    }
    
    /**
     * ゲームエンジンの初期化
     * @param {Object} config - 初期設定
     */
    initialize(config) {
        console.log('RPGエンジンを初期化中...');
        
        // 各システムを初期化
        this.initializeRenderingSystem(config.rendering);
        this.initializeInputSystem(config.input);
        this.initializePhysicsSystem(config.physics);
        this.initializeBattleSystem(config.battle);
        this.initializeDialogueSystem(config.dialogue);
        this.initializeInventorySystem(config.inventory);
        this.initializeQuestSystem(config.quest);
        this.initializeSaveSystem(config.save);
        
        // ゲーム状態の初期化
        this.initializeGameState(config.initialState);
        
        console.log('RPGエンジンの初期化が完了しました');
    }
    
    /**
     * レンダリングシステムの初期化
     * @param {Object} config - レンダリング設定
     */
    initializeRenderingSystem(config) {
        this.systems.rendering = {
            canvas: config?.canvas || null,
            context: null,
            tileSize: config?.tileSize || 32,
            sprites: {},
            animations: {},
            camera: {
                x: 0,
                y: 0,
                width: 800,
                height: 600
            }
        };
        
        if (this.systems.rendering.canvas) {
            this.systems.rendering.context = this.systems.rendering.canvas.getContext('2d');
        }
        
        console.log('レンダリングシステムを初期化しました');
    }
    
    /**
     * 入力システムの初期化
     * @param {Object} config - 入力設定
     */
    initializeInputSystem(config) {
        this.systems.input = {
            keys: {},
            gamepad: null,
            touchEnabled: false,
            callbacks: {}
        };
        
        // キーボード入力のイベントリスナー
        window.addEventListener('keydown', (e) => {
            this.systems.input.keys[e.code] = true;
            
            // 登録されたコールバックを実行
            if (this.systems.input.callbacks[e.code]) {
                this.systems.input.callbacks[e.code](true);
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.systems.input.keys[e.code] = false;
            
            // 登録されたコールバックを実行
            if (this.systems.input.callbacks[e.code]) {
                this.systems.input.callbacks[e.code](false);
            }
        });
        
        console.log('入力システムを初期化しました');
    }
    
    /**
     * 物理システムの初期化
     * @param {Object} config - 物理設定
     */
    initializePhysicsSystem(config) {
        this.systems.physics = {
            collision: config?.collision || 'grid',
            gravity: config?.gravity || 0,
            friction: config?.friction || 0
        };
        
        console.log('物理システムを初期化しました');
    }
    
    /**
     * バトルシステムの初期化
     * @param {Object} config - バトル設定
     */
    initializeBattleSystem(config) {
        this.systems.battle = new BattleSystem(this);
        
        // 設定があれば適用
        if (config) {
            this.systems.battle.config = { ...this.systems.battle.config, ...config };
        }
        
        console.log('バトルシステムを初期化しました');
    }
    
    /**
     * ダイアログシステムの初期化
     * @param {Object} config - ダイアログ設定
     */
    initializeDialogueSystem(config) {
        this.systems.dialogue = {
            container: config?.container || null,
            speed: config?.speed || 30,
            currentDialog: null,
            isActive: false
        };
        
        console.log('ダイアログシステムを初期化しました');
    }
    
    /**
     * インベントリシステムの初期化
     * @param {Object} config - インベントリ設定
     */
    initializeInventorySystem(config) {
        this.systems.inventory = {
            maxItems: config?.maxItems || 20,
            categories: config?.categories || ['item', 'weapon', 'armor', 'key'],
            onItemUse: config?.onItemUse || null
        };
        
        console.log('インベントリシステムを初期化しました');
    }
    
    /**
     * クエストシステムの初期化
     * @param {Object} config - クエスト設定
     */
    initializeQuestSystem(config) {
        this.systems.quest = {
            quests: config?.quests || [],
            activeQuests: [],
            completedQuests: []
        };
        
        console.log('クエストシステムを初期化しました');
    }
    
    /**
     * セーブシステムの初期化
     * @param {Object} config - セーブ設定
     */
    initializeSaveSystem(config) {
        this.systems.save = {
            storage: config?.storage || 'localStorage',
            slots: config?.slots || 3,
            prefix: config?.prefix || 'rpg_save_'
        };
        
        console.log('セーブシステムを初期化しました');
    }
    
    /**
     * ゲーム状態の初期化
     * @param {Object} initialState - 初期ゲーム状態
     */
    initializeGameState(initialState) {
        if (!initialState) return;
        
        this.gameState.player = initialState.player || null;
        this.gameState.playerTeam = initialState.playerTeam || [];
        this.gameState.currentMap = initialState.currentMap || null;
        this.gameState.characters = initialState.characters || [];
        this.gameState.items = initialState.items || [];
        this.gameState.events = initialState.events || [];
        this.gameState.flags = initialState.flags || {};
        this.gameState.quests = initialState.quests || [];
        
        console.log('ゲーム状態を初期化しました');
    }
    
    /**
     * ゲームのメインループ開始
     */
    startGameLoop() {
        console.log('ゲームループを開始します');
        
        let lastTime = 0;
        
        const gameLoop = (timestamp) => {
            // デルタタイム（前回のフレームからの経過時間）
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            
            // ゲーム状態の更新
            this.update(deltaTime);
            
            // 描画
            this.render();
            
            // 次のフレームをリクエスト
            requestAnimationFrame(gameLoop);
        };
        
        // 最初のフレームをリクエスト
        requestAnimationFrame(gameLoop);
    }
    
    /**
     * ゲーム状態の更新
     * @param {number} deltaTime - 前回の更新からの経過時間（ミリ秒）
     */
    update(deltaTime) {
        // バトル中は通常の更新を行わない
        if (this.systems.battle.inBattle) return;
        
        // プレイヤーの更新
        this.updatePlayer(deltaTime);
        
        // NPCの更新
        this.updateCharacters(deltaTime);
        
        // イベントの更新
        this.updateEvents(deltaTime);
        
        // 物理・衝突判定
        this.updatePhysics(deltaTime);
        
        // ランダムエンカウント処理
        this.checkRandomEncounter(deltaTime);
    }
    
    /**
     * プレイヤーの更新
     * @param {number} deltaTime - 前回の更新からの経過時間（ミリ秒）
     */
    updatePlayer(deltaTime) {
        if (!this.gameState.player) return;
        
        // 入力に基づいてプレイヤーを移動
        const moveSpeed = 0.2 * deltaTime;
        
        if (this.systems.input.keys['ArrowUp']) {
            this.gameState.player.y -= moveSpeed;
        }
        if (this.systems.input.keys['ArrowDown']) {
            this.gameState.player.y += moveSpeed;
        }
        if (this.systems.input.keys['ArrowLeft']) {
            this.gameState.player.x -= moveSpeed;
        }
        if (this.systems.input.keys['ArrowRight']) {
            this.gameState.player.x += moveSpeed;
        }
    }
    
    /**
     * キャラクターの更新
     * @param {number} deltaTime - 前回の更新からの経過時間（ミリ秒）
     */
    updateCharacters(deltaTime) {
        for (const character of this.gameState.characters) {
            // AI/動作パターンの更新
            if (character.ai && typeof character.ai === 'function') {
                character.ai(character, deltaTime, this.gameState);
            }
        }
    }
    
    /**
     * イベントの更新
     * @param {number} deltaTime - 前回の更新からの経過時間（ミリ秒）
     */
    updateEvents(deltaTime) {
        for (let i = this.gameState.events.length - 1; i >= 0; i--) {
            const event = this.gameState.events[i];
            
            // イベントの実行条件をチェック
            if (event.condition && typeof event.condition === 'function') {
                if (event.condition(this.gameState)) {
                    // イベントを実行
                    if (event.action && typeof event.action === 'function') {
                        event.action(this.gameState);
                    }
                    
                    // 一度だけ実行するイベントの場合は削除
                    if (event.once) {
                        this.gameState.events.splice(i, 1);
                    }
                }
            }
        }
    }
    
    /**
     * 物理・衝突判定の更新
     * @param {number} deltaTime - 前回の更新からの経過時間（ミリ秒）
     */
    updatePhysics(deltaTime) {
        // マップとの衝突判定
        if (this.gameState.currentMap && this.gameState.player) {
            // プレイヤーとマップの衝突判定
            this.checkMapCollision(this.gameState.player);
            
            // キャラクターとマップの衝突判定
            for (const character of this.gameState.characters) {
                this.checkMapCollision(character);
            }
            
            // プレイヤーとキャラクターの衝突判定
            for (const character of this.gameState.characters) {
                if (this.checkEntityCollision(this.gameState.player, character)) {
                    // 衝突時の処理（会話開始など）
                    if (character.onInteract && typeof character.onInteract === 'function') {
                        character.onInteract(this.gameState);
                    }
                }
            }
        }
    }
    
    /**
     * ランダムエンカウントの処理
     * @param {number} deltaTime - 前回の更新からの経過時間（ミリ秒）
     */
    checkRandomEncounter(deltaTime) {
        // 現在のマップでランダムエンカウントが有効かつプレイヤーが動いている場合
        if (this.gameState.currentMap && 
            this.gameState.currentMap.randomEncounters && 
            this.gameState.player && 
            (this.systems.input.keys['ArrowUp'] || 
             this.systems.input.keys['ArrowDown'] || 
             this.systems.input.keys['ArrowLeft'] || 
             this.systems.input.keys['ArrowRight'])) {
            
            // エンカウント率に基づき判定（毎フレームチェックしないよう調整）
            const encounterCheck = Math.random() * 100 < (this.gameState.currentMap.encounterRate * deltaTime / 1000);
            
            if (encounterCheck) {
                // 利用可能なエンカウンターからランダムに選択
                const availableEncounters = this.gameState.currentMap.randomEncounters;
                if (availableEncounters && availableEncounters.length > 0) {
                    const encounter = availableEncounters[Math.floor(Math.random() * availableEncounters.length)];
                    
                    // バトル開始
                    this.startBattle(encounter.enemies, encounter.options);
                }
            }
        }
    }
    
    /**
     * バトルを開始する
     * @param {Array} enemies - 敵キャラクターの配列
     * @param {Object} options - バトルオプション
     */
    startBattle(enemies, options = {}) {
        this.systems.battle.startBattle(enemies, options);
    }
    
    /**
     * マップとエンティティの衝突判定
     * @param {Object} entity - 判定対象のエンティティ
     */
    checkMapCollision(entity) {
        // 簡易的な実装（実際にはもっと複雑な衝突判定が必要）
        if (!this.gameState.currentMap || !this.gameState.currentMap.collision) return;
        
        const tileSize = this.systems.rendering.tileSize;
        const mapWidth = this.gameState.currentMap.width;
        const mapHeight = this.gameState.currentMap.height;
        
        // エンティティの位置に基づいてマップ上のタイルインデックスを計算
        const tileX = Math.floor(entity.x / tileSize);
        const tileY = Math.floor(entity.y / tileSize);
        
        // マップ境界との衝突
        if (tileX < 0 || tileX >= mapWidth || tileY < 0 || tileY >= mapHeight) {
            // マップ外への移動を防止
            entity.x = Math.max(0, Math.min(entity.x, mapWidth * tileSize - 1));
            entity.y = Math.max(0, Math.min(entity.y, mapHeight * tileSize - 1));
            return;
        }
        
        // 衝突判定マップとの衝突
        // 1は通行不可のタイルを表す（実装に応じて調整）
        if (this.gameState.currentMap.collision[tileY][tileX] === 1) {
            // 前の位置に戻す（単純な実装）
            entity.x = entity.prevX || entity.x;
            entity.y = entity.prevY || entity.y;
        } else {
            // 現在位置を記録
            entity.prevX = entity.x;
            entity.prevY = entity.y;
        }
    }
    
    /**
     * エンティティ同士の衝突判定
     * @param {Object} entityA - 判定対象のエンティティA
     * @param {Object} entityB - 判定対象のエンティティB
     * @returns {boolean} 衝突しているかどうか
     */
    checkEntityCollision(entityA, entityB) {
        // シンプルな矩形衝突判定
        const aLeft = entityA.x;
        const aRight = entityA.x + entityA.width;
        const aTop = entityA.y;
        const aBottom = entityA.y + entityA.height;
        
        const bLeft = entityB.x;
        const bRight = entityB.x + entityB.width;
        const bTop = entityB.y;
        const bBottom = entityB.y + entityB.height;
        
        return !(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom);
    }
    
    /**
     * ゲームの描画
     */
    render() {
        if (!this.systems.rendering.context) return;
        
        const ctx = this.systems.rendering.context;
        const canvas = this.systems.rendering.canvas;
        
        // キャンバスをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // バトル中はバトル画面を描画
        if (this.systems.battle.inBattle) {
            this.renderBattle();
            return;
        }
        
        // マップの描画
        this.renderMap();
        
        // キャラクターの描画
        this.renderCharacters();
        
        // プレイヤーの描画
        this.renderPlayer();
        
        // UIの描画
        this.renderUI();
    }
    
    /**
     * バトル画面の描画
     */
    renderBattle() {
        if (!this.systems.rendering.context) return;
        
        const ctx = this.systems.rendering.context;
        const canvas = this.systems.rendering.canvas;
        
        // バトル背景の描画
        ctx.fillStyle = '#000044';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 敵キャラクターの描画
        const enemyTeam = this.systems.battle.battleState.enemyTeam;
        const enemyCount = enemyTeam.length;
        const enemySpacing = canvas.width / (enemyCount + 1);
        
        for (let i = 0; i < enemyCount; i++) {
            const enemy = enemyTeam[i];
            const x = enemySpacing * (i + 1) - enemy.width / 2;
            const y = canvas.height / 3 - enemy.height / 2;
            
            // 敵の描画
            ctx.fillStyle = enemy.color || '#ff0000';
            ctx.fillRect(x, y, enemy.width || 64, enemy.height || 64);
            
            // 敵の名前と HP
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(enemy.name, x + (enemy.width || 64) / 2, y - 10);
            
            // HP バー
            const hpPercent = enemy.hp / (enemy.maxHP || 100);
            const hpBarWidth = 64;
            const hpBarHeight = 8;
            
            ctx.fillStyle = '#333333';
            ctx.fillRect(x, y - 30, hpBarWidth, hpBarHeight);
            ctx.fillStyle = '#ff3333';
            ctx.fillRect(x, y - 30, hpBarWidth * hpPercent, hpBarHeight);
        }
        
        // プレイヤーキャラクターの描画
        const playerTeam = this.systems.battle.battleState.playerTeam;
        const playerCount = playerTeam.length;
        const playerSpacing = canvas.width / (playerCount + 1);
        
        for (let i = 0; i < playerCount; i++) {
            const player = playerTeam[i];
            const x = playerSpacing * (i + 1) - player.width / 2;
            const y = canvas.height * 2/3 - player.height / 2;
            
            // プレイヤーの描画
            ctx.fillStyle = player.color || '#0000ff';
            ctx.fillRect(x, y, player.width || 64, player.height || 64);
            
            // プレイヤーの名前と HP
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(player.name, x + (player.width || 64) / 2, y - 10);
            
            // HP バー
            const hpPercent = player.hp / (player.maxHP || 100);
            const hpBarWidth = 64;
            const hpBarHeight = 8;
            
            ctx.fillStyle = '#333333';
            ctx.fillRect(x, y - 30, hpBarWidth, hpBarHeight);
            ctx.fillStyle = '#33ff33';
            ctx.fillRect(x, y - 30, hpBarWidth * hpPercent, hpBarHeight);
            
            // MP バー
            if (player.mp !== undefined) {
                const mpPercent = player.mp / (player.maxMP || 50);
                ctx.fillStyle = '#333333';
                ctx.fillRect(x, y - 20, hpBarWidth, hpBarHeight);
                ctx.fillStyle = '#3333ff';
                ctx.fillRect(x, y - 20, hpBarWidth * mpPercent, hpBarHeight);
            }
        }
        
        // バトルUI・コマンドメニューの描画
        this.renderBattleUI();
    }
    
    /**
     * バトルUIの描画
     */
    renderBattleUI() {
        if (!this.systems.rendering.context) return;
        
        const ctx = this.systems.rendering.context;
        const canvas = this.systems.rendering.canvas;
        
        // アクションメニュー（プレイヤーのターンの場合）
        const battleState = this.systems.battle.battleState;
        if (battleState.playerTeam.includes(battleState.currentTurn)) {
            // メニュー背景
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, canvas.height - 150, canvas.width, 150);
            
            // アクションリスト
            const actions = this.systems.battle.getAvailableActions(battleState.currentTurn);
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Arial';
            ctx.textAlign = 'left';
            
            for (let i = 0; i < actions.length; i++) {
                ctx.fillText(actions[i].name, 50, canvas.height - 120 + i * 30);
            }
        }
        
        // バトルログ表示
        if (battleState.battleLog.length > 0) {
            const latestLog = battleState.battleLog[battleState.battleLog.length - 1];
            if (latestLog && latestLog.result && latestLog.result.message) {
                // メッセージ表示
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 20, canvas.width, 40);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(latestLog.result.message, canvas.width / 2, 45);
            }
        }
    }
    
    /**
     * マップの描画
     */
    renderMap() {
        if (!this.gameState.currentMap || !this.systems.rendering.context) return;
        
        const ctx = this.systems.rendering.context;
        const tileSize = this.systems.rendering.tileSize;
        const camera = this.systems.rendering.camera;
        
        // マップデータ
        const mapData = this.gameState.currentMap.layers;
        const mapWidth = this.gameState.currentMap.width;
        const mapHeight = this.gameState.currentMap.height;
        
        // カメラの位置から表示範囲を計算
        const startX = Math.floor(camera.x / tileSize);
        const startY = Math.floor(camera.y / tileSize);
        const endX = Math.min(mapWidth, startX + Math.ceil(camera.width / tileSize) + 1);
        const endY = Math.min(mapHeight, startY + Math.ceil(camera.height / tileSize) + 1);
        
        // 表示範囲内のタイルを描画
        for (let layer = 0; layer < mapData.length; layer++) {
            for (let y = startY; y < endY; y++) {
                for (let x = startX; x < endX; x++) {
                    const tileIndex = mapData[layer][y][x];
                    
                    // 0は空のタイルを表す
                    if (tileIndex === 0) continue;
                    
                    // TODO: 実際のタイルセット画像から描画
                    // デモでは単純な色で表現
                    ctx.fillStyle = `hsl(${tileIndex * 30}, 50%, 50%)`;
                    ctx.fillRect(
                        x * tileSize - camera.x,
                        y * tileSize - camera.y,
                        tileSize,
                        tileSize
                    );
                }
            }
        }
    }
    
    /**
     * キャラクターの描画
     */
    renderCharacters() {
        if (!this.systems.rendering.context) return;
        
        const ctx = this.systems.rendering.context;
        const camera = this.systems.rendering.camera;
        
        for (const character of this.gameState.characters) {
            // TODO: 実際のキャラクタースプライトから描画
            // デモでは単純な色のブロックで表現
            ctx.fillStyle = character.color || '#ff0000';
            ctx.fillRect(
                character.x - camera.x,
                character.y - camera.y,
                character.width || 32,
                character.height || 32
            );
        }
    }
    
    /**
     * プレイヤーの描画
     */
    renderPlayer() {
        if (!this.gameState.player || !this.systems.rendering.context) return;
        
        const ctx = this.systems.rendering.context;
        const camera = this.systems.rendering.camera;
        const player = this.gameState.player;
        
        // TODO: 実際のプレイヤースプライトから描画
        // デモでは単純な色のブロックで表現
        ctx.fillStyle = player.color || '#0000ff';
        ctx.fillRect(
            player.x - camera.x,
            player.y - camera.y,
            player.width || 32,
            player.height || 32
        );
    }
    
    /**
     * UIの描画
     */
    renderUI() {
        if (!this.systems.rendering.context) return;
        
        const ctx = this.systems.rendering.context;
        const canvas = this.systems.rendering.canvas;
        
        // プレイヤーステータスUI
        if (this.gameState.player) {
            const player = this.gameState.player;
            
            // HPバー
            const maxHP = player.maxHP || 100;
            const hp = player.hp || 0;
            const hpPercent = hp / maxHP;
            
            ctx.fillStyle = '#333';
            ctx.fillRect(10, 10, 100, 20);
            ctx.fillStyle = '#f00';
            ctx.fillRect(10, 10, 100 * hpPercent, 20);
            
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(`HP: ${hp}/${maxHP}`, 15, 25);
            
            // MPバー
            if (player.mp !== undefined) {
                const maxMP = player.maxMP || 50;
                const mp = player.mp || 0;
                const mpPercent = mp / maxMP;
                
                ctx.fillStyle = '#333';
                ctx.fillRect(10, 35, 100, 20);
                ctx.fillStyle = '#00f';
                ctx.fillRect(10, 35, 100 * mpPercent, 20);
                
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.fillText(`MP: ${mp}/${maxMP}`, 15, 50);
            }
        }
        
        // ダイアログUIの描画
        if (this.systems.dialogue.isActive && this.systems.dialogue.currentDialog) {
            const dialog = this.systems.dialogue.currentDialog;
            
            // ダイアログボックス
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(50, canvas.height - 150, canvas.width - 100, 100);
            ctx.strokeStyle = '#fff';
            ctx.strokeRect(50, canvas.height - 150, canvas.width - 100, 100);
            
            // テキスト
            ctx.fillStyle = '#fff';
            ctx.font = '16px Arial';
            ctx.fillText(dialog.text, 70, canvas.height - 120);
            
            // 話者名
            if (dialog.speaker) {
                ctx.fillStyle = '#ff0';
                ctx.fillText(dialog.speaker, 70, canvas.height - 130);
            }
        }
    }
    
    /**
     * ダイアログの表示
     * @param {Object} dialog - ダイアログデータ
     */
    showDialog(dialog) {
        this.systems.dialogue.currentDialog = dialog;
        this.systems.dialogue.isActive = true;
    }
    
    /**
     * ダイアログを閉じる
     */
    closeDialog() {
        this.systems.dialogue.isActive = false;
        this.systems.dialogue.currentDialog = null;
    }
    
    /**
     * マップの読み込み
     * @param {Object} mapData - マップデータ
     */
    loadMap(mapData) {
        this.gameState.currentMap = mapData;
        console.log(`マップ「${mapData.name}」を読み込みました`);
    }
    
    /**
     * ゲームの保存
     * @param {number} slot - セーブスロット番号
     */
    saveGame(slot) {
        const saveData = {
            player: this.gameState.player,
            playerTeam: this.gameState.playerTeam,
            currentMap: {
                id: this.gameState.currentMap.id,
                name: this.gameState.currentMap.name
            },
            flags: this.gameState.flags,
            timestamp: Date.now()
        };
        
        const saveKey = `${this.systems.save.prefix}${slot}`;
        
        try {
            if (this.systems.save.storage === 'localStorage') {
                localStorage.setItem(saveKey, JSON.stringify(saveData));
                console.log(`ゲームをスロット${slot}に保存しました`);
                return true;
            }
        } catch (error) {
            console.error('ゲームの保存に失敗しました:', error);
        }
        
        return false;
    }
    
    /**
     * ゲームの読み込み
     * @param {number} slot - セーブスロット番号
     */
    loadGame(slot) {
        const saveKey = `${this.systems.save.prefix}${slot}`;
        
        try {
            if (this.systems.save.storage === 'localStorage') {
                const saveData = JSON.parse(localStorage.getItem(saveKey));
                
                if (!saveData) {
                    console.error(`スロット${slot}にセーブデータがありません`);
                    return false;
                }
                
                // プレイヤーデータを復元
                this.gameState.player = saveData.player;
                this.gameState.playerTeam = saveData.playerTeam || [];
                
                // マップを読み込み
                // 実際の実装では、マップIDに基づいて適切なマップを読み込む必要がある
                console.log(`マップ「${saveData.currentMap.name}」を読み込む必要があります`);
                
                // フラグを復元
                this.gameState.flags = saveData.flags;
                
                console.log(`スロット${slot}からゲームを読み込みました（${new Date(saveData.timestamp)}）`);
                return true;
            }
        } catch (error) {
            console.error('ゲームの読み込みに失敗しました:', error);
        }
        
        return false;
    }
}

// グローバルにエクスポート
window.RPGEngine = RPGEngine;

export default RPGEngine;