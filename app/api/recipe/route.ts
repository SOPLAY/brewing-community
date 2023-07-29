import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const pageLength = Math.ceil(
    (await prisma.recipe.count({
      where: {
        published: true,
      },
    })) / pageSize
  );

  const recipeList = await prisma.recipe.findMany({
    skip: pageSize * page,
    take: pageSize,
    where: {
      published: true,
    },
    include: {
      rating: true,
      comments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    recipeList,
    pageSize: pageLength,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOption);
  const body = await request.json();
  if (!session)
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 400 }
    );

  if (
    !body.content ||
    !body.title ||
    !body.roasting ||
    !body.dripper ||
    !body.gram
  )
    return NextResponse.json(
      {
        message: "body를 확인해주세요",
      },
      { status: 400 }
    );

  const recipe = await prisma.recipe.create({
    data: {
      title: body.title,
      content: body.content,
      roasting: body.roasting,
      dripper: body.dripper,
      gram: body.gram,
      author: {
        connect: {
          email: session.user!.email!,
        },
      },
    },
  });

  if (!recipe)
    return NextResponse.json(
      { message: "레시피를 생성하는도중 얼 수 없는 오류가 발생했습니다" },
      { status: 500 }
    );

  return NextResponse.json(recipe, { status: 500 });
}
