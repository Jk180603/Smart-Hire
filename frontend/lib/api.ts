import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8001",
});

export type AppStatus = "applied" | "interview" | "offer" | "rejected";

export interface Application {
  id: number;
  company: string;
  role: string;
  status: AppStatus;
  match_score: number;
  applied_date: string;
  url: string;
}

export interface DashboardStats {
  total: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
  avg_match_score: number;
}

export interface JdAnalysis {
  required_skills: string[];
  nice_to_have: string[];
  key_technologies: string[];
  role_summary: string;
}

export interface AnalyseResult {
  match_score: number;
  jd_analysis: JdAnalysis;
  feedback: string;
}

export interface AddApplicationData {
  company_name: string;
  role: string;
  url?: string;
  notes?: string;
}

export interface AnalyseData {
  application_id: number;
  jd_text: string;
  cv_text: string;
}

export async function getApplications(): Promise<Application[]> {
  const res = await API.get("/applications");
  return res.data;
}

export async function addApplication(
  data: AddApplicationData
): Promise<{ id: number; message: string; role: string }> {
  const res = await API.post("/applications", data);
  return res.data;
}

export async function updateStatus(
  id: number,
  status: AppStatus
): Promise<{ message: string }> {
  const res = await API.put(`/applications/${id}`, { status });
  return res.data;
}

export async function getStats(): Promise<DashboardStats> {
  const res = await API.get("/dashboard/stats");
  return res.data;
}

export async function analyseApplication(
  data: AnalyseData
): Promise<AnalyseResult> {
  const res = await API.post("/analyse", data);
  return res.data;
}