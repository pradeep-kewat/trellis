// @ts-nocheck
"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchMasterInterests() {
  const supabase = createClient();

  try {
    let query = supabase
      .from("master_interests")
      .select("id, name")
      .eq("status", "active");

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchMasterEditInterests() {
  const supabase = createClient();

  try {
    let query = supabase.from("master_interests").select("id, name");

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchCommunitiesCount(payload: any) {
  const { searchQuery, filters } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("communities")
      .select("*", { count: "exact" })
      .not("interests", "is", null);

    if (searchQuery !== "") {
      query = query.or(`name.ilike.%${searchQuery}%`);
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

export async function fetchCommunities(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("communities")
      .select(
        "id, name, description, status, follower_count, created_by, created_at, interests!inner(id, name)"
      )
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(`name.ilike.%${searchQuery}%`);
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
      delete item?.interests;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createCommunity(payload: any) {
  const supabase = createClient();

  const payloadData = {
    name: payload.name,
    interests: payload.interests,
    description: payload.description,
    created_by: "admin",
    status: "active",
  };

  try {
    const { error, data } = await supabase
      .from("communities")
      .insert(payloadData);

    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateCommunity(payload: any) {
  const supabase = createClient();

  const payloadData = {
    name: payload.name,
    interests: payload.interests,
    description: payload.description,
    updated_at: new Date().toISOString(),
  };

  try {
    const { error, data } = await supabase
      .from("communities")
      .update(payloadData)
      .eq("id", payload?.id);

    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function DeleteCommunity(payload: any) {
  const supabase = createClient();

  try {
    const { error, data } = await supabase
      .from("communities")
      .delete()
      .eq("id", payload?.id);
    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function fetchCommunityPostsCount(payload: any) {
  const { searchQuery, filters, communityId } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("community_id", communityId)
      // .not("user_id", "is", null)
      .not("community_id", "is", null)
      .not("interests", "is", null);

    if (searchQuery !== "") {
      query = query.or(`user_id.username.ilike.%${searchQuery}%`);
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

export async function fetchCommunityPosts(payload: any) {
  const supabase = createClient();

  const {
    searchQuery,
    startIndex,
    endIndex,
    sortOrder,
    sortField,
    filters,
    communityId,
  } = payload;

  try {
    let query = supabase
      .from("posts")
      .select(
        "id, title, user_id(username), community_id!inner(id, name), status, post_by, created_at, interests!inner(id, name), body_html, body_text"
      )
      .eq("community_id", communityId)
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.or(`user_id.username.ilike.%${searchQuery}%`);
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
      item.communityId = item.community_id?.id;
      item.username = item.user_id?.username;
      delete item?.interests;
      delete item?.user_id;
      delete item?.community_id;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

// export async function fetchCommunityFollowersKPI(payload: any) {
//   const { communityId } = payload;
//   const supabase = createClient();

//   try {
//     const thisWeekStart = moment().startOf("isoWeek").toISOString();
//     const thisWeekEnd = moment().endOf("isoWeek").toISOString();
//     const lastWeekStart = moment()
//       .subtract(1, "week")
//       .startOf("isoWeek")
//       .toISOString();
//     const lastWeekEnd = moment()
//       .subtract(1, "week")
//       .endOf("isoWeek")
//       .toISOString();

//     const [thisWeekData, lastWeekData, totalData] = await Promise.all([
//       supabase
//         .from("community_followers")
//         .select("*", { count: "exact" })
//         .eq("community_id", communityId)
//         .gte("created_at", thisWeekStart)
//         .lte("created_at", thisWeekEnd),
//       supabase
//         .from("community_followers")
//         .select("*", { count: "exact" })
//         .eq("community_id", communityId)
//         .gte("created_at", lastWeekStart)
//         .lte("created_at", lastWeekEnd),
//       supabase
//         .from("community_followers")
//         .select("*", { count: "exact" })
//         .eq("community_id", communityId),
//     ]);

//     if (thisWeekData.error) throw thisWeekData.error.message;
//     if (lastWeekData.error) throw lastWeekData.error.message;
//     if (totalData.error) throw totalData.error.message;

//     const thisWeekCount = thisWeekData.count || 0;
//     const lastWeekCount = lastWeekData.count || 0;
//     const totalCount = totalData.count || 0;

//     let percentageDifference = 0;
//     if (lastWeekCount > 0 && thisWeekCount !== null) {
//       percentageDifference =
//         ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
//     }

//     return {
//       success: true,
//       count: totalCount,
//       percentageDifference: percentageDifference.toFixed(0),
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error,
//       count: 0,
//       percentageDifference: 0,
//     };
//   }
// }

export async function fetchCommunityFollowersKPI(payload: any) {
  const { communityId } = payload;
  const supabase = createClient();

  try {
    // Query the view instead of the raw table.
    const { data, error } = await supabase
      .from("community_followers_kpi")
      .select("this_week_count, last_week_count, total_count")
      .eq("community_id", communityId)
      .single();

    if (error) throw error;

    const {
      this_week_count: thisWeekCount,
      last_week_count: lastWeekCount,
      total_count: totalCount,
    } = data;

    let percentageDifference = 0;
    if (lastWeekCount > 0 && thisWeekCount !== null) {
      percentageDifference =
        ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    }

    return {
      success: true,
      count: totalCount,
      percentageDifference: percentageDifference.toFixed(0),
    };
  } catch (error) {
    return {
      success: false,
      error,
      count: 0,
      percentageDifference: 0,
    };
  }
}

// export async function fetchCommunityPostsKPI(payload: any) {
//   const { communityId } = payload;
//   const supabase = createClient();

//   try {
//     const thisWeekStart = moment().startOf("isoWeek").toISOString();
//     const thisWeekEnd = moment().endOf("isoWeek").toISOString();
//     const lastWeekStart = moment()
//       .subtract(1, "week")
//       .startOf("isoWeek")
//       .toISOString();
//     const lastWeekEnd = moment()
//       .subtract(1, "week")
//       .endOf("isoWeek")
//       .toISOString();

//     const [thisWeekData, lastWeekData, totalData] = await Promise.all([
//       supabase
//         .from("posts")
//         .select("*", { count: "exact" })
//         .eq("community_id", communityId)
//         .gte("created_at", thisWeekStart)
//         .lte("created_at", thisWeekEnd),
//       supabase
//         .from("posts")
//         .select("*", { count: "exact" })
//         .eq("community_id", communityId)
//         .gte("created_at", lastWeekStart)
//         .lte("created_at", lastWeekEnd),
//       supabase
//         .from("posts")
//         .select("*", { count: "exact" })
//         .eq("community_id", communityId),
//     ]);

//     if (thisWeekData.error) throw thisWeekData.error.message;
//     if (lastWeekData.error) throw lastWeekData.error.message;
//     if (totalData.error) throw totalData.error.message;

//     const thisWeekCount = thisWeekData.count || 0;
//     const lastWeekCount = lastWeekData.count || 0;
//     const totalCount = totalData.count || 0;

//     let percentageDifference = 0;
//     if (lastWeekCount > 0 && thisWeekCount !== null) {
//       percentageDifference =
//         ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
//     }

//     return {
//       success: true,
//       count: totalCount,
//       percentageDifference: percentageDifference.toFixed(0),
//     };
//   } catch (error) {
//     return {
//       success: false,
//       error,
//       count: 0,
//       percentageDifference: 0,
//     };
//   }
// }

export async function fetchCommunityPostsKPI(payload: any) {
  const { communityId } = payload;
  const supabase = createClient();

  try {
    // Query the view instead of the raw table.
    const { data, error } = await supabase
      .from("community_posts_kpi")
      .select("this_week_count, last_week_count, total_count")
      .eq("community_id", communityId)
      .single();

    if (error) throw error;

    const {
      this_week_count: thisWeekCount,
      last_week_count: lastWeekCount,
      total_count: totalCount,
    } = data;

    let percentageDifference = 0;
    if (lastWeekCount > 0 && thisWeekCount !== null) {
      percentageDifference =
        ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    }

    return {
      success: true,
      count: totalCount,
      percentageDifference: percentageDifference.toFixed(0),
    };
  } catch (error) {
    return {
      success: false,
      error,
      count: 0,
      percentageDifference: 0,
    };
  }
}
