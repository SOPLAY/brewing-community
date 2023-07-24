"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

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
  const seletedTab = useSearchParams().get("category") || "all";
  return (
    <>
      <nav className="mb-[2px]">
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
                  font-semibold
                  ${tab.category === seletedTab && "bg-gray-700/10"}
                `}
              >
                {tab.name}
                {tab.category === seletedTab ? (
                  <motion.div
                    className="absolute h-[2px] w-full bottom-0 bg-amber-900"
                    layoutId="underline"
                  />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
