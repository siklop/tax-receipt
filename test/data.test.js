import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BUDGET } from '../data/budget-2026.js';

test('12대 분야가 모두 있다', () => {
  assert.equal(BUDGET.sectors.length, 12);
  assert.equal(new Set(BUDGET.sectors.map((s) => s.name)).size, 12);
});

test('분야 합은 총지출과 R&D 중복 범위 안에서 맞는다', () => {
  const sum = BUDGET.sectors.reduce((a, s) => a + s.trillion, 0);
  assert.ok(sum >= BUDGET.totalTrillion && sum <= BUDGET.totalTrillion * 1.02, `합계 ${sum}`);
});

test('하위 항목은 모두 출처와 근거 구분이 있다', () => {
  for (const s of BUDGET.sectors) {
    for (const x of s.items || []) {
      assert.match(x.source.url, /^https:\/\//, x.name);
      assert.ok(x.basis, x.name);
      assert.ok(x.won > 0 && x.won < s.trillion * 1e12, x.name);
    }
  }
});
