// app/api/login/route.js

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request) {
  const body = await request.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, password } = result.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.password))) {
    return NextResponse.json(
      { error: "L'adresse e-mail ou le mot de passe est incorrect." },
      { status: 401 }
    );
  }

  const token = await createSession(user.id, user.email);
  const response = NextResponse.json({
    success: true,
    redirect: user.role === "ADMIN" ? "/admin" : "/dashboard",
  });

  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}