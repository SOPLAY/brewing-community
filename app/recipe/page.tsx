import { baseURL } from "@/lib/axios";
import RecipeList from "@/components/recipe/RecipeList";
import RecipeNav from "@/app/recipe/RecipeNav";
import { Metadata } from "next";
import PaginationButton from "@/components/Button/PaginationButton";

export const metadata: Metadata = {
  title: "브루잉 게시판",
  description: "부루잉 커뮤니티의 브루잉 게시판 입니다!",
};
export const revalidate = 10;
const getData = async (page: number, pageSize: number) =>
  await fetch(`${baseURL}/api/recipe?page=${page}&pageSize=${pageSize}`, {
    next: { tags: ["recipe", "recipeList"] },
  }).then(async (res) => await res.json());

type Props = {
  searchParams: { page?: number; pageSize?: number };
};
export default async function Page({
  searchParams: { page = 0, pageSize = 10 },
}: Props) {
  const data = await getData(+page, +pageSize);
  return (
    <main className="px-[20px] mb-10">
      <RecipeNav />
      {!!data?.recipeList?.length ? (
        <>
          <RecipeList recipeList={data.recipeList} />
          <PaginationButton max={data.pageSize} current={+page} />
        </>
      ) : (
        <div className="text-xl text-center mt-20">
          레시피가 존재하지 않습니다!
        </div>
      )}
    </main>
  );
}
