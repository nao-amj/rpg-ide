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

    // 画像ファイルのインポート処理
    importImageAsset(file, type) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('ファイルが選択されていません。'));
                return;
            }
            
            // 画像ファイルのみを許可
            if (!file.type.match('image.*')) {
                reject(new Error('画像ファイルを選択してください。'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const id = Date.now().toString();
                const asset = {
                    id,
                    name: file.name.replace(/\.[^/.]+$/, ""), // 拡張子を削除
                    type,
                    src: e.target.result
                };
                
                // アセットを追加
                this.loadAsset(type === 'character' ? 'characters' : 'images', asset);
                resolve(asset);
            };
            
            reader.onerror = () => {
                reject(new Error('ファイルの読み込みに失敗しました。'));
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // アセットのエクスポート
    exportAsset(type, assetId) {
        const asset = this.getAsset(type, assetId);
        if (!asset) return null;
        
        // JSONに変換
        const assetData = JSON.stringify(asset, null, 2);
        
        // Blobとしてエクスポート
        const blob = new Blob([assetData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // ダウンロードリンクを作成
        const a = document.createElement('a');
        a.href = url;
        a.download = `${asset.name}.asset.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        return asset;
    }
    
    // アセットパック（複数アセット）のエクスポート
    exportAssetPack(assetIds = {}) {
        const exportData = {};
        
        // 各タイプのアセットを収集
        for (const type in assetIds) {
            exportData[type] = [];
            for (const id of assetIds[type]) {
                const asset = this.getAsset(type, id);
                if (asset) {
                    exportData[type].push(asset);
                }
            }
        }
        
        // JSONに変換
        const packData = JSON.stringify(exportData, null, 2);
        
        // Blobとしてエクスポート
        const blob = new Blob([packData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // ダウンロードリンクを作成
        const a = document.createElement('a');
        a.href = url;
        a.download = `asset-pack-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        return exportData;
    }
    
    // アセットパックのインポート
    importAssetPack(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('ファイルが選択されていません。'));
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const packData = JSON.parse(e.target.result);
                    const importedAssets = {
                        characters: [],
                        maps: [],
                        items: [],
                        sounds: [],
                        images: []
                    };
                    
                    // 各タイプのアセットをインポート
                    for (const type in packData) {
                        if (this.assets[type]) {
                            for (const asset of packData[type]) {
                                // IDの競合を避けるために新しいIDを生成
                                const newAsset = { ...asset, id: Date.now() + Math.random().toString(36).substr(2, 9) };
                                this.loadAsset(type, newAsset);
                                importedAssets[type].push(newAsset);
                            }
                        }
                    }
                    
                    resolve(importedAssets);
                } catch (error) {
                    reject(new Error('アセットパックの解析に失敗しました: ' + error.message));
                }
            };
            
            reader.onerror = () => {
                reject(new Error('ファイルの読み込みに失敗しました。'));
            };
            
            reader.readAsText(file);
        });
    }
}