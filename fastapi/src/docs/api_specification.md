# 📌 ChatBot FastAPI 명세서

## 📢 개요
- **API 이름**: ChatBot FastAPI
- **설명**: 쳇봇 데이터 관리 및 이메일 인증 API
- **버전**: 
- **로고**: 
  ![ChatBot 로고](https://drive.google.com/thumbnail?id=12PqUS6bj4eAO_fLDaWQmoq94-771xfim)

이 API는 MongoDB 데이터 관리와 이메일 인증을 위한 기능을 제공합니다.

---

## 📍 엔드포인트 목록

### 🔹 MongoDB 라우터

#### 📌 데이터베이스 관리
- **`GET /mongo/db`**
  - **설명**: 데이터베이스 서버에 있는 모든 데이터베이스의 목록을 반환합니다.
  - **응답**: 데이터베이스 목록 및 관련 링크를 포함한 JSON 객체

- **`GET /mongo/collections`**
  - **설명**: 현재 선택된 데이터베이스 내의 모든 컬렉션 이름을 반환합니다.
  - **쿼리 파라미터**:
    | 파라미터명 | 필수 여부 | 설명 |
    |-----------|---------|------|
    | db_name   | 필수    | 데이터베이스 이름 |
  - **응답**: 컬렉션 목록 및 관련 링크를 포함한 JSON 객체

---

### 🔹 MongoDB / Offices

#### 📌 오피스 채팅방 관리
- **`POST /mongo/offices/users/{user_id}`**
  - **설명**: 새로운 유저 채팅 문서(채팅 로그)를 MongoDB에 생성합니다.
  - **경로 파라미터**:
    | 파라미터명 | 타입   | 설명     |
    |-----------|-------|---------|
    | user_id   | string | 유저 ID |
  - **응답**: 생성된 채팅방 ID 및 관련 API 링크 정보

- **`GET /mongo/offices/users/{user_id}/documents/{document_id}`**
  - **설명**: 생성된 채팅 문서의 채팅 로그를 MongoDB에서 불러옵니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입   | 설명      |
    |-------------|-------|----------|
    | user_id     | string | 유저 ID   |
    | document_id | string | 채팅방 ID |
  - **응답**: 채팅 로그 내용 및 관련 API 링크 정보

- **`PUT /mongo/offices/users/{user_id}/documents/{document_id}`**
  - **설명**: 생성된 채팅 문서에 유저의 채팅 데이터를 저장합니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입   | 설명      |
    |-------------|-------|----------|
    | user_id     | string | 유저 ID   |
    | document_id | string | 채팅방 ID |
  - **요청 본문**:
    ```json
    {
      "input_data": "안녕하세요, 챗봇!",
      "output_data": "안녕하세요! 무엇을 도와드릴까요?"
    }
    ```
    | 필드명      | 타입   | 제약조건                  | 설명                     | 예시                           |
    |------------|-------|--------------------------|--------------------------|--------------------------------|
    | input_data  | string | minLength=1, maxLength=500 | 사용자 입력 문장           | `"안녕하세요, 챗봇!"`           |
    | output_data | string | minLength=1, maxLength=8191 | 챗봇 출력 문장            | `"안녕하세요! 무엇을 도와드릴까요?"` |
  - **응답**: 저장 결과 메시지 및 관련 API 링크 정보

- **`PATCH /mongo/offices/users/{user_id}/documents/{document_id}`**
  - **설명**: 기존 채팅 문서에 유저의 채팅 데이터를 수정합니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입   | 설명      |
    |-------------|-------|----------|
    | user_id     | string | 유저 ID   |
    | document_id | string | 채팅방 ID |
  - **요청 본문**: `PUT` 요청과 동일한 형식
  - **응답**: 수정 결과 메시지 및 관련 API 링크 정보

- **`DELETE /mongo/offices/users/{user_id}/documents/{document_id}`**
  - **설명**: 유저의 채팅방을 삭제합니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입   | 설명      |
    |-------------|-------|----------|
    | user_id     | string | 유저 ID   |
    | document_id | string | 채팅방 ID |
  - **응답**: 삭제 결과 메시지 및 관련 API 링크 정보

- **`DELETE /mongo/offices/users/{user_id}/documents/{document_id}/idx/{index}`**
  - **설명**: 최신 대화 ~ 선택된 채팅을 로그에서 삭제합니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입    | 설명                          |
    |-------------|--------|------------------------------|
    | user_id     | string  | 유저 ID                       |
    | document_id | string  | 채팅방 ID                     |
    | index       | integer | 삭제를 시작할 채팅 로그의 인덱스 |
  - **응답**: 삭제 결과 메시지 및 관련 API 링크 정보

---

### 🔹 MongoDB / Characters

#### 📌 캐릭터 채팅방 관리
- **`POST /mongo/characters/users/{user_id}`**
  - **설명**: 새로운 유저 채팅 문서(채팅 로그)를 MongoDB에 생성합니다.
  - **경로 파라미터**:
    | 파라미터명 | 타입   | 설명     |
    |-----------|-------|---------|
    | user_id   | string | 유저 ID |
  - **요청 본문**:
    ```json
    {
      "character_idx": 1
    }
    ```
    | 필드명        | 타입    | 설명         | 예시  |
    |--------------|--------|-------------|-------|
    | character_idx | integer | 캐릭터 id    | `1`   |
  - **응답**: 생성된 채팅방 ID 및 관련 API 링크 정보

- **`GET /mongo/characters/users/{user_id}/documents/{document_id}`**
  - **설명**: 생성된 채팅 문서의 채팅 로그를 MongoDB에서 불러옵니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입   | 설명      |
    |-------------|-------|----------|
    | user_id     | string | 유저 ID   |
    | document_id | string | 채팅방 ID |
  - **응답**: 채팅 로그 내용, 캐릭터 인덱스 및 관련 API 링크 정보

- **`PUT /mongo/characters/users/{user_id}/documents/{document_id}`**
  - **설명**: 생성된 채팅 문서에 유저의 채팅 데이터를 저장합니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입   | 설명      |
    |-------------|-------|----------|
    | user_id     | string | 유저 ID   |
    | document_id | string | 채팅방 ID |
  - **요청 본문**:
    ```json
    {
      "img_url": "https://drive.google.com/thumbnail?id=12PqUS6bj4eAO_fLDaWQmoq94-771xfim",
      "input_data": "안녕하세요, 챗봇!",
      "output_data": "안녕하세요! 무엇을 도와드릴까요?"
    }
    ```
    | 필드명      | 타입   | 제약조건                  | 설명                     | 예시                           |
    |------------|-------|--------------------------|--------------------------|--------------------------------|
    | img_url     | string | minLength=1, maxLength=2048 | 이미지 URL              | `"https://drive.google.com/thumbnail?id=12PqUS6bj4eAO_fLDaWQmoq94-771xfim"` |
    | input_data  | string | minLength=1, maxLength=500 | 사용자 입력 문장           | `"안녕하세요, 챗봇!"`           |
    | output_data | string | minLength=1, maxLength=8191 | 챗봇 출력 문장            | `"안녕하세요! 무엇을 도와드릴까요?"` |
  - **응답**: 저장 결과 메시지 및 관련 API 링크 정보

- **`PATCH /mongo/characters/users/{user_id}/documents/{document_id}`**
  - **설명**: 기존 채팅 문서에 유저의 채팅 데이터를 수정합니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입   | 설명      |
    |-------------|-------|----------|
    | user_id     | string | 유저 ID   |
    | document_id | string | 채팅방 ID |
  - **요청 본문**: `PUT` 요청과 동일한 형식
  - **응답**: 수정 결과 메시지 및 관련 API 링크 정보

- **`DELETE /mongo/characters/users/{user_id}/documents/{document_id}`**
  - **설명**: 유저의 채팅방을 삭제합니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입   | 설명      |
    |-------------|-------|----------|
    | user_id     | string | 유저 ID   |
    | document_id | string | 채팅방 ID |
  - **응답**: 삭제 결과 메시지 및 관련 API 링크 정보

- **`DELETE /mongo/characters/users/{user_id}/documents/{document_id}/idx/{index}`**
  - **설명**: 최신 대화 ~ 선택된 채팅을 로그에서 삭제합니다.
  - **경로 파라미터**:
    | 파라미터명   | 타입    | 설명                          |
    |-------------|--------|------------------------------|
    | user_id     | string  | 유저 ID                       |
    | document_id | string  | 채팅방 ID                     |
    | index       | integer | 삭제를 시작할 채팅 로그의 인덱스 |
  - **응답**: 삭제 결과 메시지 및 관련 API 링크 정보

---

### 🔹 인증

#### 📌 이메일 인증
- **`POST /auth/verification/send`**
  - **설명**: 사용자 이메일로 인증 코드를 전송합니다.
  - **요청 본문**:
    ```json
    {
      "user_id": "shaa97102",
      "email": "user@example.com"
    }
    ```
    | 필드명  | 타입   | 제약조건                | 설명                          | 예시                |
    |--------|-------|--------------------------|-------------------------------|---------------------|
    | user_id | string | minLength=1, maxLength=50 | 유저 ID                      | `"shaa97102"`        |
    | email   | string | 유효한 이메일 형식        | 인증 코드를 전송할 이메일 주소 | `"user@example.com"` |
  - **응답**: 인증 코드 전송 결과 메시지

- **`POST /auth/verification/verify`**
  - **설명**: 사용자로부터 받은 인증 코드를 검증합니다.
  - **요청 본문**:
    ```json
    {
      "user_id": "shaa97102",
      "email": "user@example.com",
      "code": "A12B34"
    }
    ```
    | 필드명  | 타입   | 제약조건                | 설명                          | 예시                |
    |--------|-------|--------------------------|-------------------------------|---------------------|
    | user_id | string | minLength=1, maxLength=50 | 유저 ID                      | `"shaa97102"`        |
    | email   | string | 유효한 이메일 형식        | 인증 코드를 전송한 이메일 주소 | `"user@example.com"` |
    | code    | string | minLength=6, maxLength=6  | 6자리 인증 코드              | `"A12B34"`           |
  - **응답**: 인증 코드 검증 결과 메시지

---

## 🛠 응답 구조

### 일반 응답
- **정상 응답 예시**: 
  ```json
  {
    "status": "success",
    "message": "인증 코드가 전송되었습니다. 이메일을 확인해주세요."
  }
  ```

### HATEOAS 링크
- **링크 포함 응답 예시**: 
  ```json
  {
    "Document ID": "614a123456789b0d323e456f",
    "_links": [
      {
        "href": "/mongo/offices/users/shaa97102",
        "rel": "self",
        "type": "GET",
        "title": "유저 채팅방 ID 생성"
      },
      {
        "href": "/mongo/offices/users/shaa97102/documents/614a123456789b0d323e456f",
        "rel": "/users/shaa97102/documents/614a123456789b0d323e456f",
        "type": "GET",
        "title": "유저 채팅 불러오기"
      }
    ]
  }
  ```

### 오류 응답
- **오류 응답 예시**: 
  ```json
  {
    "status": "error",
    "detail": "인증 코드가 일치하지 않습니다.",
    "code": "invalid_verification_code"
  }
  ```