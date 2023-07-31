"use client";

import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import { toast } from "react-toastify";
import { BiSolidCoffeeBean } from "react-icons/bi";
import { Button } from "@/components/Button/Button";
import { roastingPoint as roastingPointData } from "@/components/Recipe/RecipeCard";
import axios from "@/lib/axios";
import Divider from "@/components/Divder";

const roastingPoint = roastingPointData;
type IRoastingKey = keyof typeof roastingPoint;
const roastingKeys = Object.keys(roastingPoint) as IRoastingKey[];

type SectionProps = {
  children: React.ReactNode;
  title: string;
};
const Section = ({ children, title }: SectionProps) => (
  <div className="min-w-[160px]">
    <h4 className="mb-6 text-xl font-semibold">{title}</h4>
    <div className="pl-3">{children}</div>
  </div>
);

const NumField = (props: {
  title?: string;
  name: string;
  defaultValue: number;
  unitText: string;
}) => (
  <div className="[&+&]:mt-3">
    {!!props.title && <p className="font-semibold">{props.title}</p>}
    <div className="flex items-center text-lg ">
      <input
        type="number"
        name={props.name}
        className="input input-bordered w-20"
        defaultValue={props.defaultValue}
      />
      <p className="ml-2 text-xl font-bold">{props.unitText}</p>
    </div>
  </div>
);

type Props = {
  initValue?: {
    id: string;
    roasting: IRoastingKey;
    stepCnt: number;
    title: string;
    gram: number;
    dripper: string;
    degrees: number;
    content: {
      step: number;
      water: number;
      seconds: number;
    }[];
  };
  submitUrl: string;
  type: "create" | "edit";
};
export default function RecipeEditor({ initValue, submitUrl, type }: Props) {
  const router = useRouter();

  const [roasting, setRoasting] = useState<IRoastingKey>(
    initValue?.roasting || "low"
  );
  const [stepCnt, setStepCnt] = useState(initValue?.stepCnt || 1);
  const formRef = useRef<HTMLFormElement | null>(null);

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    const body = {
      roasting,
      stepCnt,
      title: formData.get("title")!,
      gram: +formData.get("gram")!,
      dripper: formData.get("dripper")!,
      degrees: +formData.get("degrees")!,
      content: JSON.stringify([
        ...Array.from({ length: stepCnt + 1 }).map((_, i) => ({
          water: +formData.get(`${i}_water`)!,
          seconds: +formData.get(`${i}_seconds`)!,
        })),
      ]),
    };
    if (!body.title || !body.gram || !body.degrees)
      return toast.error("제목, 원두 투입량 혹은 물 온도를 확인해주세요!");
    await axios({
      method: type === "create" ? "post" : "put",
      url: submitUrl,
      data: body,
    })
      .then(() => {
        toast.success("레시피를 생성했습니다.");
        router.push(`/recipe${type === "edit" ? `/${initValue?.id}` : ""}`);
        router.refresh();
      })
      .catch(() =>
        toast.error("레시피 생성중 알 수 없는 오류가 발생했습니다.")
      );
  };

  return (
    <form className="px-[50px] py-[40px]" onSubmit={onFormSubmit} ref={formRef}>
      <input
        type="text"
        name="title"
        placeholder="제목을 입력하세요!"
        defaultValue={initValue?.title || ""}
        className="placeholder:text-gray-500 text-[40px] font-bold outline-none w-full"
      />
      <div className="w-[72px] h-[10px] bg-[#111827] mt-4 mb-[21px]" />
      <Section title="배전도 선택">
        <div className="flex gap-5">
          {roastingKeys.map((key) => (
            <div
              key={key}
              onClick={() => setRoasting(key)}
              className={`flex flex-col justify-center items-center border p-3 rounded-xl cursor-pointer duration-300 ${
                key === roasting ? "bg-slate-300" : "bg-white"
              }`}
            >
              <BiSolidCoffeeBean
                className={`text-3xl ${roastingPoint[key].color}`}
              />
              <p>{roastingPoint[key].text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Divider />
      <Section title="원두 투입량">
        <NumField
          defaultValue={initValue?.gram || 20}
          unitText={"g"}
          name="gram"
        />
      </Section>
      <Divider />
      <Section title="추천 드리퍼">
        <div className="flex items-center text-lg flex-wrap">
          <input
            type="text"
            name="dripper"
            defaultValue={initValue?.dripper || ""}
            className="input input-bordered mr-3"
          />
          <p className=" text-gray-500">(없으시면 공백으로 하시면 됩니다!)</p>
        </div>
      </Section>
      <Divider />
      <Section title="적정 물온도">
        <NumField
          defaultValue={initValue?.degrees || 85}
          unitText={"°C"}
          name="degrees"
        />
      </Section>
      <Divider />
      <Section title="원두 뜸들이기">
        <NumField
          defaultValue={initValue?.content[0].water || 40}
          unitText={"g"}
          name="0_water"
          title="물 투입량"
        />
        <NumField
          name={"0_seconds"}
          defaultValue={initValue?.content[0].seconds || 60}
          unitText={"초"}
          title={"뜸들이기 시간"}
        />
      </Section>
      <Divider />
      <Section title="추출 횟수 (1~5 번)">
        <div className="max-w-xl">
          <input
            type="range"
            min={1}
            max={5}
            defaultValue={stepCnt}
            className="range"
            step="1"
            onChange={(e) => setStepCnt(+e.target.value)}
          />
          <div className="w-full flex justify-between text-sm px-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <span key={`추출_${num}`}>{num} 회</span>
            ))}
          </div>
        </div>
      </Section>
      <Divider />
      {Array.from({ length: stepCnt }).map((_, i) => (
        <Fragment key={`추출_${i}`}>
          <Section title={`추출 ${i + 1} 단계`}>
            <NumField
              title="물 투입량"
              name={`${i + 1}_water`}
              defaultValue={initValue?.content[i + 1]?.water || 0}
              unitText={"g"}
            />
            <NumField
              title="추출 및 대기시간"
              name={`${i + 1}_seconds`}
              defaultValue={initValue?.content[i + 1]?.seconds || 0}
              unitText={"초"}
            />
          </Section>
          <Divider />
        </Fragment>
      ))}
      <Button type={"submit"} size={"lg"} variant="primary">
        게시하기
      </Button>
    </form>
  );
}
