import PaginationButton from "@/app/community/PaginationButton";
import PostList from "@/components/Post/PostList";
import { baseURL } from "@/lib/axios";
import CommunityNav from "@/app/community/CommunityNav";

export const revalidate = 20;

const getPostData = async (category: string, page: number, pageSize: number) =>
  await fetch(
    `${baseURL}/api/post?category=${category}&page=${page}&pageSize=${pageSize}`
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
