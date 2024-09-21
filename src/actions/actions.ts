"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function doSocialLogin(formData) {
  const action = formData.get("action");
  await signIn(action, { redirectTo: "/" });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  revalidatePath("/");

  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return response;
  } catch (error) {
    // console.log(err);
    if (error instanceof AuthError) {
      return { message: error.cause?.err?.message, ok: false };
    }
    return { error: "error 500" };
  }
}
