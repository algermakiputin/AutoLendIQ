import { Check, Sparkles } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  status: 'complete' | 'active' | 'upcoming';
}

interface LoanProgressTrackerProps {
  steps: Step[];
}

export function LoanProgressTracker({ steps }: LoanProgressTrackerProps) {
  return (
    <div className="bg-white lg:min-h-screen lg:w-80 border-b lg:border-r lg:border-b-0 border-[#e2e8f0] p-4 sm:p-6 lg:p-8">
      <div className="lg:sticky lg:top-8">
        <div className="mb-6 lg:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center mb-3 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
          </div>
          <h2 className="text-primary mb-1 sm:mb-2 text-lg sm:text-xl">AutoLend IQ</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Smart Application Process</p>
        </div>

        {/* Mobile: Horizontal Steps */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {steps.map((step) => {
            const isCompleted = step.status === 'complete';
            const isActive = step.status === 'active';

            return (
              <div key={step.number} className="flex flex-col items-center min-w-[70px] flex-shrink-0">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 mb-2
                    ${
                      isCompleted
                        ? 'bg-success text-success-foreground shadow-md'
                        : isActive
                        ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20'
                        : 'bg-secondary text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="font-semibold text-xs">{step.number}</span>
                  )}
                </div>
                <p className={`text-xs text-center leading-tight ${isActive ? 'text-primary font-medium' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Desktop: Vertical Steps */}
        <div className="hidden lg:block space-y-2">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'complete';
            const isActive = step.status === 'active';
            const isUpcoming = step.status === 'upcoming';

            return (
              <div key={step.number} className="relative">
                <div className="flex items-start gap-4">
                  {/* Step Indicator */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${
                          isCompleted
                            ? 'bg-success text-success-foreground shadow-md'
                            : isActive
                            ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20'
                            : 'bg-secondary text-muted-foreground'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold">{step.number}</span>
                      )}
                    </div>
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`
                          absolute left-5 top-10 w-0.5 h-12 transition-colors duration-300
                          ${isCompleted ? 'bg-success' : 'bg-border'}
                        `}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-8">
                    <h3
                      className={`
                        transition-colors duration-300 mb-1
                        ${isActive ? 'text-primary font-medium' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                      `}
                    >
                      {step.title}
                    </h3>
                    {isCompleted && (
                      <span className="inline-block mt-1 text-xs font-medium text-success">
                        ✓ Completed
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-block mt-1 text-xs font-medium text-primary">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}