import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await auth();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await auth();
  if (!session) redirect("/login");
  if ((session.user as { role: string }).role !== "ADMIN") redirect("/");
  return session;
}
