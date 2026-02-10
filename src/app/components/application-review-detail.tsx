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
} from 'lucide-react';
import { getLoanApplication, getAIAssessment, type LoanApplicationData, type AIAssessmentData } from '../../utils/api';

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
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Requested Amount</p>
                  <p className="text-xl font-semibold text-primary">
                    ₱{application.loan_amount.toLocaleString('en-PH')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                  <p className="text-xl font-semibold text-foreground">
                    {application.interest_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Loan Term</p>
                  <p className="text-xl font-semibold text-foreground">
                    {application.loan_term} mo
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                  <p className="text-xl font-semibold text-foreground">
                    ₱{application.monthly_payment.toLocaleString('en-PH')}
                  </p>
                </div>
              </div>
            </div>

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