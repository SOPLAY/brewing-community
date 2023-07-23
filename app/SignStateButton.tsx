"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function SignStateButton() {
  const session = useSession();
  if (session.status === "loading") return <div />;
  return (
    <ul className="flex gap-1">
      {session.status === "authenticated" ? (
        <li>
          <button onClick={() => signOut()}>로그아웃</button>
        </li>
      ) : (
        <>
          <li>
            <Link href={"/auth/signin"}>로그인</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={"/auth/signup"}>회원가입</Link>
          </li>
        </>
      )}
    </ul>
  );
}
