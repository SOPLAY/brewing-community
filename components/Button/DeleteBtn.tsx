"use client";
import { MdDelete } from "react-icons/md";
import axios from "@/lib/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type Props = {
  postId: string;
  type?: "post" | "recipe";
};
export default function DeleteBtn({ postId, type = "post" }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const onDelete = async () => {
    await axios
      .delete(`/api/${type}/${postId}`)
      .then(() => {
        router.replace("/");
        router.refresh();
        toast.success("게시글 삭제 되었습니다.");
        router.push(`/${type === "post" ? "community" : "recipe"}`);
        router.refresh();
      })
      .catch(() => toast.error("게시글 삭제 도중 오류가 발생했습니다."));
  };

  return (
    <>
      <button
        className="px-2 hover:text-red-500 duration-300"
        onClick={() => dialogRef.current?.showModal()}
      >
        <MdDelete />
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
    </>
  );
}
