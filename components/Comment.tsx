"use client";

import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const contentDataExample = {
  id: "clkjwb",
  createdAt: "2023-07-26T15:44:17.626Z",
  updatedAt: "2023-07-26T15:41:52.229Z",
  published: true,
  content: "잘 보고 갑니다!",
  postId: "clkju",
  authorId: "clkh6",
  authorEmail: "test@email.com",
};

export type IComment = typeof contentDataExample;

type Props = {
  commentList: IComment[];
  postId: string;
};
export default function Comment({ commentList, postId }: Props) {
  const router = useRouter();
  const onCreateComment = async (text: string) => {
    const body = {
      content: text,
    };
    await axios
      .post(`/api/post/${postId}/comment`, body)
      .then(() => {
        router.refresh();
        toast.success("댓글이 작성되었습니다.");
      })
      .catch(() => toast.error("댓글 작성에 실패했습니다."));
  };
  return (
    <div className="mt-12">
      <div className="text-xl font-semibold mb-2">댓글</div>
      {!!commentList.length ? (
        commentList.map((v) => <CommentView {...v} key={`comment-${v.id}`} />)
      ) : (
        <div className="flex h-12 items-center justify-center">
          아직 댓글이 없습니다!
        </div>
      )}
      <CommentEditor onClick={onCreateComment} />
    </div>
  );
}

const CommentView = (props: IComment) => {
  const session = useSession();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const fixDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const onCorrection = async (text: string) => {
    const body = {
      id: props.id,
      content: text,
    };
    await axios
      .put(`/api/post/${props.postId}/comment`, body)
      .then(() => {
        router.refresh();
        toast.success("댓글이 작성되었습니다");
        setIsEdit(false);
      })
      .catch((res) => toast.error(res.response.body.message));
  };

  const onDelete = async () => {
    await axios
      .delete(`/api/post/${props.postId}/comment?id=${props.id}`)
      .then(() => {
        router.refresh();
        toast.success("댓글이 삭제되었습니다");
      })
      .catch(() => toast.error("댓글을 삭제하는 도중 오류가 발생했습니다."));
  };

  return (
    <div className="py-3 [&+&]:border-t">
      <div className="flex flex-wrap items-center justify-between">
        <div>
          <span className="font-semibold">{props.authorEmail}</span>
          <span className="ml-2 text-sm text-gray-500">
            {fixDate(props.createdAt)}
          </span>
        </div>
        {props.authorEmail === session.data?.user?.email && (
          <div className="gap-2">
            <button
              className={`px-2 py-0.5 
                hover:${isEdit ? "text-red-500" : "text-green-600"}
                duration-300`}
              onClick={() => setIsEdit((v) => !v)}
            >
              {isEdit ? "취소" : "수정"}
            </button>

            <button
              className="px-2 py-0.5 hover:text-red-500 duration-300"
              onClick={() => dialogRef.current?.showModal()}
            >
              삭제
            </button>
            <dialog className="modal" ref={dialogRef}>
              <form method="dialog" className="modal-box">
                <p className="">해당 댓글을 삭제하시겠습니까?</p>
                <div className="modal-action">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn px-6">취소</button>
                  <button
                    className="btn btn-error hover:bg-red-500 px-6"
                    onClick={onDelete}
                  >
                    삭제
                  </button>
                </div>
              </form>
            </dialog>
          </div>
        )}
      </div>
      {isEdit ? (
        <CommentEditor
          onClick={onCorrection}
          label="수정하기"
          initialState={props.content}
        />
      ) : (
        <pre>{props.content}</pre>
      )}
    </div>
  );
};

const CommentEditor = ({
  label = "작성하기",
  initialState = "",
  onClick,
}: {
  initialState?: string;
  onClick: (text: string) => void;
  label?: string;
}) => {
  const [text, setText] = useState(initialState);
  const session = useSession();
  return (
    <div className="flex gap-2 h-14 items-center relative rounded overflow-hidden">
      {session.status !== "authenticated" && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/5 backdrop-blur flex items-center justify-center font-bold text-lg">
          로그인 후 사용 가능합니다!
        </div>
      )}
      <textarea
        className="resize-none w-full h-full border-gray-400 border rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="bg-green-600 w-32 h-14 rounded text-white font-bold hover:bg-green-500 duration-300"
        onClick={() => {
          onClick(text);
          setText(initialState);
        }}
      >
        작성하기
      </button>
    </div>
  );
};
