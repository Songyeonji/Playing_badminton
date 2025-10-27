# Vercel 자동 배포 설정 가이드

GitHub Actions를 통해 코드를 푸시할 때마다 자동으로 Vercel에 배포되도록 설정하는 방법입니다.

## 1단계: Vercel 토큰 발급

1. https://vercel.com 접속
2. Settings → Tokens 이동
3. "Create Token" 클릭
   - Token Name: `GitHub Actions Deploy`
   - Scope: Full Account
   - Expiration: No Expiration (또는 원하는 기간)
4. 생성된 토큰을 **복사해서 안전한 곳에 보관** (다시 볼 수 없음)

## 2단계: Vercel 프로젝트 생성 및 ID 확인

### 방법 A: Vercel CLI 사용 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 링크 (프로젝트 디렉토리에서 실행)
vercel link

# 프로젝트 ID 및 조직 ID 확인
cat .vercel/project.json
```

출력 예시:
```json
{
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxxxxxxxxxx"
}
```

### 방법 B: Vercel 웹사이트 사용

1. https://vercel.com 접속
2. "New Project" → `Playing_badminton` 레포지토리 Import
3. 프로젝트 생성 후 Settings → General 이동
4. **Project ID** 복사
5. Settings → General → "Your Team ID" 또는 "Your User ID" 확인하여 **Organization ID** 복사

## 3단계: GitHub Secrets 설정

1. GitHub 레포지토리 페이지 이동
   - https://github.com/Songyeonji/Playing_badminton

2. Settings → Secrets and variables → Actions 클릭

3. "New repository secret" 버튼 클릭하여 다음 3개 생성:

   **Secret 1: VERCEL_TOKEN**
   - Name: `VERCEL_TOKEN`
   - Value: [1단계에서 발급받은 토큰]

   **Secret 2: VERCEL_ORG_ID**
   - Name: `VERCEL_ORG_ID`
   - Value: [2단계에서 확인한 Organization ID]

   **Secret 3: VERCEL_PROJECT_ID**
   - Name: `VERCEL_PROJECT_ID`
   - Value: [2단계에서 확인한 Project ID]

## 4단계: 자동 배포 테스트

이제 설정이 완료되었습니다! 테스트해봅시다:

```bash
# 아무 파일이나 수정 (예: README.md)
echo "# Test auto deploy" >> README.md

# 커밋 및 푸시
git add .
git commit -m "test: Verify auto deployment"
git push
```

GitHub Actions 탭에서 배포 진행상황을 확인할 수 있습니다:
- https://github.com/Songyeonji/Playing_badminton/actions

## 자동 배포 동작 방식

### Push 이벤트 (Production 배포)
- `claude/badminton-match-tracker-011CUXi3mEhashUypVFBc3GR` 브랜치에 푸시
- 자동으로 빌드 및 Vercel Production 배포
- 배포 URL: `your-project.vercel.app`

### Pull Request 이벤트 (Preview 배포)
- PR 생성 시 자동으로 Preview 배포
- PR마다 고유한 Preview URL 생성
- PR 리뷰에 유용

## 배포 확인

배포 완료 후:
1. Vercel 대시보드에서 확인: https://vercel.com/dashboard
2. 배포된 URL로 접속하여 앱 테스트
3. GitHub Actions에서 배포 로그 확인

## 문제 해결

### ❌ GitHub Actions 실패 시

**Error: "VERCEL_TOKEN not found"**
- GitHub Secrets가 올바르게 설정되었는지 확인
- Secret 이름이 정확한지 확인 (대소문자 구분)

**Error: "Project not found"**
- VERCEL_PROJECT_ID가 올바른지 확인
- Vercel에서 프로젝트가 생성되었는지 확인

**Error: "Unauthorized"**
- VERCEL_TOKEN이 유효한지 확인
- VERCEL_ORG_ID가 올바른지 확인

### 🔧 디버깅 팁

1. GitHub Actions 로그 확인:
   - Repository → Actions → 실패한 워크플로우 클릭
   - 각 스텝의 로그 확인

2. Vercel CLI로 수동 배포 테스트:
   ```bash
   vercel --prod
   ```

3. Secret 값 재확인:
   - GitHub Settings → Secrets에서 Secret 삭제 후 재생성

## 추가 설정 (선택사항)

### 커스텀 도메인 연결

1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Domains
3. 도메인 추가 및 DNS 설정

### 환경 변수 추가

필요시 Vercel 환경 변수 설정:
1. Vercel 대시보드 → Settings → Environment Variables
2. 변수 추가 (예: API_KEY, DATABASE_URL 등)

### 빌드 설정 변경

`vercel.json` 파일 수정:
```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

## 도움말

- Vercel 공식 문서: https://vercel.com/docs
- GitHub Actions 문서: https://docs.github.com/actions
- 문제 발생 시: GitHub Issues에 보고

---

설정 완료 후 이 파일은 삭제하셔도 됩니다!
