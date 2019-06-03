'use strict';

/* =============================================================================
 * メイン処理
 * ===========================================================================*/
outLog('run main.js');

 
// CSS読み込み
let elm_body = document.getElementsByTagName('body')[0];
 
 
 
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