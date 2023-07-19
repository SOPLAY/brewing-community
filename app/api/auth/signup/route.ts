import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeHash } from "@/lib/bcrypt";

export async function POST(request: Request) {
  const body = await request.json();

  //전달 받은 값이 비어있는경우
  if (!(!!body.email && !!body.password))
    return new Response("email 혹은 password가 비어있습니다.", { status: 400 });

  //email이 존재 하는 경우 -> 409
  const checkUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (checkUser)
    return new Response("email이 이미 사용중입니다.", { status: 409 });

  // 비밀번호 암호화 bcrypt 로직 사용
  body.password = await makeHash(body.password);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });

  return new Response(JSON.stringify(user), {
    status: 201,
  });
}
