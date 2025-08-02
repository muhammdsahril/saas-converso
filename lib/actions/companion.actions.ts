"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { revalidatePath } from "next/cache";

export const createCompanion = async (formData: CreateCompanion) => {
  // Create a new companion entry in the database
  const { userId: author } = await auth();
  const supabase = createSupabaseClient();

  const { data, error } = await supabase // Insert the new companion data into the 'companions' table
    .from("companions")
    .insert({ ...formData, author }) // Spread the form data and add the author
    .select();

  if (error || !data) {
    throw new Error(`Error creating companion: ${error.message}`);
  }

  return data[0];
};

export const getAllCompanions = async ({
  // Fetch all companions with optional filters
  limit = 10,
  page = 1,
  subject,
  topic,
}: GetAllCompanions) => {
  const supabase = createSupabaseClient(); // Create a Supabase client instance

  let query = supabase.from("companions").select(); // Query the 'companions' table

  if (subject && topic) {
    // If both subject and topic are provided, filter by both
    query = query.ilike("subject", `%${subject}%`).or(`topic.ilike.%${topic}%`);
  } else if (subject) {
    // If only subject is provided, filter by subject
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    // If only topic is provided, filter by topic
    query = query.or(`topic.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: companions, error } = await query;

  if (error) throw new Error(`Error fetching companions: ${error.message}`);

  return companions;
};

export const getCompanion = async (id: string) => {
  // Fetch a companion by ID
  const supabase = createSupabaseClient();

  const { data, error } = await supabase // Query the 'companions' table
    .from("companions")
    .select()
    .eq("id", id); // Filter by the provided ID. eq is used for equality check

  if (error) return console.log(`Error fetching companion: ${error.message}`);

  return data[0];
};

// Session History
export const addToSessionHistory = async (companionId: string) => {
  const { userId } = await auth();
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("session_history").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data;
};

export const getRecentSession = async (limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
};

export const getUserSession = async (userId: string, limit = 10) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("session_history")
    .select(`companions:companion_id (*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions);
};

// Companions
export const getUserCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("companions")
    .select()
    .eq("author", userId);

  if (error) throw new Error(error.message);

  return data;
};

// Companion - Permissions
export const newCompanionPermissions = async () => {
  const { userId, has } = await auth();
  const supabase = createSupabaseClient();

  let limit = 0;

  if (has({ plan: "pro" })) {
    return true;
  } else if (has({ feature: "3_companion_limit" })) {
    limit = 3;
  } else if (has({ feature: "10_companion_limit" })) {
    limit = 10;
  }

  const { data, error } = await supabase
    .from("companions")
    .select("id", { count: "exact" })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  const companionCount = data?.length;

  if (companionCount >= limit) {
    return false;
  } else {
    return true;
  }
};

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(path); // Clears the cache associated with a specific path.

  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId) // to make sure the data is equals or its on there
    .eq("user_id", userId); // to make sure the data is equals or its on there

  // eq mean select the spesific value

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(path); // Clears the cache associated with a specific path.

  return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companiod_id (*)`) // Will get all the companion data
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return data.map(({ companions }) => companions); // no need bookmarks data, only return the companion
};
