import React from "react";
import { getSiteSettings } from "@/lib/data";
import { SettingsForm } from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
