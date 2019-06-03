'use strict';

/** ============================================================================
 * 固定値、共有変数
 * ===========================================================================*/
const URL_CSS1 = 'https://hoshutaro.github.io/TODAY/css/main.css';

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
    elm_link.innerHTML = `<link rel="stylesheet" href="${URL_CSS1}">`;
    elm_body.appendChild(elm_link);
    
    return;
}

/** ============================================================================
 * メイン処理
 * ===========================================================================*/
outLog('run main.js');

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

