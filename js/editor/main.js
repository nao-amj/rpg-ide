/**
 * RPG IDE メインエディタ
 */

// モジュールインポート
import RPGEngine from '../engine/rpg-engine.js';

// グローバル変数
const editor = {
    // エディタの状態
    state: {
        currentProject: null,
        currentFile: null,
        isDirty: false,
        activeTab: 'visual-editor',
        codeEditor: null,
        gameEngine: null,
        assetLibrary: {
            characters: [],
            maps: [],
            items: []
        }
    },
    
    // DOM要素
    elements: {}
};

/**
 * 初期化関数
 */
function initialize() {
    console.log('RPG IDEを初期化中...');
    
    // DOM要素の参照を取得
    cacheElements();
    
    // イベントリスナーを設定
    setupEventListeners();
    
    // コードエディタを初期化
    initializeCodeEditor();
    
    // ゲームエンジンを初期化
    initializeGameEngine();
    
    // サンプルアセットを読み込み
    loadSampleAssets();
    
    // UIを更新
    updateUI();
    
    console.log('RPG IDEの初期化が完了しました');
}

/**
 * DOM要素の参照をキャッシュ
 */
function cacheElements() {
    // ボタン
    editor.elements.newProjectBtn = document.getElementById('new-project');
    editor.elements.openProjectBtn = document.getElementById('open-project');
    editor.elements.saveProjectBtn = document.getElementById('save-project');
    editor.elements.exportProjectBtn = document.getElementById('export-project');
    editor.elements.runGameBtn = document.getElementById('run-game');
    
    // タブ
    editor.elements.tabs = document.querySelectorAll('.tab-btn');
    editor.elements.tabContents = document.querySelectorAll('.tab-content');
    
    // エディタ領域
    editor.elements.codeEditorContainer = document.getElementById('code-editor');
    editor.elements.gameCanvas = document.getElementById('game-canvas');
    editor.elements.mapCanvas = document.getElementById('map-canvas');
    editor.elements.propertiesContainer = document.getElementById('properties-container');
    
    // ツリービュー
    editor.elements.projectTree = document.getElementById('project-tree');
    
    // アセットコンテナ
    editor.elements.charactersContainer = document.getElementById('characters');
    editor.elements.mapsContainer = document.getElementById('maps');
    editor.elements.itemsContainer = document.getElementById('items');
    
    // マップエディタツール
    editor.elements.mapTools = document.querySelectorAll('.map-tools button');
    editor.elements.tileSetSelect = document.getElementById('tile-set');
    
    // ステータスバー
    editor.elements.statusMessage = document.getElementById('status-message');
    editor.elements.cursorPosition = document.getElementById('cursor-position');
}

/**
 * イベントリスナーを設定
 */
function setupEventListeners() {
    // ボタンイベント
    editor.elements.newProjectBtn.addEventListener('click', handleNewProject);
    editor.elements.openProjectBtn.addEventListener('click', handleOpenProject);
    editor.elements.saveProjectBtn.addEventListener('click', handleSaveProject);
    editor.elements.exportProjectBtn.addEventListener('click', handleExportProject);
    editor.elements.runGameBtn.addEventListener('click', handleRunGame);
    
    // タブ切り替えイベント
    editor.elements.tabs.forEach(tab => {
        tab.addEventListener('click', handleTabChange);
    });
    
    // マップエディタツールイベント
    editor.elements.mapTools.forEach(tool => {
        tool.addEventListener('click', handleMapToolChange);
    });
    
    // キャンバスイベント
    editor.elements.gameCanvas.addEventListener('click', handleCanvasClick);
    editor.elements.gameCanvas.addEventListener('mousemove', handleCanvasMouseMove);
    editor.elements.mapCanvas.addEventListener('click', handleMapCanvasClick);
    editor.elements.mapCanvas.addEventListener('mousemove', handleMapCanvasMouseMove);
    
    // タイルセット選択イベント
    editor.elements.tileSetSelect.addEventListener('change', handleTileSetChange);
}

/**
 * コードエディタの初期化
 */
function initializeCodeEditor() {
    // Monaco エディタが読み込まれているか確認
    if (typeof monaco !== 'undefined') {
        editor.state.codeEditor = monaco.editor.create(editor.elements.codeEditorContainer, {
            value: '// RPGスクリプトをここに記述します\n\n',
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true
        });
        
        editor.state.codeEditor.onDidChangeModelContent(() => {
            editor.state.isDirty = true;
            updateStatusBar('変更あり - 保存していません');
        });
        
        console.log('コードエディタを初期化しました');
    } else {
        console.error('Monaco エディタが読み込まれていません');
    }
}

/**
 * ゲームエンジンの初期化
 */
function initializeGameEngine() {
    editor.state.gameEngine = new RPGEngine();
    
    // キャンバスを設定
    const config = {
        rendering: {
            canvas: editor.elements.gameCanvas
        }
    };
    
    editor.state.gameEngine.initialize(config);
    console.log('ゲームエンジンを初期化しました');
    
    // サンプルマップを読み込み
    const sampleMap = createSampleMap();
    editor.state.gameEngine.loadMap(sampleMap);
    
    // サンプルプレイヤーを作成
    const samplePlayer = createSamplePlayer();
    editor.state.gameEngine.gameState.player = samplePlayer;
    
    // ゲームループを開始
    editor.state.gameEngine.startGameLoop();
}

/**
 * サンプルマップの作成
 */
function createSampleMap() {
    const mapWidth = 20;
    const mapHeight = 15;
    
    // マップレイヤーの作成（地形）
    const groundLayer = Array(mapHeight).fill().map(() => Array(mapWidth).fill(1));
    // マップレイヤーの作成（オブジェクト）
    const objectLayer = Array(mapHeight).fill().map(() => Array(mapWidth).fill(0));
    
    // 壁を配置
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (y === 0 || y === mapHeight - 1 || x === 0 || x === mapWidth - 1) {
                objectLayer[y][x] = 2; // 壁
            }
        }
    }
    
    // 障害物をランダムに配置
    for (let i = 0; i < 10; i++) {
        const x = Math.floor(Math.random() * (mapWidth - 2)) + 1;
        const y = Math.floor(Math.random() * (mapHeight - 2)) + 1;
        objectLayer[y][x] = 3; // 障害物
    }
    
    // 衝突判定マップ
    const collisionMap = objectLayer.map(row => row.map(tile => tile > 0 ? 1 : 0));
    
    return {
        id: 'sample_map',
        name: 'サンプルマップ',
        width: mapWidth,
        height: mapHeight,
        layers: [groundLayer, objectLayer],
        collision: collisionMap,
        randomEncounters: [
            {
                enemies: [
                    { name: 'スライム', hp: 10, maxHP: 10, strength: 3, defense: 1, speed: 5, expReward: 5, goldReward: 3, color: '#44aaff' },
                    { name: 'コウモリ', hp: 5, maxHP: 5, strength: 2, defense: 0, speed: 8, expReward: 3, goldReward: 2, color: '#aa44ff' }
                ],
                rate: 0.2
            }
        ],
        encounterRate: 0.01
    };
}

/**
 * サンプルプレイヤーの作成
 */
function createSamplePlayer() {
    return {
        name: 'プレイヤー',
        x: 160,
        y: 160,
        width: 32,
        height: 32,
        hp: 50,
        maxHP: 50,
        mp: 20,
        maxMP: 20,
        strength: 10,
        defense: 5,
        speed: 10,
        level: 1,
        experience: 0,
        color: '#4444ff'
    };
}