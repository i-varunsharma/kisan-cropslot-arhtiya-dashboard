/* Kisan CropSlot — Arhtiya Dashboard
   Prototype logic. State lives in memory; actions on one screen update the others. */

const state = {
  farmers: FARMERS.map(f => ({ ...f })),
  checks: CHECKS.map(c => ({ ...c, input: c.input ? { ...c.input } : null })),
  selected: 'f1',
  pendingReg: null
};

const $  = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html !== undefined) n.innerHTML = html;
  return n;
};

const STATUS_LABEL = { booked:'Booked', arrived:'At gate', weighed:'Weighed', paid:'Paid' };
const STATUS_CLASS = { booked:'', arrived:'arrived', weighed:'weighed', paid:'paid' };

/* ---------- navigation ---------- */
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  document.querySelectorAll('.tab').forEach(t =>
    t.setAttribute('aria-selected', String(t.dataset.s === id)));
  window.scrollTo({ top:0, behavior:'instant' in window ? 'instant' : 'auto' });
}

let toastTimer;
function toast(msg){
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2600);
}

/* ---------- screen 1 : overview ---------- */
function renderOverview(){
  const body = $('farmerRows');
  body.innerHTML = '';

  const order = { arrived:0, weighed:1, booked:2, paid:3 };
  [...state.farmers]
    .sort((a,b) => (order[a.status] - order[b.status]))
    .forEach(f => {
      const tr = el('tr');
      if (f.id === state.selected) tr.className = 'sel';
      tr.innerHTML = `
        <td class="slot">${f.slot}</td>
        <td><div class="fname">${f.name}</div><div class="fsub">Token ${f.token}</div></td>
        <td>${f.crop} · ${f.qty} qtl</td>
        <td><span class="tag ${STATUS_CLASS[f.status]}">${STATUS_LABEL[f.status]}</span></td>
        <td></td>`;
      const act = el('button', 'link',
        f.status === 'booked' ? 'Details' : (f.status === 'arrived' ? 'Verify' : 'Track'));
      act.addEventListener('click', () => {
        if (f.status === 'booked'){ toast(`${f.name} has not reached the gate yet.`); return; }
        if (f.status === 'arrived'){ selectFarmer(f.id); show('s2'); }
        else show('s4');
      });
      tr.lastElementChild.appendChild(act);
      body.appendChild(tr);
    });

  $('statBooked').textContent  = state.farmers.length;
  $('statWaiting').textContent = state.farmers.filter(f => f.status === 'arrived' || f.status === 'weighed').length;
  $('statPaid').textContent    = state.farmers.filter(f => f.status === 'paid').length;

  const pct = Math.round(YARD.inside / YARD.capacity * 100);
  $('capFill').style.width = pct + '%';
  $('capText').textContent = `${YARD.inside} of ${YARD.capacity}`;
}

/* ---------- screen 2 : verification ---------- */
function selectFarmer(id){
  state.selected = id;
  state.checks = CHECKS.map(c => ({ ...c, input: c.input ? { ...c.input } : null }));
  renderVerify();
  renderOverview();
}

function qrSvg(){
  return `<svg viewBox="0 0 60 60" width="72" height="72" aria-label="Token QR code">
    <rect width="60" height="60" fill="#fff"/>
    <g fill="#141414">
      <rect x="4" y="4" width="14" height="14"/><rect x="7" y="7" width="8" height="8" fill="#fff"/>
      <rect x="42" y="4" width="14" height="14"/><rect x="45" y="7" width="8" height="8" fill="#fff"/>
      <rect x="4" y="42" width="14" height="14"/><rect x="7" y="45" width="8" height="8" fill="#fff"/>
      <rect x="24" y="6" width="4" height="4"/><rect x="32" y="6" width="4" height="4"/>
      <rect x="24" y="14" width="4" height="4"/><rect x="30" y="20" width="4" height="4"/>
      <rect x="6" y="24" width="4" height="4"/><rect x="14" y="24" width="4" height="4"/>
      <rect x="22" y="24" width="4" height="4"/><rect x="38" y="24" width="4" height="4"/>
      <rect x="46" y="24" width="4" height="4"/><rect x="24" y="32" width="4" height="4"/>
      <rect x="34" y="32" width="4" height="4"/><rect x="44" y="34" width="4" height="4"/>
      <rect x="24" y="44" width="4" height="4"/><rect x="32" y="46" width="4" height="4"/>
      <rect x="42" y="44" width="4" height="4"/><rect x="50" y="48" width="4" height="4"/>
    </g></svg>`;
}

