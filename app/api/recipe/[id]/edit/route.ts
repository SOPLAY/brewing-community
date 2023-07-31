import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

type Params = {
  params: {
    id: string;
  };
};
export async function PUT(request: Request, { params: { id } }: Params) {
  const session = await getServerSession(authOption);
  if (!session)
    return NextResponse.json(
      { message: "로그인이 필요한 서비스 입니다." },
      { status: 401 }
    );
  const body = await request.json();
  if (
    !body.title ||
    !body.roasting ||
    !body.stepCnt ||
    !body.degrees ||
    !body.content ||
    !body.gram
  )
    return NextResponse.json(
      {
        message: "body를 확인해주세요",
      },
      { status: 400 }
    );

  const editedRecipe = await prisma.recipe.update({
    where: {
      id,
      authorEmail: session!.user!.email!,
    },
    data: { ...body },
  });

  if (!editedRecipe)
    return NextResponse.json(
      { message: "레시피를 수정도중 알 수 없는 오류가 발생했습니다." },
      {
        status: 500,
      }
    );

  revalidateTag("recipe");

  return NextResponse.json(editedRecipe);
}
