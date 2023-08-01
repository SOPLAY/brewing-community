# 브루잉 커뮤니티 프로젝트

>## Overview

### 프로젝트 소게

나만의 브루잉 레시피를 쉽고 간편하게 작성하고 공유할 수 있는 커뮤니티

>## Project

### 기술 스택
- Next.js v13 (app router)
- Typescript
- React
- Next-Auth
- Tailinwdcss + Daisyui
- Bcrypt
- Prisma + Postgresql
- Axios

---

### 폴더 구조

```shell
.
├── app
│   ├── api           # 프로젝트에서 사용되는 api의 라우트 경로
│   │                 # 나머지 파일 경로는 전부 프론트에 해당 됩니다.      
│   ├── favicon.ico   # 프로젝트에서 사용될 favicon.ico의 경로 입니다.
│   ├── icon.svg      # 프로젝트에서 사용될 icon.svg의 경로 입니다.
│   ├── page.tsx      # nextjs의 서버 컴포넌트를 기본 동작으로 하는 페이지 입니다.
│   ├── layout.tsx    # app경로 바로 아래 있는 Loayout은 루트 레이아웃으로 작동하고 나머지는 extneds됩니다.
│   ├── not-found.tsx # 404 페이지의 로딩 입니다.
├── components        # 공용으로 사용하는 컴포넌트들이 모여 있습니다.
│   ├── Button
│   ├── Post
│   └── recipe
├── hooks        
├── lib
├── prisma        # pirsma에서 사용하는 DB Schema와 migrations 파일들이 모여 있습니다.
│   ├── db
│   └── migrations
└── public        # 공용 이미지 파일들이 모여 있습니다 ( 라우트시 "/" 경로에서 해당 path명으로 접근 가능합니다.)
    └── assets
```

---

### 프로젝트 설정

#### 환경변수 설정
```shell
# 브루잉 커뮤니티 env

# 서버에서 사용될 postgresql 서버 연결 커넥션 입니다.
# ex)  postgresql://postgres:password@localhost:5432/db
DATABASE_URL=DB connection string

# bcrypt sort round 설정 10이상 하시면 클라이언트 서버에 무리가 갈 수 있습나다. ( 8~10 사이를 추천합니다.)
BCRYPT_SORT_ROUND=8

# NEXTAUTH_URL은 모든 api요청의 baseUrl이 되므로 필수적으로 작성해주셔야 합니다.
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=시크릿키(자유롭게 설정하시면됩니다.)

# 카카오 소셜 로그인 키
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# 구글 소셜 로그인 키
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

#### 프로젝트 실행 방법 ( yarn을 기준으로 설명하겠습니다. )

1. Prisma migrate ( DB 와 현재 작성된 Prisma Schema를 마이그레이션 하는 과정입니다.)

```shell
npx prisma migrate deploy
```

2. 의존성 설치

```shell
yarn
```

3. 빌드

```shell
yarn build
```

4. 서버 실행

```shell
yarn start:prod
```

---

### 세부 로직

#### 1. Next.js app router를 활용한 캐싱

- 첫 방문 이후 데이터의 변경이 발생하지 않으면 이전의 데이터를 기반으로 캐싱합니다. ( 캐싱을 하다가 별도의 만료시간 (5~10초)에 도달하게 되면 캐시를 만료시키고 데이터를 갱신합니다.)

- 이를 통해 api의 과도한 호출을 방지 할 수 있습니다 ( Next.js의 캐싱에서 중요한 점은 revalidate 정책을 잘 설정하면 이점으로 작용하지만 잘 못 설정할 경우 페이지에 변화가 생기더라도 반영이 안될수도 있습니다!)

```ts
const getData = async (category:string, page: number, pageSize: number, email: string) =>
await fetch(
    `${baseURL}/api/post?category=${category}&page=${page}&pageSize=${pageSize}&email=${email}`,
    {
      cache: "reload",
      next: {
        tags: ["postList", "post"],
      },
    }
  ).then(async (res) => await res.json());
```

![approuterimg](https://github.com/SOPLAY/brewing-community/assets/40691745/eba1e063-6a48-4244-98e9-a7c78da3e59e)

#### 2. bcrypt를 활용한 이메일/비밀번호 유저의 비밀번호 암호화 ( 파이썬이 설치되어 있어야 작동합니다. )

- bcrypt 라이브러리를 사용해서 비밀번호의 단방향 암호화를 진행했습니다. ( 이를 통해 비밀번호의 복호화는 사실상 불가능에 가깝게 되지만 두 비밀번호의 비교는 가능합니다.)

- 같은 비밀번호를 하더라고 시간이 1ms라도 일치하지 않으면 서로 다른 값이 출력됩니다.

```ts
import bcrypt from "bcrypt";

