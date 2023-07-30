import { baseURL } from "@/lib/axios";
import RecipeList from "@/components/recipe/RecipeList";
import RecipeNav from "@/app/recipe/RecipeNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "브루잉 게시판",
  description: "부루잉 커뮤니티의 브루잉 게시판 입니다!",
};
export const revalidate = 10;
const getData = async () =>
  await fetch(`${baseURL}/api/recipe`).then(async (res) => await res.json());

export default async function Page() {
  const data = await getData();
  return (
    <main className="px-[20px]">
      <RecipeNav />
      {!!data?.recipeList?.length ? (
        <RecipeList recipeList={data.recipeList} />
      ) : (
        <div className="text-xl text-center mt-20">
          레시피가 존재하지 않습니다!
        </div>
      )}
    </main>
  );
}
