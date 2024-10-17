// @ts-nocheck
"use server";

import { createClient } from "@/utils/supabase/server";
import moment from "moment";

// export async function fetchDashboardUsersKPI() {
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

//     const thisWeekPromise = supabase
//       .from("users")
//       .select("id", { count: "exact" })
//       .eq("isAdmin", false)
//       .gte("created_at", thisWeekStart)
//       .lte("created_at", thisWeekEnd);

//     const lastWeekPromise = supabase
//       .from("users")
//       .select("id", { count: "exact" })
//       .eq("isAdmin", false)
//       .gte("created_at", lastWeekStart)
//       .lte("created_at", lastWeekEnd);

//     const totalUsersPromise = supabase
//       .from("users")
//       .select("id", { count: "exact" })
//       .eq("isAdmin", false);

//     const [thisWeekData, lastWeekData, totalUsersData] = await Promise.all([
//       thisWeekPromise,
//       lastWeekPromise,
//       totalUsersPromise,
//     ]);

//     if (thisWeekData.error) throw thisWeekData.error.message;
//     if (lastWeekData.error) throw lastWeekData.error.message;
//     if (totalUsersData.error) throw totalUsersData.error.message;

//     const thisWeekCount = thisWeekData.count;
//     const lastWeekCount = lastWeekData.count;
//     const totalUsersCount = totalUsersData.count;

//     let percentageDifference = 0;
//     if (lastWeekCount !== null && lastWeekCount > 0 && thisWeekCount !== null) {
//       percentageDifference =
//         ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
//     }

//     return {
//       success: true,
//       count: totalUsersCount,
//       percentageDifference: percentageDifference.toFixed(0),
//     };
//   } catch (error) {
//     return { success: false, error, count: 0, percentageDifference: 0 };
//   }
// }

//

export async function fetchDashboardUsersKPI() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("dashboard_kpi")
      .select("*")
      .single();

    if (error) throw error;

    const { total_users_count, this_week_count, last_week_count } = data;

    let percentageDifference = 0;
    if (
      last_week_count !== null &&
      last_week_count > 0 &&
      this_week_count !== null
    ) {
      percentageDifference =
        ((this_week_count - last_week_count) / last_week_count) * 100;
    }

    return {
      success: true,
      count: total_users_count,
      percentageDifference: percentageDifference.toFixed(0),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      count: 0,
      percentageDifference: 0,
    };
  }
}

// export async function fetchDashboardCommunitiesKPI() {
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

//     // Prepare promises for concurrent execution
//     const thisWeekPromise = supabase
//       .from("communities")
//       .select("id", { count: "exact" })
//       .gte("created_at", thisWeekStart)
//       .lte("created_at", thisWeekEnd);

//     const lastWeekPromise = supabase
//       .from("communities")
//       .select("id", { count: "exact" })
//       .gte("created_at", lastWeekStart)
//       .lte("created_at", lastWeekEnd);

//     const totalCommunitiesPromise = supabase
//       .from("communities")
//       .select("id", { count: "exact" });

//     // Execute all the promises concurrently
//     const [thisWeekData, lastWeekData, totalCommunitiesData] =
//       await Promise.all([
//         thisWeekPromise,
//         lastWeekPromise,
//         totalCommunitiesPromise,
//       ]);

//     // Handle any errors from the promises
//     if (thisWeekData.error) throw thisWeekData.error.message;
//     if (lastWeekData.error) throw lastWeekData.error.message;
//     if (totalCommunitiesData.error) throw totalCommunitiesData.error.message;

//     const thisWeekCount = thisWeekData.count;
//     const lastWeekCount = lastWeekData.count;
//     const totalCommunitiesCount = totalCommunitiesData.count;

//     // Calculate percentage difference
//     let percentageDifference = 0;
//     if (lastWeekCount !== null && lastWeekCount > 0 && thisWeekCount !== null) {
//       percentageDifference =
//         ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
//     }

//     return {
//       success: true,
//       count: totalCommunitiesCount,
//       percentageDifference: percentageDifference.toFixed(0),
//     };
//   } catch (error) {
//     return { success: false, error, count: 0, percentageDifference: 0 };
//   }
// }

export async function fetchDashboardCommunitiesKPI() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("dashboard_communities_kpi")
      .select("*")
      .single();

    if (error) throw error;

    const { total_communities_count, this_week_count, last_week_count } = data;

    let percentageDifference = 0;
    if (
      last_week_count !== null &&
      last_week_count > 0 &&
      this_week_count !== null
    ) {
      percentageDifference =
        ((this_week_count - last_week_count) / last_week_count) * 100;
    }

    return {
      success: true,
      count: total_communities_count,
      percentageDifference: percentageDifference.toFixed(0),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      count: 0,
      percentageDifference: 0,
    };
  }
}

// export async function fetchDashboardPostsKPI() {
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

//     // Prepare promises for concurrent execution
//     const thisWeekPromise = supabase
//       .from("posts")
//       .select("id", { count: "exact" })
//       .gte("created_at", thisWeekStart)
//       .lte("created_at", thisWeekEnd);

//     const lastWeekPromise = supabase
//       .from("posts")
//       .select("id", { count: "exact" })
//       .gte("created_at", lastWeekStart)
//       .lte("created_at", lastWeekEnd);

//     const totalPostsPromise = supabase
//       .from("posts")
//       .select("id", { count: "exact" });

//     // Execute all the promises concurrently
//     const [thisWeekData, lastWeekData, totalPostsData] = await Promise.all([
//       thisWeekPromise,
//       lastWeekPromise,
//       totalPostsPromise,
//     ]);

