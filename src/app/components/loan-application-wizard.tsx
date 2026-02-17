import { useState } from "react";
import { PersonalInfoStep } from "./personal-info-step";
import { LoanPurposeStep } from "./loan-purpose-step";
import { LoanAmountStep } from "./loan-amount-step";
import { BankSelectionStep } from "./bank-selection-step";
import { BankVerificationStep } from "./bank-verification-step";
import { IdentityVerificationStep } from "./identity-verification-step";
import { AgentReviewStep } from "./agent-review-step";
import { LoanOffersPage } from "./loan-offers-page";
import { LoanProgressTracker } from "./loan-progress-tracker";
import { ArrowLeft, Sparkles } from "lucide-react";

interface LoanApplicationWizardProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function LoanApplicationWizard({
  onComplete,
  onBack,
}: LoanApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [loanData, setLoanData] = useState({
    applicantName: undefined as string | undefined,
    applicantEmail: undefined as string | undefined,
    applicantPhone: undefined as string | undefined,
    purpose: undefined as string | undefined,
    amount: 1500000,
    interestRate: 7.5,
    term: 48,
    monthlyPayment: 36414.38,
    selectedBankIds: undefined as string[] | undefined,
    documents: [] as File[],
    bankConnected: false,
    bankName: undefined as string | undefined,
    accountVerified: false,
    accountBalance: undefined as number | undefined,
    monthlyIncome: undefined as number | undefined,
  });

  const handlePersonalInfoNext = () => {
    setCurrentStep(2);
  };

  const handlePurposeNext = () => {
    setCurrentStep(3);
  };

  const handleLoanAmountNext = () => {
    setCurrentStep(4);
  };

  const handleBankSelectionNext = () => {
    setCurrentStep(5);
  };

  const handleBankVerificationNext = () => {
    setCurrentStep(6);
  };

  const handleIdentityNext = () => {
    setCurrentStep(7);
  };

  const handleReviewComplete = (appId: string) => {
    // Store the application ID and navigate to offers page when AI review is complete
    setApplicationId(appId);
    setCurrentStep(8);
  };

  const steps = [
    {
      number: 1,
      title: "Personal Info",
      status:
        currentStep > 1
          ? "complete"
          : currentStep === 1
            ? "active"
            : "upcoming",
    },
    {
      number: 2,
      title: "Loan Purpose",
      status:
        currentStep > 2
          ? "complete"
          : currentStep === 2
            ? "active"
            : "upcoming",
    },
    {
      number: 3,
      title: "Loan Amount",
      status:
        currentStep > 3
          ? "complete"
          : currentStep === 3
            ? "active"
            : "upcoming",
    },
    {
      number: 4,
      title: "Select Banks",
      status:
        currentStep > 4
          ? "complete"
          : currentStep === 4
            ? "active"
            : "upcoming",
    },
    {
      number: 5,
      title: "Income Verification",
      status:
        currentStep > 5
          ? "complete"
          : currentStep === 5
            ? "active"
            : "upcoming",
    },
    {
      number: 6,
      title: "Identity Check",
      status:
        currentStep > 6
          ? "complete"
          : currentStep === 6
            ? "active"
            : "upcoming",
    },
    {
      number: 7,
      title: "AI Review",
      status:
        currentStep > 7
          ? "complete"
          : currentStep === 7
            ? "active"
            : "upcoming",
    },
  ] as const;

  // Show offers page after AI review
  if (currentStep === 8) {
    return (
      <LoanOffersPage
        loanData={loanData}
        applicationId={applicationId}
        onBack={onBack || (() => {})}
      />
    );
  }

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
                <span className="font-medium text-sm sm:text-base">
                  Back to Home
                </span>
              </button>

              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="font-semibold text-primary text-sm sm:text-base">
                  AutoLend IQ
                </span>
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
              <PersonalInfoStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handlePersonalInfoNext}
                onBack={onBack || (() => {})}
              />
            )}
            {currentStep === 2 && (
              <LoanPurposeStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handlePurposeNext}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <LoanAmountStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handleLoanAmountNext}
                onBack={() => setCurrentStep(2)}
              />
            )}
            {currentStep === 4 && (
              <BankSelectionStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handleBankSelectionNext}
                onBack={() => setCurrentStep(3)}
              />
            )}
            {currentStep === 5 && (
              <BankVerificationStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handleBankVerificationNext}
                onBack={() => setCurrentStep(4)}
              />
            )}
            {currentStep === 6 && (
              <IdentityVerificationStep
                loanData={loanData}
                setLoanData={setLoanData}
                onNext={handleIdentityNext}
                onBack={() => setCurrentStep(5)}
              />
            )}
            {currentStep === 7 && (
              <AgentReviewStep
                loanData={loanData}
                onBack={() => setCurrentStep(6)}
                onComplete={handleReviewComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
