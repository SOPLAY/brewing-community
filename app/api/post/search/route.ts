import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json(
      { message: "search 파라미터를 확인해주세요!" },
      {
        status: 400,
      }
    );
  }

  const postList = await prisma.post.findMany({
    where: {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          content: {
            contains: search,
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ postList }, { status: 200 });
}
