import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

type Params = { params: { postId: string } };
export async function POST(request: Request, { params: { postId } }: Params) {
  const body = await request.json();
  const session = await getServerSession(authOption);

  if (!session)
    return NextResponse.json(
      { message: "로그인이 필요한 서비스 입니다." },
      { status: 401 }
    );
  if (!body.content)
    return NextResponse.json(
      { message: "body를 확인해주세요!." },
      { status: 400 }
    );

  const comment = await prisma.comment.create({
    data: {
      ...body,
      post: {
        connect: {
          id: postId,
        },
      },
      author: {
        connect: {
          email: session.user!.email,
        },
      },
    },
  });

  if (!comment)
    return NextResponse.json(
      { message: "postId가 존재하지 않습니다.!" },
      { status: 400 }
    );
  revalidatePath("/community/post/[postId]");
  return NextResponse.json({ message: "SUCCESS" }, { status: 201 });
}

export async function PUT(request: Request, { params: { postId } }: Params) {
  const session = await getServerSession(authOption);
  const body = await request.json();
  if (!session)
    return NextResponse.json(
      { message: "로그인이 필요한 서비스 입니다." },
      { status: 401 }
    );
  if (!body.content || !body.id)
    return NextResponse.json(
      { message: "body를 확인해주세요!." },
      { status: 400 }
    );

  const comment = await prisma.comment.update({
    where: {
      authorEmail: session.user!.email!,
      postId,
      id: body.id,
    },
    data: {
      content: body.content,
    },
  });

  if (!comment)
    return NextResponse.json(
      { message: "id(commentId)가 존재하지 않습니다.!" },
      { status: 400 }
    );
  revalidatePath(`/community/post/[postId]`);
  return NextResponse.json({ message: "SUCCESS" }, { status: 201 });
}

export async function DELETE(request: Request, { params: { postId } }: Params) {
  const session = await getServerSession(authOption);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!session)
    return NextResponse.json(
      { message: "로그인이 필요한 서비스 입니다." },
      { status: 401 }
    );
  if (!id)
    return NextResponse.json(
      { message: "id를 확인해주세요!." },
      { status: 400 }
    );

  const comment = await prisma.comment.delete({
    where: {
      id,
      postId,
      authorEmail: session.user!.email!,
    },
  });
  if (!comment)
    return NextResponse.json(
      { message: "id(commentId)가 존재하지 않습니다.!" },
      { status: 400 }
    );

  revalidatePath("/community/post/[postId]");
  return NextResponse.json({ message: "SUCCESS" }, { status: 202 });
}
