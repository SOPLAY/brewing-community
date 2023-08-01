"use client";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
      <h2 className="text-3xl">알 수 없는 오류가 발생했습니다.</h2>
      <button onClick={() => reset()} className="btn btn-primary">
        다시 시도하기
      </button>
      <Link href="/" className="btn btn-primary">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
