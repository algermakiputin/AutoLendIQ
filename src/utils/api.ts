import { projectId, publicAnonKey } from "../../utils/supabase/info";
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-aa912fb4`;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${publicAnonKey}`,
      ...options?.headers,
    },
  });

  const result: ApiResponse<T> = await response.json();

  if (!result.success) {
    console.error("API Error:", result.error, result.details);
    throw new Error(result.error || "API request failed");
  }

  return result.data as T;
}

// Loan Application API
export interface LoanApplicationData {
  id?: string;
  applicant_name?: string;
  applicant_email?: string;
  applicant_phone?: string;
  loan_amount: number;
  interest_rate: number;
  loan_term: number;
  monthly_payment: number;
  bank_name?: string;
  bank_connected: boolean;
  account_verified: boolean;
  account_balance?: number;
  monthly_income?: number;
  identity_verified: boolean;
  ai_score?: number;
  ai_recommendation?: string;
  ai_confidence?: number;
  status: "pending" | "approved" | "rejected" | "under_review";
  created_at?: string;
  updated_at?: string;
}

export interface AIAssessmentData {
  id?: string;
  application_id: string;
  overall_score: number;
  recommendation: string;
  confidence: number;
  identity_score?: number;
  credit_score?: number;
  risk_score?: number;
  fraud_risk?: string;
  debt_to_income?: number;
  payment_history_score?: number;
  affordability_score?: number;
  assessment_data?: any;
  created_at?: string;
}

export interface ApproverActionData {
  id?: string;
  application_id: string;
  approver_name: string;
  approver_email: string;
  action: "approved" | "rejected";
  justification: string;
  created_at?: string;
}

export interface StatusHistoryData {
  id?: string;
  application_id: string;
  status: string;
  notes?: string;
  created_at?: string;
}

// Loan Application Functions
export async function createLoanApplication(
  data: LoanApplicationData,
): Promise<LoanApplicationData> {
  return fetchApi<LoanApplicationData>("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllLoanApplications(): Promise<LoanApplicationData[]> {
  return fetchApi<LoanApplicationData[]>("/applications");
}

export async function getLoanApplication(
  id: string,
): Promise<LoanApplicationData> {
  return fetchApi<LoanApplicationData>(`/applications/${id}`);
}

export async function updateLoanApplication(
  id: string,
  updates: Partial<LoanApplicationData>,
): Promise<LoanApplicationData> {
  return fetchApi<LoanApplicationData>(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// AI Assessment Functions
export async function createAIAssessment(
  data: AIAssessmentData,
): Promise<AIAssessmentData> {
  return fetchApi<AIAssessmentData>("/assessments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAIAssessment(
  applicationId: string,
): Promise<AIAssessmentData> {
  return fetchApi<AIAssessmentData>(`/assessments/${applicationId}`);
}

// Approver Action Functions
export async function createApproverAction(
  data: ApproverActionData,
): Promise<ApproverActionData> {
  return fetchApi<ApproverActionData>("/approver-actions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getApproverActions(
  applicationId: string,
): Promise<ApproverActionData[]> {
  return fetchApi<ApproverActionData[]>(`/approver-actions/${applicationId}`);
}

// Status History Functions
export async function getStatusHistory(
  applicationId: string,
): Promise<StatusHistoryData[]> {
  return fetchApi<StatusHistoryData[]>(`/status-history/${applicationId}`);
}
