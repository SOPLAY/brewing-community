import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
