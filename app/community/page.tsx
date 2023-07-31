import PaginationButton from "@/components/Button/PaginationButton";
import PostList from "@/components/Post/PostList";
import { baseURL } from "@/lib/axios";
import CommunityNav from "@/app/community/CommunityNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티 게시판 - 브루잉 커뮤니티",
  description: "브루잉 커뮤니티의 게시판 입니다!",
};
const getPostData = async (category: string, page: number, pageSize: number) =>
  await fetch(
    `${baseURL}/api/post?category=${category}&page=${page}&pageSize=${pageSize}`,
    {
      cache: "reload",
      next: {
        tags: ["postList", "post"],
      },
    }
  ).then(async (res) => await res.json());

type Props = {
  searchParams: { category: string; page?: number; pageSize?: number };
};

export default async function Page({
  searchParams: { category = "all", page = 0, pageSize = 20 },
}: Props) {
  const data = await getPostData(category, page, pageSize);

  return (
    <>
      <CommunityNav />
      <PostList postList={data.postList} />
      <PaginationButton max={data.pageSize} current={+page} />
    </>
  );
}
