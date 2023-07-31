import { baseURL } from "@/lib/axios";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/api/auth/[...nextauth]/route";
import { HiOutlinePencilAlt } from "react-icons/hi";
import DeleteBtn from "@/components/Button/DeleteBtn";
import { BiSolidCoffeeBean, BiTimer } from "react-icons/bi";
import { roastingPoint } from "@/components/Recipe/RecipeCard";
import { MdCoffeeMaker } from "react-icons/md";
import Divider from "@/components/Divder";
import { Fragment } from "react";

const getData = async (id: string) =>
  await fetch(`${baseURL}/api/recipe/${id}`, {
    next: { revalidate: 10, tags: ["recipe"] },
  }).then(async (res) => await res.json());

export const generateMetadata = async ({ params: { recipeId } }: Props) => {
  const data = await getData(recipeId);

  return {
    title: `${data.title} - 브루잉 레시피`,
    description: `${data.title} 레시피로 추출하는 브루잉을 즐겨보세요!`,
  };
};
const MiniCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col justify-center items-center h-28 min-w-[118px] border rounded-xl bg-base [&>p]:font-bold [&>p]:overflow-hidden [&>p]:text-ellipsis">
    {children}
  </div>
);

type Props = {
  params: {
    recipeId: string;
  };
};

export default async function Page({ params: { recipeId } }: Props) {
  const session = await getServerSession(authOption);
  const data = await getData(recipeId);
  const isAuthor = data.authorEmail === session?.user?.email;
  const totalSeconds: number = JSON.parse(data.content).reduce(
    (acc: number, cur: { seconds: number }) => acc + cur.seconds,
    0
  );
  const [minutes, seconds] = [Math.floor(totalSeconds / 60), totalSeconds % 60];
  const content: { water: string; seconds: number }[] = JSON.parse(
    data.content
  );
  const steamingData = content[0];
  const mainContentData = content.slice(1, data.stepCnt + 1);

  const roastingState =
    roastingPoint[data.roasting as keyof typeof roastingPoint];

  return (
    <main className="p-[30px]">
      <h2 className="text-gray-500 font-semibold text-xl flex justify-between">
        <Link href={`/recipe`}>
          <span>{"레시피"}</span>
        </Link>

        {isAuthor && (
          <div className="flex items-center text-2xl">
            <Link
              href={`/recipe/${recipeId}/edit`}
              className="px-2 hover:text-green-600 duration-300"
            >
              <HiOutlinePencilAlt />
            </Link>
            <DeleteBtn postId={recipeId} type={"recipe"} />
          </div>
        )}
      </h2>
      <h2 className="text-[40px] font-bold w-full">{data.title}</h2>
      <div className="flex justify-center mt-10 gap-4">
        <MiniCard>
          <BiSolidCoffeeBean className={`text-6xl ${roastingState.color}`} />
          <p>
            {roastingState.text} {data.gram}g
          </p>
        </MiniCard>
        <MiniCard>
          <MdCoffeeMaker className="text-6xl text-amber-700" />
          <p>{data.dripper || "모든 드리퍼"}</p>
        </MiniCard>
        <MiniCard>
          <BiTimer className="text-6xl text-sky-600" />
          <p>
            약 {!!minutes && `${minutes}분`} {!!seconds && `${seconds}초`}
          </p>
        </MiniCard>
      </div>
      <div className="my-10 prose ">
        <h2>1.사전 준비</h2>
        <h3>1-1. 원두 와 물</h3>
        <p>
          <b>{roastingState.text}</b> 원두 <b>{data.gram}g</b>을 분쇄하여
          준비하고, 물을 <b>{data.degrees}°C</b>에 맞춰 준비합니다.
        </p>
        <h3>1-3. 드리퍼</h3>
        <p>
          <b>{data.dripper || "드리퍼"}</b>에 <b>여과지</b>를 두고 <b>린싱</b>을
          해줍니다.
        </p>
        <Divider />
        <h2>2. 뜸들이기</h2>
        <p>
          <b>분쇄한 원두 {data.gram}g</b>을 모두 <b>드리퍼</b>에 담은 후{" "}
          <b>평탄화</b>를 진행합니다.
        </p>
        <p>
          이후 물 <b>{steamingData.water}g</b>을 부어{" "}
          <b>{steamingData.seconds}초</b>동안 뜸들이기를 진행합니다.
        </p>
        <Divider />
        <h2>3. 추출</h2>
        {mainContentData.map((content, i) => (
          <Fragment key={`추출_${i + 1}_단계`}>
            <h3>
              3-{i + 1}. {i + 1}단계 추출
            </h3>
            <p>
              이전 단계 이후 <b>{content.water}g</b>의 물을 부어{" "}
              <b>{content.seconds}초</b>동안 {i + 1}단계 추출을 진행합니다.
            </p>
          </Fragment>
        ))}
        <Divider />
        <h2>4. 추출 완료</h2>
        <p>
          <b>추출 시간이 경과후 드리퍼는 제거</b>해 주시고 기호에 따라 물에
          희석해서 드시면 됩니다.!
        </p>
      </div>
    </main>
  );
}
