const STORAGE_KEY = 'mas-finance-transactions-v1';
const rupiah = n => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n||0);
const $ = id => document.getElementById(id);
let transactions = loadTransactions();
let currentFilter = 'all';
let deferredInstallPrompt = null;

function loadTransactions(){
  try { const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); return Array.isArray(data)?data:[]; }
  catch { return []; }
}
function save(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(transactions)); render(); }
function monthKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
function monthTransactions(){return transactions.filter(t=>t.date.slice(0,7)===monthKey());}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(){
  const month=monthTransactions();
  const income=month.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0);
  const expense=month.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
  $('monthLabel').textContent=new Intl.DateTimeFormat('id-ID',{month:'short',year:'numeric'}).format(new Date());
  $('balance').textContent=rupiah(income-expense);
  $('income').textContent=rupiah(income); $('expense').textContent=rupiah(expense);
  $('txCount').textContent=`${month.length} transaksi`;
  $('recentList').innerHTML=transactionMarkup([...transactions].sort(sortDate).slice(0,4));
  const list=[...transactions].sort(sortDate).filter(t=>currentFilter==='all'||t.type===currentFilter);
  $('allList').innerHTML=transactionMarkup(list);
}
function sortDate(a,b){return new Date(b.date)-new Date(a.date)||b.createdAt-a.createdAt;}
function transactionMarkup(items){
  if(!items.length)return '<div class="empty">Belum ada transaksi. Tambahkan pemasukan atau pengeluaran pertamamu.</div>';
  return items.map(t=>`<div class="tx-row">
    <div class="tx-symbol">${t.type==='income'?'↙':'↗'}</div>
    <div class="tx-main"><strong>${escapeHtml(t.category)}</strong><small>${escapeHtml(t.note||'Tanpa keterangan')} · ${new Date(t.date+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</small></div>
    <div class="tx-amount ${t.type==='income'?'positive':'negative'}">${t.type==='income'?'+':'−'} ${rupiah(t.amount)}</div>
  </div>`).join('');
}
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===`page-${name}`));
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===name));
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.open)));
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
  currentFilter=b.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));
  render();
}));
function openDialog(){
  $('txDate').value=new Date().toISOString().slice(0,10);
  $('txAmount').value=''; $('txNote').value='';
  $('txDialog').showModal();
}
$('addBtn').addEventListener('click',openDialog);
document.querySelectorAll('.quick').forEach(b=>b.addEventListener('click',()=>{
  const target=b.dataset.open;
  if(target==='transactions'){showPage('transactions');openDialog();}
  else showPage(target);
}));
document.querySelectorAll('.type-choice').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.type-choice').forEach(x=>x.classList.toggle('selected',x===b));
  $('txType').value=b.dataset.type;
}));
$('txForm').addEventListener('submit',e=>{
  e.preventDefault();
  const amount=Number($('txAmount').value);
  if(!Number.isSafeInteger(amount)||amount<=0){toast('Masukkan nominal yang valid.');return;}
  transactions.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),type:$('txType').value,amount,category:$('txCategory').value,note:$('txNote').value.trim(),date:$('txDate').value,createdAt:Date.now()});
  save(); $('txDialog').close(); toast('Transaksi berhasil disimpan.');
});
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2200);}
$('exportBtn').addEventListener('click',()=>{
  const backup={app:'MAS FINANCE',version:1,exportedAt:new Date().toISOString(),transactions};
  const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download=`mas-finance-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
  toast('File backup dibuat.');
});
$('importFile').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  try{
    const data=JSON.parse(await file.text());
    if(data.app!=='MAS FINANCE'||!Array.isArray(data.transactions))throw new Error('Format tidak cocok');
    const valid=data.transactions.every(t=>['income','expense'].includes(t.type)&&Number.isSafeInteger(t.amount)&&t.amount>0&&typeof t.date==='string');
    if(!valid)throw new Error('Isi backup tidak valid');
    if(!confirm(`Pulihkan ${data.transactions.length} transaksi? Data transaksi saat ini akan diganti.`))return;
    transactions=data.transactions;save();toast('Backup berhasil dipulihkan.');
  }catch(err){toast('File backup tidak valid.');}
  finally{e.target.value='';}
});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;$('installBtn').hidden=false;});
$('installBtn').addEventListener('click',async()=>{
  if(!deferredInstallPrompt)return;
  deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$('installBtn').hidden=true;
});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
render();
