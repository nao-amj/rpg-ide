/**
 * マップエディタクラス
 */
export class MapEditor {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.tileSize = 32;
        this.mapWidth = 20;
        this.mapHeight = 15;
        this.currentTool = 'draw';
        this.currentTileSet = 'basic';
        this.selectedTileIndex = 0;
        this.mapData = [];
        this.tileSets = {};
    }
    
    initialize(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // マップデータの初期化
        this.initializeMapData();
        
        // タイルセットの読み込み
        this.loadTileSets();
        
        // キャンバスのイベントリスナー
        this.setupEventListeners();
        
        // 初期描画
        this.render();
    }
    
    initializeMapData() {
        // 空のマップデータを作成
        this.mapData = Array(this.mapHeight).fill().map(() => 
            Array(this.mapWidth).fill(0) // 0は空のタイル
        );
    }
    
    loadTileSets() {
        // 実際の実装では、画像ファイルからタイルセットを読み込む
        // このデモでは単純な色のタイルをシミュレート
        
        // 基本タイルセット
        this.tileSets.basic = {
            tileSize: 32,
            tiles: [
                { color: '#000000' }, // 空のタイル
                { color: '#008800' }, // 草
                { color: '#0000AA' }, // 水
                { color: '#AA5500' }, // 土
                { color: '#AAAAAA' }  // 石
            ]
        };
        
        // ダンジョンタイルセット
        this.tileSets.dungeon = {
            tileSize: 32,
            tiles: [
                { color: '#000000' }, // 空のタイル
                { color: '#555555' }, // 床
                { color: '#888888' }, // 壁
                { color: '#AA5500' }, // ドア
                { color: '#FFCC00' }  // 宝箱
            ]
        };
        
        // 町タイルセット
        this.tileSets.town = {
            tileSize: 32,
            tiles: [
                { color: '#000000' }, // 空のタイル
                { color: '#888888' }, // 道路
                { color: '#AA5500' }, // 建物
                { color: '#008800' }, // 木
                { color: '#0000AA' }  // 水
            ]
        };
    }
    
    setupEventListeners() {
        // マウスダウンイベント
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.tileSize);
            const y = Math.floor((e.clientY - rect.top) / this.tileSize);
            
            if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
                this.handleTileClick(x, y);
            }
        });
        
        // マウス移動イベント（ドラッグ描画）
        this.canvas.addEventListener('mousemove', (e) => {
            if (e.buttons !== 1) return; // 左ボタンが押されていない場合は無視
            
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.tileSize);
            const y = Math.floor((e.clientY - rect.top) / this.tileSize);
            
            if (x >= 0 && x < this.mapWidth && y >= 0 && y < this.mapHeight) {
                this.handleTileClick(x, y);
            }
        });
    }
    
    handleTileClick(x, y) {
        switch (this.currentTool) {
            case 'draw':
                this.mapData[y][x] = this.selectedTileIndex;
                break;
            case 'erase':
                this.mapData[y][x] = 0; // 0は空のタイル
                break;
            case 'select':
                this.selectedTileIndex = this.mapData[y][x];
                console.log(`選択されたタイル: ${this.selectedTileIndex}`);
                break;
        }
        
        this.render();
    }
    
    setTool(tool) {
        this.currentTool = tool;
        console.log(`現在のツール: ${tool}`);
        
        // ツールボタンのUI更新
        document.querySelectorAll('.map-tools button').forEach(button => {
            button.classList.remove('active');
        });
        document.getElementById(`${tool}-tool`).classList.add('active');
    }
    
    setTileSet(tileSetName) {
        if (this.tileSets[tileSetName]) {
            this.currentTileSet = tileSetName;
            console.log(`現在のタイルセット: ${tileSetName}`);
            this.render();
        }
    }
    
    render() {
        // キャンバスをクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // グリッドを描画
        this.drawGrid();
        
        // マップを描画
        this.drawMap();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        
        // 縦線
        for (let x = 0; x <= this.mapWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.tileSize, 0);
            this.ctx.lineTo(x * this.tileSize, this.mapHeight * this.tileSize);
            this.ctx.stroke();
        }
        
        // 横線
        for (let y = 0; y <= this.mapHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.tileSize);
            this.ctx.lineTo(this.mapWidth * this.tileSize, y * this.tileSize);
            this.ctx.stroke();
        }
    }
    
    drawMap() {
        const tileSet = this.tileSets[this.currentTileSet];
        
        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                const tileIndex = this.mapData[y][x];
                if (tileIndex > 0 && tileSet.tiles[tileIndex]) {
                    this.ctx.fillStyle = tileSet.tiles[tileIndex].color;
                    this.ctx.fillRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }
    }
    
    // マップデータをJSON形式で取得
    getMapData() {
        return {
            width: this.mapWidth,
            height: this.mapHeight,
            tileSize: this.tileSize,
            tileSet: this.currentTileSet,
            data: this.mapData
        };
    }
    
    // マップデータを設定
    setMapData(mapData) {
        if (!mapData) return;
        
        this.mapWidth = mapData.width || this.mapWidth;
        this.mapHeight = mapData.height || this.mapHeight;
        this.tileSize = mapData.tileSize || this.tileSize;
        this.currentTileSet = mapData.tileSet || this.currentTileSet;
        this.mapData = mapData.data || this.initializeMapData();
        
        this.render();
    }
}