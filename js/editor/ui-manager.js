/**
 * UI管理クラス
 */
export class UIManager {
    constructor() {
        // イベントリスナーを設定
        document.addEventListener('project-created', (e) => this.updateProjectTree(e.detail));
        document.addEventListener('project-loaded', (e) => this.updateProjectTree(e.detail));
        document.addEventListener('project-updated', (e) => this.updateProjectTree(e.detail));
    }
    
    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                const tabContainer = button.closest('.tabs').parentElement;
                
                // 同じコンテナ内のすべてのタブボタンから'active'クラスを削除
                tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // 同じコンテナ内のすべてのタブコンテンツを非表示にする
                tabContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.add('hidden');
                });
                
                // 選択されたタブボタンとコンテンツをアクティブにする
                button.classList.add('active');
                tabContainer.querySelector(`#${tabId}`).classList.remove('hidden');
            });
        });
    }
    
    setupAssetTabs() {
        const assetTabs = document.querySelectorAll('.assets-library .tab-btn');
        
        assetTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // すべてのアセットタブから'active'クラスを削除
                document.querySelectorAll('.assets-library .tab-btn').forEach(t => {
                    t.classList.remove('active');
                });
                
                // すべてのアセットコンテンツを非表示にする
                document.querySelectorAll('.assets-library .tab-content').forEach(content => {
                    content.classList.add('hidden');
                });
                
                // 選択されたタブとコンテンツをアクティブにする
                tab.classList.add('active');
                document.getElementById(tabId).classList.remove('hidden');
            });
        });
    }
    
    updateProjectTree(project) {
        if (!project) return;
        
        const treeElement = document.getElementById('project-tree');
        treeElement.innerHTML = '';
        
        // プロジェクト名
        const projectItem = document.createElement('li');
        projectItem.textContent = project.name;
        projectItem.classList.add('project-root');
        treeElement.appendChild(projectItem);
        
        // シーンフォルダ
        const scenesFolder = this.createFolderItem('シーン');
        treeElement.appendChild(scenesFolder);
        
        const scenesList = document.createElement('ul');
        scenesFolder.appendChild(scenesList);
        
        project.scenes.forEach(scene => {
            const sceneItem = document.createElement('li');
            sceneItem.textContent = scene.name;
            sceneItem.dataset.type = scene.type;
            scenesList.appendChild(sceneItem);
            
            // シーンアイテムのクリックイベント
            sceneItem.addEventListener('click', () => {
                this.selectItem(sceneItem, scene);
            });
        });
        
        // キャラクターフォルダ
        const charactersFolder = this.createFolderItem('キャラクター');
        treeElement.appendChild(charactersFolder);
        
        const charactersList = document.createElement('ul');
        charactersFolder.appendChild(charactersList);
        
        project.characters.forEach(character => {
            const characterItem = document.createElement('li');
            characterItem.textContent = character.name;
            characterItem.dataset.type = character.type;
            charactersList.appendChild(characterItem);
            
            // キャラクターアイテムのクリックイベント
            characterItem.addEventListener('click', () => {
                this.selectItem(characterItem, character);
            });
        });
        
        // アイテムフォルダ
        const itemsFolder = this.createFolderItem('アイテム');
        treeElement.appendChild(itemsFolder);
        
        const itemsList = document.createElement('ul');
        itemsFolder.appendChild(itemsList);
        
        project.items.forEach(item => {
            const itemElement = document.createElement('li');
            itemElement.textContent = item.name;
            itemElement.dataset.type = item.type;
            itemsList.appendChild(itemElement);
            
            // アイテム要素のクリックイベント
            itemElement.addEventListener('click', () => {
                this.selectItem(itemElement, item);
            });
        });
    }
    
    createFolderItem(name) {
        const folderItem = document.createElement('li');
        folderItem.textContent = name;
        folderItem.classList.add('folder');
        
        // フォルダの展開/折りたたみ機能
        folderItem.addEventListener('click', (e) => {
            if (e.target === folderItem) {
                const ul = folderItem.querySelector('ul');
                if (ul) {
                    ul.classList.toggle('hidden');
                    folderItem.classList.toggle('collapsed');
                }
            }
        });
        
        return folderItem;
    }
    
    selectItem(element, data) {
        // 選択済みの要素から選択状態を解除
        document.querySelectorAll('#project-tree li.selected').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 選択された要素にselectedクラスを追加
        element.classList.add('selected');
        
        // 選択されたアイテムのプロパティを表示
        this.displayProperties(data);
        
        // アイテムタイプに応じて適切なエディタを表示
        this.activateEditorForType(data.type);
    }
    
    displayProperties(data) {
        const propertiesContainer = document.getElementById('properties-container');
        propertiesContainer.innerHTML = '';
        
        // オブジェクトのプロパティを表示
        for (const key in data) {
            if (key === 'type') continue; // typeプロパティは特別に処理
            
            const propertyRow = document.createElement('div');
            propertyRow.classList.add('property-row');
            
            const propertyLabel = document.createElement('label');
            propertyLabel.textContent = key;
            propertyRow.appendChild(propertyLabel);
            
            const propertyInput = document.createElement('input');
            propertyInput.type = 'text';
            propertyInput.value = data[key];
            propertyInput.dataset.property = key;
            propertyRow.appendChild(propertyInput);
            
            propertiesContainer.appendChild(propertyRow);
        }
    }
    
    activateEditorForType(type) {
        // アイテムタイプに応じて適切なエディタタブをアクティブにする
        switch (type) {
            case 'map':
                document.querySelector('[data-tab="map-editor"]').click();
                break;
            case 'scene':
            case 'character':
            case 'item':
            case 'weapon':
                document.querySelector('[data-tab="visual-editor"]').click();
                break;
            default:
                document.querySelector('[data-tab="script-editor"]').click();
                break;
        }
    }
}