import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";

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
    include: {
      author: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
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

  return NextResponse.json(
    { post },
    {
      status: 201,
    }
  );
}

export async function PUT(request: Response) {
  const session = await getServerSession(authOption);
  const body = await request.json();
  const {
    id,
    category,
    title,
    content,
  }: { id: string; category: string; title: string; content: string } = body;

  if (!(session && category && title && content && id)) {
    return NextResponse.json(
      { message: "body혹은 로그인 유무를 확인해 주세요!" },
      {
        status: 400,
      }
    );
  }

  const currentPost = await prisma.post.findUnique({
    where: {
      author: {
        email: session.user!.email!,
      },
      id,
    },
  });

  if (!currentPost) {
    return NextResponse.json(
      { message: "해당 포스트를 수정할 권한이 없습니다." },
      {
        status: 400,
      }
    );
  }

  const updatedPost = await prisma.post.update({
    where: {
      id,
    },
    data: {
      category,
      title,
      content,
    },
  });

  return NextResponse.json(
    { post: updatedPost },
    {
      status: 200,
    }
  );
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOption);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!(session && id)) {
    return NextResponse.json(
      { message: "id 파라미터 혹은 로그인 유무를 확인해주세요!" },
      {
        status: 400,
      }
    );
  }

  const currentPost = await prisma.post.findUnique({
    where: {
      id,
      author: {
        email: session.user!.email!,
      },
    },
  });

  if (!currentPost) {
    return NextResponse.json(
      { message: "해당 포스트를 삭제할 권한이 없습니다." },
      {
        status: 400,
      }
    );
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id,
      author: {
        email: session.user!.email!,
      },
    },
  });

  return NextResponse.json(
    { post: deletedPost },
    {
      status: 200,
    }
  );
}
