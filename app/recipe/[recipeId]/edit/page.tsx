import { baseURL } from "@/lib/axios";
import RecipeEditor from "@/components/Recipe/RecipeEditor";

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
