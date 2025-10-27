# 배드민턴 경기 기록 시스템

배드민턴 복식 경기를 기록하고 집계하는 웹 애플리케이션입니다.

## 주요 기능

- ✅ 복식(2 vs 2) 경기 입력
- ✅ 세트별 점수 기록 (최대 5세트)
- ✅ 총점 21점/25점 선택 (승리 시 11점/13점 부여)
- ✅ 실시간 집계 (승/패/세트승/세트패/득점/실점/득실차/순위)
- ✅ 엑셀(XLSX) 내보내기
- ✅ CSV 내보내기
- ✅ PNG 이미지 내보내기
- ✅ 반응형 디자인 (iPhone + Desktop)
- ✅ IndexedDB 자동 저장 (브라우저 로컬 저장)

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: TailwindCSS
- **상태관리**: Zustand + IndexedDB (localforage)
- **내보내기**: XLSX (SheetJS), html2canvas
- **배포**: Vercel

## 시작하기

### 개발 환경

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 사용 방법

1. **총점 선택**: 상단에서 21점 또는 25점 선택
2. **경기 추가**: "경기 추가" 버튼 클릭
3. **선수 정보 입력**: 팀 A, 팀 B의 선수 이름 입력
4. **세트 점수 입력**: 각 세트의 점수 입력 (세트 추가/삭제 가능)
5. **저장**: 입력 완료 후 "저장" 버튼 클릭
6. **집계 확인**: 자동으로 집계된 결과 확인
7. **내보내기**: 엑셀, CSV, PNG로 결과 저장

## 계산 규칙

### 승점 부여
- 총점 21 선택 시: 매치 승리 시 11점
- 총점 25 선택 시: 매치 승리 시 13점

### 순위 결정 기준 (우선순위)
1. 승점 (매치 승리로 획득한 점수)
2. 매치 승수
3. 득실차 (득점 - 실점)
4. 득점
5. 세트 승수
6. 이름 (알파벳 순)

### 동명이인 처리
- 기본적으로 같은 이름은 동일 선수로 합산됩니다

## 데이터 저장

- 모든 데이터는 **브라우저의 IndexedDB**에 저장됩니다
- 브라우저를 닫아도 데이터가 유지됩니다
- 다른 브라우저나 기기에서는 데이터가 공유되지 않습니다
- 정기적으로 엑셀/CSV 파일로 백업하는 것을 권장합니다

## 배포

### GitHub Actions 자동 배포 (권장)

이 프로젝트는 GitHub Actions를 통해 자동으로 Vercel에 배포됩니다.

**설정 방법:**
1. [VERCEL_SETUP.md](./VERCEL_SETUP.md) 파일의 가이드를 따라 설정
2. GitHub Secrets에 Vercel 토큰 및 프로젝트 ID 추가
3. 코드 푸시 시 자동으로 배포됨

**자동 배포 동작:**
- `claude/badminton-match-tracker-011CUXi3mEhashUypVFBc3GR` 브랜치에 푸시 → Production 배포
- Pull Request 생성 → Preview 배포

### 수동 배포 (Vercel CLI)

```bash
npm i -g vercel
vercel --prod
```

### Vercel 웹사이트를 통한 배포

1. [Vercel](https://vercel.com)에서 GitHub 연동
2. `Playing_badminton` 레포지토리 Import
3. 브랜치 선택 후 Deploy

## 프로젝트 구조

```
/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # 루트 레이아웃
│   ├── page.tsx         # 메인 페이지
│   └── globals.css      # 전역 스타일
├── components/          # React 컴포넌트
│   ├── TopBar.tsx       # 헤더 (총점 선택)
│   ├── MatchRow.tsx     # 경기 입력 폼
│   ├── MatchList.tsx    # 경기 목록
│   └── AggregateTable.tsx # 집계 테이블
├── lib/                 # 라이브러리
│   └── store.ts         # Zustand 스토어
├── types/               # TypeScript 타입
│   └── index.ts
├── utils/               # 유틸리티 함수
│   ├── aggregation.ts   # 집계 로직
│   ├── validation.ts    # 검증 로직
│   └── export.ts        # 내보내기 기능
└── package.json
```

## 브라우저 지원

- Chrome/Edge (최신 버전)
- Safari (iOS 포함)
- Firefox (최신 버전)

## 라이선스

MIT License

## 기여

이슈 및 Pull Request는 언제나 환영합니다!
