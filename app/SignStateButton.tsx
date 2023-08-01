"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignStateButton() {
  const session = useSession();
  const pathname = usePathname();

  if (session.status === "loading") return <div />;
  return (
    <ul className="flex gap-1">
      {session.status === "authenticated" ? (
        <>
          <li>
            <button onClick={() => signOut()}>로그아웃</button>
          </li>
          {pathname !== "/account" && (
            <>
              <li>/</li>
              <li>
                <Link href={"/account"}>마이페이지</Link>
              </li>
            </>
          )}
        </>
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
