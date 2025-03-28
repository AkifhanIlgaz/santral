"use client";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const user = auth?.user;

  useEffect(() => {
    if (user) {
      router.push("/giris");
    }
  }, [user, router]);

  return (
    <section className="flex flex-col w-full h-full items-center justify-center gap-8 ">
      {children}
    </section>
  );
}
