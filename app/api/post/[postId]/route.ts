import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type Params = { params: { postId: string } };
export async function GET(request: Request, { params: { postId } }: Params) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      comments: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!post)
    return NextResponse.json(
      { message: "존재하지 않는 게시글 입니다." },
      {
        status: 404,
      }
    );

  return NextResponse.json(post);
}
export async function PUT(request: Request, { params: { postId } }: Params) {
  const session = await getServerSession(authOption);
  const body = await request.json();
  const {
    category,
    title,
    content,
  }: { category: string; title: string; content: string } = body;

  if (!(session && category && title && content)) {
    return NextResponse.json(
      { message: "body혹은 로그인 유무를 확인해 주세요!" },
      {
        status: 400,
      }
    );
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      category,
      title,
      content,
    },
  });

  if (!updatedPost) {
    return NextResponse.json(
      { message: "해당 포스트를 수정할 권한이 없습니다." },
      {
        status: 400,
      }
    );
  }

  revalidatePath("/community");

  return NextResponse.json(updatedPost, {
    status: 200,
  });
}

export async function DELETE(request: Request, { params: { postId } }: Params) {
  const session = await getServerSession(authOption);

  if (!session) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      {
        status: 400,
      }
    );
  }

  const deletedPost = await prisma.post.delete({
    where: {
      id: postId,
      author: {
        email: session.user!.email!,
      },
    },
  });

  if (!deletedPost) {
    return NextResponse.json(
      { message: "해당 포스트를 삭제할 권한이 없습니다." },
      {
        status: 400,
      }
    );
  }

  revalidatePath("/community");

  return NextResponse.json(
    { post: deletedPost },
    {
      status: 200,
    }
  );
}
