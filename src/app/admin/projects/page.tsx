import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { ProjectManager } from "./ProjectManager";

export default async function AdminProjectsPage() {
  let projects: any[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });
      projects = data || [];
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <ProjectManager projects={projects} />
    </div>
  );
}
