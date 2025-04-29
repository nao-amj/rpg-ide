/**
 * スクリプトエディタクラス
 */
export class ScriptEditor {
    constructor() {
        this.editor = null;
        this.currentFile = null;
    }
    
    initialize(containerId) {
        // Monaco エディタの初期化
        // 注: 実際の実装では、Monaco エディタのライブラリがロードされている必要があります
        try {
            // Monaco が利用可能かチェック
            if (typeof monaco !== 'undefined') {
                this.editor = monaco.editor.create(document.getElementById(containerId), {
                    value: this.getDefaultCode(),
                    language: 'javascript',
                    theme: 'vs-dark',
                    automaticLayout: true
                });
                
                console.log('スクリプトエディタが初期化されました');
            } else {
                console.warn('Monaco エディタが見つかりません。スクリプトエディタはデモモードで動作します。');
                this.initializeFallbackEditor(containerId);
            }
        } catch (error) {
            console.error('スクリプトエディタの初期化に失敗しました:', error);
            this.initializeFallbackEditor(containerId);
        }
    }
    
    initializeFallbackEditor(containerId) {
        // Monaco エディタが利用できない場合のフォールバック
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        const textarea = document.createElement('textarea');
        textarea.value = this.getDefaultCode();
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.backgroundColor = '#1e1e1e';
        textarea.style.color = '#d4d4d4';
        textarea.style.fontFamily = 'monospace';
        textarea.style.padding = '10px';
        textarea.style.border = 'none';
        textarea.style.resize = 'none';
        
        container.appendChild(textarea);
        
        this.fallbackEditor = textarea;
    }
    
    getDefaultCode() {
        return `/**
 * RPGゲームスクリプト
 */

// ゲームの初期化
function initGame() {
    console.log('ゲームを初期化中...');
    
    // プレイヤーの設定
    const player = {
        name: 'Hero',
        level: 1,
        hp: 100,
        mp: 50,
        strength: 10,
        defense: 5,
        items: []
    };
    
    return player;
}

// メインゲームループ
function gameLoop() {
    // ゲームの状態を更新
    updateGameState();
    
    // 画面を描画
    renderGame();
    
    // 次のフレームでループを続ける
    requestAnimationFrame(gameLoop);
}

// ゲーム状態の更新
function updateGameState() {
    // キャラクターの移動
    // イベントの処理
    // バトルの処理
    // など
}

// ゲーム画面の描画
function renderGame() {
    // マップの描画
    // キャラクターの描画
    // UIの描画
    // など
}

// 使用例:
// const player = initGame();
// gameLoop();
`;
    }
    
    setContent(content) {
        if (this.editor) {
            this.editor.setValue(content);
        } else if (this.fallbackEditor) {
            this.fallbackEditor.value = content;
        }
    }
    
    getContent() {
        if (this.editor) {
            return this.editor.getValue();
        } else if (this.fallbackEditor) {
            return this.fallbackEditor.value;
        }
        return '';
    }
    
    setLanguage(language) {
        if (this.editor) {
            monaco.editor.setModelLanguage(this.editor.getModel(), language);
        }
        // フォールバックエディタは言語の切り替えをサポートしていません
    }
}