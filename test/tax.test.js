import { test } from 'node:test';
import assert from 'node:assert/strict';
import { earnedDeduction, progressiveTax, earnedCredit, estimate, splitNationalLocal, myShare } from '../src/tax.js';

const man = (n) => n * 1e4;

test('근로소득공제 구간 경계와 한도', () => {
  assert.equal(earnedDeduction(man(500)), man(350));
  assert.equal(earnedDeduction(man(1500)), man(750));
  assert.equal(earnedDeduction(man(4500)), man(1200));
  assert.equal(earnedDeduction(man(10000)), man(1475));
  assert.equal(earnedDeduction(man(100000)), man(2000)); // 한도 2천만
});

test('누진세율 구간 계산', () => {
  assert.equal(progressiveTax(0), 0);
  assert.equal(progressiveTax(man(1400)), man(84));
  assert.equal(Math.round(progressiveTax(man(5000))), man(624));
  assert.equal(Math.round(progressiveTax(man(8800))), man(1536));
});

test('근로소득세액공제 한도', () => {
  assert.equal(earnedCredit(man(100), man(3000)), man(55));
  assert.equal(earnedCredit(man(500), man(3000)), man(74)); // 3,300만 이하 한도 74만
  assert.equal(earnedCredit(man(500), man(5000)), man(66)); // 하한 66만
  assert.equal(earnedCredit(man(2000), man(20000)), man(20)); // 하한 20만
});

test('연봉 5,000만 원 어림값이 프로토타입 결과와 같다', () => {
  const r = estimate(man(5000));
  assert.equal(Math.round(r.ins / 1e4), 486);
  assert.equal(Math.round(r.income / 1e4), 266);
  assert.equal(Math.round(r.local / 1e4), 27);
  assert.equal(Math.round(r.vat / 1e4), 138);
});

test('구성 요소 합은 연봉과 같다', () => {
  for (const g of [0, man(3000), man(8000), man(15000)]) {
    const r = estimate(g, { dependents: 2, spendRate: 0.8 });
    assert.ok(Math.abs(r.ins + r.income + r.local + r.vat + r.net - g) < 1e-6);
  }
});

test('부양가족이 늘면 소득세는 줄거나 같다', () => {
  const g = man(6000);
  assert.ok(estimate(g, { dependents: 3 }).income <= estimate(g).income);
});

test('국세·지방세 분배와 내 몫', () => {
  const s = splitNationalLocal({ income: 100, local: 10, vat: 100 });
  assert.ok(Math.abs(s.national - 174.7) < 1e-9);
  assert.ok(Math.abs(s.local - 35.3) < 1e-9);
  assert.equal(myShare(1e6, 125e8, 728e12).toFixed(2), '17.17');
});
