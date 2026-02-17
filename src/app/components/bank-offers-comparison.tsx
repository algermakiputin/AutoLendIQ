import { useState } from 'react';
import { 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  Award, 
  Calculator,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BankOffer } from '../types/bank-partner';

interface BankOffersComparisonProps {
  offers: BankOffer[];
  loanAmount: number;
  onSelectOffer: (offer: BankOffer) => void;
  onViewAll: () => void;
}

export function BankOffersComparison({
  offers,
  loanAmount,
  onSelectOffer,
  onViewAll,
}: BankOffersComparisonProps) {
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  // Check if any offer has been accepted
  const hasAcceptedOffer = offers.some(offer => offer.status === 'accepted');
  const acceptedOffer = offers.find(offer => offer.status === 'accepted');

  // Sort offers: recommended first, then by interest rate
  const sortedOffers = [...offers].sort((a, b) => {
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    return a.interestRate - b.interestRate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Offer Accepted Banner */}
      {hasAcceptedOffer && acceptedOffer && (
        <div className="bg-gradient-to-r from-success/20 to-primary/20 border-2 border-success/40 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">
                🎉 Offer Accepted!
              </h3>
              <p className="text-muted-foreground mb-3">
                You've accepted the loan offer from <strong>{acceptedOffer.bankName}</strong>. 
                Your application is now pending final approval from our lending managers.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Interest Rate</p>
                  <p className="font-bold text-success">{acceptedOffer.interestRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Loan Amount</p>
                  <p className="font-bold text-foreground">{formatCurrency(acceptedOffer.loanAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Term</p>
                  <p className="font-bold text-foreground">{acceptedOffer.term} months</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Payment</p>
                  <p className="font-bold text-foreground">{formatCurrency(acceptedOffer.monthlyPayment)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">
            {offers.length > 0 ? 'Pre-Approved Offers Ready!' : 'Processing Offers...'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-3">
          Compare Your Loan Offers
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Based on your profile, here are personalized offers from our partner banks.
          Choose the one that best fits your needs.
        </p>
      </div>

      {/* No Offers State */}
      {offers.length === 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Offers Available
          </h3>
          <p className="text-muted-foreground mb-4">
            We couldn't generate loan offers at this time. This might be because:
          </p>
          <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-2">
            <li>• No banks were selected during application</li>
            <li>• The loan amount or term doesn't match bank criteria</li>
            <li>• Profile data is incomplete</li>
          </ul>
        </div>
      )}

      {/* Summary Stats */}
      {offers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm">Best Rate</span>
            </div>
            <p className="text-2xl font-bold text-success">
              {Math.min(...offers.map((o) => o.interestRate))}%
            </p>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calculator className="w-4 h-4" />
              <span className="text-sm">Lowest Monthly</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(Math.min(...offers.map((o) => o.monthlyPayment)))}
            </p>
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Award className="w-4 h-4" />
              <span className="text-sm">Offers Received</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{offers.length}</p>
          </div>
        </div>
      )}

      {/* Offers Grid */}
      <div className="space-y-4">
        {sortedOffers.map((offer, index) => {
          const isSelected = selectedOfferId === offer.bankId;
          const isBestRate =
            offer.interestRate === Math.min(...offers.map((o) => o.interestRate));

          return (
            <div
              key={offer.bankId}
              className={`
                relative bg-white rounded-xl p-6 border-2 transition-all duration-300
                ${
                  isSelected
                    ? 'border-primary shadow-lg ring-4 ring-primary/20'
                    : 'border-[#e2e8f0] hover:border-primary/30 hover:shadow-md'
                }
                ${offer.isRecommended ? 'ring-2 ring-amber-400/50' : ''}
              `}
            >
              {/* Recommended Badge */}
              {offer.isRecommended && (
                <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" />
                  AI Recommended
                </div>
              )}

              {/* Best Rate Badge */}
              {isBestRate && !offer.isRecommended && (
                <div className="absolute -top-3 left-6 bg-success text-success-foreground px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                  Best Rate
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Bank Info */}
                <div className="flex items-start gap-4 lg:w-1/3">
                  <img
                    src={offer.bankLogoUrl}
                    alt={offer.bankName}
                    className="w-16 h-16 rounded-lg object-cover border border-[#e2e8f0]"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {offer.bankName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{offer.estimatedApprovalTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <Award className="w-3 h-3 text-success" />
                      <span className="text-success font-medium">
                        {Math.round(offer.approvalProbability * 100)}% approval chance
                      </span>
                    </div>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                    <p className="text-xl font-bold text-success">
                      {offer.interestRate}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Monthly Payment</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(offer.monthlyPayment)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(offer.totalInterest)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Processing Fee</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatCurrency(offer.processingFeeAmount)}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="lg:w-auto flex items-center">
                  {offer.status === 'accepted' ? (
                    <div className="flex items-center gap-2 px-6 py-3 bg-success/10 text-success rounded-lg border-2 border-success/30">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Offer Accepted</span>
                    </div>
                  ) : offer.status === 'rejected' ? (
                    <div className="px-6 py-3 bg-muted text-muted-foreground rounded-lg border-2 border-border opacity-60">
                      <span className="font-semibold">Not Available</span>
                      <p className="text-xs mt-1">Another offer accepted</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedOfferId(offer.bankId);
                        onSelectOffer(offer);
                      }}
                      disabled={hasAcceptedOffer}
                      className={`w-full lg:w-auto px-6 py-3 rounded-lg transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap ${
                        hasAcceptedOffer
                          ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {hasAcceptedOffer ? 'Another Offer Accepted' : 'Select Offer'}
                      {!hasAcceptedOffer && <ArrowRight className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Recommendation Reason */}
              {offer.isRecommended && offer.recommendationReason && (
                <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
                  <div className="flex items-start gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Why we recommend this:</span>{' '}
                      {offer.recommendationReason}
                    </p>
                  </div>
                </div>
              )}

              {/* Loan Breakdown */}
              <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Loan Amount</p>
                    <p className="font-semibold">{formatCurrency(offer.loanAmount)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Loan Term</p>
                    <p className="font-semibold">{offer.term} months</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Payment</p>
                    <p className="font-semibold">{formatCurrency(offer.totalPayment)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Effective Rate</p>
                    <p className="font-semibold">
                      {(
                        (offer.totalInterest / offer.loanAmount / (offer.term / 12)) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Important Information
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• These are preliminary offers based on your profile</li>
              <li>• Final terms will be confirmed after document verification</li>
              <li>• Offers are valid for 7 days from the date shown</li>
              <li>• No obligation to accept - compare freely</li>
            </ul>
          </div>
        </div>
      </div>

      {/* View All Applications Button */}
      <div className="text-center pt-4">
        <button
          onClick={onViewAll}
          className="text-primary hover:text-primary/80 font-medium text-sm underline"
        >
          View all application statuses
        </button>
      </div>
    </div>
  );
}