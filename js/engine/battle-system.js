/**
 * RPGバトルシステムクラス
 */
export class BattleSystem {
    constructor(engine) {
        this.engine = engine;
        this.inBattle = false;
        this.battleState = {
            playerTeam: [],
            enemyTeam: [],
            currentTurn: null,
            turnOrder: [],
            actions: [],
            battleLog: [],
            round: 0,
            battleResult: null
        };
        this.config = {
            type: 'turn-based', // 'turn-based', 'active-time', 'real-time'
            encounterRate: 0.1,  // エンカウント率（0-1）
            escapeRate: 0.5      // 逃走成功率（0-1）
        };
    }
    
    /**
     * バトルを開始する
     * @param {Array} enemies - 敵キャラクターの配列
     * @param {Object} battleOptions - バトル設定オプション
     */
    startBattle(enemies, battleOptions = {}) {
        if (this.inBattle) return;
        
        console.log('バトルを開始します');
        
        // バトル状態を初期化
        this.inBattle = true;
        this.battleState.playerTeam = [
            this.engine.gameState.player,
            ...this.engine.gameState.playerTeam || []
        ];
        this.battleState.enemyTeam = enemies;
        this.battleState.currentTurn = null;
        this.battleState.turnOrder = [];
        this.battleState.actions = [];
        this.battleState.battleLog = [];
        this.battleState.round = 0;
        this.battleState.battleResult = null;
        
        // バトル設定をマージ
        this.config = { ...this.config, ...battleOptions };
        
        // ターン順を決定
        this.determineTurnOrder();
        
        // バトル開始イベントをディスパッチ
        const battleEvent = new CustomEvent('battle-start', { 
            detail: { 
                playerTeam: this.battleState.playerTeam,
                enemyTeam: this.battleState.enemyTeam 
            } 
        });
        document.dispatchEvent(battleEvent);
        
        // 最初のターンを開始
        this.startNextTurn();
    }
    
    /**
     * ターン順を決定する
     */
    determineTurnOrder() {
        // すべてのキャラクターを速度順にソート
        const allCharacters = [
            ...this.battleState.playerTeam,
            ...this.battleState.enemyTeam
        ];
        
        // 速度（speed）パラメータでソート（高い順）
        this.battleState.turnOrder = allCharacters.sort((a, b) => {
            const speedA = a.speed || 0;
            const speedB = b.speed || 0;
            return speedB - speedA;
        });
        
        console.log('ターン順が決定しました:', this.battleState.turnOrder.map(c => c.name));
    }
    
    /**
     * 次のターンを開始する
     */
    startNextTurn() {
        if (!this.inBattle) return;
        
        // 全ラウンドが終了したら次のラウンドへ
        if (!this.battleState.currentTurn || 
            this.battleState.turnOrder.indexOf(this.battleState.currentTurn) === this.battleState.turnOrder.length - 1) {
            this.battleState.round++;
            console.log(`ラウンド ${this.battleState.round} 開始`);
            this.battleState.currentTurn = this.battleState.turnOrder[0];
        } else {
            // 次のキャラクターへ
            const currentIndex = this.battleState.turnOrder.indexOf(this.battleState.currentTurn);
            this.battleState.currentTurn = this.battleState.turnOrder[currentIndex + 1];
        }
        
        const currentCharacter = this.battleState.currentTurn;
        console.log(`${currentCharacter.name}のターン`);
        
        // プレイヤーチームのキャラクターなら、行動選択UIを表示
        if (this.battleState.playerTeam.includes(currentCharacter)) {
            this.showPlayerActionMenu(currentCharacter);
        } else {
            // 敵AIの行動を決定
            this.determineEnemyAction(currentCharacter);
        }
    }
    
    /**
     * プレイヤーのアクションメニューを表示
     * @param {Object} character - 行動するキャラクター
     */
    showPlayerActionMenu(character) {
        // イベントをディスパッチしてUIに通知
        const actionEvent = new CustomEvent('battle-action-menu', { 
            detail: { 
                character: character,
                availableActions: this.getAvailableActions(character)
            } 
        });
        document.dispatchEvent(actionEvent);
        
        // Note: 実際のUI表示はイベントリスナーで処理
    }
    
