// @ts-nocheck
"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchTermsCondition() {
  const supabase = createClient();

  try {
    let query = supabase
      .from("policies")
      .select("*")
      .select("id, terms_and_conditions, terms_and_conditions_html");

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createTermsCondition(payload: any) {
  const supabase = createClient();
  const { text, html } = payload;

  try {
    let query = supabase.from("policies").insert({
      terms_and_conditions: text,
      terms_and_conditions_html: html,
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function updateTermsCondition(payload: any) {
  const supabase = createClient();
  const { id, text, html } = payload;

  try {
    let query = supabase
      .from("policies")
      .update({
        terms_and_conditions: text,
        terms_and_conditions_html: html,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchPrivacyPolicy() {
  const supabase = createClient();

  try {
    let query = supabase
      .from("policies")
      .select("*")
      .select("id, privacy_policy, privacy_policy_html");

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createPrivacyPolicy(payload: any) {
  const supabase = createClient();
  const { text, html } = payload;

  try {
    let query = supabase.from("policies").insert({
      privacy_policy: text,
      privacy_policy_html: html,
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function updatePrivacyPolicy(payload: any) {
  const supabase = createClient();
  const { id, text, html } = payload;

  try {
    let query = supabase
      .from("policies")
      .update({
        privacy_policy: text,
        privacy_policy_html: html,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}
