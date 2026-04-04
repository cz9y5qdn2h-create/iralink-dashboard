export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
  industry: string;
  team_size: number;
  plan: "starter" | "pro" | "enterprise" | "trial";
  avatar_url?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  industry: string;
  team_size: number;
  settings: Record<string, unknown>;
  created_at: string;
}

export interface Automation {
  id: string;
  org_id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "suggested" | "failed" | "draft";
  trigger: string;
  actions: AutomationAction[];
  time_saved_hours: number;
  runs_count: number;
  success_rate: number;
  created_by: "ai" | "user";
  last_run_at: string | null;
  created_at: string;
}

export interface AutomationAction {
  type: string;
  config: Record<string, unknown>;
  order: number;
}

export interface Integration {
  id: string;
  org_id: string;
  type: IntegrationType;
  name: string;
  status: "connected" | "disconnected" | "error" | "pending";
  icon: string;
  last_sync_at: string | null;
  config: Record<string, unknown>;
  created_at: string;
}

export type IntegrationType =
  | "google_workspace"
  | "notion"
  | "slack"
  | "make"
  | "zapier"
  | "hubspot"
  | "stripe_integration"
  | "calendar"
  | "drive"
  | "gmail"
  | "sheets"
  | "trello"
  | "airtable"
  | "salesforce";

export interface AIAnalysis {
  id: string;
  org_id: string;
  date: string;
  type: "weekly" | "daily" | "on_demand";
  findings: Finding[];
  recommendations: Recommendation[];
  automations_suggested: number;
  time_saved_potential: number;
  score: number;
  status: "completed" | "in_progress" | "pending";
  created_at: string;
}

export interface Finding {
  category: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  data?: Record<string, unknown>;
}

export interface Recommendation {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  automation_possible: boolean;
}

export interface AILog {
  id: string;
  org_id: string;
  action: string;
  details: string;
  status: "success" | "error" | "info";
  created_at: string;
}

export interface DashboardMetrics {
  total_automations: number;
  active_automations: number;
  total_time_saved: number;
  time_saved_this_week: number;
  total_runs: number;
  success_rate: number;
  connected_integrations: number;
  ai_score: number;
  trend_automations: number;
  trend_time_saved: number;
}
