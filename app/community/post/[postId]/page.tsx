import { baseURL } from "@/lib/axios";
import dynamic from "next/dynamic";
import { HiOutlinePencilAlt } from "react-icons/hi";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";

const Editor = dynamic(() => import("@/app/community/regist/Editor"), {
  ssr: false,
});
const Viewer = dynamic(() => import("./Viewer"), { ssr: false });
export const revalidate = 60;
const getPost = async (id: string) =>
  await fetch(`${baseURL}/api/post/${id}`).then(
    async (res) => await res.json()
  );

const updateViews = async (id: string) =>
  await fetch(`${baseURL}/api/post/${id}/views`, { cache: "no-cache" });

type Props = {
  params: {
    postId: string;
  };
  searchParams: {
    mode?: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.postId);
  return {
    title: `브루잉 - ${post.title}`,
    description: `브루잉 커뮤니티 ${post.title} 게시글 입니다.`,
  };
}

export default async function Page({ params, searchParams: { mode } }: Props) {
  const session = await getServerSession(authOption);
  const data = await getPost(params.postId);
  if (data) {
    updateViews(params.postId);
  }

  if (mode === "edit" && data.authorEmail !== session?.user?.email) {
    return (
      <div className="flex justify-center items-center mt-14">
        해당 게시글을 수정할 권한이 없습니다.
      </div>
    );
  }

  if (mode === "edit") {
    return <Editor initailData={data} type="edit" />;
  }

  return (
    <div className="p-[30px]">
      <h3 className="text-gray-500 font-semibold text-xl flex justify-between">
        <span>{data.category === "free" ? "자유" : "브루잉"}</span>
        <Link href={`?mode=edit`}>
          <HiOutlinePencilAlt className="text-2xl" />
        </Link>
      </h3>
      <h2 className="text-[40px] font-bold w-full">{data.title}</h2>
      <Viewer content={data.content} />
    </div>
  );
}
