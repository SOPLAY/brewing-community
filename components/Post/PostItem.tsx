"use client";

import { IPostDescription } from "@/components/Post/PostList";
import Link from "next/link";

const categoryFix = {
  free: "자유",
  brewing: "브루잉",
};

interface Props extends IPostDescription {}
export default function PostItem({
  id,
  author: { email },
  category,
  createdAt,
  title,
  views,
}: Props) {
  const date = new Date(createdAt);

  return (
    <div className="flex w-full h-10 items-center border [&+&]:border-t-0 text-sm">
      <div className="min-w-[80px] bg-gray-100 text-gray-700 flex justify-center items-center flex-shrink">
        <span>{categoryFix[category as keyof typeof categoryFix]}</span>
      </div>
      <Link
        href={`/community/post/${id}`}
        className="pl-4 text-ellipsis overflow-hidden bg-red-500px-2 whitespace-nowrap w-full flex-wrap border-r text-[16px]"
      >
        {title}
      </Link>
      <div className="min-w-[160px] text-ellipsis overflow-hidden flex border-r justify-center ">
        {email}
      </div>
      <div className="min-w-[32px] flex border-r justify-center ">{views}</div>
      <div className="min-w-[64px] flex justify-center ">
        {`${
          date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1
        }-${date.getDate()}`}
      </div>
    </div>
  );
}
