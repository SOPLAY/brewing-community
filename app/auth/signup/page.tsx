"use client";

import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/Button/Button";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/Input";
import { regx } from "@/lib/regx";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Page() {
  const session = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(
    async (data) =>
      await fetch("/api/auth/signup", {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok) {
            toast.success("회원가입에 성공했습니다!");
            router.push("/auth/signin");
          } else {
            toast.error(data.message);
          }
        })
        .catch((err) => console.error(err))
  );

  useEffect(() => {
    session.status === "authenticated" && router.push("/");
  }, [session]);

  return (
    <form onSubmit={onSubmit}>
      <div className="h-24 pt-4">
        <h1 className="text-3xl font-bold mb-2">회원가입</h1>
        <h3 className="text-md text-gray-500">계정 만들기</h3>
      </div>
      <div className="mt-6">
        <Button
          size="lg"
          variant="kakao"
          onClick={async (e) => {
            e.preventDefault();
            await signIn("kakao", { redirect: true, callbackUrl: "/" });
          }}
        >
          <RiKakaoTalkFill className="text-xl mr-2" />
          카카오 아이디로 시작하기
        </Button>
        <Button
          size="lg"
          variant="google"
          onClick={async (e) => {
            e.preventDefault();
            await signIn("google", {
              redirect: true,
              callbackUrl: "/",
            });
          }}
        >
          <FcGoogle className="mr-2" />
          구글 아이디로 시작하기
        </Button>
      </div>
      <span className="divider !gap-1">or</span>
      <div>
        <Input label={"Email"} errorText={errors?.email?.message as string}>
          <Input.TextField
            error={!!errors?.email}
            placeholder={"you@email.com"}
            onEnter={onSubmit}
            {...register("email", {
              required: "이메일은 필수 입니다.",
              pattern: {
                value: regx.email,
                message: "이메일을 확인해주세요!",
              },
            })}
          />
        </Input>
        <Input
          label={"Password"}
          errorText={errors?.password?.message as string}
        >
          <Input.TextField
            error={!!errors?.password}
            type="password"
            autoComplete="off"
            placeholder={"••••••••"}
            onEnter={onSubmit}
            {...register("password", {
              required: "비밀번호는 필수 입니다.",
              pattern: {
                value: regx.password,
                message: "영문자+특수문자조합 8자리 이상",
              },
            })}
          />
        </Input>
        <Input
          label={"Password Check"}
          errorText={errors?.passwordCheck?.message as string}
        >
          <Input.TextField
            error={!!errors?.passwordCheck}
            type="password"
            autoComplete="off"
            placeholder={"••••••••"}
            onEnter={onSubmit}
            {...register("passwordCheck", {
              required: "비밀번호가 일치하지 않습니다.",
              validate: (value) => {
                const { password } = getValues();
                return password === value || "비밀번호가 일치하지 않습니다.";
              },
            })}
          />
        </Input>
      </div>
      <div className="mt-8">
        <Button size={"lg"} variant="primary" type={"submit"}>
          회원가입
        </Button>
      </div>
      <span className="text-center block mt-8">
        계정이 있다면?
        <Link className="font-bold ml-1 underline" href={"/auth/signin"}>
          로그인
        </Link>
      </span>
    </form>
  );
}