    /**
     * キャラクターが実行可能なアクションを取得
     * @param {Object} character - キャラクター
     * @returns {Array} 実行可能なアクションの配列
     */
    getAvailableActions(character) {
        const baseActions = [
            { id: 'attack', name: '攻撃', type: 'basic', targetType: 'enemy', description: '通常攻撃' },
            { id: 'defend', name: '防御', type: 'basic', targetType: 'self', description: '防御態勢をとる' },
            { id: 'escape', name: '逃げる', type: 'basic', targetType: 'none', description: 'バトルから逃げる' }
        ];
        
        // キャラクター固有のスキルがあれば追加
        const skills = character.skills || [];
        
        return [...baseActions, ...skills];
    }
    
    /**
     * 敵の行動を決定する
     * @param {Object} enemy - 敵キャラクター
     */
    determineEnemyAction(enemy) {
        // 敵AIの実装
        // 単純な例: ランダムに行動を選択
        const availableActions = this.getAvailableActions(enemy);
        const action = availableActions[Math.floor(Math.random() * availableActions.length)];
        
        // ターゲットの選択
        let target;
        if (action.targetType === 'enemy') {
            // プレイヤーチームからランダムに選択
            const aliveTargets = this.battleState.playerTeam.filter(c => c.hp > 0);
            if (aliveTargets.length === 0) {
                // 全員戦闘不能ならバトル終了
                this.endBattle('enemy');
                return;
            }
            target = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
        } else if (action.targetType === 'ally') {
            // 敵チームからランダムに選択
            const aliveTargets = this.battleState.enemyTeam.filter(c => c.hp > 0);
            target = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
        } else if (action.targetType === 'self') {
            target = enemy;
        } else {
            target = null;
        }
        
        // 行動を実行
        setTimeout(() => {
            this.executeAction(enemy, action, target);
        }, 1000); // 少し遅延を入れて演出
    }
    
    /**
     * プレイヤーの行動を処理
     * @param {Object} character - 行動するキャラクター
     * @param {Object} action - 選択されたアクション
     * @param {Object} target - 対象キャラクター
     */
    handlePlayerAction(character, action, target) {
        // 行動を実行
        this.executeAction(character, action, target);
    }
    
    /**
     * 行動を実行する
     * @param {Object} actor - 行動するキャラクター
     * @param {Object} action - 実行するアクション
     * @param {Object} target - 対象キャラクター
     */
    executeAction(actor, action, target) {
        console.log(`${actor.name}が${action.name}を実行（対象: ${target ? target.name : 'なし'}）`);
        
        // 行動結果を記録
        const actionResult = {
            actor: actor,
            action: action,
            target: target,
            result: null
        };
        
        // アクションの種類に応じた処理
        switch(action.id) {
            case 'attack':
                actionResult.result = this.executeAttack(actor, target);
                break;
            case 'defend':
                actionResult.result = this.executeDefend(actor);
                break;
            case 'escape':
                actionResult.result = this.executeEscape(actor);
                return; // 逃走成功ならここで終了
            default:
                // カスタムスキルの処理
                if (action.execute && typeof action.execute === 'function') {
                    actionResult.result = action.execute(actor, target, this);
                } else {
                    console.warn(`未実装のアクション: ${action.id}`);
                    actionResult.result = { success: false, message: '実装されていないアクション' };
                }
                break;
        }
        
        // バトルログに追加
        this.battleState.battleLog.push(actionResult);
        
        // バトル状態を更新（戦闘不能チェックなど）
        this.updateBattleState();
        
        // アクション実行イベントをディスパッチ
        const actionEvent = new CustomEvent('battle-action-executed', { detail: actionResult });
        document.dispatchEvent(actionEvent);
        
        // バトルが続行中なら次のターンへ
        if (this.inBattle) {
            setTimeout(() => {
                this.startNextTurn();
            }, 1000); // 次のターンまで少し遅延
        }
    }
    
