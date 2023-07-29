"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { useRef, useState } from "react";
import { MdClose } from "react-icons/md";

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
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [searchText, setSearchText] = useState("");

  const onSubmit = () => {
    !!searchText && router.push(`/community/search?q=${searchText}`);
  };

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
        <ul className="flex items-center text-2xl">
          <li>
            <button
              onClick={() => {
                dialogRef.current?.showModal();
                setSearchText("");
              }}
              className="flex items-center"
            >
              <BiSearch />
            </button>
            <dialog className="modal" ref={dialogRef}>
              <form
                method="dialog"
                className="modal-box bg-transparent shadow-none flex justify-center p-2 w-fit rounded-none"
                onSubmit={onSubmit}
              >
                <div className="flex border-b text-white w-fit">
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className=" text-[16px] font-bold outline-none w-[200px] bg-transparent"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <button>
                    <BiSearch />
                  </button>
                </div>
              </form>
              <form
                method="dialog"
                className="modal-backdrop bg-black/80 text-white relative"
              >
                <button className="cursor-default">
                  <div className="absolute top-0 right-0 p-6 text-4xl cursor-pointer">
                    <MdClose />
                  </div>
                </button>
              </form>
            </dialog>
          </li>
          <li>
            <Link
              href={"/community/new"}
              className="flex items-center p-1 px-5"
            >
              <HiOutlinePencilAlt className="" />
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
