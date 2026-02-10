import { Banknote, Calendar, Percent, TrendingUp, User, Briefcase, PieChart } from 'lucide-react';

interface LoanApplication {
  applicantName: string;
  applicationId: string;
  amount: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  purpose: string;
  submittedDate: string;
  creditScore: number;
  debtToIncome: number;
  employmentYears: number;
  annualIncome: number;
}

interface LoanSummaryCardProps {
  application: LoanApplication;
}

export function LoanSummaryCard({ application }: LoanSummaryCardProps) {
  // Calculate credit score color and status
  const getCreditScoreStatus = (score: number) => {
    if (score >= 740) return { color: '#10B981', status: 'Excellent', width: 90 };
    if (score >= 670) return { color: '#3b82f6', status: 'Good', width: 70 };
    if (score >= 580) return { color: '#F59E0B', status: 'Fair', width: 50 };
    return { color: '#ef4444', status: 'Poor', width: 30 };
  };

  const creditStatus = getCreditScoreStatus(application.creditScore);

  // Calculate debt-to-income status
  const getDTIStatus = (dti: number) => {
    if (dti <= 36) return { color: '#10B981', status: 'Excellent' };
    if (dti <= 43) return { color: '#3b82f6', status: 'Good' };
    if (dti <= 50) return { color: '#F59E0B', status: 'Fair' };
    return { color: '#ef4444', status: 'High Risk' };
  };

  const dtiStatus = getDTIStatus(application.debtToIncome);

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="mb-1">Loan Application Summary</h3>
            <p className="text-sm opacity-90">{application.applicantName}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
        </div>
        <div className="text-4xl font-semibold mb-1">
          ₱{application.amount.toLocaleString('en-PH')}
        </div>
        <p className="text-sm opacity-90">Requested Amount</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Loan Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Percent className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Interest Rate</span>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {application.interestRate}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">APR</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-success" />
              </div>
              <span className="text-xs text-muted-foreground">Loan Term</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {application.term}
            </p>
            <p className="text-xs text-muted-foreground mt-1">months</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Banknote className="w-4 h-4 text-warning" />
              </div>
              <span className="text-xs text-muted-foreground">Monthly Payment</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">
              ₱{application.monthlyPayment.toLocaleString('en-PH')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">per month</p>
          </div>

          <div className="bg-background rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Purpose</span>
            </div>
            <p className="text-sm font-semibold text-foreground mt-2">
              {application.purpose}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#e2e8f0]"></div>

        {/* Applicant Financial Profile */}
        <div>
          <h4 className="mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Financial Profile
          </h4>

          {/* Credit Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Credit Score</span>
              <div className="text-right">
                <span className="text-2xl font-semibold" style={{ color: creditStatus.color }}>
                  {application.creditScore}
                </span>
                <span className="text-xs text-muted-foreground ml-2">/ 850</span>
              </div>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${creditStatus.width}%`,
                  backgroundColor: creditStatus.color,
                }}
              />
            </div>
            <p className="text-xs font-medium" style={{ color: creditStatus.color }}>
              {creditStatus.status}
            </p>
          </div>

          {/* Debt-to-Income Ratio */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Debt-to-Income Ratio</span>
              <div className="text-right">
                <span className="text-2xl font-semibold" style={{ color: dtiStatus.color }}>
                  {application.debtToIncome}%
                </span>
              </div>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${application.debtToIncome}%`,
                  backgroundColor: dtiStatus.color,
                }}
              />
            </div>
            <p className="text-xs font-medium" style={{ color: dtiStatus.color }}>
              {dtiStatus.status}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Annual Income</p>
              <p className="text-lg font-semibold text-foreground">
                ₱{(application.annualIncome / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-background rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Employment</p>
              <p className="text-lg font-semibold text-foreground">
                {application.employmentYears} years
              </p>
            </div>
          </div>
        </div>

        {/* Submission Date */}
        <div className="pt-4 border-t border-[#e2e8f0]">
          <p className="text-xs text-muted-foreground">
            Submitted on {new Date(application.submittedDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}