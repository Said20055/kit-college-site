import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/dal";
import { LoginForm } from "../_components/LoginForm";

export const metadata: Metadata = { title: "Вход" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");

  return (
    <div className="w-full max-w-sm rounded-2xl border bg-surface p-7 shadow-md">
      <div className="mb-6 text-center">
        <p className="font-serif text-xl font-bold text-foreground">
          Вход в админпанель
        </p>
        <p className="mt-1 text-sm text-muted-fg">ГБПОУ РД «КИТ»</p>
      </div>
      <LoginForm />
    </div>
  );
}
