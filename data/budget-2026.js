// 2026년 정부 예산 12대 분야. 분야 금액 단위: 조 원, 하위 항목 금액 단위: 원.
const NABO = 'https://nabo.go.kr/board/file/bulkDown.do?idx=8946&bid=19';

export const BUDGET = {
  year: 2026,
  basis: '정부안',
  totalTrillion: 728.0,
  source: { label: '국회예산정책처, 2026년도 예산안 분야별 재원배분 분석', url: NABO },
  sectors: [
    { name: '보건·복지·고용', trillion: 269.1, desc: '국민연금·기초연금, 건강보험 지원, 아동수당, 실업급여, 일자리 사업 등.' },
    { name: '일반·지방행정', trillion: 121.1, desc: '지방자치단체로 내려보내는 교부세, 나랏빚 이자, 중앙부처 운영비 등.' },
    { name: '교육', trillion: 99.8, desc: '시도교육청으로 가는 교육재정교부금, 대학·장학금 지원 등.' },
    { name: '국방', trillion: 66.3, desc: '장병 인건비·급식, 무기 도입과 전력 유지 등.' },
    { name: 'R&D', trillion: 35.3, desc: '국가 연구개발 사업. 다른 분야와 일부 겹칩니다.' },
    { name: '산업·중소기업·에너지', trillion: 32.3, desc: '중소기업·소상공인 지원, 에너지 전환, 산업 육성 등.' },
    { name: '농림·수산·식품', trillion: 27.9, desc: '농어민 직불금, 농산물 가격 안정, 수산 지원 등.' },
    { name: 'SOC', trillion: 27.5, desc: '도로·철도·항만 같은 사회기반시설 건설과 유지.' },
    { name: '공공질서·안전', trillion: 27.2, desc: '경찰·소방·해경·법원·교정 등.' },
    { name: '환경', trillion: 14.0, desc: '상하수도, 대기·수질 관리, 탄소중립 사업 등.' },
    {
      name: '문화·체육·관광',
      trillion: 9.6,
      desc: '문화예술 지원, 관광 진흥, 체육단체 보조금 등.',
      items: [
        {
          name: '대한축구협회 국고 보조금',
          won: 125e8,
          desc: '국가대표·유소년·지도자 육성 명목. 보도 기준 1년 100억~150억 원의 가운데값.',
          basis: '보도 기준',
          source: { label: '머니투데이, 「매년 300억 어디다 썼나」', url: 'https://www.mt.co.kr/article/2026062909245254637' },
        },
      ],
    },
    { name: '외교·통일', trillion: 7.0, desc: '재외공관 운영, 공적개발원조(ODA), 남북협력 등.' },
  ],
};