function renderVerify(){
  const f = state.farmers.find(x => x.id === state.selected);
  if (!f) return;

  $('verName').textContent  = `Verify arrival — ${f.name}`;
  $('verSub').textContent   = `Slot ${f.slot} · ${f.crop} · ${f.qty} quintal · Khanna Mandi`;
  $('verToken').textContent = f.token;
  $('qrBox').innerHTML      = qrSvg();
  $('verMeta').innerHTML    = `Booked via ${f.bookedVia}<br>${f.gate ? 'Gate entry recorded ' + f.gate : 'Not yet at gate'}`;

  const list = $('checklist');
  list.innerHTML = '';
  state.checks.forEach((c, i) => {
    const row = el('div', 'check');
    const box = el('button', 'box');
    box.dataset.done = c.done ? '1' : '0';
    box.setAttribute('aria-label', c.t);
    box.setAttribute('aria-pressed', String(!!c.done));
    box.addEventListener('click', () => {
      state.checks[i].done = !state.checks[i].done;
      renderVerify();
      updateConfirmState();
    });

    const txt = el('div');
    txt.appendChild(el('div', 't', c.t));
    txt.appendChild(el('div', 'd', c.d));

    if (c.input){
      const wrap = el('div', 'inp');
      const inp  = el('input');
      inp.type = 'text';
      inp.value = c.input.value;
      inp.placeholder = '—';
      inp.setAttribute('aria-label', c.t + ' value');
      inp.addEventListener('input', e => { state.checks[i].input.value = e.target.value; });
      wrap.appendChild(inp);
      wrap.appendChild(el('span', 'unit', c.input.unit));
      txt.appendChild(wrap);
    }

    row.appendChild(box);
    row.appendChild(txt);
    list.appendChild(row);
  });

  const mirror = $('mirrorList');
  mirror.innerHTML = '';
  state.checks.forEach(c => {
    const done = c.done;
    mirror.appendChild(el('div','kv',
      `<span>${c.t.replace(' logged','').replace(' recorded','')}</span>
       <span style="color:${done ? '#3D7540' : '#9A9A9A'}">${done ? 'Shared' : 'Not yet'}</span>`));
  });

  updateConfirmState();
}

function updateConfirmState(){
  const allDone = state.checks.every(c => c.done);
  const btn = $('confirmBtn');
  btn.disabled = !allDone;
  btn.textContent = allDone ? 'Confirm and send to farmer' : 'Complete all checks to confirm';
}

/* ---------- screen 3 : assisted registration ---------- */
function slotDates(daysAhead){
  const base = new Date();
  base.setDate(base.getDate() + (Number(daysAhead) || 1));
  const fmt = d => d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short' });
  return [
    { label: fmt(base),  time:'6:00–8:00 AM' },
    { label: fmt(base),  time:'2:00–4:00 PM' },
    { label: fmt(new Date(base.getTime() + 864e5)), time:'8:00–10:00 AM' }
  ];
}

function handleRegister(){
  const phone   = $('regPhone').value.trim();
  const name    = $('regName').value.trim();
  const village = $('regVillage').value.trim();
  const qty     = $('regQty').value.trim();
  const crop    = $('regCrop').value;
  const ready   = $('regReady').value;

  $('regPhone').closest('.anchor-field').style.borderColor = phone ? '' : '#C0563B';
  if (!phone || !name || !qty){
    toast('Farmer name, mobile number and quantity are needed.');
    return;
  }

  state.pendingReg = { phone, name, village, qty:Number(qty), crop };

  const msg = $('regMsg');
  msg.textContent = `Sent. ${name} will receive three slot options on ${phone} by SMS, and can reply with his choice or call 1800-180-1551.`;
  msg.classList.add('on');

  const wrap = $('slotOptions');
  wrap.innerHTML = '';
  slotDates(ready).forEach((s, i) => {
    const b = el('button', 'slot-opt', `<b>${s.time}</b>${s.label}`);
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => {
      wrap.querySelectorAll('.slot-opt').forEach(o => o.setAttribute('aria-pressed','false'));
      b.setAttribute('aria-pressed','true');
      confirmBooking(s);
    });
    wrap.appendChild(b);
  });
  $('slotPick').hidden = false;
}

function confirmBooking(slot){
  const r = state.pendingReg;
  if (!r) return;
  const token = 'MM-KH-2424' + (30 + state.farmers.length);
  state.farmers.push({
    id:'f' + (state.farmers.length + 1),
    name:r.name, token, slot:slot.time, crop:r.crop, qty:r.qty,
    status:'booked', bookedVia:'Assisted', gate:null, jform:null, hours:0, block:null
  });
  renderOverview();
  renderPayments();
  renderCommission();
  toast(`${r.name} booked for ${slot.time} · token ${token}`);
  state.pendingReg = null;
  ['regPhone','regName','regVillage','regQty'].forEach(id => $(id).value = '');
  $('slotPick').hidden = true;
  $('regMsg').classList.remove('on');
}

