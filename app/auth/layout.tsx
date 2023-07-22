import Image from "next/image";
import SingBgImg from "@/public/assets/sign-bg.webp";
import Logo from "@/components/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "브루잉-로그인/회원가입",
  description: "브루잉 커뮤니티 로그인/회원가입 페이지 입니다.",
};

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="bg-base flex min-h-screen absolute left-0 top-0 w-full">
      <div className="lg:min-w-[500px] relative flex items-center justify-center w-full ">
        <h2 className="absolute top-6 left-6">
          <Logo />
        </h2>
        <div className="max-w-[384px] w-full my-16 ">{children}</div>
      </div>
      <div className="lg:block hidden">
        <Image src={SingBgImg} alt={"sdf"} className={"h-full object-cover"} />
      </div>
    </div>
  );
}
