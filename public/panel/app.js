async function postJson(path, body){
  const res = await fetch(API_BASE + path, {method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify(body)});
  const text = await res.text();
  try { return JSON.parse(text);} catch(e){ return text}
}

document.getElementById('formCreateAgent').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f = e.target;
  const data = {
    agentCode: f.agentCode.value,
    saldo: parseFloat(f.saldo.value||0),
    agentToken: f.agentToken.value||undefined,
    secretKey: f.secretKey.value||undefined
  }
  const r = await postJson('/api/v1/createagent', data)
  document.getElementById('createAgentResult').textContent = JSON.stringify(r, null, 2)
})

document.getElementById('formLaunch').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const f = e.target;
  const data = {
    agentToken: f.agentToken.value,
    secretKey: f.secretKey.value,
    user_code: f.user_code.value,
    game_code: f.game_code.value,
    user_balance: Number(f.user_balance.value)
  }
  const r = await postJson('/api/v1/game_launch', data)
  document.getElementById('launchResult').textContent = JSON.stringify(r, null, 2)
})

document.getElementById('btnInfo').addEventListener('click', async ()=>{
  const g = document.getElementById('gameCode').value;
  const r = await postJson(`/game-api/${g}/v2/GameInfo/Get`, {})
  document.getElementById('gameResult').textContent = JSON.stringify(r, null, 2)
})
document.getElementById('btnSpin').addEventListener('click', async ()=>{
  const g = document.getElementById('gameCode').value;
  const r = await postJson(`/game-api/${g}/v2/Spin`, {})
  document.getElementById('gameResult').textContent = JSON.stringify(r, null, 2)
})

document.getElementById('btnRaw').addEventListener('click', async ()=>{
  const method = document.getElementById('rawMethod').value;
  const path = document.getElementById('rawPath').value;
  const body = document.getElementById('rawBody').value;
  let opts = {method};
  if(method!== 'GET'){
    opts.headers = {'Content-Type':'application/json'};
    try{ opts.body = JSON.stringify(JSON.parse(body)); }catch(e){ opts.body = body }
  }
  const res = await fetch(API_BASE + path, opts);
  const text = await res.text();
  try{ document.getElementById('rawResult').textContent = JSON.stringify(JSON.parse(text), null,2) }catch(e){ document.getElementById('rawResult').textContent = text }
})

// try to prefill agentToken/secretKey from server (best-effort)
async function tryPrefill(){
  try{
    // No list API — leave empty
  }catch(e){ }
}
tryPrefill();
