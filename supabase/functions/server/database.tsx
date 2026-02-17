import { createClient } from 'npm:@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Types for our database schema
export interface LoanApplication {
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
  status: 'pending' | 'approved' | 'rejected' | 'under_review' | 'pending_final_approval' | 'fully_approved' | 'disbursed';
  created_at?: string;
  updated_at?: string;
  // Accepted offer details (from multi-bank flow)
  accepted_bank_id?: string;
  accepted_bank_name?: string;
  accepted_bank_logo?: string;
  accepted_offer_rate?: number;
  accepted_offer_term?: number;
  accepted_offer_amount?: number;
  accepted_offer_monthly_payment?: number;
  accepted_offer_total_interest?: number;
  accepted_offer_processing_fee?: number;
  accepted_at?: string;
}

export interface AIAssessment {
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

export interface ApproverAction {
  id?: string;
  application_id: string;
  approver_name: string;
  approver_email: string;
  action: 'approved' | 'rejected';
  justification: string;
  created_at?: string;
}

export interface ApplicationStatusHistory {
  id?: string;
  application_id: string;
  status: string;
  notes?: string;
  created_at?: string;
}

// NOTE: Tables must be created manually in Supabase dashboard
// See /supabase/SETUP_INSTRUCTIONS.md for the SQL schema

// Loan Application Functions
export async function createLoanApplication(data: LoanApplication) {
  const { data: application, error } = await supabase
    .from('loan_applications')
    .insert([{
      applicant_name: data.applicant_name,
      applicant_email: data.applicant_email,
      applicant_phone: data.applicant_phone,
      loan_amount: data.loan_amount,
      interest_rate: data.interest_rate,
      loan_term: data.loan_term,
      monthly_payment: data.monthly_payment,
      bank_name: data.bank_name,
      bank_connected: data.bank_connected,
      account_verified: data.account_verified,
      account_balance: data.account_balance,
      monthly_income: data.monthly_income,
      identity_verified: data.identity_verified,
      ai_score: data.ai_score,
      ai_recommendation: data.ai_recommendation,
      ai_confidence: data.ai_confidence,
      status: data.status || 'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating loan application:', error);
    throw error;
  }

  return application;
}

export async function getLoanApplication(id: string) {
  const { data, error } = await supabase
    .from('loan_applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching loan application:', error);
    throw error;
  }

  return data;
}

export async function getAllLoanApplications() {
  const { data, error } = await supabase
    .from('loan_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching loan applications:', error);
    throw error;
  }

  return data;
}

export async function updateLoanApplication(id: string, updates: Partial<LoanApplication>) {
  const { data, error } = await supabase
    .from('loan_applications')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating loan application:', error);
    throw error;
  }

  return data;
}

// AI Assessment Functions
export async function createAIAssessment(data: AIAssessment) {
  const { data: assessment, error } = await supabase
    .from('ai_assessments')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error creating AI assessment:', error);
    throw error;
  }

  return assessment;
}

export async function getAIAssessment(applicationId: string) {
  const { data, error } = await supabase
    .from('ai_assessments')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching AI assessment:', error);
    throw error;
  }

  return data;
}

// Approver Action Functions
export async function createApproverAction(data: ApproverAction) {
  const { data: action, error } = await supabase
    .from('approver_actions')
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error('Error creating approver action:', error);
    throw error;
  }

  return action;
}

export async function getApproverActions(applicationId: string) {
  const { data, error } = await supabase
    .from('approver_actions')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching approver actions:', error);
    throw error;
  }

  return data;
}

// Status History Functions
export async function addStatusHistory(applicationId: string, status: string, notes?: string) {
  const { data, error } = await supabase
    .from('application_status_history')
    .insert([{
      application_id: applicationId,
      status,
      notes,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding status history:', error);
    throw error;
  }

  return data;
}

export async function getStatusHistory(applicationId: string) {
  const { data, error } = await supabase
    .from('application_status_history')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching status history:', error);
    throw error;
  }

  return data;
}

export { supabase };