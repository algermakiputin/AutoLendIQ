import { useState } from 'react';
import { LoanPurposeStep } from './loan-purpose-step';
import { LoanAmountStep } from './loan-amount-step';
import { BankVerificationStep } from './bank-verification-step';
import { IdentityVerificationStep } from './identity-verification-step';
import { AgentReviewStep } from './agent-review-step';
import { LoanProgressTracker } from './loan-progress-tracker';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface LoanApplicationWizardProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function LoanApplicationWizard({ onComplete, onBack }: LoanApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loanData, setLoanData] = useState({
    purpose: undefined as string | undefined,
    amount: 1500000,
    interestRate: 7.5,
    term: 48,
    monthlyPayment: 36414.38,
    documents: [] as File[],
    bankConnected: false,
    bankName: undefined as string | undefined,
    accountVerified: false,
    accountBalance: undefined as number | undefined,
    monthlyIncome: undefined as number | undefined,
  });

  const handlePurposeNext = () => {
    setCurrentStep(2);
  };

  const handleLoanAmountNext = () => {
    setCurrentStep(3);
  };

  const handleBankVerificationNext = () => {
    setCurrentStep(4);
  };

  const handleIdentityNext = () => {
    setCurrentStep(5);
  };

  const steps = [
    { number: 1, title: 'Loan Purpose', status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'active' : 'upcoming' },
    { number: 2, title: 'Loan Amount', status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'active' : 'upcoming' },
    { number: 3, title: 'Bank Connection', status: currentStep > 3 ? 'complete' : currentStep === 3 ? 'active' : 'upcoming' },
    { number: 4, title: 'Identity Check', status: currentStep > 4 ? 'complete' : currentStep === 4 ? 'active' : 'upcoming' },
    { number: 5, title: 'AI Review', status: currentStep === 5 ? 'active' : 'upcoming' },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back to Landing */}
      {onBack && (
        <div className="bg-white border-b border-[#e2e8f0] sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-sm sm:text-base">Back to Home</span>
              </button>
              
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="font-semibold text-primary text-sm sm:text-base">AutoLend IQ</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Progress Tracker */}
        <LoanProgressTracker steps={steps} />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-16">
          <div className="max-w-3xl mx-auto">
            {currentStep === 1 && (
              <LoanPurposeStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handlePurposeNext}
              />
            )}
            {currentStep === 2 && (
              <LoanAmountStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handleLoanAmountNext}
              />
            )}
            {currentStep === 3 && (
              <BankVerificationStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handleBankVerificationNext}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <IdentityVerificationStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handleIdentityNext}
                onBack={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 5 && (
              <AgentReviewStep
                loanData={loanData}
                onBack={() => setCurrentStep(4)}
                onComplete={onComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}