import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  DollarSign, 
  Building2, 
  Shield, 
  Sparkles,
  User,
  TrendingDown,
  FileSearch,
  ChevronRight,
  Terminal,
  Loader2,
  ArrowLeft,
  Home
} from 'lucide-react';

interface SmartApplicationProgressProps {
  loanData?: {
    amount: number;
    interestRate: number;
    term: number;
    monthlyPayment: number;
    bankConnected?: boolean;
    bankName?: string;
    accountVerified?: boolean;
    accountBalance?: number;
    monthlyIncome?: number;
  };
  onBack?: () => void;
}

type StepStatus = 'complete' | 'active' | 'pending';
type AgentStatus = 'complete' | 'processing' | 'pending';

interface MicroAgent {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: AgentStatus;
  progress: number;
  emoji: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export function SmartApplicationProgress({ loanData = {
  amount: 2500000,
  interestRate: 12.5,
  term: 36,
  monthlyPayment: 83500,
  bankConnected: true,
  bankName: 'BDO Unibank',
  accountVerified: true,
  accountBalance: 450000,
  monthlyIncome: 75000,
}, onBack = () => {} }: SmartApplicationProgressProps) {
  const [currentStep, setCurrentStep] = useState(3); // Start at AI Agent Orchestration
  const [microAgents, setMicroAgents] = useState<MicroAgent[]>([
    {
      id: 'identity',
      name: 'Identity Agent',
      description: 'Document verification complete',
      icon: User,
      status: 'complete',
      progress: 100,
      emoji: '✅',
    },
    {
      id: 'risk',
      name: 'Risk Agent',
      description: 'Analyzing cashflow patterns',
      icon: TrendingDown,
      status: 'processing',
      progress: 67,
      emoji: '🔄',
    },
    {
      id: 'fraud',
      name: 'Fraud Agent',
      description: 'Scanning documents for anomalies',
      icon: FileSearch,
      status: 'processing',
      progress: 45,
      emoji: '✨',
    },
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: 'Identity Agent',
      message: 'Verified SSS ID authenticity - PASSED',
      type: 'success',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 2000).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: 'Risk Agent',
      message: 'Analyzing bank transaction history...',
      type: 'info',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 4000).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent: 'Fraud Agent',
      message: 'Initiating document pattern recognition',
      type: 'info',
    },
  ]);

  const steps = [
    {
      id: 'loan-amount',
      title: 'Loan Amount',
      description: 'Amount and terms selected',
      icon: DollarSign,
      status: 'complete' as StepStatus,
      details: `₱${loanData.amount.toLocaleString('en-PH')} for ${loanData.term} months`,
    },
    {
      id: 'bank-connection',
      title: 'Bank Connection',
      description: 'Account linked successfully',
      icon: Building2,
      status: 'complete' as StepStatus,
      details: loanData.bankName || 'Bank connected',
    },
    {
      id: 'identity-check',
      title: 'Identity Check',
      description: 'Documents verified',
      icon: Shield,
      status: 'complete' as StepStatus,
      details: 'ID verification complete',
    },
    {
      id: 'ai-orchestration',
      title: 'AI Agent Orchestration',
      description: 'Intelligent processing in progress',
      icon: Sparkles,
      status: 'active' as StepStatus,
      details: '3 agents analyzing your application',
    },
  ];

  // Simulate agent progress and logs
  useEffect(() => {
    const interval = setInterval(() => {
      setMicroAgents((prev) =>
        prev.map((agent) => {
          if (agent.status === 'processing') {
            const newProgress = Math.min(agent.progress + Math.random() * 8, 100);
            const newStatus = newProgress >= 100 ? 'complete' : 'processing';
            return {
              ...agent,
              progress: newProgress,
              status: newStatus,
              emoji: newStatus === 'complete' ? '✅' : agent.emoji,
              description: newStatus === 'complete' 
                ? agent.id === 'risk' 
                  ? 'Cashflow analysis complete' 
                  : 'Document scan complete'
                : agent.description,
            };
          }
          return agent;
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Add new logs periodically
  useEffect(() => {
    const logMessages = [
      { agent: 'Risk Agent', message: 'Evaluating debt-to-income ratio...', type: 'info' as const },
      { agent: 'Fraud Agent', message: 'Cross-referencing government databases', type: 'info' as const },
      { agent: 'Risk Agent', message: 'Monthly income verified: ₱75,000', type: 'success' as const },
      { agent: 'Fraud Agent', message: 'Document authenticity score: 98/100', type: 'success' as const },
      { agent: 'Risk Agent', message: 'Credit utilization: 35% - HEALTHY', type: 'success' as const },
      { agent: 'System', message: 'Generating final risk assessment...', type: 'info' as const },
    ];

    let messageIndex = 0;
    const interval = setInterval(() => {
      if (messageIndex < logMessages.length) {
        const newLog: LogEntry = {
          id: `${Date.now()}-${messageIndex}`,
          timestamp: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          ...logMessages[messageIndex],
        };
        setLogs((prev) => [newLog, ...prev].slice(0, 8));
        messageIndex++;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStepColor = (status: StepStatus) => {
    switch (status) {
      case 'complete':
        return 'text-success border-success bg-success/10';
      case 'active':
        return 'text-primary border-primary bg-primary/10';
      case 'pending':
        return 'text-muted-foreground border-border bg-secondary';
    }
  };

  const getAgentStatusColor = (status: AgentStatus) => {
    switch (status) {
      case 'complete':
        return 'bg-success/10 border-success/20';
      case 'processing':
        return 'bg-primary/10 border-primary/20';
      case 'pending':
        return 'bg-secondary border-border';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="bg-white border-b border-[#e2e8f0] sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">AutoLend IQ</span>
              </div>
            </div>
            
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Home className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Home</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Processing</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Smart Application Progress</h1>
          <p className="text-muted-foreground text-lg">
            Our AI agents are intelligently analyzing your application in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Timeline */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 border border-[#e2e8f0] shadow-lg">
              <h2 className="text-foreground mb-8 flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-primary" />
                Application Steps
              </h2>
              
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === steps.length - 1;
                  
                  return (
                    <div key={step.id} className="relative">
                      {/* Connection Line */}
                      {!isLast && (
                        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border -mb-6" />
                      )}
                      
                      {/* Step Content */}
                      <div className="relative flex gap-4">
                        {/* Icon Circle */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300 ${getStepColor(step.status)}`}>
                          {step.status === 'complete' ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : step.status === 'active' ? (
                            <Icon className="w-6 h-6 animate-pulse" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </div>
                        
                        {/* Step Info */}
                        <div className="flex-1 pb-8">
                          <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                          <p className="text-xs text-primary font-medium">{step.details}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - AI Orchestration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Micro Agents Panel */}
            <div className="bg-white rounded-2xl p-8 border border-[#e2e8f0] shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-foreground flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  AI Micro-Agents
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Processing in parallel</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {microAgents.map((agent) => {
                  const Icon = agent.icon;
                  return (
                    <div
                      key={agent.id}
                      className={`rounded-xl p-6 border-2 transition-all duration-300 ${getAgentStatusColor(agent.status)}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-2xl">{agent.emoji}</span>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-2">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 h-10">{agent.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{Math.round(agent.progress)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${
                              agent.status === 'complete' ? 'bg-success' : 'bg-primary'
                            }`}
                            style={{ width: `${agent.progress}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="mt-4 pt-4 border-t border-border/50">
                        {agent.status === 'complete' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Complete
                          </span>
                        ) : agent.status === 'processing' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent Status Terminal */}
            <div className="bg-[#1A2B48] rounded-2xl p-8 shadow-lg border border-[#2A3B58]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Terminal className="w-5 h-5 text-success" />
                  <h3 className="font-semibold text-white">Agent Status Terminal</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-xs text-success font-mono">LIVE</span>
                </div>
              </div>

              {/* Terminal Window */}
              <div className="bg-[#0F1A2E] rounded-xl p-6 font-mono text-sm min-h-[300px] max-h-[300px] overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex gap-4 items-start group hover:bg-white/5 -mx-2 px-2 py-1 rounded transition-colors">
                      <span className="text-muted-foreground text-xs opacity-60 flex-shrink-0 w-20">
                        {log.timestamp}
                      </span>
                      <span className="text-primary font-semibold flex-shrink-0 w-32">
                        [{log.agent}]
                      </span>
                      <span className={`flex-1 ${getLogColor(log.type)}`}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Typing Indicator */}
                <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>

              {/* Terminal Footer */}
              <div className="mt-4 pt-4 border-t border-[#2A3B58] flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-mono">
                  autoLend-iq-agent-system v2.1.0
                </span>
                <span className="text-success font-mono">
                  {logs.length} events logged
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">AI Agents</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {microAgents.filter(a => a.status === 'complete').length}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {microAgents.filter(a => a.status === 'processing').length}
                </p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">~2m</p>
                <p className="text-xs text-muted-foreground">Est. Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0F1A2E;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10B981;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
}