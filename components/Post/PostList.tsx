"use client";

import PostItem from "@/components/Post/PostItem";

const postExampleData = {
  id: "clkfdzhfi0057cpbh4plqb04fasdf",
  createdAt: "2023-07-23T11:59:35.934Z",
  title: "자유게시판 테스트",
  category: "free",
  views: 0,
  authorEmail: "test@email.com",
};

export type IPostDescription = typeof postExampleData;

interface Props {
  postList: IPostDescription[];
}
export default function PostList({ postList }: Props) {
  return (
    <div>
      {postList?.map((postData) => (
        <PostItem {...postData} key={postData.id} />
      ))}
    </div>
  );
}
