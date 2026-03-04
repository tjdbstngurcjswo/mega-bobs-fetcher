# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Welplus 구내식당(Mega Bobs) 점심 메뉴를 Welplus API에서 가져와 Supabase `daily_menu` 테이블에 upsert하는 자동화 프로젝트.

## Commands

```bash
pnpm install          # 의존성 설치
node index.js         # 메뉴 페치 실행
```

## Architecture

**데이터 흐름**: Welplus 로그인 → 세션 토큰 → 날짜별/코스별 식단 조회 → Supabase upsert

- `index.js` — 오케스트레이터. 날짜 계산, API 호출 순서 제어, DB 삽입
- `api.js` — Welplus API 통신 (로그인, 세션, 식단 조회). iOS User-Agent 헤더 필수
- `constant.js` — 코스 타입 매핑 (`COURSE_1:BB`, `COURSE_2:CC`, `TAKE_OUT:DD`), `RESTAURANT_ID`
- `supabase.js` — Supabase 클라이언트 초기화 (service role key 사용)

**Supabase `daily_menu` 테이블 row 구조**: `{ date, meal: 'LUNCH', category, items: [{ name, kcal }] }`

## Environment Variables

```
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, USER_ID, USER_PW, DEVICE_ID
```

## Key Conventions

- ES Modules (`"type": "module"`)
- 패키지 매니저: pnpm
- API 인증: Welplus 로그인 → access token → session token (Bearer) 순서
- 빈 식단 응답은 skip하여 null 삽입 방지
- Supabase upsert로 중복 키 충돌 방지
