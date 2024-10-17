"use server";

import { createClient } from "@/utils/supabase/server";
// Master Countries
export async function fetchMasterCountriesCount(payload: any) {
  const { searchQuery, filters } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("master_countries")
      .select("*", { count: "exact" });

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function fetchMasterCountries(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("master_countries")
      .select("id, name, status, created_at")
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function createMasterCountries(payload: any) {
  const supabase = createClient();

  const { name } = payload;
  try {
    let query = supabase.from("master_countries").insert({
      name,
      status: "active",
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function updateMasterCountries(payload: any) {
  const supabase = createClient();

  const { name, action, actionId } = payload;
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };
  if (name) updatePayload.name = name;
  if (action) updatePayload.status = action;
  try {
    let query = supabase
      .from("master_countries")
      .update(updatePayload)
      .eq("id", actionId);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

// Master Interests
export async function fetchMasterInterestsCount(payload: any) {
  const { searchQuery, filters } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("master_interests")
      .select("*", { count: "exact" });

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function fetchMasterTableInterests(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("master_interests")
      .select("id, name, status, created_at")
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function createMasterInterests(payload: any) {
  const supabase = createClient();

  const { name } = payload;
  try {
    let query = supabase.from("master_interests").insert({
      name,
      status: "active",
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function updateMasterInterests(payload: any) {
  const supabase = createClient();

  const { name, action, actionId } = payload;
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };
  if (name) updatePayload.name = name;
  if (action) updatePayload.status = action;
  try {
    let query = supabase
      .from("master_interests")
      .update(updatePayload)
      .eq("id", actionId);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

// Master Personality Traits
export async function fetchMasterTraitsCount(payload: any) {
  const { searchQuery, filters } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("master_personality_traits")
      .select("*", { count: "exact" });

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function fetchMasterTableTraits(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("master_personality_traits")
      .select("id, name, status, created_at")
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function updateMasterTraits(payload: any) {
  const supabase = createClient();

  const { name, action, actionId } = payload;
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };
  if (name) updatePayload.name = name;
  if (action) updatePayload.status = action;
  try {
    let query = supabase
      .from("master_personality_traits")
      .update(updatePayload)
      .eq("id", actionId);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createMasterTraits(payload: any) {
  const supabase = createClient();

  const { name } = payload;
  try {
    let query = supabase.from("master_personality_traits").insert({
      name,
      status: "active",
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

// Master Report
export async function fetchMasterReportsCount(payload: any) {
  const { searchQuery, filters } = payload;

  const supabase = createClient();
  try {
    let query = supabase
      .from("master_report_reasons")
      .select("*", { count: "exact" });

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function fetchMasterTableReports(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("master_report_reasons")
      .select("id, name, status, created_at")
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function updateMasterReports(payload: any) {
  const supabase = createClient();

  const { name, action, actionId } = payload;
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };
  if (name) updatePayload.name = name;
  if (action) updatePayload.status = action;
  try {
    let query = supabase
      .from("master_report_reasons")
      .update(updatePayload)
      .eq("id", actionId);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createMasterReports(payload: any) {
  const supabase = createClient();

  const { name } = payload;
  try {
    let query = supabase.from("master_report_reasons").insert({
      name,
      status: "active",
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

// Master Skills
export async function fetchMasterSkillsCount(payload: any) {
  const { searchQuery, filters } = payload;

  const supabase = createClient();
  try {
    let query = supabase.from("master_skills").select("*", { count: "exact" });

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function fetchMasterTableSkills(payload: any) {
  const supabase = createClient();

  const { searchQuery, startIndex, endIndex, sortOrder, sortField, filters } =
    payload;

  try {
    let query = supabase
      .from("master_skills")
      .select("id, name, status, created_at")
      .range(startIndex, endIndex);

    if (searchQuery !== "") {
      query = query.ilike("name", `%${searchQuery}%`);
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

export async function updateMasterSkills(payload: any) {
  const supabase = createClient();

  const { name, action, actionId } = payload;
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };
  if (name) updatePayload.name = name;
  if (action) updatePayload.status = action;
  try {
    let query = supabase
      .from("master_skills")
      .update(updatePayload)
      .eq("id", actionId);

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}

export async function createMasterSkills(payload: any) {
  const supabase = createClient();

  const { name } = payload;
  try {
    let query = supabase.from("master_skills").insert({
      name,
      status: "active",
    });

    const { data, error } = await query;

    if (error) throw error.message;

    return { success: true, data };
  } catch (error) {
    return { success: false, error, data: [] };
  }
}
