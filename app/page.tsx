import { baseURL } from "@/lib/axios";
import PostList from "@/components/Post/PostList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "브루잉 커뮤니티",
  description:
    "브루잉 커뮤니티를 통해 하나뿐인 나만의 레시피를 작성해서 공유해보세요!",
};
export const revalidate = 10;
export default async function Home() {
  const postData = await fetch(`${baseURL}/api/post?pageSize=5`).then(
    async (res) => await res.json()
  );
  return (
    <main>
      {!!postData && (
        <section className="p-[30px]">
          <div className="text-2xl font-bold">최근 추가된 커뮤니티 게시글</div>
          <PostList postList={postData.postList} />
        </section>
      )}
    </main>
  );
}
