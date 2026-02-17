import { BankPartner, BankOffer } from '../types/bank-partner';

interface ApplicantProfile {
  creditScore: number;
  monthlyIncome: number;
  loanAmount: number;
  loanTerm: number; // months
  debtToIncome: number; // 0.0 to 1.0
  employmentStatus?: string;
  hasExistingLoans?: boolean;
}

/**
 * Calculate interest rate based on credit score within bank's range
 */
function calculateInterestRate(
  creditScore: number,
  bank: BankPartner
): number {
  const [minRate, maxRate] = bank.interestRateRange;
  const rateRange = maxRate - minRate;

  // Better credit score = lower rate
  // 850 (perfect) -> minRate
  // 300 (worst) -> maxRate
  const scoreRange = 850 - 300;
  const scoreFactor = (850 - creditScore) / scoreRange;
  
  // Add some randomness for realism (±0.5%)
  const randomAdjustment = (Math.random() - 0.5) * 1.0;
  
  const calculatedRate = minRate + (rateRange * scoreFactor) + randomAdjustment;
  
  // Clamp between min and max
  return Math.max(minRate, Math.min(maxRate, Number(calculatedRate.toFixed(2))));
}

/**
 * Calculate monthly payment using amortization formula
 */
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const monthlyRate = annualRate / 100 / 12;
  
  if (monthlyRate === 0) {
    return principal / months;
  }
  
  const payment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment * 100) / 100;
}

/**
 * Calculate approval probability based on applicant profile vs bank criteria
 */
function calculateApprovalProbability(
  applicant: ApplicantProfile,
  bank: BankPartner
): number {
  let probability = bank.approvalRate; // Start with bank's base approval rate

  // Credit score factor
  if (applicant.creditScore >= bank.minCreditScore + 100) {
    probability += 0.15; // +15% for excellent credit
  } else if (applicant.creditScore >= bank.minCreditScore + 50) {
    probability += 0.08; // +8% for good credit
  } else if (applicant.creditScore < bank.minCreditScore) {
    probability -= 0.25; // -25% for below minimum
  }

  // DTI factor
  if (applicant.debtToIncome <= bank.maxDTI - 0.15) {
    probability += 0.10; // +10% for low DTI
  } else if (applicant.debtToIncome > bank.maxDTI) {
    probability -= 0.20; // -20% for high DTI
  }

  // Income factor
  const incomeRatio = applicant.monthlyIncome / bank.minMonthlyIncome;
  if (incomeRatio >= 2.0) {
    probability += 0.10; // +10% for high income
  } else if (incomeRatio < 1.0) {
    probability -= 0.15; // -15% for low income
  }

  // Loan amount factor (prefer mid-range loans)
  const loanRange = bank.maxAmount - bank.minAmount;
  const loanPosition = (applicant.loanAmount - bank.minAmount) / loanRange;
  if (loanPosition > 0.2 && loanPosition < 0.8) {
    probability += 0.05; // +5% for mid-range loans
  }

  // Clamp between 0.05 and 0.99
  return Math.max(0.05, Math.min(0.99, probability));
}

/**
 * Generate recommendation reason based on why this bank is a good match
 */
function generateRecommendationReason(
  applicant: ApplicantProfile,
  bank: BankPartner,
  offer: BankOffer,
  allOffers: BankOffer[]
): string {
  const reasons: string[] = [];

  // Check if it's the best rate
  const hasBestRate = offer.interestRate === Math.min(...allOffers.map(o => o.interestRate));
  if (hasBestRate) {
    reasons.push('lowest interest rate available');
  }

  // Check if it has the best monthly payment
  const hasBestMonthly = offer.monthlyPayment === Math.min(...allOffers.map(o => o.monthlyPayment));
  if (hasBestMonthly && !hasBestRate) {
    reasons.push('lowest monthly payment');
  }

  // Check approval probability
  if (offer.approvalProbability >= 0.85) {
    reasons.push('very high approval probability');
  }

  // Check processing time
  if (bank.avgApprovalTime.includes('hour') || bank.avgApprovalTime.includes('24')) {
    reasons.push('fastest approval time');
  }

  // Check processing fee
  if (bank.processingFee <= 1.0) {
    reasons.push('lowest processing fee');
  }

  // Digital banks for tech-savvy
  if (bank.tier === 'digital') {
    reasons.push('fully digital process with mobile-first experience');
  }

  // Universal banks for prestige
  if (bank.tier === 'universal' && applicant.creditScore >= 700) {
    reasons.push('premium bank with excellent service for qualified borrowers');
  }

  if (reasons.length === 0) {
    return 'Good balance of rate, terms, and approval probability for your profile';
  }

  return reasons.slice(0, 2).join(' and ');
}

/**
 * Check if applicant is eligible for a bank
 */
export function isEligibleForBank(
  applicant: ApplicantProfile,
  bank: BankPartner
): boolean {
  // Basic eligibility checks
  if (!bank.isActive) return false;
  if (applicant.loanAmount < bank.minAmount || applicant.loanAmount > bank.maxAmount) return false;
  if (applicant.loanTerm < bank.minTerm || applicant.loanTerm > bank.maxTerm) return false;
  
  // Relaxed criteria - allow application even if slightly below minimum
  // Banks may still approve based on other factors
  const creditScoreMargin = 30;
  if (applicant.creditScore < bank.minCreditScore - creditScoreMargin) return false;
  
  const dtiMargin = 0.10;
  if (applicant.debtToIncome > bank.maxDTI + dtiMargin) return false;
  
  const incomeMargin = 0.80; // Allow 80% of minimum
  if (applicant.monthlyIncome < bank.minMonthlyIncome * incomeMargin) return false;

  return true;
}

