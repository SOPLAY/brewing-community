"use client";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input";
import Link from "next/link";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { regx } from "@/lib/regx";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();
  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(
    async (data) =>
      await signIn("credentials", {
        redirect: false,
        ...data,
      }).then((res) => {
        res?.error && toast.error("이메일/비밀번호를 확인해 주세요!");
      })
  );

  useEffect(() => {
    session.status === "authenticated" && router.push("/");
  }, [session]);

  return (
    <form onSubmit={onSubmit}>
      <div className="h-24 pt-4">
        <h1 className="text-3xl font-bold mb-2">로그인</h1>
        <h3 className="text-md text-gray-500">회원 로그인</h3>
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
          카카오 아이디로 로그인
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
          구글 아이디로 로그인
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
            placeholder={"••••••••"}
            autoComplete="off"
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
      </div>
      <div className="mt-8">
        <Button size={"lg"} variant="primary" type={"submit"}>
          로그인
        </Button>
      </div>
      <span className="text-center block mt-8">
        계정이 없다면?
        <Link className="font-bold ml-1 underline" href={"/auth/signup"}>
          회원가입
        </Link>
      </span>
    </form>
  );
}
