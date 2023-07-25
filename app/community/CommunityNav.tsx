"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlinePencilAlt } from "react-icons/hi";

const tabs = [
  {
    category: "all",
    name: "전체",
  },
  {
    category: "free",
    name: "자유 게시판",
  },
  {
    category: "brewing",
    name: "브루잉 게시판",
  },
];
export default function CommunityNav() {
  const selectedTab = useSearchParams().get("category") || "all";
  return (
    <>
      <nav className="mb-[2px] flex justify-between font-semibold">
        <ul className="flex h-[30px] mt-2 overflow-auto">
          {tabs.map((tab) => (
            <li key={`tabs_${tab.category}`}>
              <Link
                href={`/community?category=${tab.category}`}
                className={`
                  relative flex items-center justify-center
                  w-28 h-full
                  rounded-t-md
                  delay-150 duration-100 ease-in-out 
                  ${tab.category === selectedTab && "bg-gray-700/10"}
                `}
              >
                {tab.name}
                {tab.category === selectedTab ? (
                  <motion.div
                    className="absolute h-[2px] w-full bottom-0 bg-amber-900"
                    layoutId="underline"
                  />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex items-center">
          <li>
            <Link
              href={"/community/regist"}
              className="flex items-center p-1 px-5"
            >
              <HiOutlinePencilAlt className="text-2xl" />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
