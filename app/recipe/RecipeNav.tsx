"use client";

import { HiOutlinePencilAlt } from "react-icons/hi";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function RecipeNav() {
  const session = useSession();

  return (
    <div className="flex items-center justify-between text-2xl mb-6 mt-2">
      <h2 className="font-semibold">전체 레시피</h2>
      {session.status === "authenticated" && (
        <Link className="py-1 px-5" href={"/recipe/new"}>
          <HiOutlinePencilAlt />
        </Link>
      )}
    </div>
  );
}
