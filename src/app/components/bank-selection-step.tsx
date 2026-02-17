import { useState, useEffect } from 'react';
import { Building2, CheckCircle2, Info, TrendingDown, Clock, Award } from 'lucide-react';
import { BankPartner } from '../types/bank-partner';
import { MOCK_BANK_PARTNERS } from '../data/bank-partners';

interface BankSelectionStepProps {
  loanData: {
    selectedBankIds?: string[];
    amount?: number;
    [key: string]: any;
  };
  setLoanData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BankSelectionStep({
  loanData,
  setLoanData,
  onNext,
  onBack,
}: BankSelectionStepProps) {
  const [selectedBankIds, setSelectedBankIds] = useState<string[]>(
    loanData.selectedBankIds || []
  );
  const [filterTier, setFilterTier] = useState<string>('all');

  // Filter banks based on loan amount (if available)
  const eligibleBanks = MOCK_BANK_PARTNERS.filter((bank) => {
    if (!loanData.amount) return bank.isActive;
    return (
      bank.isActive &&
      loanData.amount >= bank.minAmount &&
      loanData.amount <= bank.maxAmount
    );
  });

  // Further filter by tier
  const filteredBanks =
    filterTier === 'all'
      ? eligibleBanks
      : eligibleBanks.filter((bank) => bank.tier === filterTier);

  const toggleBankSelection = (bankId: string) => {
    setSelectedBankIds((prev) =>
      prev.includes(bankId)
        ? prev.filter((id) => id !== bankId)
        : [...prev, bankId]
    );
  };

  const handleContinue = () => {
    if (selectedBankIds.length === 0) {
      alert('Please select at least one bank to continue');
      return;
    }

    setLoanData({
      ...loanData,
      selectedBankIds,
    });
    onNext();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'universal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'commercial':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'digital':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'fintech':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'universal':
        return 'Universal Bank';
      case 'commercial':
        return 'Commercial Bank';
      case 'digital':
        return 'Digital Bank';
      case 'fintech':
        return 'Fintech Lender';
      default:
        return tier;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-primary mb-1">Select Bank Partners</h2>
            <p className="text-muted-foreground text-sm">
              Choose one or more banks to apply to
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Increase your chances of approval
            </p>
            <p className="text-xs text-muted-foreground">
              Applying to multiple banks increases your approval chances. We'll
              submit your application to all selected banks simultaneously and show
              you the best offers.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {selectedBankIds.length > 0 && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {selectedBankIds.length} bank{selectedBankIds.length > 1 ? 's' : ''}{' '}
                selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated approval chance:{' '}
                <span className="font-semibold text-success">
                  {Math.min(
                    95,
                    Math.round(
                      selectedBankIds.reduce((acc, id) => {
                        const bank = MOCK_BANK_PARTNERS.find((b) => b.id === id);
                        return acc + (bank?.approvalRate || 0);
                      }, 0) *
                        100 *
                        0.8
                    )
                  )}
                  %
                </span>
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { value: 'all', label: 'All Banks' },
          { value: 'universal', label: 'Universal' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'digital', label: 'Digital' },
          { value: 'fintech', label: 'Fintech' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterTier(filter.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
              ${
                filterTier === filter.value
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-white border border-[#e2e8f0] text-muted-foreground hover:border-primary/30'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Bank Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBanks.map((bank) => {
          const isSelected = selectedBankIds.includes(bank.id);

          return (
            <button
              key={bank.id}
              onClick={() => toggleBankSelection(bank.id)}
              className={`
                relative bg-white rounded-xl p-6 border-2 transition-all duration-300
                hover:shadow-lg text-left
                ${
                  isSelected
                    ? 'border-success shadow-md ring-4 ring-success/20'
                    : 'border-[#e2e8f0] hover:border-primary/30'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-success flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Bank Logo */}
                <div className="flex-shrink-0">
                  <img
                    src={bank.logoUrl}
                    alt={bank.name}
                    className="w-16 h-16 rounded-lg object-cover border border-[#e2e8f0]"
                  />
                </div>

                {/* Bank Info */}
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-start gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {bank.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded border ${getTierColor(
                        bank.tier
                      )}`}
                    >
                      {getTierLabel(bank.tier)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {bank.description}
                  </p>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-success" />
                      <div>
                        <p className="text-xs text-muted-foreground">Rate from</p>
                        <p className="text-sm font-semibold text-foreground">
                          {bank.interestRateRange[0]}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Approval</p>
                        <p className="text-sm font-semibold text-foreground">
                          {bank.avgApprovalTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                        <p className="text-sm font-semibold text-foreground">
                          {Math.round(bank.approvalRate * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Fee</p>
                        <p className="text-sm font-semibold text-foreground">
                          {bank.processingFee}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features Pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {bank.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-primary/5 text-primary rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredBanks.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No banks available for the selected filter
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 border-2 border-[#e2e8f0] rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors font-medium text-foreground"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={selectedBankIds.length === 0}
          className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue with {selectedBankIds.length || 0} Bank
          {selectedBankIds.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}
