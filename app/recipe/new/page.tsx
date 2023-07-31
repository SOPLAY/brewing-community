import RecipeEditor from "@/components/Recipe/RecipeEditor";

export default function Page() {
  return <RecipeEditor submitUrl={"/api/recipe"} type={"create"} />;
}
