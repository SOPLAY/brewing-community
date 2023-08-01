import { baseURL } from "@/lib/axios";
import PostList from "@/components/Post/PostList";
import { Metadata } from "next";
import Bg1 from "@/public/assets/sign-bg.webp";
import Image from "next/image";
import Link from "next/link";
import RecipeList from "@/components/recipe/RecipeList";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cache } from "react";

const getPostData = async () =>
  await prisma.post.findMany({
    take: 5,
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const getRecipeData = async () =>
  await prisma.recipe.findMany({
    take: 4,
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

export const metadata: Metadata = {
  title: "브루잉 커뮤니티",
  description:
    "브루잉 커뮤니티를 통해 하나뿐인 나만의 레시피를 작성해서 공유해보세요!",
};
export const revalidate = 10;
export default async function Home() {
  const postData = (await getPostData()) as any;
  const recipeData = (await getRecipeData()) as any;

  return (
    <main>
      <div className="h-96 w-full relative">
        <Image
          src={Bg1}
          alt={"브루잉 이미지"}
          placeholder={"blur"}
          className="object-cover h-full"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
        <div className="absolute top-0 left-0 w-full h-full z-10">
          <div className="flex flex-col justify-center items-center h-full text-white text-2xl font-bold gap-2">
            <p>브루잉 커뮤니티를 통해</p>
            <p>나만의 부르잉 레시피를 만들어 보세요!</p>
            <Link
              href={"/recipe/new"}
              className="btn btn-primary text-lg font-bold mt-5"
            >
              레시피 만들러 가기
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[30px] my-[30px]">
        <section className="px-[30px]">
          <div className="text-2xl font-bold mb-4">최근 추가된 레피시</div>
          <RecipeList recipeList={recipeData} />
        </section>
        <section className="px-[30px]">
          <div className="text-2xl font-bold mb-4">
            최근 추가된 커뮤니티 게시글
          </div>
          <PostList postList={postData} />
        </section>
      </div>
    </main>
  );
}
