import { TrendingUp, Shield, CheckCircle2, AlertTriangle, BarChart3, FileText } from 'lucide-react';
import { useState } from 'react';

interface Recommendation {
  status: string;
  confidence: number;
  riskScore: number;
  approvalProbability: number;
  reasons: string[];
}

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const [showContract, setShowContract] = useState(false);

  // Determine status color
  const getStatusColor = () => {
    if (recommendation.confidence >= 80) return '#10B981'; // success/green
    if (recommendation.confidence >= 60) return '#3b82f6'; // primary/blue
    if (recommendation.confidence >= 40) return '#F59E0B'; // warning/amber
    return '#ef4444'; // destructive/red
  };

  const statusColor = getStatusColor();

  // Get risk level
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'Low Risk', color: '#10B981', icon: Shield };
    if (score <= 50) return { level: 'Medium Risk', color: '#F59E0B', icon: AlertTriangle };
    return { level: 'High Risk', color: '#ef4444', icon: AlertTriangle };
  };

  const riskLevel = getRiskLevel(recommendation.riskScore);
  const RiskIcon = riskLevel.icon;

  const handleGenerateContract = () => {
    setShowContract(true);
    // In a real app, this would trigger contract generation
    setTimeout(() => {
      alert('Contract generation initiated! This would typically create a PDF document with all loan terms and conditions.');
      setShowContract(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] shadow-xl overflow-hidden">
      {/* Header with Gradient */}
      <div
        className="p-8 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${statusColor} 0%, ${statusColor}cc 100%)`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-sm font-medium opacity-90">AI Recommendation</span>
              </div>
              <h2 className="text-3xl font-semibold mb-1">
                {recommendation.status}
              </h2>
              <p className="text-sm opacity-90">
                High confidence in loan approval
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Confidence Score</span>
              <span className="text-2xl font-semibold">{recommendation.confidence}%</span>
            </div>
            <div className="h-4 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${recommendation.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Risk Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Risk Score */}
          <div className="bg-background rounded-lg p-6 border border-[#e2e8f0]">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${riskLevel.color}20` }}
              >
                <RiskIcon className="w-6 h-6" style={{ color: riskLevel.color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Risk Assessment</p>
                <p className="font-semibold" style={{ color: riskLevel.color }}>
                  {riskLevel.level}
                </p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Risk Score</span>
                <span className="text-xl font-semibold text-foreground">
                  {recommendation.riskScore}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${recommendation.riskScore}%`,
                    backgroundColor: riskLevel.color,
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Lower score indicates better risk profile
            </p>
          </div>

          {/* Approval Probability */}
          <div className="bg-background rounded-lg p-6 border border-[#e2e8f0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Approval Rate</p>
                <p className="font-semibold text-success">Very High</p>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Probability</span>
                <span className="text-xl font-semibold text-foreground">
                  {recommendation.approvalProbability}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${recommendation.approvalProbability}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on historical data and AI models
            </p>
          </div>

          {/* Processing Time */}
          <div className="bg-background rounded-lg p-6 border border-[#e2e8f0]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Processing</p>
                <p className="font-semibold text-primary">Complete</p>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-xl font-semibold text-foreground mb-1">2.4 min</p>
              <p className="text-sm text-muted-foreground">Total analysis time</p>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              87% faster than traditional review
            </p>
          </div>
        </div>

        {/* Key Factors */}
        <div className="mb-8">
          <h4 className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Key Approval Factors
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendation.reasons.map((reason, index) => (
              <div
                key={index}
                className="flex items-start gap-3 bg-success/5 border border-success/20 rounded-lg p-4"
              >
                <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <p className="text-sm text-foreground">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleGenerateContract}
            disabled={showContract}
            className={`
              flex-1 px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-200
              flex items-center justify-center gap-3
              ${
                showContract
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-success text-white hover:bg-success/90 hover:shadow-xl hover:scale-[1.02]'
              }
            `}
            style={{
              backgroundColor: showContract ? undefined : statusColor,
            }}
          >
            {showContract ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating Contract...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Generate Loan Contract
              </>
            )}
          </button>
          <button className="px-8 py-4 bg-background border-2 border-[#e2e8f0] text-foreground rounded-lg hover:bg-secondary transition-all duration-200 font-semibold hover:border-primary/50">
            Request Manual Review
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-background rounded-lg border border-[#e2e8f0]">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span> This AI recommendation is based on automated analysis of the provided information. Final approval may require additional documentation or manual review. All loan terms are subject to change based on final underwriting.
          </p>
        </div>
      </div>
    </div>
  );
}
