"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen gap-4">
      <h2 className="text-3xl font-bold">잘못된 접근입니다.</h2>
      <p>리소스가 서버에 없습니다</p>
      <button
        className="btn btn-primary"
        onClick={() => {
          router.push("/");
          router.refresh();
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