    /**
     * 攻撃アクションを実行
     * @param {Object} attacker - 攻撃するキャラクター
     * @param {Object} target - 対象キャラクター
     * @returns {Object} 攻撃結果
     */
    executeAttack(attacker, target) {
        // 攻撃力と防御力に基づいてダメージ計算
        const attackPower = attacker.strength || 10;
        const defensePower = target.defense || 0;
        
        // 基本ダメージ式
        let damage = Math.max(1, attackPower - defensePower / 2);
        
        // クリティカルヒット（10%の確率）
        const isCritical = Math.random() < 0.1;
        if (isCritical) {
            damage = Math.floor(damage * 1.5);
        }
        
        // ダメージを整数に丸める
        damage = Math.floor(damage);
        
        // HPを減少させる
        target.hp = Math.max(0, target.hp - damage);
        
        // 結果を返す
        return {
            success: true,
            damage: damage,
            isCritical: isCritical,
            targetHP: target.hp,
            message: `${attacker.name}の攻撃！${target.name}に${damage}ダメージ${isCritical ? '（クリティカル！）' : ''}`
        };
    }
    
    /**
     * 防御アクションを実行
     * @param {Object} character - 防御するキャラクター
     * @returns {Object} 防御結果
     */
    executeDefend(character) {
        // 一時的に防御力を上昇させる
        character.defendBonus = 0.5; // 50%ダメージ軽減
        
        return {
            success: true,
            message: `${character.name}は防御の構えをとった！`
        };
    }
    
    /**
     * 逃走アクションを実行
     * @param {Object} character - 逃走するキャラクター
     * @returns {Object} 逃走結果
     */
    executeEscape(character) {
        // 逃走確率の計算
        const escapeRate = this.config.escapeRate;
        const escapeSuccess = Math.random() < escapeRate;
        
        if (escapeSuccess) {
            // 逃走成功
            this.endBattle('escape');
            return {
                success: true,
                message: `${character.name}は戦闘から逃げ出した！`
            };
        } else {
            // 逃走失敗
            return {
                success: false,
                message: `${character.name}は逃げ出せなかった！`
            };
        }
    }
    
    /**
     * バトル状態を更新する
     */
    updateBattleState() {
        // 生存キャラクター数のチェック
        const alivePlayerCount = this.battleState.playerTeam.filter(c => c.hp > 0).length;
        const aliveEnemyCount = this.battleState.enemyTeam.filter(c => c.hp > 0).length;
        
        // バトル終了条件のチェック
        if (alivePlayerCount === 0) {
            // プレイヤー全滅
            this.endBattle('enemy');
        } else if (aliveEnemyCount === 0) {
            // 敵全滅
            this.endBattle('player');
        }
        
        // 一時的な効果をリセット（ターン終了時など）
        for (const character of [...this.battleState.playerTeam, ...this.battleState.enemyTeam]) {
            character.defendBonus = 0;
        }
    }
    
    /**
     * バトルを終了する
     * @param {string} result - バトル結果 ('player', 'enemy', 'escape')
     */
    endBattle(result) {
        if (!this.inBattle) return;
        
        console.log(`バトル終了: ${result}`);
        this.inBattle = false;
        this.battleState.battleResult = result;
        
        // 報酬計算（プレイヤー勝利の場合）
        let rewards = null;
        if (result === 'player') {
            rewards = this.calculateRewards();
        }
        
        // バトル終了イベントをディスパッチ
        const battleEndEvent = new CustomEvent('battle-end', { 
            detail: { 
                result: result,
                rewards: rewards,
                battleLog: this.battleState.battleLog
            } 
        });
        document.dispatchEvent(battleEndEvent);
    }
    
    /**
     * バトル報酬を計算する
     * @returns {Object} 報酬の内容
     */
    calculateRewards() {
        // 敵から得られる経験値とゴールドを計算
        let exp = 0;
        let gold = 0;
        let items = [];
        
        for (const enemy of this.battleState.enemyTeam) {
            exp += enemy.expReward || 0;
            gold += enemy.goldReward || 0;
            
            // ドロップアイテム
            if (enemy.dropItems && Array.isArray(enemy.dropItems)) {
                for (const dropItem of enemy.dropItems) {
                    if (Math.random() < dropItem.rate) {
                        items.push(dropItem.item);
                    }
                }
            }
        }
        
        return { exp, gold, items };
    }
}