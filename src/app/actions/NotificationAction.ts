"use server";

import { createClient } from "@/utils/supabase/server";

export async function fetchGroupNotificationsCount(payload: any) {
  // eslint-disable-next-line no-unused-vars
  const { searchQuery, filters } = payload;
  const supabase = createClient();
  try {
    let query = supabase
      .from("push_notifications")
      .select("*", { count: "exact" });

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

export async function fetchGroupNotifications(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("push_notifications")
      .select("id, title, description, created_at")
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

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function sendUserNotification(payload: any) {
  const supabase = createClient();
  const {
    title,
    description,
    notification_type,
    sender,
    receivers,
    onesignal_notification_id,
  } = payload;
  try {
    const notifications = receivers.map((receiver: string) => ({
      title,
      description,
      notification_type,
      group_id: sender,
      receiver_id: receiver,
      onesignal_notification_id: onesignal_notification_id,
    }));

    let query = supabase.from("user_notifications").insert(notifications);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchUsersNotificationsCount(payload: any) {
  const supabase = createClient();
  try {
    const { error, count }: any = await supabase
      .from("user_notifications")
      .select("*", { count: "exact" })
      .not("receiver_id", "is", null)
      .eq("group_id", payload.notificationId);
    if (error) throw error.message;
    return { success: true, count };
  } catch (error) {
    return { success: false, error, count: 0 };
  }
}

export async function fetchUsersNotifications(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("user_notifications")
      .select("id, title, receiver_id!inner(preferred_name), created_at")
      .eq("group_id", payload.notificationId)
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.ilike("receiver_id.preferred_name", `%${searchQuery}%`);
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

    data.forEach((element: any) => {
      element.receiver_name = element.receiver_id?.preferred_name;
      delete element.receiver_id;
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function sendGroupNotification(payload: any) {
  const supabase = createClient();
  try {
    let query = supabase.from("push_notifications").insert([payload]);
    const { data, error } = await query.select("id").single();

    if (error) throw error.message;
    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function fetchAllNotificationUsers() {
  const supabase = createClient();

  try {
    let query = supabase
      .from("user_devices")
      .select("user_id!inner(id, preferred_name), notification_token")
      .not("notification_token", "is", null);

    const { data, error }: any = await query;

    if (error) throw error.message;

    data.forEach((item: any) => {
      item.id = item.user_id?.id;
      item.preferred_name = item.user_id.preferred_name;
      delete item.user_id;
    });
    data.unshift({ id: "all", preferred_name: "All" });

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}
