import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { baseURL } from "@/lib/axios";
import { redirect } from "next/navigation";
import PostList from "@/components/Post/PostList";
import RecipeList from "@/components/recipe/RecipeList";
import divder from "@/components/Divder";
import Link from "next/link";
import {
  BiArrowFromLeft,
  BiArrowToLeft,
  BiSolidArrowToLeft,
  BiSolidRightArrow,
} from "react-icons/bi";

export default async function Page() {
  const session = await getServerSession(authOption);
  if (!session) redirect("/");

  const email = session?.user?.email || "이메일 정보 로딩 실페했습니다.";

  const isCreidential = !session?.user?.image;
  const { postList } = await fetch(
    `${baseURL}/api/post?pageSize=5&email=${session?.user?.email}`,
    {
      cache: "no-cache",
    }
  ).then(async (res) => await res.json());

  const { recipeList } = await fetch(
    `${baseURL}/api/recipe?pageSize=4&email=${session?.user?.email}`,
    {
      cache: "no-cache",
    }
  ).then(async (res) => await res.json());

  return (
    <div className="p-[30px]">
      <h2 className="text-2xl font-bold mb-5">마이페이지</h2>
      <h3 className="text-xl font-semibold mb-10">
        {email}{" "}
        <span className="ml-2 text-sm text-gray-500">
          (현재 접속중인 이메일)
        </span>
      </h3>
      <Section type={"게시글"} email={email}>
        {!!postList.length ? (
          <div>
            <PostList postList={postList} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-44 text-xl font-semibold">
            아직 작성된 게시글이 없습니다!
          </div>
        )}
      </Section>
      <Section type="레시피" email={email}>
        {!!recipeList.length ? (
          <div>
            <RecipeList recipeList={recipeList} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-44 text-xl font-semibold">
            아직 작성된 레시피가 없습니다!
          </div>
        )}
      </Section>
    </div>
  );
}

const Section = (props: {
  children: React.ReactNode;
  type: "레시피" | "게시글";
  email: string;
}) => (
  <div className="[&+&]:mt-10">
    <div className="flex justify-between items-center text-lg font-semibold mb-4">
      <h4>최근에 작성한 {props.type}</h4>
      <Link
        href={`/${props.type === "게시글" ? "community" : "recipe"}?email=${
          props.email
        }`}
        className="flex items-center text-[16px] border rounded py-1 px-2 hover:bg-gray-300 duration-300"
      >
        {props.type} 리스트 보러가기
        <BiSolidRightArrow />
      </Link>
    </div>
    {props.children}
  </div>
);
