import Image from "next/image";
import SingBgImg from "@/public/assets/sign-bg.webp";
import Logo from "@/components/Logo";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="bg-base flex h-screen">
      <div className="lg:min-w-[500px] relative flex items-center justify-center w-full">
        <h2 className="absolute top-6 left-6">
          <Logo />
        </h2>
        <div className="max-w-[384px] w-full">{children}</div>
      </div>
      <div className="lg:block hidden">
        <Image src={SingBgImg} alt={"sdf"} className={"h-full object-cover"} />
      </div>
    </div>
  );
}
