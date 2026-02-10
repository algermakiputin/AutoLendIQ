import { LoanSummaryCard } from './loan-summary-card';
import { AgentTimeline } from './agent-timeline';
import { RecommendationCard } from './recommendation-card';
import { Bell, User, Activity, ArrowLeft } from 'lucide-react';

interface LoanReviewDashboardProps {
  onBack: () => void;
}

export function LoanReviewDashboard({ onBack }: LoanReviewDashboardProps) {
  // Mock loan application data
  const loanApplication = {
    applicantName: 'Maria Santos',
    applicationId: 'AL-2026-00847',
    amount: 2250000,
    interestRate: 7.8,
    term: 48,
    monthlyPayment: 54562,
    purpose: 'Home Renovation',
    submittedDate: '2026-02-05',
    creditScore: 742,
    debtToIncome: 32,
    employmentYears: 6,
    annualIncome: 4750000,
  };

  const agentActions = [
    {
      id: 1,
      title: 'Bank Account Verified',
      description: 'Financial data retrieved via GetSMILE API',
      status: 'complete' as const,
      timestamp: '2026-02-05 10:22 AM',
      details: 'Account balance and income verified through secure bank connection',
    },
    {
      id: 2,
      title: 'Identity Verified',
      description: 'Document authenticity confirmed via AI analysis',
      status: 'complete' as const,
      timestamp: '2026-02-05 10:23 AM',
      details: 'Government-issued ID verified, facial recognition matched',
    },
    {
      id: 3,
      title: 'Credit Scored',
      description: 'Credit history evaluated across all bureaus',
      status: 'complete' as const,
      timestamp: '2026-02-05 10:24 AM',
      details: 'FICO Score: 742 (Good) - No delinquencies in past 24 months',
    },
    {
      id: 4,
      title: 'Fraud Check Passed',
      description: 'Advanced pattern recognition complete',
      status: 'complete' as const,
      timestamp: '2026-02-05 10:25 AM',
      details: 'No suspicious patterns detected, application deemed legitimate',
    },
    {
      id: 5,
      title: 'Income Verification',
      description: 'Employment and income sources confirmed',
      status: 'complete' as const,
      timestamp: '2026-02-05 10:26 AM',
      details: 'Stable employment verified, income matches reported figures',
    },
    {
      id: 6,
      title: 'Risk Assessment',
      description: 'Comprehensive risk model analysis',
      status: 'complete' as const,
      timestamp: '2026-02-05 10:27 AM',
      details: 'Low default probability: 2.3% over loan term',
    },
  ];

  const recommendation = {
    status: 'Strong Match',
    confidence: 94,
    riskScore: 23,
    approvalProbability: 96,
    reasons: [
      'Excellent credit history with consistent payment record',
      'Stable employment and income exceeds threshold',
      'Low debt-to-income ratio indicates financial health',
      'No fraud indicators detected',
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-semibold">AL</span>
              </div>
              <div>
                <h1 className="font-semibold text-primary">AutoLend IQ</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Loan Review Dashboard
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Application</span>
                <span className="sm:hidden">Back</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <User className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
        {/* Application Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-primary mb-1">
                Loan Application Review
              </h2>
              <p className="text-muted-foreground">
                Application ID: {loanApplication.applicationId} • Applicant: {loanApplication.applicantName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-lg bg-success/10 text-success border border-success/20">
                <span className="font-medium text-sm">✓ Ready for Review</span>
              </div>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary mb-1">AI Analysis Complete</h4>
                <p className="text-sm text-muted-foreground">
                  All verification steps completed successfully. Review the details below and generate the loan contract when ready.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Loan Summary */}
          <LoanSummaryCard application={loanApplication} />

          {/* Right: Agent Timeline */}
          <AgentTimeline actions={agentActions} />
        </div>

        {/* Bottom: Recommendation Card */}
        <RecommendationCard recommendation={recommendation} />
      </main>
    </div>
  );
}