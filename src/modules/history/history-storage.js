// 文件：./js/history-storage.js
(function(global){
  const INDEX_KEY = 'contractRecord:index';

  async function sha256Hex(buffer){
    // buffer 允许 ArrayBuffer 或 Uint8Array
    const ab = buffer instanceof ArrayBuffer ? buffer : buffer.buffer;
    const hash = await crypto.subtle.digest('SHA-256', ab);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  function readIndex(){
    try{
      return JSON.parse(localStorage.getItem(INDEX_KEY) || '[]');
    }catch(e){
      console.warn('[history] 解析索引失败，重置', e);
      return [];
    }
  }
  function writeIndex(arr){
    localStorage.setItem(INDEX_KEY, JSON.stringify(arr));
  }

  async function save(meta, arrayBuffer){
    if(!arrayBuffer){
      console.warn('[history] 未提供 arrayBuffer，放弃保存');
      return null;
    }
    const id = 'CR_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);
    const hash = await sha256Hex(arrayBuffer);
    const size = arrayBuffer.byteLength;

    // 是否需要存 PDF base64：如果 history 页面要直接原样下载，建议 true
    const storePdfBase64 = true;
    let pdfBase64 = null;
    if(storePdfBase64){
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunk = 0x8000;
      for(let i=0;i<bytes.length;i+=chunk){
        binary += String.fromCharCode.apply(null, bytes.subarray(i,i+chunk));
      }
      pdfBase64 = btoa(binary);
    }

    const record = {
      id,
      template: meta.template || meta.templateKey || 'unknown',
      fileName: meta.fileName || (id + '.pdf'),
      createdAt: Date.now(),
      size,
      sha256: hash,
      fields: meta.fields || {},
      chain: { status:'not_submitted' },
      pdfBase64 // 可选字段：有则用于无损下载
    };

    // 防重复（同哈希不重复）可选
    const index = readIndex();
    for(const rid of index){
      const existing = JSON.parse(localStorage.getItem('contractRecord:'+rid) || 'null');
      if(existing && existing.sha256 === hash){
        console.info('[history] 已存在同哈希记录，跳过保存', hash);
        return existing.id;
      }
    }

    localStorage.setItem('contractRecord:'+id, JSON.stringify(record));
    index.unshift(id);
    if(index.length > 500) index.length = 500;
    writeIndex(index);
    console.log('[history] 保存成功', id);
    return id;
  }

  function loadAll(){
    const ids = readIndex();
    const arr = [];
    ids.forEach(id=>{
      const obj = JSON.parse(localStorage.getItem('contractRecord:'+id) || 'null');
      if(obj) arr.push(obj);
    });
    return arr;
  }

  function deleteRecord(id){
    localStorage.removeItem('contractRecord:'+id);
    let idx = readIndex().filter(x=>x!==id);
    writeIndex(idx);
  }

  function clearAll(){
    const idx = readIndex();
    idx.forEach(id => localStorage.removeItem('contractRecord:'+id));
    localStorage.removeItem(INDEX_KEY);
  }

  function rebuildPdf(record){
    if(record.pdfBase64){
      const binary = atob(record.pdfBase64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for(let i=0;i<len;i++) bytes[i] = binary.charCodeAt(i);
      return new Blob([bytes], {type:'application/pdf'});
    }
    // 没有原始内容：返回 null，由外部自行文本重建
    return null;
  }

  global.HistoryStorage = {
    save, loadAll, deleteRecord, clearAll, rebuildPdf
  };

})(window);
