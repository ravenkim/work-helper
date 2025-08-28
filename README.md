# Work Helper

카테고리와 url 만 있으면 나머지는 자동 수집!!! 


## ✨ 소개

** Work Helper**는 직원들을을 위한 다양한 추천 사이트를 카테고리별로 한눈에 탐색할 수 있는 웹 서비스입니다.

- 프론트엔드, 백엔드, 디자인, AI 등 다양한 분야의 유용한 사이트를 한 곳에서 확인할 수 있습니다.
- 카테고리별, 태그별, 검색어별로 빠르게 원하는 사이트를 찾을 수 있습니다.
- Owner Pick, CEO Pick 등 추천 필터로 큐레이션된 사이트만 모아볼 수 있습니다.
- 무한 스크롤, 실시간 검색, 카테고리 아코디언 등 편리한 UI/UX를 제공합니다.

---

## 🖥️ 주요 기능

- **카테고리별 사이트 탐색**: 좌측 아코디언 UI로 카테고리별로 사이트를 분류하여 탐색할 수 있습니다.
- **검색 및 필터**: 사이트 이름, 설명, 태그로 실시간 검색이 가능하며, Owner Pick/CEO Pick 필터로 추천 사이트만 볼 수 있습니다.
- **무한 스크롤**: 스크롤을 내리면 자동으로 더 많은 사이트가 로드됩니다.
- **사이트/카테고리 직접 추가**: 데이터 파일을 수정하여 손쉽게 사이트와 카테고리를 추가할 수 있습니다.

---

## ⚙️ 동작 원리

- 메인 페이지(`src/app/page.tsx`)에서 `SitesServer` 컴포넌트가 사이트/카테고리 데이터를 불러옵니다.
- 각 사이트는 메타데이터(썸네일, 설명, 키워드 등)를 자동으로 수집하여 최신 정보를 제공합니다.
- 클라이언트(`Sites.client.tsx`)에서 검색, 필터, 무한 스크롤 등 UI/UX를 담당합니다.
- 카테고리-사이트 구조는 아코디언 UI(`CategoryAccordion.tsx`)로 계층적으로 보여집니다.

---

## 🏃‍♂️ 로컬 실행 방법

### 1. 의존성 설치

```bash
yarn
```

### 2. 개발 서버 실행

```bash
yarn dev
```

- 기본적으로 [http://localhost:3000](http://localhost:3000)에서 서비스가 실행됩니다.

### 3. 도커로 실행 (선택)

```bash
./build.sh
```

---

## 🌱 사이트/카테고리 추가 방법

### 1. 사이트 추가

아래 경로의 파일을 수정하세요:

```
src/features/sites/data/sites.ts
```

#### 예시 템플릿

```js
{
  category: '카테고리ID', // category.ts에 정의된 id와 일치해야 함
  url: 'https://example.com',
  git: 'https://github.com/example/repo', // (선택)
  imageUrl: '', // (선택, 자동 수집됨)
  name: '사이트 이름',
  description: '사이트 설명',
  labels: ['태그1', '태그2'],
  language: ['ko', 'en'],
  ownerPick: false,
  userPick: false,
}
```

#### 실제 예시

```js
{
  category: 'fe-ui-lib',
  url: 'https://mui.com/',
  git: 'https://github.com/mui/material-ui',
  imageUrl: '',
  name: 'MUI',
  description: 'Google의 Material Design을 기반으로 한 인기 있는 React UI 프레임워크입니다.',
  labels: ['Material UI', '디자인 시스템', '컴포넌트'],
  language: ['en'],
  ownerPick: false,
  userPick: false,
}
```

### 2. 카테고리 추가

아래 경로의 파일을 수정하세요:

```
src/features/sites/data/category.ts
```

#### 예시 템플릿

```js
{
  name: '카테고리명',
  id: '카테고리ID',
  children: [
    // 하위 카테고리 (선택)
  ]
}
```

#### 실제 예시

```js
{
  name: '프론트엔드 / Frontend',
  id: 'fe',
  children: [
    {
      name: 'UI 라이브러리 / UI Libraries',
      id: 'fe-ui-lib',
    },
    // ...
  ]
}
```

- 사이트의 `category` 필드는 반드시 카테고리의 `id`와 일치해야 합니다.
- 계층 구조로 원하는 만큼 하위 카테고리를 추가할 수 있습니다.
- 카테고리 id 는 중복이 있으면 안됩니다다

---

## 🗂️ 데이터 구조 참고

### Site 타입

```ts
interface Site {
    name: string
    language: string[]
    url: string
    git?: string
    description: string
    labels: string[]
    category: string
    ownerPick: boolean
    userPick: boolean
    imageUrl?: string
}
```

### Category 타입

```ts
interface Category {
    name: string
    id: string
    children?: Category[]
}
```

---

## 💡 기타

- 사이트 썸네일/설명/키워드는 자동으로 수집되며, 필요시 직접 입력도 가능합니다.
- Owner Pick/CEO Pick은 사이트 데이터의 해당 필드를 true로 설정하면 필터링에 반영됩니다.
- 데이터 파일 수정 후 서버를 재시작하면 바로 반영됩니다.

---

## 📂 주요 파일 구조

```
src/
  features/
    sites/
      data/
        sites.ts        # 사이트 데이터
        category.ts     # 카테고리 데이터
      components/
        CategoryAccordion.tsx  # 카테고리-사이트 UI
      Sites.client.tsx         # 클라이언트 기능/필터/검색/무한스크롤
      Sites.server.tsx         # 서버에서 데이터 가공/전달
      api/
        useInfiniteSiteQuery.ts # 클라이언트 무한스크롤/필터 로직
```

---

문의/기여 환영합니다! 🎉

---

## 🤝 기여 방법 (Contributing)

이 프로젝트에 기여하고 싶으시다면, Pull Request를 통해 참여하실 수 있습니다. 아래의 절차를 따라주세요.

1.  **리포지토리 Fork 하기**
    - 이 리포지토리를 자신의 GitHub 계정으로 Fork 하세요.

2.  **새로운 브랜치 생성**
    - 새로운 기능 추가나 버그 수정을 위한 브랜치를 생성합니다.
    ```bash
    git checkout -b feature/YourFeatureName
    ```

3.  **코드 수정**
    - 원하는 기능을 추가하거나 버그를 수정합니다.

4.  **변경 사항 커밋**
    - 수정한 내용을 커밋합니다. 명확한 메시지를 작성해주세요.
    ```bash
    git commit -m 'Feat: Add some amazing feature'
    ```

5.  **브랜치에 Push**
    - 생성한 브랜치에 변경 사항을 Push 합니다.
    ```bash
    git push origin feature/YourFeatureName
    ```

6.  **Pull Request 생성**
    - GitHub에서 Fork한 리포지토리로 이동하여, `main` 브랜치로 향하는 Pull Request를 생성합니다.

---

남은 할거 목록

- 테마 적용
- lint staged 적용
- 허스키 적용
- 언어 설정 적용
- 이미지 안나오는 케이스 확인후 수정 (아마도 사이트에서 잘못 설정한 경우)