import Input from "@/app/community/search/Input";
import { baseURL } from "@/lib/axios";
import PostList from "@/components/Post/PostList";

const getData = async (query: string) => {
  const res = await fetch(`${baseURL}/api/post/search?search=${query}`);
  return await res.json();
};
type Props = { searchParams: { q: string } };
export default async function Page({ searchParams: { q } }: Props) {
  const data = !!q && (await getData(q));
  return (
    <div className="p-[30px]">
      <div className="py-2 flex justify-between items-center text-xl">
        <div>
          <span className="font-bold text-2xl mr-2">"{q}"</span>검색 결과
          입니다.
        </div>
        <Input />
      </div>
      {!!data ? (
        <PostList postList={data.postList} />
      ) : (
        <div className="text-2xl text-center py-10">
          검색결과가 존재하지 않습니다
        </div>
      )}
    </div>
  );
}
