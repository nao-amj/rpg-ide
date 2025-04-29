/**
 * プロジェクト管理クラス
 */
export class ProjectManager {
    constructor() {
        this.currentProject = null;
        this.projectPath = null;
    }
    
    createNewProject() {
        // 新規プロジェクト作成ダイアログを表示
        const projectName = prompt('新規プロジェクト名を入力してください：', 'NewProject');
        
        if (!projectName) return; // キャンセルされた場合
        
        // 新規プロジェクト構造の作成
        this.currentProject = {
            name: projectName,
            scenes: [
                { name: 'Title', type: 'scene' },
                { name: 'MainMap', type: 'map' }
            ],
            characters: [],
            items: []
        };
        
        // UIを更新
        document.dispatchEvent(new CustomEvent('project-created', { detail: this.currentProject }));
        document.getElementById('status-message').textContent = `新規プロジェクト「${projectName}」が作成されました`;
    }
    
    openProject() {
        // プロジェクトを開くための処理
        console.log('プロジェクトを開く...');
        
        // ファイル選択ダイアログをシミュレート
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.rpgproj, .json';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const projectData = JSON.parse(event.target.result);
                    this.loadProject(projectData, file.name);
                } catch (error) {
                    console.error('プロジェクトの読み込みに失敗しました:', error);
                    alert('プロジェクトの読み込みに失敗しました。');
                }
            };
            reader.readAsText(file);
        });
        
        fileInput.click();
    }
    
    loadProject(projectData, filename) {
        this.currentProject = projectData;
        this.projectPath = filename;
        
        // UIを更新
        document.dispatchEvent(new CustomEvent('project-loaded', { detail: this.currentProject }));
        document.getElementById('status-message').textContent = `プロジェクト「${this.currentProject.name}」を読み込みました`;
    }
    
    saveProject() {
        if (!this.currentProject) {
            alert('保存するプロジェクトがありません。');
            return;
        }
        
        // プロジェクトデータをJSONに変換
        const projectData = JSON.stringify(this.currentProject, null, 2);
        
        // ファイル保存ダイアログをシミュレート
        const blob = new Blob([projectData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentProject.name}.rpgproj`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        document.getElementById('status-message').textContent = `プロジェクト「${this.currentProject.name}」を保存しました`;
    }
    
    exportProject() {
        if (!this.currentProject) {
            alert('エクスポートするプロジェクトがありません。');
            return;
        }
        
        // ゲームのエクスポート処理
        console.log('プロジェクトをエクスポート中...');
        document.getElementById('status-message').textContent = 'プロジェクトをエクスポート中...';
        
        // TODO: 実際のエクスポート処理を実装
        
        // エクスポート完了のシミュレーション
        setTimeout(() => {
            alert(`プロジェクト「${this.currentProject.name}」のエクスポートが完了しました。`);
            document.getElementById('status-message').textContent = 'エクスポート完了';
        }, 1000);
    }
    
    // プロジェクト構造の変更を処理するメソッド
    updateProjectStructure(updatedStructure) {
        this.currentProject = updatedStructure;
        document.dispatchEvent(new CustomEvent('project-updated', { detail: this.currentProject }));
    }
}