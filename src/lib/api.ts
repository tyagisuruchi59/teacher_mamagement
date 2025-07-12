// src/lib/api.ts
import { Teacher } from "@/types/teacher";

const BASE = "/api/teachers";

export async function fetchTeachers(): Promise<Teacher[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
}

export async function createOrUpdateTeacher(data: Partial<Teacher>) {
  const method = data.id ? "PUT" : "POST";
  const url = data.id ? `${BASE}/${data.id}` : BASE;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Save failed");
  return res.json();
}
