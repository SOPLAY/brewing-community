type Props = {
  children: React.ReactElement;
};
export default function Layout({ children }: Props) {
  return <div className="p-[30px]">{children}</div>;
}
