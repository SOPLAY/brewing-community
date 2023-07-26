"use client";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor as ToastEditor } from "@toast-ui/react-editor";
import { useCallback, useRef, useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";
import { toast } from "react-toastify";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

const categoryList = [
  {
    category: "free",
    name: "자유 게시판",
  },
  {
    category: "brewing",
    name: "브루잉 게시판",
  },
];

type Props = {
  initailData?: {
    title?: string;
    content?: string;
    category?: "free" | "brewing" | "";
    id?: string;
  };
  type?: "create" | "edit";
};
export default function Editor({ initailData, type = "create" }: Props) {
  const router = useRouter();
  const editorRef = useRef(null);
  const [title, setTitle] = useState(initailData?.title || "");
  const [category, setCategory] = useState(initailData?.category || "");

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const onSubmitPost = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const content = (editorRef.current as any).getInstance().getHTML();
      if (!(title && content && category)) {
        toast.error("제목, 카테고리 혹은 내용을 확인해주세요!");
        return null;
      }
      const body = {
        title,
        content,
        category,
      };

      if (type === "create") {
        await axios
          .post("/api/post", body)
          .then(async (res) => {
            const { id } = res.data;
            router.push(`/community/post/${id}`);
          })
          .catch((err) => {
            toast.error("게시글을 작성하는도중 오류가 발생했습니다.");
          });
      } else {
        await axios
          .put(`/api/post/${initailData?.id}`, body)
          .then(async (res) => {
            const { id } = res.data;
            router.push(`?mode=viewer`);
            router.refresh();
          })
          .catch((err) => {
            toast.error("게시글을 작성하는도중 오류가 발생했습니다.");
          });
      }
    },
    [title, category, type]
  );

  return (
    <div className="p-[10px]">
      <input
        type="text"
        placeholder="제목을 입력하세요!"
        className="placeholder:text-gray-500 text-[40px] font-bold outline-none w-full"
        onChange={onInputChange}
        value={title}
      />
      <div className="w-[72px] h-[10px] bg-[#111827] mt-4 mb-[21px]" />
      <details className="dropdown relative mb-[32px]">
        <summary className="btn btn-ghost hover:bg-transparent text-gray-700/70 text-[20px] font-bold p-0">
          {category
            ? categoryList.find((v) => v.category === category)?.name
            : "카테고리를 선택하세요"}
          <BiSolidDownArrow />
        </summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
          {categoryList.map(({ category, name }) => (
            <li
              key={`regist-${category}`}
              className="p-2 btn-ghost cursor-pointer rounded"
              onClick={() => setCategory(category)}
            >
              {name}
            </li>
          ))}
        </ul>
      </details>
      <ToastEditor
        height="600px"
        initialEditType="wysiwyg"
        placeholder="글을 작성해 주세요!"
        initialValue={initailData?.content || ""}
        ref={editorRef}
      />
      <div className="flex justify-end mt-4">
        <button
          className="btn bg-green-600 text-base px-10 hover:bg-green-800"
          onClick={onSubmitPost}
        >
          {type === "create" ? "게시하기" : "수정하기"}
        </button>
      </div>
    </div>
  );
}
