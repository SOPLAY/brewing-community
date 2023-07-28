"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MdSearch } from "react-icons/md";

export default function Input() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const onChangeSearchParams = () => {
    const params = new URLSearchParams(searchParams as any);
    params.set("q", inputText);
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <form onSubmit={onChangeSearchParams} method="dialog">
      <div className="flex items-center">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Search"
          className="input input-bordered"
        />
        <button className="p-2">
          <MdSearch className="text-4xl" />
        </button>
      </div>
    </form>
  );
}