/**
 * Generate loan offers from selected banks based on applicant profile
 */
export function generateBankOffers(
  applicant: ApplicantProfile,
  selectedBanks: BankPartner[]
): BankOffer[] {
  const offers: BankOffer[] = [];

  // Filter eligible banks
  const eligibleBanks = selectedBanks.filter((bank) =>
    isEligibleForBank(applicant, bank)
  );

  // Generate offers for eligible banks
  for (const bank of eligibleBanks) {
    const interestRate = calculateInterestRate(applicant.creditScore, bank);
    const monthlyPayment = calculateMonthlyPayment(
      applicant.loanAmount,
      interestRate,
      applicant.loanTerm
    );
    const totalPayment = monthlyPayment * applicant.loanTerm;
    const totalInterest = totalPayment - applicant.loanAmount;
    const processingFeeAmount = applicant.loanAmount * (bank.processingFee / 100);
    const approvalProbability = calculateApprovalProbability(applicant, bank);

    // Calculate expiry date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const offer: BankOffer = {
      bankId: bank.id,
      bankName: bank.name,
      bankLogoUrl: bank.logoUrl,
      loanAmount: applicant.loanAmount,
      interestRate,
      term: applicant.loanTerm,
      monthlyPayment,
      totalInterest,
      totalPayment,
      processingFee: bank.processingFee,
      processingFeeAmount,
      approvalProbability,
      estimatedApprovalTime: bank.avgApprovalTime,
      isRecommended: false, // Will be set later
      status: approvalProbability >= 0.70 ? 'approved' : 'pending',
      expiresAt: expiresAt.toISOString(),
    };

    offers.push(offer);
  }

  // Sort by interest rate (best first)
  offers.sort((a, b) => a.interestRate - b.interestRate);

  // Mark top 2-3 offers as recommended based on different criteria
  if (offers.length > 0) {
    // Best rate
    offers[0].isRecommended = true;
    offers[0].recommendationReason = generateRecommendationReason(
      applicant,
      eligibleBanks.find((b) => b.id === offers[0].bankId)!,
      offers[0],
      offers
    );

    // Best approval probability (if different from best rate)
    const bestApprovalOffer = [...offers].sort(
      (a, b) => b.approvalProbability - a.approvalProbability
    )[0];
    if (bestApprovalOffer.bankId !== offers[0].bankId && bestApprovalOffer.approvalProbability >= 0.85) {
      bestApprovalOffer.isRecommended = true;
      bestApprovalOffer.recommendationReason = generateRecommendationReason(
        applicant,
        eligibleBanks.find((b) => b.id === bestApprovalOffer.bankId)!,
        bestApprovalOffer,
        offers
      );
    }

    // Fastest approval (if digital bank and different from above)
    const fastestOffer = offers.find(
      (o) =>
        eligibleBanks.find((b) => b.id === o.bankId)?.tier === 'digital' &&
        o.bankId !== offers[0].bankId &&
        o.bankId !== bestApprovalOffer.bankId
    );
    if (fastestOffer) {
      fastestOffer.isRecommended = true;
      fastestOffer.recommendationReason = generateRecommendationReason(
        applicant,
        eligibleBanks.find((b) => b.id === fastestOffer.bankId)!,
        fastestOffer,
        offers
      );
    }
  }

  return offers;
}

/**
 * Calculate credit score from GetSmile data and other factors
 * This is a simplified version - real implementation would be more complex
 */
export function calculateCreditScore(smileData: any, applicantData: any): number {
  let baseScore = 650; // Start with fair credit

  // Income factor (higher income = higher score)
  if (applicantData.monthlyIncome) {
    if (applicantData.monthlyIncome >= 80000) baseScore += 80;
    else if (applicantData.monthlyIncome >= 50000) baseScore += 50;
    else if (applicantData.monthlyIncome >= 30000) baseScore += 30;
    else if (applicantData.monthlyIncome >= 20000) baseScore += 10;
  }

  // Account balance factor (savings = stability)
  if (applicantData.accountBalance) {
    if (applicantData.accountBalance >= 200000) baseScore += 50;
    else if (applicantData.accountBalance >= 100000) baseScore += 30;
    else if (applicantData.accountBalance >= 50000) baseScore += 20;
    else if (applicantData.accountBalance >= 20000) baseScore += 10;
  }

  // Smile data factors (if available)
  if (smileData) {
    // Transaction history
    if (smileData.transactions && smileData.transactions.length > 100) {
      baseScore += 20;
    }

    // Regular income deposits
    if (smileData.hasRegularDeposits) {
      baseScore += 30;
    }

    // Low overdrafts/returns
    if (smileData.overdraftCount === 0) {
      baseScore += 20;
    }
  }

  // Cap at realistic range
  return Math.min(850, Math.max(300, baseScore));
}

/**
 * Calculate debt-to-income ratio
 */
export function calculateDTI(
  monthlyIncome: number,
  monthlyDebtPayments: number
): number {
  if (monthlyIncome === 0) return 1.0;
  return monthlyDebtPayments / monthlyIncome;
}
