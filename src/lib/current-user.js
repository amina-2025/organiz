import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  const session = await verifySession(token);

  if (!session?.userId) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: String(session.userId) },
      select: { id: true, name: true, email: true, role: true },
    });
  } catch (error) {
    console.error("Current user lookup failed:", error);
    return null;
  }
}