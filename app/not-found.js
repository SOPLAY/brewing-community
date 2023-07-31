import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen gap-4">
      <h2 className="text-3xl font-bold">잘못된 접근입니다.</h2>
      <p>리소스가 서버에 없습니다</p>
      <Link href="/" className="btn btn-primary">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
