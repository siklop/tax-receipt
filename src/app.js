// 화면: 입력을 읽어 계산 모듈 결과를 그린다.
import { estimate, splitNationalLocal, myShare } from './tax.js';
import { BUDGET } from '../data/budget-2026.js';

const TOTAL = BUDGET.totalTrillion * 1e12;
const $ = (id) => document.getElementById(id);
const fmt = (n) => (n >= 10 ? Math.round(n).toLocaleString('ko-KR') : n.toFixed(n >= 1 ? 1 : 2));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const PARTS = [
  ['income', '근로소득세', '나라로 갑니다', '--c-inc'],
  ['local', '지방소득세', '소득세의 10%, 지자체로 갑니다', '--c-loc'],
  ['vat', '부가세 (어림)', '물건·서비스를 살 때 냅니다', '--c-vat'],
  ['ins', '4대보험', '세금이 아닌 연금·보험료', '--c-ins'],
  ['net', '내 손에 남는 돈', '세금·보험료를 빼고 쓰고 남는 돈', '--c-net'],
];

function buildLines() {
  const lines = $('lines');
  const max = Math.max(...BUDGET.sectors.map((s) => s.trillion));
  BUDGET.sectors.forEach((s, i) => {
    const d = document.createElement('details');
    const drill = (s.items || []).map((x, j) =>
      `<div class="drill"><b>${esc(x.name)}</b><span class="won" data-sub="${i}-${j}"></span><span>${esc(x.desc)}</span>` +
      `<a href="${esc(x.source.url)}" target="_blank" rel="noopener">${esc(x.basis)} · ${esc(x.source.label)}</a></div>`).join('');
    d.innerHTML =
      `<summary><span class="name">${esc(s.name)}</span><span class="won" data-i="${i}"></span>` +
      `<span class="bar"><i style="width:${(s.trillion / max * 100).toFixed(1)}%"></i></span>` +
      `<span class="pct">${s.trillion.toFixed(1)}조 원 · ${(s.trillion * 1e12 / TOTAL * 100).toFixed(1)}%</span></summary>` +
      `<div class="body"><p>${esc(s.desc)}</p>${drill}</div>`;
    lines.appendChild(d);
  });
  const withItems = BUDGET.sectors.findIndex((s) => s.items?.length);
  if (withItems >= 0) lines.children[withItems].open = true;
}

function render() {
  const gross = Number($('salary').value.replace(/[^0-9]/g, '')) || 0;
  const spendRate = Number($('spend').value) / 100;
  $('spendv').textContent = `${Math.round(spendRate * 100)}%`;
  const r = estimate(gross, { dependents: Number($('dep').value), spendRate });

  $('stack').innerHTML = PARTS.map(([k, label, , color]) =>
    `<i title="${label}" style="width:${gross ? (r[k] / gross) * 100 : 0}%;background:var(${color})"></i>`).join('');
  $('legend').innerHTML = PARTS.map(([k, label, note, color]) =>
    `<div class="lg"><span class="dot" style="background:var(${color})"></span><span><b>${label}</b><small>${note}</small></span><span class="won">${fmt(r[k])}원</span></div>`).join('');

  const taxes = r.income + r.local + r.vat;
  $('taxsum').textContent = `${fmt(taxes)}원`;
  $('rate').textContent = gross ? `연봉의 ${(taxes / gross * 100).toFixed(1)}% · 한 달에 약 ${fmt(taxes / 12)}원` : '';

  const { national, local } = splitNationalLocal(r);
  $('nat').textContent = `${fmt(national)}원`;
  $('loc').textContent = `${fmt(local)}원`;
  const lines = $('lines');
  BUDGET.sectors.forEach((s, i) => {
    lines.querySelector(`[data-i="${i}"]`).textContent = `${fmt(myShare(national, s.trillion * 1e12, TOTAL))}원`;
    (s.items || []).forEach((x, j) => {
      lines.querySelector(`[data-sub="${i}-${j}"]`).textContent = `내 몫 약 ${fmt(myShare(national, x.won, TOTAL))}원`;
    });
  });
}

$('salary').addEventListener('input', (e) => {
  const digits = e.target.value.replace(/[^0-9]/g, '');
  e.target.value = digits ? Number(digits).toLocaleString('ko-KR') : '';
  render();
});
$('dep').addEventListener('change', render);
$('spend').addEventListener('input', render);
document.querySelectorAll('.chips button').forEach((b) => b.addEventListener('click', () => {
  $('salary').value = Number(b.dataset.v).toLocaleString('ko-KR');
  render();
}));

buildLines();
render();
