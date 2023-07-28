import { Metadata } from "next";

type Props = {
  children: React.ReactElement;
};

export const metadata: Metadata = {
  title: "커뮤니티 게시판",
  description: "커뮤니티 게시판 입니다.",
};
export default function Layout({ children }: Props) {
  return <div className="px-[10px]">{children}</div>;
}
