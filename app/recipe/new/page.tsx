import RecipeEditor from "@/components/recipe/RecipeEditor";

export default function Page() {
  return <RecipeEditor submitUrl={"/api/recipe"} type={"create"} />;
}
