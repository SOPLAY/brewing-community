import { IComment } from "@/components/Comment";
import { BiSolidCoffeeBean, BiTimer } from "react-icons/bi";
import { MdCoffeeMaker } from "react-icons/md";

export type IRating = {
  id: string;
  createdAt: string;

  rating: string;
  authorId: string;
  authorEmail: string;
  recipeId: string;
};

export type IRecipe = {
  id: string;
  createdAt: string;

  title: string;
  roasting: keyof typeof roastingPoint;
  gram: number;
  dripper: string;
  totalTime: number;
  content: string;
  authorId: string;
  authorEmail: string;

  rating: IRating[];
  comments: IComment[];
};

interface Props extends IRecipe {}

export const roastingPoint = {
  low: {
    color: "text-[#C08B63]",
    text: "약배전",
  },
  medium: {
    color: "text-[#73431F]",
    text: "중배전",
  },
  high: {
    color: "text-[#3C1E08]",
    text: "강배전",
  },
};

export default function RecipeCard(props: Props) {
  const totalSeconds: number = JSON.parse(props.content).reduce(
    (acc: number, cur: { seconds: number }) => acc + cur.seconds,
    0
  );

  const [minutes, seconds] = [Math.floor(totalSeconds / 60), totalSeconds % 60];

  return (
    <div className="flex flex-col rounded-2xl text-lg p-5 shadow-md bg-base hover:scale-105 duration-300 ease-in-out cursor-pointer">
      <h3 className="text-center text-2xl font-bold mb-5 overflow-hidden text-ellipsis whitespace-nowrap">
        {props.title}
      </h3>
      <div className="flex flex-col gap-2 ">
        <div className="flex items-center gap-4">
          <BiSolidCoffeeBean
            className={`text-3xl ${roastingPoint[props.roasting]?.color}`}
          />
          <p>
            원두 {props.gram}g ({roastingPoint[props.roasting]?.text})
          </p>
        </div>
        <div className="flex items-center gap-4">
          <MdCoffeeMaker className="text-3xl text-amber-700" />
          <p>{!!props.dripper ? props.dripper : "모든 드리퍼"}</p>
        </div>
        <div className="flex items-center gap-4">
          <BiTimer className="text-3xl text-sky-600" />
          <p>
            약 {!!minutes && `${minutes}분`} {!!seconds && `${seconds}초`}{" "}
            소요됨
          </p>
        </div>
      </div>
    </div>
  );
}
