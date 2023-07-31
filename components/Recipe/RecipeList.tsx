import RecipeCard, { IRecipe } from "@/components/Recipe/RecipeCard";

type Props = {
  recipeList: IRecipe[];
};
export default function RecipeList({ recipeList }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 pb-5">
      {recipeList.map((recipeData: any) => (
        <RecipeCard key={recipeData.id} {...recipeData} />
      ))}
    </div>
  );
}
