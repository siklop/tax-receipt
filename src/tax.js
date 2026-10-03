// 근로소득 세금 어림 계산. 순수 함수만 둔다 (DOM 없음).
import { TAX_RULES } from '../data/tax-rules-2026.js';

const R = TAX_RULES;

/** 근로소득공제 */
export function earnedDeduction(gross) {
  const step = R.earnedDeduction.find((s) => gross <= s.upTo);
  return Math.min(step.base + (gross - step.from) * step.rate, R.earnedDeductionCap);
}

/** 종합소득세 기본세율 누진 계산 */
export function progressiveTax(base) {
  let tax = 0;
  let prev = 0;
  for (const { upTo, rate } of R.brackets) {
    if (base <= prev) break;
    tax += (Math.min(base, upTo) - prev) * rate;
    prev = upTo;
  }
  return tax;
}

/** 근로소득세액공제 (총급여별 한도 포함) */
export function earnedCredit(calculated, gross) {
  const c = R.earnedCredit;
  const credit = calculated <= c.threshold
    ? calculated * c.lowRate
    : c.threshold * c.lowRate + (calculated - c.threshold) * c.highRate;
  const lim = c.limits.find((l) => gross <= l.upTo);
  const cap = Math.max(lim.floor, lim.base - Math.max(0, gross - lim.from) * lim.rate);
  return Math.min(credit, cap);
}

/** 4대보험 근로자 부담분 (상한액 미반영 근삿값) */
export function socialInsurance(gross) {
  const s = R.socialInsurance;
  const health = gross * s.health;
  return gross * s.pension + health + health * s.longTermCareOfHealth + gross * s.employment;
}

/**
 * 연봉 → 세금·보험료·실수령 어림
 * @param {number} gross 세전 연봉(원)
 * @param {{dependents?: number, spendRate?: number}} opts 부양가족 수(본인 제외), 실수령액 중 소비 비율(0~1)
 */
export function estimate(gross, { dependents = 0, spendRate = 0.6 } = {}) {
  const ins = socialInsurance(gross);
  const base = Math.max(0, gross - earnedDeduction(gross) - R.basicDeductionPerPerson * (1 + dependents) - ins);
  const calculated = progressiveTax(base);
  const income = Math.max(0, calculated - earnedCredit(calculated, gross) - R.standardCredit);
  const local = income * R.localIncomeTaxRate;
  const afterTax = gross - ins - income - local;
  const vat = afterTax * spendRate * R.vat.taxableShare * R.vat.rate / (1 + R.vat.rate);
  return { ins, income, local, vat, net: afterTax - vat };
}

/** 세금을 국세·지방세로 나눔 (부가세 중 지방소비세분은 지방) */
export function splitNationalLocal({ income, local, vat }) {
  const lc = R.vat.localConsumptionShare;
  return { national: income + vat * (1 - lc), local: local + vat * lc };
}

/** 국세가 총지출과 같은 비율로 쓰인다고 보고 금액 하나의 내 몫 */
export function myShare(national, amountWon, totalSpendingWon) {
  return (national * amountWon) / totalSpendingWon;
}
