import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  Banknote,
  TrendingUp,
  FileText,
  Shield,
  Building2,
  Clock,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertTriangle,
  TrendingDown,
  Briefcase,
  DollarSign,
  Info,
  BadgeCheck,
  AlertCircle,
  Zap,
  Target,
  Activity,
} from 'lucide-react';
import { getLoanApplication, getAIAssessment, type LoanApplicationData, type AIAssessmentData } from '../../utils/api';

interface AIObservation {
  label: string;
  text: string;
  impact: 'positive' | 'warning' | 'critical';
}

interface CounterOffer {
  suggested_amount: number;
  original_dti: number;
  new_dti: number;
  reasoning: string;
}

interface IncomeSource {
  source: string;
  provider: string;
  type: 'permanent' | 'gig' | 'freelance' | 'government';
  monthly_income: number;
  trust_score: number;
  verified_by: string;
  volatility: 'low' | 'medium' | 'high';
}

interface ApplicationReviewDetailProps {
  applicationId: string;
  onBack: () => void;
  onDecision: (decision: 'approved' | 'rejected', notes: string) => void;
}

export function ApplicationReviewDetail({
  applicationId,
  onBack,
  onDecision,
}: ApplicationReviewDetailProps) {
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<LoanApplicationData | null>(null);
  const [aiAssessment, setAiAssessment] = useState<AIAssessmentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load application data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const appData = await getLoanApplication(applicationId);
        setApplication(appData);
        
        // Debug: Log the full application data to see what we got from the database
        console.log('=== APPLICATION REVIEW DEBUG ===');
        console.log('Application ID:', applicationId);
        console.log('Status:', appData.status);
        console.log('Accepted Bank Name:', appData.accepted_bank_name);
        console.log('Accepted Bank ID:', appData.accepted_bank_id);
        console.log('Accepted Offer Rate:', appData.accepted_offer_rate);
        console.log('Accepted Offer Amount:', appData.accepted_offer_amount);
        console.log('Full Application Data:', JSON.stringify(appData, null, 2));
        console.log('================================');
        
        try {
          const assessmentData = await getAIAssessment(applicationId);
          setAiAssessment(assessmentData);
        } catch (assessmentError) {
          console.log('No AI assessment found for this application');
          // AI assessment is optional
        }
      } catch (err) {
        console.error('Error loading application:', err);
        setError('Failed to load application data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [applicationId]);

  const handleSubmitDecision = () => {
    if (decision && notes.trim()) {
      onDecision(decision, notes);
    }
  };

  const getCreditScoreStatus = (score: number) => {
    if (score >= 740) return { color: 'text-success', status: 'Excellent' };
    if (score >= 670) return { color: 'text-blue-600', status: 'Good' };
    if (score >= 580) return { color: 'text-warning', status: 'Fair' };
    return { color: 'text-destructive', status: 'Poor' };
  };

  const getDTIStatus = (dti: number) => {
    if (dti <= 36) return { color: 'text-success', status: 'Excellent' };
    if (dti <= 43) return { color: 'text-blue-600', status: 'Good' };
    if (dti <= 50) return { color: 'text-warning', status: 'Fair' };
    return { color: 'text-destructive', status: 'High Risk' };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !application) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Application</h2>
          <p className="text-muted-foreground mb-6">{error || 'Application not found'}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate derived values with safe defaults
  const creditScore = aiAssessment?.credit_score || 700;
  const debtToIncome = aiAssessment?.debt_to_income || 35;
  const creditStatus = getCreditScoreStatus(creditScore);
  const dtiStatus = getDTIStatus(debtToIncome);

  // Mock advanced AI insights from GetSmile API data
  // In production, these would come from the AI analysis of Smile API employment/income data
  const incomeSources: IncomeSource[] = [
    {
      source: 'Permanent Salary',
      provider: 'ABC Corporation',
      type: 'permanent',
      monthly_income: 85000,
      trust_score: 95,
      verified_by: 'Pag-IBIG (pagibig_ph)',
      volatility: 'low',
    },
    {
      source: 'Freelance (Upwork)',
      provider: 'Upwork Inc.',
      type: 'freelance',
      monthly_income: 45000,
      trust_score: 72,
      verified_by: 'Upwork API',
      volatility: 'medium',
    },
    {
      source: 'Gig Economy',
      provider: 'Foodpanda',
      type: 'gig',
      monthly_income: 28000,
      trust_score: 68,
      verified_by: 'Foodpanda Partner API',
      volatility: 'high',
    },
  ];

  const totalVerifiedIncome = incomeSources.reduce((sum, source) => sum + source.monthly_income, 0);

  const aiObservations: AIObservation[] = [
    {
      label: 'High Identity Trust',
      text: 'Data retrieved directly from Pag-IBIG government portal, reducing identity theft risk by 80% compared to manual uploads',
      impact: 'positive',
    },
    {
      label: 'Income Diversification',
      text: 'Applicant maintains active gig-economy accounts (Upwork/Foodpanda) while working a permanent role. This provides a safety net for repayment if primary employment is lost.',
      impact: 'positive',
    },
    {
      label: 'Stable Employment History',
      text: 'Permanent employment verified through government HRIS system with 3+ years tenure at ABC Corporation',
      impact: 'positive',
    },
    {
      label: 'Freelance Income Volatility',
      text: 'Upwork income shows 15% month-over-month variation. Consider this when calculating affordability.',
      impact: 'warning',
    },
  ];

  const fraudFlags: AIObservation[] = [];

  // Add fraud detection if DTI is too high
  if (debtToIncome > 43) {
    fraudFlags.push({
      label: 'High DTI Alert',
      text: 'Debt-to-Income ratio exceeds recommended threshold. Review counter-offer suggestion below.',
      impact: 'warning',
    });
  }

  const counterOffer: CounterOffer | null =
    debtToIncome > 40
      ? {
          suggested_amount: Math.round(application.loan_amount * 0.7),
          original_dti: debtToIncome,
          new_dti: Math.round(debtToIncome * 0.7),
          reasoning: `Requested amount (₱${application.loan_amount.toLocaleString('en-PH')}) leads to a high risk DTI of ${debtToIncome}%. AI suggests a counter-offer which brings the DTI to a healthy range based on verified income.`,
        }
      : null;

  const confidenceScore = 85; // Based on data source reliability (higher for government sources)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-secondary rounded-lg transition-colors touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <h1 className="text-primary text-base sm:text-lg lg:text-xl">Application Review</h1>
              <p className="text-xs text-muted-foreground">ID: {application.id?.slice(0, 8)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Applicant Info */}
            <div className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-foreground mb-1">
                      {application.applicant_name || 'N/A'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {application.applicant_email || 'No email provided'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {application.applicant_phone || 'No phone provided'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Submitted</p>
                  <p className="text-sm font-medium text-foreground">
                    {application.created_at
                      ? new Date(application.created_at).toLocaleDateString('en-PH', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-medium text-foreground capitalize">
                    {application.status.replace('_', ' ')}
                  </p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Bank</p>
                  <p className="font-medium text-foreground">
                    {application.bank_name || 'Not connected'}
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm">
              <h3 className="text-foreground mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-primary" />
                Loan Details
                {application.status === 'pending_final_approval' && application.accepted_bank_name && (
                  <span className="ml-auto text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">
                    Accepted Offer
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {application.status === 'pending_final_approval' && application.accepted_bank_name ? 'Accepted Amount' : 'Requested Amount'}
                  </p>
                  <p className="text-xl font-semibold text-primary">
                    ₱{(application.status === 'pending_final_approval' && application.accepted_offer_amount 
                      ? application.accepted_offer_amount 
                      : application.loan_amount
                    ).toLocaleString('en-PH')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                  <p className="text-xl font-semibold text-foreground">
                    {application.status === 'pending_final_approval' && application.accepted_offer_rate 
                      ? application.accepted_offer_rate 
                      : application.interest_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Loan Term</p>
                  <p className="text-xl font-semibold text-foreground">
                    {application.status === 'pending_final_approval' && application.accepted_offer_term 
                      ? application.accepted_offer_term 
                      : application.loan_term} mo
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                  <p className="text-xl font-semibold text-foreground">
                    ₱{(application.status === 'pending_final_approval' && application.accepted_offer_monthly_payment 
                      ? application.accepted_offer_monthly_payment 
                      : application.monthly_payment
                    ).toLocaleString('en-PH')}
                  </p>
                </div>
              </div>
              {application.status === 'pending_final_approval' && application.accepted_bank_name && (
                <div className="mt-4 pt-4 border-t border-[#e2e8f0] text-xs text-muted-foreground">
                  <p className="flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    These are the final terms from the accepted offer by {application.accepted_bank_name}
                  </p>
                </div>
              )}
            </div>

            {/* Accepted Bank Offer (if pending final approval) */}
            {application.status === 'pending_final_approval' && application.accepted_bank_name && (
              <div className="bg-gradient-to-br from-success/10 to-primary/10 rounded-lg p-6 border-2 border-success/30 shadow-sm">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-success" />
                      Accepted Bank Offer - Awaiting Final Approval
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Customer has selected and accepted this offer. Please review and provide final approval.
                    </p>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    {application.accepted_bank_logo && (
                      <img
                        src={application.accepted_bank_logo}
                        alt={application.accepted_bank_name}
                        className="w-12 h-12 rounded-lg object-cover border border-[#e2e8f0]"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold text-foreground">{application.accepted_bank_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Accepted on {application.accepted_at ? new Date(application.accepted_at).toLocaleDateString('en-PH', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {application.accepted_offer_rate && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                        <p className="text-lg font-semibold text-success">
                          {application.accepted_offer_rate}%
                        </p>
                      </div>
                    )}
                    {application.accepted_offer_amount && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                        <p className="text-lg font-semibold text-foreground">
                          ₱{application.accepted_offer_amount.toLocaleString('en-PH')}
                        </p>
                      </div>
                    )}
                    {application.accepted_offer_term && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Term</p>
                        <p className="text-lg font-semibold text-foreground">
                          {application.accepted_offer_term} months
                        </p>
                      </div>
                    )}
                    {application.accepted_offer_monthly_payment && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                        <p className="text-lg font-semibold text-foreground">
                          ₱{application.accepted_offer_monthly_payment.toLocaleString('en-PH')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Additional Details */}
                  {(application.accepted_offer_total_interest || application.accepted_offer_processing_fee) && (
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#e2e8f0]">
                      {application.accepted_offer_total_interest && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                          <p className="text-sm font-medium text-foreground">
                            ₱{application.accepted_offer_total_interest.toLocaleString('en-PH')}
                          </p>
                        </div>
                      )}
                      {application.accepted_offer_processing_fee && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Processing Fee</p>
                          <p className="text-sm font-medium text-foreground">
                            ₱{application.accepted_offer_processing_fee.toLocaleString('en-PH')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Approval Action Note */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <strong>Action Required:</strong> Review the accepted offer details and borrower's profile, then approve or reject for final processing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Profile */}
            <div className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm">
              <h3 className="text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Financial Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiAssessment?.credit_score && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Credit Score</p>
                      <span className={`text-sm font-medium ${creditStatus.color}`}>
                        {creditStatus.status}
                      </span>
                    </div>
                    <p className="text-3xl font-semibold text-foreground mb-2">
                      {creditScore}
                    </p>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success"
                        style={{ width: `${(creditScore / 850) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {aiAssessment?.debt_to_income && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Debt-to-Income Ratio</p>
                      <span className={`text-sm font-medium ${dtiStatus.color}`}>
                        {dtiStatus.status}
                      </span>
                    </div>
                    <p className="text-3xl font-semibold text-foreground mb-2">
                      {debtToIncome}%
                    </p>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success"
                        style={{ width: `${100 - debtToIncome}%` }}
                      />
                    </div>
                  </div>
                )}

                {application.monthly_income && (
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Income</p>
                    <p className="text-xl font-semibold text-success">
                      ₱{application.monthly_income.toLocaleString('en-PH')}
                    </p>
                  </div>
                )}

                {application.account_balance && (
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Account Balance</p>
                    <p className="text-xl font-semibold text-primary">
                      ₱{application.account_balance.toLocaleString('en-PH')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Income Sources - NEW */}
            <div className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Verified Income Sources
                </h3>
                <span className="text-sm font-medium text-muted-foreground">
                  Total: ₱{totalVerifiedIncome.toLocaleString('en-PH')}/mo
                </span>
              </div>

              <div className="space-y-3">
                {incomeSources.map((source, index) => (
                  <div
                    key={index}
                    className="border border-[#e2e8f0] rounded-lg p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{source.source}</p>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              source.type === 'permanent'
                                ? 'bg-success/10 text-success'
                                : source.type === 'freelance'
                                ? 'bg-primary/10 text-primary'
                                : source.type === 'gig'
                                ? 'bg-warning/10 text-warning'
                                : 'bg-blue-500/10 text-blue-600'
                            }`}
                          >
                            {source.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{source.provider}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3 text-success" />
                            <span className="text-muted-foreground">Verified by {source.verified_by}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-semibold text-success">
                          ₱{source.monthly_income.toLocaleString('en-PH')}
                        </p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#e2e8f0]">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Trust Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                source.trust_score >= 90
                                  ? 'bg-success'
                                  : source.trust_score >= 70
                                  ? 'bg-primary'
                                  : 'bg-warning'
                              }`}
                              style={{ width: `${source.trust_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground">{source.trust_score}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Volatility</p>
                        <span
                          className={`text-xs font-medium ${
                            source.volatility === 'low'
                              ? 'text-success'
                              : source.volatility === 'medium'
                              ? 'text-warning'
                              : 'text-destructive'
                          }`}
                        >
                          {source.volatility.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    <strong>Source Trust Indicator:</strong> Government-verified sources (Pag-IBIG, BIR) receive
                    higher trust scores, reducing identity theft risk by up to 80%.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Observations - NEW */}
            <div className="bg-gradient-to-br from-success/5 to-primary/5 rounded-lg p-6 border-2 border-success/20 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success to-primary text-white flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-foreground">AI Credit Analyst Observations</h3>
                  <p className="text-sm text-muted-foreground">Advanced insights from Smile API data analysis</p>
                </div>
              </div>

              <div className="space-y-3">
                {aiObservations.map((observation, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-lg p-4 border-l-4 ${
                      observation.impact === 'positive'
                        ? 'border-l-success'
                        : observation.impact === 'warning'
                        ? 'border-l-warning'
                        : 'border-l-destructive'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          observation.impact === 'positive'
                            ? 'bg-success/10 text-success'
                            : observation.impact === 'warning'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {observation.impact === 'positive' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : observation.impact === 'warning' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground mb-1">{observation.label}</p>
                        <p className="text-sm text-muted-foreground">{observation.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-white rounded-lg p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">Analysis Confidence</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{confidenceScore}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on data source reliability and verification methods
                </p>
              </div>
            </div>

            {/* Fraud Detection Flags - NEW */}
            {fraudFlags.length > 0 && (
              <div className="bg-gradient-to-br from-warning/5 to-destructive/5 rounded-lg p-6 border-2 border-warning/30 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-warning text-white flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-warning">Fraud Detection Alerts</h3>
                    <p className="text-sm text-muted-foreground">Automated risk checks and heuristics</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {fraudFlags.map((flag, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-l-warning">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-foreground mb-1">{flag.label}</p>
                          <p className="text-sm text-muted-foreground">{flag.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Counter-Offer Suggestion - NEW */}
            {counterOffer && (
              <div className="bg-gradient-to-br from-primary/5 to-warning/5 rounded-lg p-6 border-2 border-primary/30 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-primary">DTI Optimization - Counter-Offer</h3>
                    <p className="text-sm text-muted-foreground">AI-recommended alternative to save the deal</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 mb-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Requested Amount</p>
                      <p className="text-xl font-semibold text-foreground line-through decoration-destructive">
                        ₱{application.loan_amount.toLocaleString('en-PH')}
                      </p>
                      <p className="text-xs text-destructive mt-1">DTI: {counterOffer.original_dti}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Suggested Amount</p>
                      <p className="text-xl font-semibold text-success">
                        ₱{counterOffer.suggested_amount.toLocaleString('en-PH')}
                      </p>
                      <p className="text-xs text-success mt-1">DTI: {counterOffer.new_dti}%</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e2e8f0]">
                    <p className="text-sm text-muted-foreground">{counterOffer.reasoning}</p>
                  </div>
                </div>

                <div className="bg-success/5 border border-success/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Recommendation</p>
                      <p className="text-sm text-muted-foreground">
                        Approve with counter-offer amount to maintain healthy DTI ratio while supporting the
                        applicant's financial needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Verification */}
            {application.bank_connected && (
              <div className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm">
                <h3 className="text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Bank Verification
                </h3>
                <div className="flex items-center gap-3 bg-success/5 border border-success/20 rounded-lg p-4">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      Verified via {application.bank_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Account and income verification completed through GetSMILE API
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Assessment */}
            {aiAssessment && (
              <div className="bg-gradient-to-br from-primary/5 to-success/5 rounded-lg p-6 border-2 border-primary/20 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-success text-white flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-primary">AI Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      Automated analysis and recommendation
                    </p>
                  </div>
                </div>

                {/* Overall Score */}
                <div className="bg-white rounded-lg p-4 mb-4 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Overall AI Score</p>
                      <p className="text-4xl font-bold text-primary">
                        {aiAssessment.overall_score}/100
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-4 py-2 rounded-lg bg-success/10 text-success border border-success/20 text-sm font-semibold">
                        {aiAssessment.overall_score >= 80
                          ? 'Excellent'
                          : aiAssessment.overall_score >= 65
                          ? 'Good'
                          : 'Fair'}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300"
                      style={{ width: `${aiAssessment.overall_score}%` }}
                    />
                  </div>
                </div>

                {/* AI Scores Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {aiAssessment.identity_score && (
                    <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
                      <p className="text-xs text-muted-foreground mb-1">Identity Score</p>
                      <p className="text-2xl font-semibold text-primary">
                        {aiAssessment.identity_score}
                      </p>
                    </div>
                  )}
                  {aiAssessment.credit_score && (
                    <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
                      <p className="text-xs text-muted-foreground mb-1">Credit Score</p>
                      <p className="text-2xl font-semibold text-success">
                        {aiAssessment.credit_score}
                      </p>
                    </div>
                  )}
                  {aiAssessment.risk_score && (
                    <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
                      <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {aiAssessment.risk_score}
                      </p>
                    </div>
                  )}
                  {aiAssessment.affordability_score && (
                    <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
                      <p className="text-xs text-muted-foreground mb-1">Affordability</p>
                      <p className="text-2xl font-semibold text-success">
                        {aiAssessment.affordability_score}
                      </p>
                    </div>
                  )}
                </div>

                {aiAssessment.fraud_risk && (
                  <div className="mt-4 bg-white rounded-lg p-4 border border-[#e2e8f0]">
                    <p className="text-sm font-medium text-foreground mb-1">Fraud Risk</p>
                    <p className="text-lg font-semibold text-success">
                      {aiAssessment.fraud_risk}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Processing Timeline */}
            <div className="bg-white rounded-lg p-6 border border-[#e2e8f0] shadow-sm">
              <h3 className="text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Processing Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="w-0.5 h-full bg-success/30 mt-2" />
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium text-foreground mb-1">Application Submitted</p>
                    <p className="text-sm text-muted-foreground mb-1">
                      Loan application received and validated
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {application.created_at
                        ? new Date(application.created_at).toLocaleString('en-PH')
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {application.bank_connected && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="w-0.5 h-full bg-success/30 mt-2" />
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-medium text-foreground mb-1">Bank Account Verified</p>
                      <p className="text-sm text-muted-foreground">
                        Connected to {application.bank_name} via GetSMILE API
                      </p>
                    </div>
                  </div>
                )}

                {application.identity_verified && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="w-0.5 h-full bg-success/30 mt-2" />
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-medium text-foreground mb-1">Identity Verified</p>
                      <p className="text-sm text-muted-foreground">
                        Document authenticity confirmed
                      </p>
                    </div>
                  </div>
                )}

                {aiAssessment && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-success text-success-foreground flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-1">AI Assessment Complete</p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Score: {aiAssessment.overall_score}/100 - {aiAssessment.recommendation}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {aiAssessment.created_at
                          ? new Date(aiAssessment.created_at).toLocaleString('en-PH')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - AI Recommendation & Decision */}
          <div className="space-y-6">
            {/* AI Recommendation */}
            <div className="bg-gradient-to-br from-primary/10 to-success/10 rounded-lg p-6 border-2 border-primary/30 shadow-lg sticky top-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-primary">AI Recommendation</h3>
                  {application.ai_confidence && (
                    <p className="text-xs text-muted-foreground">
                      Confidence: {application.ai_confidence}%
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <p className="font-semibold text-foreground">
                    {application.ai_recommendation || 'Under Review'}
                  </p>
                </div>
                {application.ai_score && (
                  <>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-success"
                        style={{ width: `${application.ai_score}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI Score: {application.ai_score}/100
                    </p>
                  </>
                )}
              </div>

              {/* Decision Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Your Decision
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDecision('approved')}
                      className={`
                        px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2
                        ${
                          decision === 'approved'
                            ? 'border-success bg-success text-success-foreground shadow-md'
                            : 'border-[#e2e8f0] bg-white hover:border-success/50'
                        }
                      `}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-medium">Approve</span>
                    </button>
                    <button
                      onClick={() => setDecision('rejected')}
                      className={`
                        px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2
                        ${
                          decision === 'rejected'
                            ? 'border-destructive bg-destructive text-destructive-foreground shadow-md'
                            : 'border-[#e2e8f0] bg-white hover:border-destructive/50'
                        }
                      `}
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="font-medium">Reject</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                    Notes <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="Add your review notes and justification..."
                  />
                </div>

                <button
                  onClick={handleSubmitDecision}
                  disabled={!decision || !notes.trim()}
                  className={`
                    w-full px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
                    ${
                      decision && notes.trim()
                        ? decision === 'approved'
                          ? 'bg-success text-success-foreground hover:bg-success/90 shadow-md hover:shadow-lg'
                          : 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }
                  `}
                >
                  <MessageSquare className="w-5 h-5" />
                  Submit Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}