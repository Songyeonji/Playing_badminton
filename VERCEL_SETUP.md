# Vercel 자동 배포 설정 (간단 버전)

## 빠른 시작 (3분이면 완료!)

### 1단계: Vercel 연결

1. https://vercel.com 접속
2. "Continue with GitHub" 클릭하여 로그인
3. "Add New..." → "Project" 클릭
4. `Playing_badminton` 레포지토리 선택
5. **Branch 선택**: `claude/badminton-match-tracker-011CUXi3mEhashUypVFBc3GR`
6. **Deploy** 클릭!

끝! 🎉

### 2단계: 자동 배포 확인

이제 이 브랜치에 코드를 푸시할 때마다 자동으로 Vercel에 배포됩니다.

```bash
# 테스트
git push
```

배포 진행상황은 Vercel 대시보드에서 확인 가능합니다.

## 배포 URL

배포가 완료되면 다음과 같은 URL을 받게 됩니다:
- Production: `https://playing-badminton-xxxxx.vercel.app`

### 커스텀 도메인 연결 (선택사항)

간단한 URL을 원하신다면:

1. Vercel 프로젝트 → Settings → Domains
2. 원하는 도메인 입력 (예: `badminton.vercel.app`)
3. DNS 설정 완료

또는 Vercel이 제공하는 기본 도메인 사용도 가능합니다.

## 문제 해결

### ❌ 빌드 실패 시

1. 로컬에서 빌드 테스트:
   ```bash
   npm run build
   ```

2. 성공하면 푸시:
   ```bash
   git add .
   git commit -m "fix: build error"
   git push
   ```

### 🔧 배포 설정 변경

Vercel 프로젝트 → Settings → General에서:
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## 도움말

- Vercel 문서: https://vercel.com/docs
- 문제 발생 시: GitHub Issues에 보고