//     // Handle any errors from the promises
//     if (thisWeekData.error) throw thisWeekData.error.message;
//     if (lastWeekData.error) throw lastWeekData.error.message;
//     if (totalPostsData.error) throw totalPostsData.error.message;

//     const thisWeekCount = thisWeekData.count;
//     const lastWeekCount = lastWeekData.count;
//     const totalPostsCount = totalPostsData.count;

//     // Calculate percentage difference
//     let percentageDifference = 0;
//     if (lastWeekCount !== null && lastWeekCount > 0 && thisWeekCount !== null) {
//       percentageDifference =
//         ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
//     }

//     return {
//       success: true,
//       count: totalPostsCount,
//       percentageDifference: percentageDifference.toFixed(0),
//     };
//   } catch (error) {
//     return { success: false, error, count: 0, percentageDifference: 0 };
//   }
// }

export async function fetchDashboardPostsKPI() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("dashboard_posts_kpi")
      .select("*")
      .single();

    if (error) throw error;

    const { total_posts_count, this_week_count, last_week_count } = data;

    let percentageDifference = 0;
    if (
      last_week_count !== null &&
      last_week_count > 0 &&
      this_week_count !== null
    ) {
      percentageDifference =
        ((this_week_count - last_week_count) / last_week_count) * 100;
    }

    return {
      success: true,
      count: total_posts_count,
      percentageDifference: percentageDifference.toFixed(0),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      count: 0,
      percentageDifference: 0,
    };
  }
}

export async function fetchKPIForLast4Weeks() {
  const supabase = createClient();

  const weeks = [];
  for (let i = 0; i < 4; i++) {
    const startOfWeek = moment()
      .subtract(i, "weeks")
      .startOf("isoWeek")
      .toISOString();
    const endOfWeek = moment()
      .subtract(i, "weeks")
      .endOf("isoWeek")
      .toISOString();
    weeks.push({ startOfWeek, endOfWeek });
  }

  try {
    const results = await Promise.all(
      weeks.map(async ({ startOfWeek, endOfWeek }) => {
        // Fetch data for users
        const { count: userCount } = await supabase
          .from("users")
          .select("*", { count: "exact" })
          .eq("isAdmin", false)
          .gte("created_at", startOfWeek)
          .lte("created_at", endOfWeek);

        // Fetch data for communities
        const { count: communityCount } = await supabase
          .from("communities")
          .select("*", { count: "exact" })
          .gte("created_at", startOfWeek)
          .lte("created_at", endOfWeek);

        // Fetch data for posts
        const { count: postCount } = await supabase
          .from("posts")
          .select("*", { count: "exact" })
          .gte("created_at", startOfWeek)
          .lte("created_at", endOfWeek);

        // Fetch data for reports
        const { count: reportCount } = await supabase
          .from("user_reports")
          .select("*", { count: "exact" })
          .gte("created_at", startOfWeek)
          .lte("created_at", endOfWeek);

        return {
          week: moment(startOfWeek).format("YYYY-MM-DD"),
          userCount,
          communityCount,
          postCount,
          reportCount,
        };
      })
    );

    return { success: true, data: results.reverse() };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

// export async function fetchKPIForLast4Weeks() {
//   const supabase = createClient();

//   try {
//     const weeks = [];
//     for (let i = 0; i < 4; i++) {
//       const startOfWeek = moment()
//         .subtract(i, "weeks")
//         .startOf("isoWeek")
//         .toISOString();
//       const endOfWeek = moment()
//         .subtract(i, "weeks")
//         .endOf("isoWeek")
//         .toISOString();
//       weeks.push({ startOfWeek, endOfWeek });
//     }

//     // Prepare promises for concurrent execution
//     const promises = weeks.map(({ startOfWeek, endOfWeek }) => {
//       return Promise.all([
//         supabase
//           .from("users")
//           .select("*", { count: "exact" })
//           .eq("isAdmin", false)
//           .gte("created_at", startOfWeek)
//           .lte("created_at", endOfWeek),
//         supabase
//           .from("communities")
//           .select("*", { count: "exact" })
//           .gte("created_at", startOfWeek)
//           .lte("created_at", endOfWeek),
//         supabase
//           .from("posts")
//           .select("*", { count: "exact" })
//           .gte("created_at", startOfWeek)
//           .lte("created_at", endOfWeek),
//         supabase
//           .from("user_reports")
//           .select("*", { count: "exact" })
//           .gte("created_at", startOfWeek)
//           .lte("created_at", endOfWeek),
//       ]).then(([userData, communityData, postData, reportData]) => ({
//         week: moment(startOfWeek).format("YYYY-MM-DD"),
//         userCount: userData.count,
//         communityCount: communityData.count,
//         postCount: postData.count,
//         reportCount: reportData.count,
//       }));
//     });

//     // Execute all the promises concurrently
//     const results = await Promise.all(promises);

//     return { success: true, data: results.reverse() };
//   } catch (error) {
//     return { success: false, error, data: [] };
//   }
// }

export async function fetchDashboardUsersCount(payload: any) {
  const { searchQuery, filters } = payload;
  const supabase = createClient();

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).toISOString();

  try {
    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .not("country", "is", null)
      .eq("isAdmin", false)
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth);

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

export async function fetchDashboardUsers(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  ).toISOString();
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).toISOString();

  try {
    let query = supabase
      .from("users")
      .select(
        "id, username, email_id, age_group, profession, country!inner(name), status, created_at"
      )
      .eq("isAdmin", false)
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth)
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