/* ---------- screen 4 : payments ---------- */
function stageRow(f){
  const s1 = !!f.jform;
  const s2 = f.status === 'paid' || (f.jform && f.hours > 0);
  const s3 = f.status === 'paid';
  const d = (done, now) => `<span class="dot ${done ? 'done' : (now ? 'now' : '')}"></span>`;
  return `<div class="stages">
    <div class="stg">${d(s1, !s1)}<span class="lb">J-Form</span></div>
    <span class="rail ${s1 ? 'done' : ''}"></span>
    <div class="stg">${d(s3, s2 && !s3)}<span class="lb">Verified</span></div>
    <span class="rail ${s3 ? 'done' : ''}"></span>
    <div class="stg">${d(s3, false)}<span class="lb">Paid</span></div>
  </div>`;
}

function renderPayments(){
  const body = $('payRows');
  body.innerHTML = '';
  const tracked = state.farmers.filter(f => f.status !== 'booked');

  tracked.forEach(f => {
    let cls = 'ok', label = f.hours + ' hrs';
    if (f.status !== 'paid' && f.hours >= 48){ cls = 'late'; label = f.hours + ' hrs — past 48'; }
    else if (f.status !== 'paid' && f.hours >= 40){ cls = ''; label = f.hours + ' hrs — nearing norm'; }

    const tr = el('tr');
    tr.innerHTML = `
      <td><div class="fname">${f.name}</div><div class="fsub">${f.qty} qtl · ${f.crop}</div></td>
      <td class="token">${f.jform || 'Pending'}</td>
      <td>${stageRow(f)}</td>
      <td><span class="flag ${cls}">${label}</span></td>`;
    body.appendChild(tr);
  });

  const blocks = tracked.filter(f => f.block);
  const bl = $('blockList');
  bl.innerHTML = '';
  if (!blocks.length){
    bl.appendChild(el('div','hint','No payment is currently held up.'));
  } else {
    blocks.forEach(f => bl.appendChild(el('div','kv',
      `<span>${f.name}</span><span>${f.block}</span>`)));
  }

  $('breachCount').textContent =
    tracked.filter(f => f.status !== 'paid' && f.hours >= 48).length;
}

/* ---------- screen 5 : commission ---------- */
const inr = n => '₹ ' + Math.round(n).toLocaleString('en-IN');

function renderCommission(){
  const seasonAmt = SEASON.quintal * RATES.Wheat;
  const todayQtl  = state.farmers.reduce((s,f) => s + f.qty, 0);
  const todayAmt  = todayQtl * RATES.Wheat;

  $('commTotal').textContent = inr(seasonAmt);
  $('commCap').textContent   =
    `Rabi season to date · ${SEASON.quintal.toLocaleString('en-IN')} quintal handled across ${SEASON.farmers} farmers`;
  $('commToday').textContent = inr(todayAmt);
}

/* ---------- wiring ---------- */
document.querySelectorAll('.tab').forEach(t =>
  t.addEventListener('click', () => show(t.dataset.s)));
document.querySelectorAll('[data-go]').forEach(b =>
  b.addEventListener('click', () => show(b.dataset.go)));

$('confirmBtn').addEventListener('click', () => {
  const f = state.farmers.find(x => x.id === state.selected);
  if (!f) return;
  f.status = 'weighed';
  f.jform  = 'JF-44' + (90 + state.farmers.length);
  f.hours  = 1;
  const m = $('verMsg');
  m.textContent = `Sent. ${f.name} has been notified by SMS. J-Form ${f.jform} generated.`;
  m.classList.add('on');
  renderOverview(); renderPayments(); renderCommission();
  toast('Weighment confirmed and shared with the farmer.');
});

$('saveBtn').addEventListener('click', () => toast('Saved. Nothing has been sent to the farmer yet.'));
$('regBtn').addEventListener('click', handleRegister);
$('regClear').addEventListener('click', () => {
  ['regPhone','regName','regVillage','regQty'].forEach(id => $(id).value = '');
  $('regMsg').classList.remove('on');
  $('slotPick').hidden = true;
});
$('dlBtn').addEventListener('click', () => {
  const m = $('dlMsg');
  m.textContent = 'Statement prepared. In the live system this downloads as a PDF.';
  m.classList.add('on');
});

/* ---------- init ---------- */
$('ctxDate').textContent = 'Wheat season · ' +
  new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });

renderOverview();
renderVerify();
renderPayments();
renderCommission();
