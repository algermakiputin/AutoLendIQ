import { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  Calendar,
  DollarSign,
  Download,
  ArrowRight,
  X,
} from 'lucide-react';
import { BankOffer } from '../types/bank-partner';

interface OfferAcceptanceFlowProps {
  offer: BankOffer;
  applicantName: string;
  onAccept: (signature: string, agreedToTerms: boolean) => void;
  onCancel: () => void;
}

export function OfferAcceptanceFlow({
  offer,
  applicantName,
  onAccept,
  onCancel,
}: OfferAcceptanceFlowProps) {
  const [step, setStep] = useState<'review' | 'terms' | 'signature' | 'confirmation'>('review');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signature, setSignature] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleAcceptOffer = async () => {
    if (!agreedToTerms || !signature) {
      alert('Please review terms and provide your signature');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setStep('confirmation');
    setIsProcessing(false);
    
    // Call parent callback
    onAccept(signature, agreedToTerms);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <img
              src={offer.bankLogoUrl}
              alt={offer.bankName}
              className="w-12 h-12 rounded-lg object-cover border border-[#e2e8f0]"
            />
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {step === 'confirmation' ? 'Offer Accepted!' : 'Accept Loan Offer'}
              </h2>
              <p className="text-sm text-muted-foreground">{offer.bankName}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress Steps */}
        {step !== 'confirmation' && (
          <div className="px-6 py-4 bg-background border-b border-[#e2e8f0]">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { key: 'review', label: 'Review Offer' },
                { key: 'terms', label: 'Terms & Conditions' },
                { key: 'signature', label: 'Sign Agreement' },
              ].map((s, idx) => (
                <div key={s.key} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 ${
                      step === s.key
                        ? 'text-primary'
                        : ['review', 'terms'].includes(s.key) &&
                          ['terms', 'signature'].includes(step)
                        ? 'text-success'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step === s.key
                          ? 'bg-primary text-primary-foreground'
                          : ['review', 'terms'].includes(s.key) &&
                            ['terms', 'signature'].includes(step)
                          ? 'bg-success text-success-foreground'
                          : 'bg-gray-200 text-muted-foreground'
                      }`}
                    >
                      {['review', 'terms'].includes(s.key) &&
                      ['terms', 'signature'].includes(step) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">
                      {s.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className="w-12 sm:w-24 h-0.5 bg-gray-200 mx-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Step 1: Review Offer */}
          {step === 'review' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success rounded-full mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Pre-Approved Offer</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {formatCurrency(offer.loanAmount)}
                </h3>
                <p className="text-muted-foreground">
                  Loan Amount • {offer.term} months term
                </p>
              </div>

              {/* Key Terms Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg p-4 border border-[#e2e8f0]">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Interest Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-success">
                    {offer.interestRate}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Per annum</p>
                </div>

                <div className="bg-background rounded-lg p-4 border border-[#e2e8f0]">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Monthly Payment</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(offer.monthlyPayment)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    For {offer.term} months
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4 border border-[#e2e8f0]">
                  <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(offer.totalInterest)}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4 border border-[#e2e8f0]">
                  <p className="text-sm text-muted-foreground mb-1">Processing Fee</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(offer.processingFeeAmount)}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4 border border-[#e2e8f0]">
                  <p className="text-sm text-muted-foreground mb-1">Total Payment</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(offer.totalPayment)}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4 border border-[#e2e8f0]">
                  <p className="text-sm text-muted-foreground mb-1">Offer Expires</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatDate(offer.expiresAt!)}
                  </p>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Important Information
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>
                        • This is a binding loan agreement. Please review all terms
                        carefully.
                      </li>
                      <li>
                        • Monthly payments will be automatically debited from your
                        account.
                      </li>
                      <li>• Late payments may incur additional fees and penalties.</li>
                      <li>
                        • Early repayment is allowed with no prepayment penalties.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Terms & Conditions */}
          {step === 'terms' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Loan Agreement Terms
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please read and agree to the following terms
                </p>
              </div>

              <div className="bg-background border border-[#e2e8f0] rounded-lg p-6 max-h-96 overflow-y-auto text-sm space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    1. LOAN AGREEMENT
                  </h4>
                  <p className="text-muted-foreground">
                    This Loan Agreement ("Agreement") is entered into between{' '}
                    {offer.bankName} ("Lender") and {applicantName} ("Borrower") for
                    a loan amount of {formatCurrency(offer.loanAmount)}.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    2. INTEREST RATE
                  </h4>
                  <p className="text-muted-foreground">
                    The loan shall bear interest at a fixed rate of{' '}
                    {offer.interestRate}% per annum. The interest rate is fixed for
                    the entire term of the loan.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    3. REPAYMENT TERMS
                  </h4>
                  <p className="text-muted-foreground">
                    The Borrower agrees to repay the loan in {offer.term} equal
                    monthly installments of {formatCurrency(offer.monthlyPayment)}.
                    Payments are due on the same day each month.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    4. PROCESSING FEE
                  </h4>
                  <p className="text-muted-foreground">
                    A one-time processing fee of{' '}
                    {formatCurrency(offer.processingFeeAmount)} ({offer.processingFee}
                    % of loan amount) will be deducted from the loan disbursement
                    amount.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    5. LATE PAYMENT PENALTIES
                  </h4>
                  <p className="text-muted-foreground">
                    Late payments will incur a penalty of 2% of the monthly payment
                    amount. Repeated late payments may result in additional fees and
                    credit score impact.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    6. PREPAYMENT
                  </h4>
                  <p className="text-muted-foreground">
                    The Borrower may prepay the loan in full or in part at any time
                    without penalty. Prepayment will reduce the remaining principal
                    and interest charges.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    7. DEFAULT AND REMEDIES
                  </h4>
                  <p className="text-muted-foreground">
                    Failure to make payments for 90 days constitutes default. Upon
                    default, the Lender may accelerate the loan and demand immediate
                    payment of the entire outstanding balance.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    8. DATA PRIVACY
                  </h4>
                  <p className="text-muted-foreground">
                    The Borrower authorizes the Lender to collect, process, and share
                    credit information with credit bureaus and regulatory authorities
                    in accordance with the Data Privacy Act of 2012.
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-primary/20 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="text-sm text-foreground">
                    I have read, understood, and agree to the terms and conditions of
                    this loan agreement. I acknowledge that this is a legally binding
                    contract.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Digital Signature */}
          {step === 'signature' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Digital Signature
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sign to finalize your loan agreement
                </p>
              </div>

              {/* Signature Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-success/5 border border-primary/20 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Borrower Name</p>
                    <p className="font-semibold text-foreground">{applicantName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Lender</p>
                    <p className="font-semibold text-foreground">{offer.bankName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Loan Amount</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(offer.loanAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Interest Rate</p>
                    <p className="font-semibold text-foreground">
                      {offer.interestRate}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Signature Input */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type your full name to sign
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-serif text-2xl text-center"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Your typed signature is legally binding
                </p>
              </div>

              {/* Signature Preview */}
              {signature && (
                <div className="bg-white border-2 border-[#e2e8f0] rounded-lg p-6">
                  <p className="text-xs text-muted-foreground mb-4">
                    Digital Signature Preview:
                  </p>
                  <div className="border-b-2 border-foreground pb-2 mb-2">
                    <p className="font-serif text-3xl text-foreground text-center">
                      {signature}
                    </p>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{applicantName}</span>
                    <span>{new Date().toLocaleDateString('en-PH')}</span>
                  </div>
                </div>
              )}

              {/* Legal Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Legal Binding Agreement
                    </p>
                    <p className="text-xs text-muted-foreground">
                      By signing this document, you agree to all terms and conditions
                      of the loan agreement. This is a legally binding contract under
                      Philippine law.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Offer Accepted Successfully!
              </h3>
              <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                You've successfully accepted the loan offer from {offer.bankName}.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto mb-8">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Pending Final Approval
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your acceptance has been submitted. A loan manager will review and provide final approval before disbursement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-background rounded-lg p-6 border border-[#e2e8f0] text-left max-w-lg mx-auto mb-8">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  Next Steps
                </h4>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      1
                    </span>
                    <span>
                      Loan manager will review your accepted offer and supporting documents
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      2
                    </span>
                    <span>
                      Final approval decision within {offer.estimatedApprovalTime}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      3
                    </span>
                    <span>After manager approval, loan amount will be disbursed to your account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                      4
                    </span>
                    <span>
                      You'll receive confirmation and payment schedule via SMS and email
                    </span>
                  </li>
                </ol>
              </div>

              <button
                onClick={onCancel}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step !== 'confirmation' && (
          <div className="flex items-center justify-between gap-4 p-6 border-t border-[#e2e8f0] bg-background">
            <button
              onClick={() => {
                if (step === 'review') {
                  onCancel();
                } else if (step === 'terms') {
                  setStep('review');
                } else if (step === 'signature') {
                  setStep('terms');
                }
              }}
              className="px-6 py-3 border-2 border-[#e2e8f0] rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-colors font-medium text-foreground"
            >
              {step === 'review' ? 'Cancel' : 'Back'}
            </button>

            <button
              onClick={() => {
                if (step === 'review') {
                  setStep('terms');
                } else if (step === 'terms') {
                  if (!agreedToTerms) {
                    alert('Please agree to the terms and conditions');
                    return;
                  }
                  setStep('signature');
                } else if (step === 'signature') {
                  handleAcceptOffer();
                }
              }}
              disabled={
                (step === 'terms' && !agreedToTerms) ||
                (step === 'signature' && !signature) ||
                isProcessing
              }
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {step === 'signature' ? 'Accept & Sign' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}