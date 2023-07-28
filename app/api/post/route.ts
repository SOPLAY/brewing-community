import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");

  const pageLength = Math.ceil(
    (await prisma.post.count({
      where: {
        category: category === "all" ? undefined : category,
        published: true,
      },
    })) / pageSize
  );
  const postList = await prisma.post.findMany({
    skip: pageSize * page,
    take: pageSize,
    where: {
      category: category === "all" ? undefined : category,
      published: true,
    },
    select: {
      id: true,
      createdAt: true,
      title: true,
      category: true,
      views: true,
      authorEmail: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ postList, pageSize: pageLength });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOption);
  const body = await request.json();
  const {
    category,
    title,
    content,
  }: { category: string; title: string; content: string } = body;

  //세션 혹은 body에 내용이 안담겨 올 경우
  if (!(session && category && title && content)) {
    let message = !session
      ? "로그인 정보를 확인해주세요"
      : "category, title, content를 확인해주세요!";
    return NextResponse.json(
      { message },
      {
        status: 400,
      }
    );
  }

  //포스트 생성
  const post = await prisma.post.create({
    data: {
      category,
      title,
      content,
      author: {
        connect: {
          email: session.user!.email!,
        },
      },
    },
  });

  revalidatePath("/community");
  revalidatePath("/community/search");

  return NextResponse.json(post, {
    status: 201,
  });
}
