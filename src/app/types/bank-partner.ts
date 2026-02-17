export interface BankPartner {
  id: string;
  name: string;
  logoUrl: string;
  tier: 'universal' | 'commercial' | 'digital' | 'fintech';
  description: string;
  
  // Eligibility Criteria
  minCreditScore: number;
  maxDTI: number; // Debt-to-Income ratio (e.g., 0.4 = 40%)
  minMonthlyIncome: number;
  
  // Loan Products
  minAmount: number;
  maxAmount: number;
  minTerm: number; // months
  maxTerm: number; // months
  baseInterestRate: number; // Base rate before adjustments
  interestRateRange: [number, number]; // [min, max]
  
  // Processing Info
  avgApprovalTime: string; // "24 hours", "3-5 days"
  approvalRate: number; // 0.65 = 65%
  processingFee: number; // Percentage
  
  // Features
  features: string[];
  
  // API Integration
  apiEndpoint?: string;
  requiresManualReview: boolean;
  
  // Status
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankOffer {
  bankId: string;
  bankName: string;
  bankLogoUrl: string;
  
  // Offer Details
  loanAmount: number;
  interestRate: number;
  term: number; // months
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  
  // Fees
  processingFee: number;
  processingFeeAmount: number;
  
  // Approval Info
  approvalProbability: number; // 0-1
  estimatedApprovalTime: string;
  
  // Recommendations
  isRecommended: boolean;
  recommendationReason?: string;
  
  // Status
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'accepted' | 'awaiting_disbursement';
  expiresAt?: string;
  acceptedAt?: string;
}

export interface BankApplication {
  id: string;
  applicationId: string; // Parent loan application ID
  bankId: string;
  bankName: string;
  
  // Application Details
  appliedAmount: number;
  appliedTerm: number;
  
  // Status
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn' | 'accepted' | 'pending_final_approval' | 'fully_approved' | 'disbursed';
  statusUpdatedAt: string;
  
  // Offer (if approved)
  offer?: BankOffer;
  
  // Timeline
  submittedAt: string;
  reviewedAt?: string;
  decidedAt?: string;
  
  // Notes
  notes?: string;
  rejectionReason?: string;
}