import { baseURL } from "@/lib/axios";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/app/community/new/Editor"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center text-2xl h-[870px]">
      에디터 로딩중 <span className="loading loading-dots loading-lg ml-5" />
    </div>
  ),
});

const getPost = async (id: string) =>
  await fetch(`${baseURL}/api/post/${id}`, {
    cache: "no-cache",
  }).then(async (res) => await res.json());

type Props = {
  params: {
    postId: string;
  };
};
export default async function Page({ params: { postId } }: Props) {
  const data = await getPost(postId);

  return (
    <div className="px-[20px] pt-3">
      <Editor initailData={data} type="edit" />
    </div>
  );
}
