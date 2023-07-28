"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

type Props = {
  max: number;
  current: number;
};
export default function PaginationButton({ max, current }: Props) {
  const pathName = usePathname();
  const searchParams = useSearchParams()!;

  const pageCnt =
    max - Math.floor(current / 5) * 5 > 5
      ? 5
      : max - Math.floor(current / 5) * 5;

  const pageList = Array.from(
    {
      length: pageCnt,
    },
    (_, i) => Math.floor(current / 5) * 5 + i + 1
  );

  const onChangePage = (pageNum: number) => {
    // @ts-ignore
    const params = new URLSearchParams(searchParams);
    params.set("page", (pageNum - 1).toString());

    return params.toString();
  };

  //페이지 네이션 변경시 스크롤 위치 최상 변경
  useEffect(() => {
    window?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [current]);

  return (
    <div className="flex justify-between items-center bg-gray-200/10 ">
      <Link
        href={`${pathName}?${onChangePage(1)}`}
        className="flex items-center h-8 px-2 border w-28 justify-center hover:bg-gray-200 duration-300"
      >
        <BiSolidLeftArrow />
        처음페이지
      </Link>
      <ul className="flex h-[50px] items-center justify-center">
        {pageList.map((v) => (
          <li key={`pagination_${v}`}>
            <Link
              href={`${pathName}?${onChangePage(v)}`}
              className={`
                flex justify-center items-center
                w-8 h-8 border [&+&]:border-l-0 
                text-sm
                duration-300
                ${
                  current === v - 1
                    ? "bg-neutral text-white"
                    : "hover:bg-gray-200"
                }
              `}
            >
              {v}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`${pathName}?${onChangePage(max)}`}
        className="flex items-center h-8 px-2 border hover:bg-gray-200 duration-300"
      >
        마지막페이지
        <BiSolidRightArrow />
      </Link>
    </div>
  );
}
