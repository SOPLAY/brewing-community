import Image from "next/image";
import LogoImg from "@/public/assets/logo.svg";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"}>
      <span className="flex items-center">
        <Image src={LogoImg} alt={"logo"} />
        <span className="text-amber-950 text-2xl font-bold ml-2 pr-2">
          Brewing
        </span>
      </span>
    </Link>
  );
}
