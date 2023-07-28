"use client";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer as ToastViewer } from "@toast-ui/react-editor";

type Props = {
  content: string;
};
export default function Viewer({ content }: Props) {
  return <ToastViewer initialValue={content || "뷰어 로딩에 실패했습니다!"} />;
}
