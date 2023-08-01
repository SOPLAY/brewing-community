import { baseURL } from "@/lib/axios";
import RecipeEditor from "@/components/recipe/RecipeEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "브루잉 레시피 작성중...",
  description: "브루잉 커뮤니티를 통해 나만의 레시피를 작성해서 공유해보세요!",
};
const getData = async (id: string) =>
  await fetch(`${baseURL}/api/recipe/${id}`, { cache: "no-cache" }).then(
    async (res) => await res.json()
  );
type Props = {
  params: {
    recipeId: string;
  };
};
export default async function Page({ params: { recipeId } }: Props) {
  const data = await getData(recipeId);
  data.content = JSON.parse(data.content);
  return (
    <RecipeEditor
      initValue={data}
      type={"edit"}
      submitUrl={`/api/recipe/${recipeId}/edit`}
    />
  );
}
