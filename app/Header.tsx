import Logo from "@/components/Logo";
import Link from "next/link";
import SignStateButton from "@/app/SignStateButton";

export default async function Header() {
  return (
    <header className="flex h-[60px] items-center fixed w-full px-6 bg-base z-50">
      <h1>
        <Logo />
      </h1>
      <nav className="flex justify-between w-full ml-10 lg:text-lg">
        <ul className="flex gap-5">
          <li>
            <Link href={"/community"}>커뮤니티</Link>
          </li>
          <li>
            <Link href={"/recipe"}>레시피</Link>
          </li>
        </ul>
        <SignStateButton />
      </nav>
    </header>
  );
}
