import { User, Briefcase, GraduationCap, Heart, Home, MoreHorizontal } from 'lucide-react';

interface LoanPurposeStepProps {
  loanData: {
    purpose?: string;
  };
  setLoanData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const purposes = [
  {
    id: 'personal',
    label: 'Personal',
    icon: User,
    description: 'Personal expenses & lifestyle'
  },
  {
    id: 'business',
    label: 'Business',
    icon: Briefcase,
    description: 'Business capital & expansion'
  },
  {
    id: 'education',
    label: 'Education',
    icon: GraduationCap,
    description: 'Tuition & educational needs'
  },
  {
    id: 'medical',
    label: 'Medical',
    icon: Heart,
    description: 'Healthcare & medical expenses'
  },
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    description: 'Home improvement & renovation'
  },
  {
    id: 'others',
    label: 'Others',
    icon: MoreHorizontal,
    description: 'Other financing needs'
  }
];

export function LoanPurposeStep({ loanData, setLoanData, onNext, onBack }: LoanPurposeStepProps) {
  const handleSelectPurpose = (purposeId: string) => {
    setLoanData({ ...loanData, purpose: purposeId });
    // Auto-advance after selection with a small delay for visual feedback
    setTimeout(() => {
      onNext();
    }, 300);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-3 sm:mb-4">
          How will you use your funds?
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Select the primary purpose for your loan application
        </p>
      </div>

      {/* Purpose Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {purposes.map((purpose) => {
          const Icon = purpose.icon;
          const isSelected = loanData.purpose === purpose.id;

          return (
            <button
              key={purpose.id}
              onClick={() => handleSelectPurpose(purpose.id)}
              className={`
                group relative bg-white rounded-xl p-6 sm:p-8 border-2 transition-all duration-300
                hover:shadow-xl hover:-translate-y-1 text-left
                ${
                  isSelected
                    ? 'border-success shadow-lg ring-4 ring-success/20'
                    : 'border-[#e2e8f0] hover:border-primary/30'
                }
              `}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                  <svg className="w-4 h-4 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className={`
                w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300
                ${
                  isSelected
                    ? 'bg-success text-success-foreground shadow-lg'
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md'
                }
              `}>
                <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              {/* Content */}
              <div>
                <h3 className={`
                  text-lg sm:text-xl font-semibold mb-2 transition-colors duration-300
                  ${isSelected ? 'text-success' : 'text-foreground group-hover:text-primary'}
                `}>
                  {purpose.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {purpose.description}
                </p>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`
                absolute inset-0 rounded-xl transition-opacity duration-300
                ${isSelected ? 'bg-success/5' : 'bg-primary/0 group-hover:bg-primary/5'}
              `} />
            </button>
          );
        })}
      </div>

      {/* Optional: Skip Button */}
      <div className="text-center mt-8 sm:mt-12">
        <button
          onClick={() => {
            setLoanData({ ...loanData, purpose: 'personal' });
            onNext();
          }}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Skip for now
        </button>
      </div>

      {/* Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 border-2 border-[#e2e8f0] rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors font-medium text-foreground"
        >
          Back
        </button>
      </div>
    </div>
  );
}