import { baseURL } from "@/lib/axios";
import dynamic from "next/dynamic";
import { HiOutlinePencilAlt } from "react-icons/hi";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import Comment from "@/components/Comment";
import DeleteBtn from "@/components/Button/DeleteBtn";

const Editor = dynamic(() => import("@/app/community/new/Editor"), {
  ssr: false,
});
const Viewer = dynamic(() => import("./Viewer"), {
  ssr: false,
  loading: () => (
    <div className="">
      <div className="mt-4 flex flex-col gap-2">
        <div className="h-4 w-2/3 bg-gray-300 animate-pulse" />
        <div className="h-4 w-1/4 bg-gray-300 animate-pulse" />
        <div className="h-64 w-full bg-gray-300 animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-300 animate-pulse" />
      </div>
    </div>
  ),
});

const getPost = async (id: string) =>
  await fetch(`${baseURL}/api/post/${id}`, { cache: "force-cache" }).then(
    async (res) => await res.json()
  );

//TODO views의 업데이트는 post를 불러오는 단계에서 업데이트 하도록 변경 예정
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
    title: `${post.title} - 브루잉 커뮤니티`,
    description: `브루잉 커뮤니티 ${post.title} 게시글 입니다.`,
  };
}

export default async function Page({ params, searchParams: { mode } }: Props) {
  const session = await getServerSession(authOption);
  const data = await getPost(params.postId);
  const isAuthor = data.authorEmail === session?.user?.email;

  if (data) {
    updateViews(params.postId);
  }

  if (mode === "edit" && !isAuthor) {
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
        <Link href={`/community?category=${data.category}`}>
          <span>{data.category === "free" ? "자유" : "브루잉"}</span>
        </Link>
        {isAuthor && (
          <div className="flex items-center text-2xl">
            <Link
              href={`?mode=edit`}
              className="px-2 hover:text-green-600 duration-300"
            >
              <HiOutlinePencilAlt />
            </Link>
            <DeleteBtn postId={params.postId} />
          </div>
        )}
      </h3>
      <h2 className="text-[40px] font-bold w-full">{data.title}</h2>
      <Viewer content={data.content} />
      <Comment commentList={data.comments} postId={params.postId} />
    </div>
  );
}
