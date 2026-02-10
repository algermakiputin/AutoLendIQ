import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Sparkles, Shield, FileCheck, UserCheck, TrendingUp } from 'lucide-react';
import { createLoanApplication, createAIAssessment } from '../../utils/api';

interface AgentReviewStepProps {
  loanData: {
    amount: number;
    interestRate: number;
    term: number;
    monthlyPayment: number;
    documents: File[];
    bankConnected?: boolean;
    bankName?: string;
    accountVerified?: boolean;
    accountBalance?: number;
    monthlyIncome?: number;
  };
  onBack: () => void;
  onComplete?: () => void;
}

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'pending' | 'processing' | 'complete';
  progress: number;
}

export function AgentReviewStep({ loanData, onBack, onComplete }: AgentReviewStepProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'identity',
      title: 'Verifying Identity',
      description: 'Analyzing document authenticity and matching details...',
      icon: UserCheck,
      status: 'processing',
      progress: 0,
    },
    {
      id: 'credit',
      title: 'Credit Assessment',
      description: 'Evaluating credit history and financial profile...',
      icon: TrendingUp,
      status: 'pending',
      progress: 0,
    },
    {
      id: 'risk',
      title: 'Risk Analysis',
      description: 'Running AI-powered risk models...',
      icon: Shield,
      status: 'pending',
      progress: 0,
    },
    {
      id: 'approval',
      title: 'Final Review',
      description: 'Generating your personalized loan offer...',
      icon: FileCheck,
      status: 'pending',
      progress: 0,
    },
  ]);

  useEffect(() => {
    // Simulate AI processing with realistic timing
    const intervals: NodeJS.Timeout[] = [];

    const processStep = (stepIndex: number) => {
      if (stepIndex >= processingSteps.length) {
        setIsComplete(true);
        // Save application data to Supabase
        saveApplicationToDatabase();
        // Don't auto-navigate - let user click button
        return;
      }

      // Update step to processing
      setProcessingSteps((prev) =>
        prev.map((step, idx) =>
          idx === stepIndex ? { ...step, status: 'processing' as const } : step
        )
      );

      // Simulate progress for current step
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);

          // Mark step as complete
          setProcessingSteps((prev) =>
            prev.map((step, idx) =>
              idx === stepIndex
                ? { ...step, status: 'complete' as const, progress: 100 }
                : step
            )
          );

          // Move to next step after a brief pause
          setTimeout(() => {
            setCurrentPhase(stepIndex + 1);
            processStep(stepIndex + 1);
          }, 800);
        }

        setProcessingSteps((prev) =>
          prev.map((step, idx) =>
            idx === stepIndex ? { ...step, progress: Math.min(progress, 100) } : step
          )
        );
      }, 300);

      intervals.push(progressInterval);
    };

    // Start processing
    processStep(0);

    // Update overall progress
    const overallInterval = setInterval(() => {
      setOverallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(overallInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 120);

    intervals.push(overallInterval);

    return () => {
      intervals.forEach(clearInterval);
    };
  }, []);

  const saveApplicationToDatabase = async () => {
    setIsSaving(true);
    try {
      // Generate AI scores
      const aiScore = 75 + Math.random() * 20; // 75-95 score
      const confidence = 80 + Math.random() * 15; // 80-95% confidence
      const recommendation = aiScore >= 85 ? 'Approve' : aiScore >= 75 ? 'Review' : 'Decline';
      
      // Create loan application
      const application = await createLoanApplication({
        loan_amount: loanData.amount,
        interest_rate: loanData.interestRate,
        loan_term: loanData.term,
        monthly_payment: loanData.monthlyPayment,
        bank_name: loanData.bankName,
        bank_connected: loanData.bankConnected || false,
        account_verified: loanData.accountVerified || false,
        account_balance: loanData.accountBalance,
        monthly_income: loanData.monthlyIncome,
        identity_verified: true,
        ai_score: aiScore,
        ai_recommendation: recommendation,
        ai_confidence: confidence,
        status: 'under_review',
      });
      
      setApplicationId(application.id!);
      
      // Create AI assessment details
      await createAIAssessment({
        application_id: application.id!,
        overall_score: aiScore,
        recommendation,
        confidence,
        identity_score: 90 + Math.random() * 10,
        credit_score: 70 + Math.random() * 25,
        risk_score: 75 + Math.random() * 20,
        fraud_risk: aiScore >= 85 ? 'Low' : 'Medium',
        debt_to_income: 0.25 + Math.random() * 0.15,
        payment_history_score: 75 + Math.random() * 20,
        affordability_score: 70 + Math.random() * 25,
        assessment_data: {
          identity_verification: {
            document_authenticity: 95,
            face_match: 92,
            address_verification: 88
          },
          credit_assessment: {
            credit_history_length: '5 years',
            outstanding_loans: 2,
            credit_utilization: 35
          },
          risk_analysis: {
            default_probability: 5.2,
            risk_category: aiScore >= 85 ? 'Low' : 'Medium',
            mitigating_factors: ['Stable income', 'Good bank history']
          },
          income_verification: {
            verified_monthly_income: loanData.monthlyIncome || 75000,
            income_stability_score: 85,
            employment_verification: 'Verified'
          }
        }
      });
      
      console.log('Application saved successfully:', application.id);
    } catch (error) {
      console.error('Error saving application:', error);
      // Don't show error to user, just log it
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-primary">AI Agent Review</h1>
            <p className="text-sm text-muted-foreground">Processing your application in real-time</p>
          </div>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-card rounded-lg p-8 shadow-lg border border-[#e2e8f0]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground">Overall Progress</h2>
            <span className="text-2xl font-semibold text-primary">{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {!isComplete && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Estimated time remaining: {Math.max(1, Math.ceil((100 - overallProgress) / 10))} minutes</span>
          </div>
        )}

        {isComplete && (
          <div className="flex items-center gap-3 text-sm text-success">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Processing complete!</span>
          </div>
        )}
      </div>

      {/* Processing Steps */}
      <div className="space-y-4">
        {processingSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.status === 'processing';
          const isComplete = step.status === 'complete';
          const isPending = step.status === 'pending';

          return (
            <div
              key={step.id}
              className={`
                bg-card rounded-lg p-6 border transition-all duration-300
                ${
                  isActive
                    ? 'border-primary shadow-lg scale-[1.02]'
                    : isComplete
                    ? 'border-success/50 shadow-md'
                    : 'border-border shadow-sm opacity-60'
                }
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300
                    ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-lg animate-pulse'
                        : isComplete
                        ? 'bg-success text-success-foreground shadow-md'
                        : 'bg-secondary text-muted-foreground'
                    }
                  `}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`
                        transition-colors
                        ${isActive ? 'text-primary' : isComplete ? 'text-success' : 'text-foreground'}
                      `}
                    >
                      {step.title}
                    </h3>
                    {(isActive || isComplete) && (
                      <span className="text-sm font-semibold text-muted-foreground">
                        {Math.round(step.progress)}%
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                  {/* Progress Bar */}
                  {(isActive || isComplete) && (
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`
                          h-full transition-all duration-300
                          ${isComplete ? 'bg-success' : 'bg-primary'}
                        `}
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  )}

                  {isComplete && (
                    <p className="text-xs text-success font-medium mt-2">✓ Complete</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loan Summary */}
      {isComplete && (
        <div className="bg-gradient-to-br from-primary/10 to-success/10 rounded-lg p-8 border-2 border-primary/30 shadow-xl animate-in fade-in duration-500">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-primary mb-2">Application na Kumpleto!</h2>
              <p className="text-muted-foreground">
                Ang iyong loan application ay natapos na ang AI review at handa na para sa final approval ng lending agent.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 space-y-4">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-success" />
                <p className="font-semibold text-foreground">Mga Naverify na Detalye:</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-7">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Identity verification - Kumpleto</span>
                </li>
                {loanData.bankConnected && (
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Bank account at income verification - Kumpleto</span>
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Credit assessment - Kumpleto</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>Risk analysis - Kumpleto</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#e2e8f0]">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Requested Amount</p>
                <p className="text-2xl font-semibold text-primary">
                  ₱{loanData.amount.toLocaleString('en-PH')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                <p className="text-2xl font-semibold text-foreground">
                  {loanData.interestRate}% APR
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loan Term</p>
                <p className="text-2xl font-semibold text-foreground">
                  {loanData.term} buwan
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                <p className="text-2xl font-semibold text-foreground">
                  ₱{loanData.monthlyPayment.toLocaleString('en-PH', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="pt-4 bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm mb-1">Naghihintay ng Agent Approval</p>
                  <p className="text-sm text-muted-foreground">
                    Ang lending agent ay magsusuri ng iyong application at magbibigay ng final decision sa loob ng 24-48 oras.
                    Makakatanggap ka ng email notification kapag natapos na ang review.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* View Dashboard Button */}
          {onComplete && (
            <div className="mt-6">
              <button
                onClick={onComplete}
                className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2"
              >
                Tingnan ang Full Dashboard
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {!isComplete && (
        <div className="flex justify-start pt-4">
          <button
            onClick={onBack}
            disabled={overallProgress > 10}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${
                overallProgress > 10
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }
            `}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}