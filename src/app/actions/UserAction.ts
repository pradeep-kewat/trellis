// @ts-nocheck

"use server";

import { createClient } from "@/utils/supabase/server";
import { FunctionRegion } from "@supabase/supabase-js";
import moment from "moment";

export async function fetchUsersCount(payload: any) {
  const { searchQuery, filters } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("isAdmin", false);

    if (searchQuery !== "") {
      query = query.or(
        `username.ilike.%${searchQuery}%, email_id.ilike.%${searchQuery}%`
      );
    }

    if (filters?.length > 0) {
      filters?.forEach((item: any) => {
        if (item?.column && item?.value) {
          if (item?.columnType === "Enum") {
            query = query.eq(item.column, item.value);
          } else {
            query = query.ilike(item.column, `%${item.value}%`);
          }
        }
      });
    }

    const { count, error } = await query;

    if (error) throw error.message;

    return { success: true, count };
  } catch (error) {
    return { success: false, error, count: 0 };
  }
}

export async function fetchUsers(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("users")
      .select(
        "id, username, email_id, age_group, profession, country(name), status, created_at"
      )
      .eq("isAdmin", false)
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(
        `username.ilike.%${searchQuery}%, email_id.ilike.%${searchQuery}%`
      );
    }

    if (sortField !== "") {
      query = query.order(sortField, {
        ascending: sortOrder === "asc" ? true : false,
      });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (filters?.length > 0) {
      filters?.forEach((item: any) => {
        if (item?.column && item?.value) {
          if (item?.columnType === "Enum") {
            query = query.eq(item.column, item.value);
          } else {
            query = query.ilike(item.column, `%${item.value}%`);
          }
        }
      });
    }

    const { data, error } = await query;

    if (error) throw error.message;

    data.forEach((item) => {
      item.interestsName = item.interests?.name;
      item.interestsId = item.interests?.id;
      item.country = item.country?.name;
      delete item?.interests;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchUserPostsCount(payload: any) {
  const { searchQuery, filters, userId } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .not("community_id", "is", null)
      .not("interests", "is", null)
      .eq("user_id", userId);

    if (searchQuery !== "") {
      query = query.or(`title.ilike.%${searchQuery}%`);
    }

    if (filters?.length > 0) {
      filters?.forEach((item: any) => {
        if (item?.column && item?.value) {
          if (item?.columnType === "Enum") {
            query = query.eq(item.column, item.value);
          } else {
            query = query.ilike(item.column, `%${item.value}%`);
          }
        }
      });
    }

    const { count, error } = await query;

    if (error) throw error.message;

    return { success: true, count };
  } catch (error) {
    return { success: false, error, count: 0 };
  }
}

export async function fetchUserPosts(payload: any) {
  const supabase = createClient();

  const {
    searchQuery,
    startIndex,
    endIndex,
    sortOrder,
    sortField,
    filters,
    userId,
  } = payload;

  try {
    let query = supabase
      .from("posts")
      .select(
        "id, title, community_id!inner(name), status, interests!inner(id, name), body_html, body_text, created_at"
      )
      .eq("user_id", userId)
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(`title.ilike.%${searchQuery}%`);
    }

    if (sortField !== "") {
      query = query.order(sortField, {
        ascending: sortOrder === "asc" ? true : false,
      });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    if (filters?.length > 0) {
      filters?.forEach((item: any) => {
        if (item?.column && item?.value) {
          if (item?.columnType === "Enum") {
            query = query.eq(item.column, item.value);
          } else {
            query = query.ilike(item.column, `%${item.value}%`);
          }
        }
      });
    }

    const { data, error } = await query;

    if (error) throw error.message;

    data.forEach((item) => {
      item.interestsName = item.interests?.name;
      item.interestsId = item.interests?.id;
      item.communityName = item.community_id?.name;
      delete item?.interests;
      delete item?.user_id;
      delete item?.community_id;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchAllUsers() {
  const supabase = createClient();

  try {
    let query = supabase.from("users").select("id").eq("isAdmin", false);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export const handleUserStatus = async (payload: any) => {
  const supabase = createClient();
  try {
    const { error }: any = await supabase
      .from("users")
      .update({
        status: payload.action,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.actionId);
    if (error) throw error.message;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const fetchUserDetail = async (payload: any) => {
  const supabase = createClient();
  try {
    let query = supabase
      .from("users")
      .select(
        "firstname, lastname, email_id, profession, profile_image, country(name), bio, created_at"
      )
      .eq("id", payload?.userId)
      .single();
    const { data, error } = await query;

    data.created_at = moment(data.created_at).format("DD-MM-YYYY");

    if (error) throw error.message;

    data.country = data.country?.name;
    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: {} };
  }
};

export const fetchUserIntrests = async (payload: any) => {
  const supabase = createClient();

  try {
    let { error, data } = await supabase
      .from("user_interests")
      .select("interest(name)")
      .eq("user_id", payload?.userId);
    if (error) throw error.message;
    data = data.map((item) => item.interest?.name);

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export const fetchUserSkills = async (payload: any) => {
  const supabase = createClient();

  try {
    let { error, data } = await supabase
      .from("user_skills")
      .select("skill(name)")
      .eq("user_id", payload?.userId);
    if (error) throw error.message;
    data = data.map((item) => item.skill?.name);

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export const fetchUserPersonalityTraits = async (payload: any) => {
  const supabase = createClient();

  try {
    let { error, data } = await supabase
      .from("user_personality_traits")
      .select("traits(name)")
      .eq("user_id", payload?.userId);
    if (error) throw error.message;
    data = data.map((item) => item.traits?.name);

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export const hardDeleteUsers = async (payload: any) => {
  const supabase = createClient();

  try {
    let query = supabase.functions.invoke("hard-delete-users", {
      body: JSON.stringify({ users: payload.users }),
      method: "POST",
      region: FunctionRegion.UsWest1,
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export const softDeleteUsers = async (payload: any) => {
  const supabase = createClient();

  try {
    let query = supabase.functions.invoke("soft-delete-users", {
      body: JSON.stringify({ users: payload.users }),
      method: "POST",
      region: FunctionRegion.UsWest1,
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};

export async function fetchTotalUsersKPI() {
  const supabase = createClient();

  try {
    const thisWeekStart = moment().startOf("isoWeek").toISOString();
    const thisWeekEnd = moment().endOf("isoWeek").toISOString();

    const lastWeekStart = moment()
      .subtract(1, "week")
      .startOf("isoWeek")
      .toISOString();
    const lastWeekEnd = moment()
      .subtract(1, "week")
      .endOf("isoWeek")
      .toISOString();

    const thisWeekPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("isAdmin", false)
      .gte("created_at", thisWeekStart)
      .lte("created_at", thisWeekEnd);

    const lastWeekPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("isAdmin", false)
      .gte("created_at", lastWeekStart)
      .lte("created_at", lastWeekEnd);

    const totalUsersPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("isAdmin", false);

    const [thisWeekData, lastWeekData, totalUsersData] = await Promise.all([
      thisWeekPromise,
      lastWeekPromise,
      totalUsersPromise,
    ]);

    if (thisWeekData.error) throw thisWeekData.error.message;
    if (lastWeekData.error) throw lastWeekData.error.message;
    if (totalUsersData.error) throw totalUsersData.error.message;

    const thisWeekCount = thisWeekData.count;
    const lastWeekCount = lastWeekData.count;
    const totalUsersCount = totalUsersData.count;

    let percentageDifference = 0;
    if (lastWeekCount !== null && lastWeekCount > 0 && thisWeekCount !== null) {
      percentageDifference =
        ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    }

    return {
      success: true,
      count: totalUsersCount,
      percentageDifference: percentageDifference.toFixed(0),
    };
  } catch (error) {
    return { success: false, error, count: 0, percentageDifference: 0 };
  }
}

export async function fetchActiveUsersKPI() {
  const supabase = createClient();

  try {
    const thisWeekStart = moment().startOf("isoWeek").toISOString();
    const thisWeekEnd = moment().endOf("isoWeek").toISOString();

    const lastWeekStart = moment()
      .subtract(1, "week")
      .startOf("isoWeek")
      .toISOString();
    const lastWeekEnd = moment()
      .subtract(1, "week")
      .endOf("isoWeek")
      .toISOString();

    const thisWeekPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("status", "active")
      .eq("isAdmin", false)
      .gte("created_at", thisWeekStart)
      .lte("created_at", thisWeekEnd);

    const lastWeekPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("status", "active")
      .eq("isAdmin", false)
      .gte("created_at", lastWeekStart)
      .lte("created_at", lastWeekEnd);

    const totalActiveUsersPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("status", "active")
      .eq("isAdmin", false);

    const [thisWeekData, lastWeekData, totalActiveUsersData] =
      await Promise.all([
        thisWeekPromise,
        lastWeekPromise,
        totalActiveUsersPromise,
      ]);

    if (thisWeekData.error) throw thisWeekData.error.message;
    if (lastWeekData.error) throw lastWeekData.error.message;
    if (totalActiveUsersData.error) throw totalActiveUsersData.error.message;

    const thisWeekCount = thisWeekData.count;
    const lastWeekCount = lastWeekData.count;
    const totalActiveUsersCount = totalActiveUsersData.count;

    let percentageDifference = 0;
    if (lastWeekCount !== null && lastWeekCount > 0 && thisWeekCount !== null) {
      percentageDifference =
        ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    }

    return {
      success: true,
      count: totalActiveUsersCount,
      percentageDifference: percentageDifference.toFixed(0),
    };
  } catch (error) {
    return { success: false, error, count: 0, percentageDifference: 0 };
  }
}

export async function fetchInactiveUsersKPI() {
  const supabase = createClient();

  try {
    const thisWeekStart = moment().startOf("isoWeek").toISOString();
    const thisWeekEnd = moment().endOf("isoWeek").toISOString();

    const lastWeekStart = moment()
      .subtract(1, "week")
      .startOf("isoWeek")
      .toISOString();
    const lastWeekEnd = moment()
      .subtract(1, "week")
      .endOf("isoWeek")
      .toISOString();

    const thisWeekPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("status", "inactive")
      .eq("isAdmin", false)
      .gte("created_at", thisWeekStart)
      .lte("created_at", thisWeekEnd);

    const lastWeekPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("status", "inactive")
      .eq("isAdmin", false)
      .gte("created_at", lastWeekStart)
      .lte("created_at", lastWeekEnd);

    const totalInactiveUsersPromise = supabase
      .from("users")
      .select("id", { count: "exact" })
      .eq("status", "inactive")
      .eq("isAdmin", false);

    const [thisWeekData, lastWeekData, totalInactiveUsersData] =
      await Promise.all([
        thisWeekPromise,
        lastWeekPromise,
        totalInactiveUsersPromise,
      ]);

    if (thisWeekData.error) throw thisWeekData.error.message;
    if (lastWeekData.error) throw lastWeekData.error.message;
    if (totalInactiveUsersData.error)
      throw totalInactiveUsersData.error.message;

    const thisWeekCount = thisWeekData.count;
    const lastWeekCount = lastWeekData.count;
    const totalInactiveUsersCount = totalInactiveUsersData.count;

    let percentageDifference = 0;
    if (lastWeekCount !== null && lastWeekCount > 0 && thisWeekCount !== null) {
      percentageDifference =
        ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    }

    return {
      success: true,
      count: totalInactiveUsersCount,
      percentageDifference: percentageDifference.toFixed(0),
    };
  } catch (error) {
    return { success: false, error, count: 0, percentageDifference: 0 };
  }
}

export const testAction = async (payload: any) => {
  const supabase = createClient();
  const { countries } = payload;

  try {
    let query = supabase.from("master_countries").insert(countries);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
};
