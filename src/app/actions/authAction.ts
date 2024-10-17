"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export const emailLogin = async (formData: any) => {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signInWithPassword(formData);
    if (error) {
      throw error.message;
    }
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const signOut = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/auth/signin");
};

export const checkUserExistance = async (payload: any) => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("email_id", payload)
      .eq("isAdmin", true)
      .select("id, email_id")
      .single()

    if (error || !data) {
      throw "User not found";
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};
