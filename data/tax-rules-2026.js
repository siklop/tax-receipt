// 2026년 근로소득 세금 계산 규칙. 값을 바꿀 때는 source 를 함께 갱신한다.
export const TAX_RULES = {
  asOf: '2026-01-01',
  source: '소득세법 제47조(근로소득공제)·제55조(세율)·제59조(근로소득세액공제)·제59조의4(표준세액공제)',
  earnedDeduction: [
    { from: 0, upTo: 5e6, base: 0, rate: 0.7 },
    { from: 5e6, upTo: 15e6, base: 3.5e6, rate: 0.4 },
    { from: 15e6, upTo: 45e6, base: 7.5e6, rate: 0.15 },
    { from: 45e6, upTo: 100e6, base: 12e6, rate: 0.05 },
    { from: 100e6, upTo: Infinity, base: 14.75e6, rate: 0.02 },
  ],
  earnedDeductionCap: 20e6,
  brackets: [
    { upTo: 14e6, rate: 0.06 },
    { upTo: 50e6, rate: 0.15 },
    { upTo: 88e6, rate: 0.24 },
    { upTo: 150e6, rate: 0.35 },
    { upTo: 300e6, rate: 0.38 },
    { upTo: 500e6, rate: 0.4 },
    { upTo: 1000e6, rate: 0.42 },
    { upTo: Infinity, rate: 0.45 },
  ],
  earnedCredit: {
    threshold: 1.3e6,
    lowRate: 0.55,
    highRate: 0.3,
    limits: [
      { from: 0, upTo: 33e6, base: 740e3, rate: 0, floor: 740e3 },
      { from: 33e6, upTo: 70e6, base: 740e3, rate: 0.008, floor: 660e3 },
      { from: 70e6, upTo: 120e6, base: 660e3, rate: 0.5, floor: 500e3 },
      { from: 120e6, upTo: Infinity, base: 500e3, rate: 0.5, floor: 200e3 },
    ],
  },
  basicDeductionPerPerson: 1.5e6,
  standardCredit: 130e3,
  localIncomeTaxRate: 0.1,
  // 근사값: 요율 고시로 확인 필요 (PRD 데이터 출처 표 참고)
  socialInsurance: { pension: 0.0475, health: 0.03595, longTermCareOfHealth: 0.1314, employment: 0.009 },
  vat: { rate: 0.1, taxableShare: 0.6, localConsumptionShare: 0.253 },
};
