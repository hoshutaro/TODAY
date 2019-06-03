'use strict';

/** ============================================================================
 * 固定値、共有変数
 * ===========================================================================*/
const URL_CSS1 = 'https://hoshutaro.github.io/TODAY/css/main.css';
const URL_CSS2 = 'https://hoshutaro.github.io/TODAY/css/51-modern-default.css';

/** ============================================================================
 * 汎用関数
 * ===========================================================================*/

/**
 * ログ出力
 */
const outLog = (str) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const mSecond = now.getMilliseconds();

    console.log(`${year}/${month}/${day} ${hour}:${minute}:${second}.${mSecond} ${str}`);
    return;
}

/**
 * CSSインポート
 */
const importCSS = async () => {
    
    let elm_body = document.getElementsByTagName('body')[0];
    let elm_link = document.createElement('div');
    elm_link.innerHTML = `<link rel="stylesheet" href="${URL_CSS1}">
                          <link rel="stylesheet" href="${URL_CSS2}">`;
    elm_body.appendChild(elm_link);
    
    return;
}

/** ============================================================================
 * 検索機能
 * ===========================================================================*/

/**
 * 検索フォーム設置
 */
const addSearchForm = (HEADER) => {

    if(HEADER != null){
        
        let cont = document.createElement('div');
        cont.innerHTML = `<div class="kintoneplugin-input-outer">
                              <input class="kintoneplugin-input-text" type="text" placeholder="検索文字を入力">
                          </div>
                          <button class="kintoneplugin-button-dialog-ok" onClick="doSearch()" style="min-width: 60px;">検索</button>`;
        
        HEADER.appendChild(cont);
    }
    return;
}

/** ============================================================================
 * メイン処理
 * ===========================================================================*/
outLog('run main.js');

/**
 * レコード一覧画面
 */
kintone.events.on('app.record.index.show', (event) => {
    // 非同期処理を制御
    appRecordIndexShow();

    return event;
});
const appRecordIndexShow = async () => {
    const HEADER = await kintone.app.getHeaderMenuSpaceElement();

    // 検索フォーム生成
    await addSearchForm(HEADER);
    
    return;
}

/**
 * 非同期処理を順番に実行させる
 */
const runMainFunc = async () => {
    
    await importCSS();
    
    return;
}

/**
 * メイン部
 */
runMainFunc();

