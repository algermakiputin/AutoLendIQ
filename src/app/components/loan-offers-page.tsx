import { useState, useEffect } from 'react';
import { BankOffersComparison } from './bank-offers-comparison';
import { OfferAcceptanceFlow } from './offer-acceptance-flow';
import { MultiBankTracker } from './multi-bank-tracker';
import { BankOffer, BankApplication } from '../types/bank-partner';
import { MOCK_BANK_PARTNERS } from '../data/bank-partners';
import { generateBankOffers, calculateCreditScore, calculateDTI } from '../utils/offer-generation';
import { updateLoanApplication } from '../../utils/api';
import { Sparkles, ArrowLeft, Building2 } from 'lucide-react';

interface LoanOffersPageProps {
  loanData: {
    applicantName?: string;
    applicantEmail?: string;
    applicantPhone?: string;
    amount: number;
    term: number;
    selectedBankIds?: string[];
    monthlyIncome?: number;
    accountBalance?: number;
    bankConnected?: boolean;
    [key: string]: any;
  };
  applicationId: string | null;
  onBack: () => void;
}

export function LoanOffersPage({ loanData, applicationId, onBack }: LoanOffersPageProps) {
  const [offers, setOffers] = useState<BankOffer[]>([]);
  const [applications, setApplications] = useState<BankApplication[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | null>(null);
  const [showAcceptanceFlow, setShowAcceptanceFlow] = useState(false);
  const [view, setView] = useState<'offers' | 'applications'>('offers');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate offers based on applicant profile
    const generateOffers = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Calculate credit score
      const creditScore = calculateCreditScore(
        null, // Smile data would come from GetSmile integration
        {
          monthlyIncome: loanData.monthlyIncome || 50000,
          accountBalance: loanData.accountBalance || 100000,
        }
      );

      // Calculate DTI (simplified - assume 20% existing debt)
      const monthlyDebt = (loanData.monthlyIncome || 50000) * 0.20;
      const dti = calculateDTI(loanData.monthlyIncome || 50000, monthlyDebt);

      // Build applicant profile
      const applicantProfile = {
        creditScore,
        monthlyIncome: loanData.monthlyIncome || 50000,
        loanAmount: loanData.amount,
        loanTerm: loanData.term,
        debtToIncome: dti,
        employmentStatus: 'employed',
        hasExistingLoans: false,
      };

      // Get selected banks (or use all active banks if none selected)
      let selectedBanks = MOCK_BANK_PARTNERS.filter((bank) =>
        bank.isActive && loanData.selectedBankIds?.includes(bank.id)
      );
      
      // If no banks selected, use all active banks
      if (selectedBanks.length === 0) {
        selectedBanks = MOCK_BANK_PARTNERS.filter((bank) => bank.isActive);
      }

      console.log('LoanOffersPage Debug:', {
        selectedBankIds: loanData.selectedBankIds,
        selectedBanks: selectedBanks.map(b => b.name),
        applicantProfile,
      });

      // Generate offers
      const generatedOffers = generateBankOffers(applicantProfile, selectedBanks);
      
      console.log('Generated Offers:', generatedOffers);
      
      setOffers(generatedOffers);

      // Create application records for each bank
      const bankApplications: BankApplication[] = generatedOffers.map((offer) => ({
        id: `app-${offer.bankId}-${Date.now()}`,
        applicationId: `loan-${Date.now()}`,
        bankId: offer.bankId,
        bankName: offer.bankName,
        appliedAmount: offer.loanAmount,
        appliedTerm: offer.term,
        status: offer.status === 'approved' ? 'approved' : 'under_review',
        statusUpdatedAt: new Date().toISOString(),
        offer: offer.status === 'approved' ? offer : undefined,
        submittedAt: new Date().toISOString(),
      }));

      setApplications(bankApplications);
      setIsLoading(false);
    };

    generateOffers();
  }, [loanData]);

  const handleSelectOffer = (offer: BankOffer) => {
    setSelectedOffer(offer);
    setShowAcceptanceFlow(true);
  };

  const handleAcceptOffer = async (signature: string, agreedToTerms: boolean) => {
    if (!selectedOffer) return;

    // Update offer status: accepted for selected, rejected for all others
    setOffers((prev) =>
      prev.map((offer) =>
        offer.bankId === selectedOffer.bankId
          ? { ...offer, status: 'accepted', acceptedAt: new Date().toISOString() }
          : { ...offer, status: 'rejected', rejectedReason: 'Another offer was accepted' }
      )
    );

    // Update application status: pending_final_approval for selected, rejected for others
    setApplications((prev) =>
      prev.map((app) =>
        app.bankId === selectedOffer.bankId
          ? { 
              ...app, 
              status: 'pending_final_approval',
              decidedAt: new Date().toISOString(),
              offer: {
                ...selectedOffer,
                status: 'accepted',
                acceptedAt: new Date().toISOString(),
              }
            }
          : {
              ...app,
              status: 'rejected',
              decidedAt: new Date().toISOString(),
            }
      )
    );

    // Log acceptance
    console.log('Offer accepted - all other offers automatically rejected:', {
      acceptedOffer: selectedOffer,
      signature,
      agreedToTerms,
      timestamp: new Date().toISOString(),
    });

    // Update the loan application in the database
    if (applicationId) {
      try {
        const updateData = {
          status: 'pending_final_approval' as const,
          accepted_bank_id: selectedOffer.bankId,
          accepted_bank_name: selectedOffer.bankName,
          accepted_bank_logo: MOCK_BANK_PARTNERS.find(b => b.id === selectedOffer.bankId)?.logoUrl,
          accepted_offer_rate: selectedOffer.interestRate,
          accepted_offer_term: selectedOffer.term,
          accepted_offer_amount: selectedOffer.loanAmount,
          accepted_offer_monthly_payment: selectedOffer.monthlyPayment,
          accepted_offer_total_interest: selectedOffer.totalInterest,
          accepted_offer_processing_fee: selectedOffer.processingFee,
        };
        
        console.log('=== SAVING ACCEPTED OFFER ===');
        console.log('Application ID:', applicationId);
        console.log('Update Data:', JSON.stringify(updateData, null, 2));
        
        await updateLoanApplication(applicationId, updateData);
        
        console.log('✅ Accepted offer saved to database successfully');
        console.log('=============================');
      } catch (error) {
        console.error('❌ Error saving accepted offer:', error);
        alert('❌ Error updating database. Please check the console for details.');
      }
    }

    // Don't auto-close - let user click "Back to Dashboard" in confirmation screen
  };

  const handleViewApplication = (application: BankApplication) => {
    if (application.offer) {
      handleSelectOffer(application.offer);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Generating Your Offers
          </h2>
          <p className="text-muted-foreground">
            Our AI is analyzing your profile and matching you with the best banks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium text-sm sm:text-base">Back</span>
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

      {/* View Tabs */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setView('offers')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                view === 'offers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Available Offers ({offers.length})
            </button>
            <button
              onClick={() => setView('applications')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                view === 'applications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Application Status
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'offers' ? (
          <BankOffersComparison
            offers={offers}
            loanAmount={loanData.amount}
            onSelectOffer={handleSelectOffer}
            onViewAll={() => setView('applications')}
          />
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">
                Your Bank Applications
              </h2>
              <p className="text-muted-foreground">
                Track the status of your applications across all selected banks
              </p>
            </div>
            <MultiBankTracker
              applications={applications}
              onViewOffer={handleViewApplication}
            />
          </div>
        )}
      </div>

      {/* Offer Acceptance Modal */}
      {showAcceptanceFlow && selectedOffer && (
        <OfferAcceptanceFlow
          offer={selectedOffer}
          applicantName={loanData.applicantName || 'Applicant'}
          onAccept={handleAcceptOffer}
          onCancel={() => {
            setShowAcceptanceFlow(false);
            setSelectedOffer(null);
          }}
        />
      )}
    </div>
  );
}