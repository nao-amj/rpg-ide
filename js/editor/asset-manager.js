/**
 * アセット管理クラス
 */
export class AssetManager {
    constructor() {
        this.assets = {
            characters: [],
            maps: [],
            items: [],
            sounds: [],
            images: []
        };
    }
    
    // アセットの読み込み
    loadAsset(type, assetData) {
        if (this.assets[type]) {
            this.assets[type].push(assetData);
            this.updateAssetUI(type);
            return true;
        }
        return false;
    }
    
    // アセットの削除
    removeAsset(type, assetId) {
        if (this.assets[type]) {
            const index = this.assets[type].findIndex(asset => asset.id === assetId);
            if (index !== -1) {
                this.assets[type].splice(index, 1);
                this.updateAssetUI(type);
                return true;
            }
        }
        return false;
    }
    
    // アセットの取得
    getAsset(type, assetId) {
        if (this.assets[type]) {
            return this.assets[type].find(asset => asset.id === assetId);
        }
        return null;
    }
    
    // すべてのアセットの取得
    getAllAssets(type) {
        return this.assets[type] || [];
    }
    
    // アセットUIの更新
    updateAssetUI(type) {
        const container = document.getElementById(type);
        if (!container) return;
        
        container.innerHTML = '';
        
        this.assets[type].forEach(asset => {
            const assetElement = document.createElement('div');
            assetElement.classList.add('asset-item');
            assetElement.dataset.id = asset.id;
            
            // アセットのタイプに応じた表示内容
            switch (type) {
                case 'characters':
                    this.createCharacterAssetUI(assetElement, asset);
                    break;
                case 'maps':
                    this.createMapAssetUI(assetElement, asset);
                    break;
                case 'items':
                    this.createItemAssetUI(assetElement, asset);
                    break;
                default:
                    assetElement.textContent = asset.name;
                    break;
            }
            
            container.appendChild(assetElement);
        });
    }
    
    // キャラクターアセットUI作成
    createCharacterAssetUI(element, asset) {
        // プレビュー画像（実際の実装ではキャラクター画像を表示）
        const preview = document.createElement('div');
        preview.classList.add('asset-preview');
        preview.style.backgroundColor = '#555';
        preview.style.width = '32px';
        preview.style.height = '32px';
        element.appendChild(preview);
        
        // アセット名
        const name = document.createElement('div');
        name.classList.add('asset-name');
        name.textContent = asset.name;
        element.appendChild(name);
    }
    
    // マップアセットUI作成
    createMapAssetUI(element, asset) {
        // プレビュー画像（実際の実装ではマップサムネイルを表示）
        const preview = document.createElement('div');
        preview.classList.add('asset-preview');
        preview.style.backgroundColor = '#55f';
        preview.style.width = '48px';
        preview.style.height = '32px';
        element.appendChild(preview);
        
        // アセット名
        const name = document.createElement('div');
        name.classList.add('asset-name');
        name.textContent = asset.name;
        element.appendChild(name);
    }
    
    // アイテムアセットUI作成
    createItemAssetUI(element, asset) {
        // プレビュー画像（実際の実装ではアイテム画像を表示）
        const preview = document.createElement('div');
        preview.classList.add('asset-preview');
        preview.style.backgroundColor = '#5a5';
        preview.style.width = '24px';
        preview.style.height = '24px';
        element.appendChild(preview);
        
        // アセット名
        const name = document.createElement('div');
        name.classList.add('asset-name');
        name.textContent = asset.name;
        element.appendChild(name);
    }
    
    // 新しいアセットの作成
    createNewAsset(type, name) {
        const id = Date.now().toString();
        
        const asset = {
            id,
            name,
            type
        };
        
        // アセットタイプ固有のプロパティを追加
        switch (type) {
            case 'characters':
                asset.stats = {
                    hp: 100,
                    mp: 50,
                    strength: 10,
                    defense: 5
                };
                break;
            case 'maps':
                asset.size = {
                    width: 20,
                    height: 15
                };
                break;
            case 'items':
                asset.properties = {
                    value: 100,
                    effect: 'none'
                };
                break;
        }
        
        this.loadAsset(type, asset);
        return asset;
    }
    
    // 画像アセットのインポート
    importImageAsset(file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('有効な画像ファイルではありません'));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const id = Date.now().toString();
                const asset = {
                    id,
                    name: file.name,
                    type: 'image',
                    dataUrl: event.target.result
                };
                
                this.loadAsset('images', asset);
                resolve(asset);
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // サウンドアセットのインポート
    importSoundAsset(file) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('audio/')) {
                reject(new Error('有効な音声ファイルではありません'));
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const id = Date.now().toString();
                const asset = {
                    id,
                    name: file.name,
                    type: 'sound',
                    dataUrl: event.target.result
                };
                
                this.loadAsset('sounds', asset);
                resolve(asset);
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // アセットのエクスポート
    exportAsset(type, assetId, format = 'json') {
        const asset = this.getAsset(type, assetId);
        if (!asset) return null;
        
        switch (format) {
            case 'json':
                return JSON.stringify(asset, null, 2);
            case 'dataUrl':
                return asset.dataUrl || null;
            default:
                return null;
        }
    }
    
    // すべてのアセットのエクスポート
    exportAllAssets(format = 'json') {
        const exportData = {};
        
        for (const type in this.assets) {
            exportData[type] = this.assets[type];
        }
        
        return JSON.stringify(exportData, null, 2);
    }
}