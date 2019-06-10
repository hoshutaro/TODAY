/** ============================================================================
 * 
 * TODAY魔改造Javascript
 * 01. 簡易検索（特定フィールドを対象とした単語検索）
 * 02. 担当者ソート（担当者をソート用フィールドへコピー）
 * 03. 分類分割
 * xx. 共有メモ
 * 
 * ===========================================================================*/

'use strict';

/** ============================================================================
 * 
 * 固定値、共有変数
 * 
 * ===========================================================================*/
const URL_CSS1 = 'https://hoshutaro.github.io/TODAY/css/main.css';
const URL_CSS2 = 'https://hoshutaro.github.io/TODAY/css/51-modern-default.css';
const APP_ID   = kintone.app.getId();

// HTML要素ID
const ELMID_SEARCH = 'searchbox'; // 検索入力欄のID

// Kintoneフィールドコード
const CODE_TANTOSHA         = 'CaseOwner';          // 担当者
const CODE_TANTOSHA_COPY    = 'CopyOfCaseOwner';    // 担当者コピー先
const CODE_BUNRUI           = 'CaseCategory';       // 分類
const CODE_BUNRUI_DAI       = 'CaseCategory_Large'; // 分析用大分類
const CODE_BUNRUI_SYO       = 'CaseCategory_Small'; // 分析用小分類

// ### 環境が変わったら主に直すところ ###
const CONF_SEARCH           = ['msbox', 'Lookup'];  // 検索対象のフィールドコード
const CONF_MEMO_RECORDID    = 9;                    // 共有メモが内部的に使用するレコードID
const SPLIT_WORD            = '　＞　';             // 分類分割の文字列

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
 * 01. 簡易検索
 * 
 * ===========================================================================*/

/**
 * 検索フォーム設置
 */
const addSearchForm = (HEADER) => {
    outLog('run addSearchForm()');

    let cont = document.createElement('div');
    cont.innerHTML = `<div class="kintoneplugin-input-outer">
                          <input class="kintoneplugin-input-text" type="text" placeholder="検索文字を入力" id="${ELMID_SEARCH}" onkeydown="onEnter()">
                      </div>
                      <button class="kintoneplugin-button-dialog-ok" onClick="doSearch()" style="min-width: 60px;">検索</button>`;
    
    HEADER.appendChild(cont);

    return;
}

/**
 * 検索実行
 */
const doSearch = () => {
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

/**
 * Enterキーで検索実行
 */
const onEnter = () => {
    outLog('run onEnter()');
    
    if(window.event.keyCode == 13){
        doSearch();
    }
    return;
}

/** ============================================================================
 * 
 * 02. 担当者ソート
 * 
 * ===========================================================================*/
 
/**
 * 担当者を特定フィールドにコピー
 */
const copyCaseOwner = (event) => {
    outLog('run copyCaseOwner()');
    
    let caseOwner = event.record[CODE_TANTOSHA]['value'];
    let copy = '';
    
    if(!caseOwner){
        // 複数人いたら全部コピー
        for(let i=0; i<caseOwner.length; i++){
            copy = copy + caseOwner[i]['name'] + ',';
        }
        // 最後のカンマは削除
        copy = copy.slice(0, -1);
    }

    event.record[CODE_TANTOSHA_COPY]['value'] = copy;
    return;
}

/** ============================================================================
 * 
 * 03. 分類分割
 * 
 * ===========================================================================*/
 
/**
 * 分類を大小に分割して分析用フィールドにコピーする
 */
const splitCaseCategory = (event) => {
    outLog('run splitCaseCategory()');
    
    let caseCategory = event.record[CODE_BUNRUI]['value'];
    if(!caseCategory){
        // 特定文字で2分割
        event.record[CODE_BUNRUI_DAI]['value'] = caseCategory.split(SPLIT_WORD)[0];
        event.record[CODE_BUNRUI_SYO]['value'] = caseCategory.split(SPLIT_WORD)[1];
    } else {
        event.record[CODE_BUNRUI_DAI]['value'] = '';
        event.record[CODE_BUNRUI_SYO]['value'] = '';
    }
    
    return;
}

/** ============================================================================
 * 
 * xx. 共有メモ
 * 
 * ===========================================================================*/

/**
 * メモ設置
 */
const addMemoForm = async () => {
    outLog('run addMemoForm()');
    
    // 既存メモを取得
    const body = {
        'app': APP_ID,
        'id': CONF_MEMO_RECORDID
    }
    const result = await kintone.api('/k/v1/record', 'GET', body);
    const memo = result['record']['文字列__1行_']['value'];
    
    // ヘッダーのちょい下パーツを取得
    const elm_index = document.getElementsByClassName('gaia-argoui-app-index-pager')[0];
    
    let cont = document.createElement('div');
    cont.innerHTML = `<input type="text" size="100" id="memo" value="${memo}" style="font-size: 12px">
                      <button type="button" style="background-color: #fff; border-style: none; color: #248;" onClick="saveMemo()">
                      <img src="https://static.cybozu.com/contents/k/image/argo/component/recordlist/record-save16.png" style="vertical-align: middle;">
                      </button>`;
    
    elm_index.appendChild(cont);

    return;
}

/**
 * メモを保存
 */
const saveMemo = async () => {
    outLog('run saveMemo()');
    
    const memo = document.getElementById('memo').value;
    
    const body = {
        'app': APP_ID,
        'id': CONF_MEMO_RECORDID,
        'record': {
            '文字列__1行_': {'value': memo}
        }
    };
    
    await kintone.api('/k/v1/record', 'PUT', body);
    
    location.reload();
    
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
 * レコード一覧画面の表示後イベント
 */
kintone.events.on('app.record.index.show', async () => {
    outLog('Kintone Event app.record.index.show');
    
    // ヘッダースペース取得
    const HEADER = await kintone.app.getHeaderMenuSpaceElement();
    // 検索フォーム生成
    await addSearchForm(HEADER);
    
    return;
});
 
/**
 * レコード追加画面の保存実行前イベント
 * レコード編集画面の保存実行前イベント
 */
kintone.events.on(['app.record.create.submit','app.record.edit.submit'], async (event) => {
    outLog(`kintone event ${event['type']}`);
    
    // 担当者コピー
    await copyCaseOwner(event);
    // 分類分割
    await splitCaseCategory(event);
    
    return event;
});