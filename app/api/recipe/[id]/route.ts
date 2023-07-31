import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

type Params = {
  params: {
    id: string;
  };
};
export async function GET(request: Request, { params: { id } }: Params) {
  const recipe = await prisma.recipe.findUnique({
    where: {
      id,
    },
  });

  if (!recipe)
    return NextResponse.json(
      { message: "recipeId에 해당하는 recipe가 존재하지 않습니다." },
      {
        status: 404,
      }
    );

  return NextResponse.json(recipe);
}

export async function DELETE(request: Request, { params: { id } }: Params) {
  const session = await getServerSession(authOption);
  if (!session)
    return NextResponse.json(
      { message: "로그인이 필요한 서비스 입니다." },
      { status: 401 }
    );

  const deletedRecipe = await prisma.recipe.delete({
    where: {
      id,
      authorEmail: session!.user!.email!,
    },
  });

  if (!deletedRecipe)
    return NextResponse.json({
      message: "레시피를 삭제하던 도중 알 수 없는 오류가 발생했습니다.",
    });

  revalidatePath("/recipe");
  return NextResponse.json(
    { message: "레시피가 삭제되었습니다." },
    { status: 200 }
  );
}
