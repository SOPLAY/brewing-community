"use client";
import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input";
import Link from "next/link";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { regx } from "@/lib/regx";

// export const metadata: Metadata = {
//   title: "브루잉-로그인",
//   description: "브루잉 커뮤니티 로그인",
// };

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = handleSubmit(
    async (data) =>
      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/",
        ...data,
      })
  );

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
          onClick={(e) => {
            e.preventDefault();
            signIn("kakao", { redirect: true, callbackUrl: "/" });
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
              pattern: { value: regx.email, message: "이메일을 확인해주세요!" },
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
        <Link className="font-bold ml-1" href={"/auth/signup"}>
          회원가입
        </Link>
      </span>
    </form>
  );
}