const sortRounds = parseInt(process.env.BCRYPT_SORT_ROUND!);

export const makeHash = async (password: string) =>
  await bcrypt.hash(password, sortRounds);

export const checkHash = async (password: string, hashPassword: string) =>
  await bcrypt.compare(password, hashPassword);

// makeHash("123123123") => $2b$08$AKBkatJLjYVeK4lopszWUe/N/xDlgQPKfOhfCZaGH2bLdBwzVtWfa의 값으로 DB에 저장이 됩니다.
```

![image](https://github.com/SOPLAY/brewing-community/assets/40691745/58ce536b-0aa9-40a3-80b1-050b40bf4d17)

#### 3. next-auth를 활용한 소셜 로그인 및 이메일/비밀번호 로그인

- Next.js에서의 안정적인 로그인을 위해 next-auth 라이브러리를 사용했습니다.

```ts
// app/auth/[...nextauth]/route.ts

// next-auth 옵션을 설정해줍니다.
// 이 옵션은 서버 사이드(서버 컴포넌트 포함)에서 user의 session을 확인할 때 사용해야 하므로 export 해줍니다.
// 서버 사이드에서 user의 세션을 확인하는 법은 const user = await getServerSession(authOption); 을 사용하시면 됩니다.
export const authOption: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
		CredentialsProvider({...})
	],
	pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOption);

// route.ts 규칙에 따라 GET, POST로 export 해줍니다.
export { handler as GET, handler as POST };
```

#### 4. SEO 최적화 ( with. Next.js server component )

- Next.js의 서버 컴포넌트를 통해 SEO를 최적화 했습니다.

> ##### 정적인 페이지의 SEO 최적화

```ts
import { Metadata } from "next";

export const metadata:Metadata= {
	title:'타이틀',
	description:'설명',
	...
}
```

> ##### 동적 SEO 최적화가 필요한 경우 다음과 같이 할 수 있습니다.

```ts
// app/community/post/[postId]/page.tsx

const getPost = async (id: string) =>
  await fetch(`${baseURL}/api/post/${id}`, {
    next: { tags: ["post"] }, //이 태그를 통해 route.ts에서 태그를 기반으로 revaildate가 진행됩니다.
  }).then(async (res) => await res.json());

type Props = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.postId);
  return {
    title: `${post.title} - 브루잉 커뮤니티`,
    description: `브루잉 커뮤니티 ${post.title} 게시글 입니다.`,
  };
}
```

---

### 세부 페이지

#### 1. 랜딩 페이지

![image](https://github.com/SOPLAY/brewing-community/assets/40691745/b048a2b0-4781-4a72-add6-306f449edb15)

#### 2. 회원가입

![회원가입 반응형](https://github-production-user-asset-6210df.s3.amazonaws.com/40691745/257435492-c69a8c58-369e-4d4c-9983-e3edfeff67d5.gif)

![회원가입](https://github.com/SOPLAY/brewing-community/assets/40691745/8f19466e-e709-430f-a80d-a007d48c26d8)

#### 3. 로그인 

![로그인 반응형](https://github.com/SOPLAY/brewing-community/assets/40691745/f11e1315-9c79-436c-8d44-f334eedb76d8)

#### 4. 게시글 작성

![게시글 작성](https://github.com/SOPLAY/brewing-community/assets/40691745/974eb0c4-09b8-451c-b38c-04eedceaa470)

#### 5. 댓글 작성, 수정 및 삭제

![댓글 작성 수정 삭제](https://github.com/SOPLAY/brewing-community/assets/40691745/ed7839da-5217-4c4b-a94f-54a3116c7c8a)

#### 6. 게시글 수정 및 삭제

![게시글 수정 및 삭제](https://github.com/SOPLAY/brewing-community/assets/40691745/c59c231c-3ad8-4f29-8acb-d7fa1dc54aed)

#### 7. 레시피 작성 및 조회

![레시피 작성및 확인](https://github.com/SOPLAY/brewing-community/assets/40691745/9554975c-9fa1-4963-9a80-c91b1a696fba)

#### 8. 레시피 수정 및 삭제

![레시피 수정 삭제](https://github.com/SOPLAY/brewing-community/assets/40691745/cdd80f93-6d62-4393-a10a-7a62e6c6ae17)


#### 마이 페이지 및 로그아웃

![마이 페이지 및 로그아웃](https://github.com/SOPLAY/brewing-community/assets/40691745/65eb9436-bb66-404a-9e38-15253874e598)


