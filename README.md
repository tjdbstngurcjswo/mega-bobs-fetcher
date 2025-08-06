# Mega Bobs Fetcher

This project fetches next week's lunch menu data from an API, parses it, and inserts it into a Supabase database. It focuses on weekday menus starting from the upcoming Monday.

## Features
- Calculates the dates for the next week's weekdays (Monday to Friday).
- Fetches meal details for different courses.
- Parses the data and upserts it into Supabase.
- Skips empty meal details.

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mega-bobs-fetcher.git
   cd mega-bobs-fetcher
   ```

2. Install dependencies using pnpm:
   ```
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   # Add any other required env vars for API authentication if needed
   ```

## Usage
Run the main script:
```
node index.js
```

This will:
- Fetch the access token and session token.
- Get the next week's weekday dates.
- For each date and course, fetch meal details.
- Parse and insert/upsert the data into the table in Supabase.

## Project Structure
- `index.js`: Main entry point, orchestrates fetching and inserting data.
- `api.js`: API functions for login, fetching tokens, and meal details.
- `parser.js`: Parses meal data into a format suitable for Supabase.
- `constant.js`: Constants like course type mappings.
- `supabase.js`: Supabase client initialization.

---

# 메가 밥스 페처 (Mega Bobs Fetcher)

이 프로젝트는 API에서 다음 주 점심 메뉴 데이터를 가져와서 파싱하고, Supabase 데이터베이스에 삽입합니다. 다가오는 월요일부터 시작하는 평일 메뉴에 중점을 둡니다.

## 기능
- 다음 주 평일 (월요일 ~ 금요일) 날짜를 계산합니다.
- 다양한 코스에 대한 식사 세부 정보를 가져옵니다.
- 데이터를 파싱하고 Supabase에 upsert합니다.
- 빈 식사 세부 정보를 건너뜁니다.

## 설치
1. 저장소 클론:
   ```
   git clone https://github.com/yourusername/mega-bobs-fetcher.git
   cd mega-bobs-fetcher
   ```

2. pnpm을 사용하여 종속성 설치:
   ```
   pnpm install
   ```

3. 환경 변수 설정:
   루트 디렉토리에 `.env` 파일을 생성하고 다음을 추가:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   # API 인증에 필요한 다른 환경 변수 추가
   ```

## 사용법
메인 스크립트 실행:
```
node index.js
```

이 작업은:
- 액세스 토큰과 세션 토큰을 가져옵니다.
- 다음 주 평일 날짜를 가져옵니다.
- 각 날짜와 코스에 대해 식사 세부 정보를 가져옵니다.
- 데이터를 파싱하고 Supabase의 테이블에 삽입/upsert합니다.

## 프로젝트 구조
- `index.js`: 메인 진입점, 데이터 가져오기 및 삽입을 조정합니다.
- `api.js`: 로그인, 토큰 가져오기, 식사 세부 정보 API 함수.
- `parser.js`: Supabase에 적합한 형식으로 식사 데이터를 파싱합니다.
- `constant.js`: 코스 유형 매핑과 같은 상수.
- `supabase.js`: Supabase 클라이언트 초기화.
