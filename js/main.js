'use strict';

/** ============================================================================
 * 
 * 固定値、共有変数
 * 
 * ===========================================================================*/
const URL_CSS1 = 'https://hoshutaro.github.io/TODAY/css/main.css';
const URL_CSS2 = 'https://hoshutaro.github.io/TODAY/css/51-modern-default.css';

const ELMID_SEARCH = 'searchbox'; // 検索入力欄のID

// ### 状況が変わったらここを直せばOK ###
/**
 * 検索対象のフィールドコード
 * Kintone仕様で文字列、複数文字列、ルックアップしか対象にできない
 */
const CONF_SEARCH = ['msbox', 'Lookup'];


/** ============================================================================
 * 
 * 汎用関数
 * 
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
    outLog('run importCSS()');
    
    let elm_body = document.getElementsByTagName('body')[0];
    let elm_link = document.createElement('div');
    elm_link.innerHTML = `<link rel="stylesheet" href="${URL_CSS1}">
                          <link rel="stylesheet" href="${URL_CSS2}">`;
    elm_body.appendChild(elm_link);
    
    return;
}

/** ============================================================================
 * 
 * 検索機能
 * 
 * ===========================================================================*/

/**
 * 検索フォーム設置
 */
const addSearchForm = (HEADER) => {
    outLog('run addSearchForm()');

    let cont = document.createElement('div');
    cont.innerHTML = `<div class="kintoneplugin-input-outer">
                          <input class="kintoneplugin-input-text" type="text" placeholder="検索文字を入力" id="${ELMID_SEARCH}">
                      </div>
                      <button class="kintoneplugin-button-dialog-ok" onClick="doSearch()" style="min-width: 60px;">検索</button>`;
    
    HEADER.appendChild(cont);

    return;
}

/**
 * 検索実行
 */
const doSearch =  () => {
    outLog('run doSearch()');
    
    let txt = document.getElementById(ELMID_SEARCH).value;
    if(txt != ''){
        let query = '?query=';
        
        for(let i=0; i<CONF_SEARCH.length; i++){
            if(i>0){query += ' or ';}
            query += `${CONF_SEARCH[i]} like "${txt}"`;
        }
        document.location = `${location.origin}${location.pathname}${encodeURI(query)}`;
    } else {
        document.location = `${location.origin}${location.pathname}`;
    }
    
    return;
}

/** ============================================================================
 * 
 * メイン処理
 * 
 * ===========================================================================*/
outLog('run main.js');

/**
 * 毎回実行される処理
 */
const runMainFunc = async () => {
    outLog('run runMainFunc()');
    
    await importCSS();
    
    return;
}
runMainFunc();

/**
 * レコード一覧画面
 */
kintone.events.on('app.record.index.show', (event) => {
    outLog('Kintone Event app.record.index.show');
    
    // 非同期処理を制御
    appRecordIndexShow();

    return event;
});
const appRecordIndexShow = async () => {
    // ヘッダースペース取得
    const HEADER = await kintone.app.getHeaderMenuSpaceElement();
    // 検索フォーム生成
    await addSearchForm(HEADER);
    
    return;
}