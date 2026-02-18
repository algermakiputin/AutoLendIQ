import { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Banknote, Percent, Calendar, TrendingUp } from "lucide-react";

interface LoanAmountStepProps {
  loanData: {
    amount: number;
    interestRate: number;
    term: number;
    monthlyPayment: number;
  };
  setLoanData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LoanAmountStep({
  loanData,
  setLoanData,
  onNext,
  onBack,
}: LoanAmountStepProps) {
  const [amount, setAmount] = useState(loanData.amount);
  const [term, setTerm] = useState(loanData.term);

  // Calculate interest rate based on loan amount (realistic lending logic for Philippines)
  const calculateInterestRate = (loanAmount: number) => {
    if (loanAmount < 500000) return 6.5;
    if (loanAmount < 1500000) return 7.5;
    if (loanAmount < 3000000) return 8.5;
    return 9.5;
  };

  // Calculate monthly payment
  const calculateMonthlyPayment = (
    principal: number,
    annualRate: number,
    months: number,
  ) => {
    const monthlyRate = annualRate / 100 / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  useEffect(() => {
    const interestRate = calculateInterestRate(amount);
    const monthlyPayment = calculateMonthlyPayment(amount, interestRate, term);

    setLoanData({
      ...loanData,
      amount,
      term,
      interestRate,
      monthlyPayment,
    });
  }, [amount, term]);

  const totalPayment = loanData.monthlyPayment * term;
  const totalInterest = totalPayment - amount;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-primary">Magkano ang kailangan mo?</h1>
        <p className="text-muted-foreground">
          I-adjust ang loan amount at term para makita ang real-time na
          kalkulasyon ng iyong monthly payment.
        </p>
      </div>

      {/* Main Loan Amount Card */}
      <div className="bg-card rounded-lg p-8 shadow-lg border border-[#e2e8f0]">
        <div className="mb-8">
          <label className="text-sm text-muted-foreground mb-4 block">
            Halaga ng Loan
          </label>
          <div className="text-5xl font-semibold text-primary mb-2">
            ₱{amount.toLocaleString("en-PH")}
          </div>
          <p className="text-sm text-muted-foreground">
            Range: ₱250,000 - ₱5,000,000
          </p>
        </div>

        {/* Amount Slider */}
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5 mb-8"
          value={[amount]}
          onValueChange={([value]) => setAmount(value)}
          min={250000}
          max={5000000}
          step={50000}
        >
          <Slider.Track className="bg-secondary relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-primary rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-6 h-6 bg-white shadow-lg border-2 border-primary rounded-full hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-transform cursor-grab active:cursor-grabbing"
            aria-label="Loan amount"
          />
        </Slider.Root>

        {/* Loan Term Selector */}
        <div className="mb-8">
          <label className="text-sm text-muted-foreground mb-4 block">
            Tagal ng Loan (buwan)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[24, 36, 48, 60, 72, 84].map((months) => (
              <button
                key={months}
                onClick={() => setTerm(months)}
                className={`
                  px-4 py-3 rounded-lg border-2 transition-all duration-200
                  ${
                    term === months
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-[#e2e8f0] bg-white hover:border-primary/50 hover:shadow-sm"
                  }
                `}
              >
                <div className="font-semibold">{months}</div>
                <div className="text-xs opacity-80">buwan</div>
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Calculation Display */}
        <div className="bg-background rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Buwanang Bayad</p>
                <p className="text-2xl font-semibold text-primary">
                  ₱
                  {loanData.monthlyPayment.toLocaleString("en-PH", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <Percent className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interest Rate</p>
                <p className="font-semibold text-foreground">
                  {loanData.interestRate}% APR
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Kabuuang Interest
                </p>
                <p className="font-semibold text-foreground">
                  ₱
                  {totalInterest.toLocaleString("en-PH", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kabuuang Bayad</p>
                <p className="font-semibold text-foreground">
                  ₱
                  {totalPayment.toLocaleString("en-PH", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-success/5 border border-success/20 rounded-lg p-6">
          <h3 className="text-success mb-2">Bakit ito ang rate?</h3>
          <p className="text-sm text-muted-foreground">
            Ang iyong interest rate ay kinakalkula base sa halaga ng loan,
            tagal, at kasalukuyang kondisyon ng market. Mas mababang halaga ay
            may mas magandang rate.
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-primary mb-2">Walang nakatagong bayad</h3>
          <p className="text-sm text-muted-foreground">
            Ang nakikita mo ay ang makukuha mo. Walang origination fees, walang
            prepayment penalties, at walang sorpresa.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
        >
          Balik
        </button>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-medium"
        >
          Magpatuloy sa Bank Selection
        </button>
      </div>
    </div>
  );
}
