import RecipeCard, { IRecipe } from "@/components/Recipe/RecipeCard";

type Props = {
  recipeList: IRecipe[];
};
export default function RecipeList({ recipeList }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 pb-5">
      {!!recipeList.length ? (
        recipeList.map((recipeData: any) => (
          <RecipeCard key={recipeData.id} {...recipeData} />
        ))
      ) : (
        <div className="flex justify-center items-center h-44 text-xl font-semibold">
          아직 작성된 레시피가 없습니다!
        </div>
      )}
    </div>
  );
}
