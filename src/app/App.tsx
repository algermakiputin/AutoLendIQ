import { useState, useEffect } from "react";
import { LoanApplicationWizard } from "./components/loan-application-wizard";
import { LoanOffersPage } from "./components/loan-offers-page";
import { SmartApplicationProgress } from "./components/smart-application-progress";
import { LoanReviewDashboard } from "./components/loan-review-dashboard";
import { ApproverLogin } from "./components/approver-login";
import { ApproverDashboard } from "./components/approver-dashboard";
import { ApplicationReviewDetail } from "./components/application-review-detail";
import { BankPartnerAdmin } from "./components/bank-partner-admin";
import { DatabaseSetupNotice } from "./components/database-setup-notice";
import {
  Sparkles,
  CheckCircle,
  TrendingUp,
  Users,
  ArrowRight,
  Shield,
  Zap,
  Activity,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building2,
} from "lucide-react";
import { createApproverAction } from "../utils/api";
import { MOCK_BANK_PARTNERS } from "./data/bank-partners";
import logo from "figma:asset/f0f1e75fbe24cb57ad970f880f03d951e07279ad.png";

type View =
  | "landing"
  | "application"
  | "offers"
  | "review"
  | "approver-login"
  | "approver-dashboard"
  | "approver-review"
  | "progress-demo"
  | "bank-admin";

interface Approver {
  name: string;
  email: string;
  role: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [approver, setApprover] = useState<Approver | null>(null);
  const [reviewingApplicationId, setReviewingApplicationId] = useState<
    string | null
  >(null);
  const [loanData, setLoanData] = useState<any>(null);

  // Simulated live metrics that update
  const [liveMetrics, setLiveMetrics] = useState({
    approvalTime: 35,
    fraudAccuracy: 99.8,
    activeTasks: 142,
  });

  // useEffect(() => {
  //   // Simulate live metrics updates
  //   const interval = setInterval(() => {
  //     setLiveMetrics({
  //       approvalTime: +(4.0 + Math.random() * 0.5).toFixed(1),
  //       fraudAccuracy: +(99.7 + Math.random() * 0.2).toFixed(1),
  //       activeTasks: Math.floor(138 + Math.random() * 8),
  //     });
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  const handleApproverLogin = (loggedInApprover: Approver) => {
    setApprover(loggedInApprover);
    setCurrentView("approver-dashboard");
  };

  const handleApproverLogout = () => {
    setApprover(null);
    setCurrentView("landing");
  };

  const handleReviewApplication = (applicationId: string) => {
    setReviewingApplicationId(applicationId);
    setCurrentView("approver-review");
  };

  const handleDecision = async (
    decision: "approved" | "rejected",
    notes: string,
  ) => {
    if (!reviewingApplicationId || !approver) return;

    try {
      // Save the approver action to the database
      await createApproverAction({
        application_id: reviewingApplicationId,
        approver_name: approver.name,
        approver_email: approver.email,
        action: decision,
        justification: notes,
      });

      alert(
        `Application ${decision === "approved" ? "Approved" : "Rejected"}!\n\nNotes: ${notes}`,
      );
      setCurrentView("approver-dashboard");
      setReviewingApplicationId(null);
    } catch (error) {
      console.error("Error saving decision:", error);
      alert("Failed to save decision. Please try again.");
    }
  };

  // Landing page - choose between applicant or approver
  if (currentView === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-success/5">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 border border-primary/20 rounded-full mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                AI-Powered Agentic Orchestration
              </span>
            </div>

            <h1 className="text-primary mb-3 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl">
              AutoLend IQ
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-2 sm:mb-4">
              Agentic Loan Application Platform
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Experience lightning-fast loan decisions powered by autonomous AI
              agents working in harmony
            </p>
          </div>

          {/* Live Metrics Ticker */}
          <div className="bg-gradient-to-r from-primary via-success to-primary bg-[length:200%_100%] animate-[gradient_8s_linear_infinite] p-[1px] rounded-lg mb-8 sm:mb-12 lg:mb-16 shadow-lg">
            <div className="bg-white rounded-lg px-4 sm:px-6 py-4 sm:py-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Avg Approval Time
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      {liveMetrics.approvalTime}M
                      <span className="text-xs ml-1 text-success">⚡ Live</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Fraud Detection
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-success">
                      {liveMetrics.fraudAccuracy}%
                      <span className="text-xs ml-1 text-success">⚡ Live</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Completed Agentic Tasks
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-warning">
                      {liveMetrics.activeTasks}
                      <span className="text-xs ml-1 text-success">⚡ Live</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agent Hive Visualization */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                Meet Your Agent Hive
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Autonomous AI agents orchestrated to process your application in
                real-time
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Identity Agent */}
              <div className="bg-white rounded-xl p-6 border-2 border-primary/20 hover:border-primary shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    Identity Agent
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Verifies document authenticity using computer vision and
                    OCR. Extracts and validates applicant data with 98%+
                    accuracy.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-success font-medium">
                      Active • Processing
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Analysis Agent */}
              <div className="bg-white rounded-xl p-6 border-2 border-success/20 hover:border-success shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-success to-success/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-success-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    Risk Analysis Agent
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Evaluates creditworthiness, DTI ratios, and payment
                    capacity. Uses ML models trained on 10M+ loan applications.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-success font-medium">
                      Active • Analyzing
                    </span>
                  </div>
                </div>
              </div>

              {/* Fraud Detection Agent */}
              <div className="bg-white rounded-xl p-6 border-2 border-warning/20 hover:border-warning shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-warning to-warning/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-warning-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    Fraud Detection Agent
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Scans for suspicious patterns and anomalies.
                    Cross-references data across multiple fraud databases in
                    real-time.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                    <span className="text-success font-medium">
                      Active • Monitoring
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orchestration Flow Visualization */}
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-primary/10 via-success/10 to-warning/10 rounded-lg p-4 sm:p-6 border border-primary/20 overflow-x-auto">
              <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm min-w-max">
                <span className="text-muted-foreground font-medium">
                  Orchestration Flow:
                </span>
                <div className="flex items-center gap-2">
                  <div className="px-2 sm:px-3 py-1 bg-primary/20 text-primary rounded-full font-medium text-xs sm:text-sm">
                    Identity
                  </div>
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <div className="px-2 sm:px-3 py-1 bg-success/20 text-success rounded-full font-medium text-xs sm:text-sm">
                    Risk
                  </div>
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <div className="px-2 sm:px-3 py-1 bg-warning/20 text-warning rounded-full font-medium text-xs sm:text-sm">
                    Fraud
                  </div>
                  <svg
                    className="w-4 h-4 sm:w-6 sm:h-6 text-muted-foreground flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <div className="px-2 sm:px-3 py-1 bg-primary/20 text-primary rounded-full font-medium flex items-center gap-1 text-xs sm:text-sm">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    Decision
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Partners Showcase */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3">
                <Building2 className="w-3 h-3" />
                Our Lending Network
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                Trusted by Leading Philippine Banks
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                We partner with {MOCK_BANK_PARTNERS.length} financial
                institutions to bring you the best loan offers. Apply once, get
                multiple pre-approved offers.
              </p>
            </div>

            {/* Bank Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 border border-[#e2e8f0] text-center">
                <p className="text-3xl font-bold text-primary mb-1">
                  {MOCK_BANK_PARTNERS.length}
                </p>
                <p className="text-xs text-muted-foreground">Bank Partners</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#e2e8f0] text-center">
                <p className="text-3xl font-bold text-success mb-1">
                  {Math.min(
                    ...MOCK_BANK_PARTNERS.map((b) => b.interestRateRange[0]),
                  )}
                  %
                </p>
                <p className="text-xs text-muted-foreground">Lowest Rate</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#e2e8f0] text-center">
                <p className="text-3xl font-bold text-warning mb-1">₱5M</p>
                <p className="text-xs text-muted-foreground">Max Loan Amount</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-[#e2e8f0] text-center">
                <p className="text-3xl font-bold text-primary mb-1">
                  {Math.round(
                    (MOCK_BANK_PARTNERS.reduce(
                      (acc, b) => acc + b.approvalRate,
                      0,
                    ) /
                      MOCK_BANK_PARTNERS.length) *
                      100,
                  )}
                  %
                </p>
                <p className="text-xs text-muted-foreground">
                  Avg Approval Rate
                </p>
              </div>
            </div>

            {/* Bank Logos Grid */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#e2e8f0] shadow-lg">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {MOCK_BANK_PARTNERS.filter((b) => b.isActive).map((bank) => (
                  <div
                    key={bank.id}
                    className="flex flex-col items-center justify-center group"
                  >
                    <div className="relative w-20 h-20 mb-3 rounded-xl overflow-hidden border-2 border-[#e2e8f0] group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg">
                      <img
                        src={bank.logoUrl}
                        alt={bank.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs font-semibold text-foreground text-center group-hover:text-primary transition-colors">
                      {bank.name}
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      from {bank.interestRateRange[0]}%
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Banner */}
              <div className="mt-8 pt-8 border-t border-[#e2e8f0]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-primary/5 to-success/5 rounded-lg p-4 sm:p-6">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Ready to compare offers?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Submit one application and receive multiple pre-approved
                      loan offers
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentView("application")}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Compliance Strip */}
          <div className="bg-white rounded-xl p-8 border border-[#e2e8f0] shadow-lg mb-8 sm:mb-12">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Enterprise-Grade Security & Compliance
              </h3>
              <p className="text-sm text-muted-foreground">
                Bank-level security standards protecting your financial data
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* SOC 2 Type II */}
              <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-[#e2e8f0] group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground text-center">
                  SOC 2
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Type II
                </p>
              </div>

              {/* ISO 27001 */}
              <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-[#e2e8f0] group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <p className="text-xs font-semibold text-foreground text-center">
                  ISO 27001
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Certified
                </p>
              </div>

              {/* PCI DSS */}
              <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-[#e2e8f0] group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-warning" />
                </div>
                <p className="text-xs font-semibold text-foreground text-center">
                  PCI DSS
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Level 1
                </p>
              </div>

              {/* GDPR */}
              <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-[#e2e8f0] group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground text-center">
                  GDPR
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Compliant
                </p>
              </div>

              {/* Bank-Grade Encryption */}
              <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border border-[#e2e8f0] group hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <p className="text-xs font-semibold text-foreground text-center">
                  256-bit
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Encryption
                </p>
              </div>
            </div>
          </div>

          {/* Portal Access Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 sm:mb-12">
            {/* Applicant Portal */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 sm:p-8 border-2 border-primary/20 hover:border-primary/40 transition-all shadow-lg hover:shadow-xl group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Apply for a Loan
                  </h3>
                  <p className="text-sm text-muted-foreground">For Borrowers</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Submit your loan application and get instant AI-powered
                decisions from multiple Philippine banks. Compare offers and
                choose the best one for you.
              </p>
              <button
                onClick={() => setCurrentView("application")}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-105 transition-transform"
              >
                Start Application
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Loan Manager Portal */}
            <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-xl p-6 sm:p-8 border-2 border-success/20 hover:border-success/40 transition-all shadow-lg hover:shadow-xl group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                  <Users className="w-6 h-6 text-success-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Loan Manager Dashboard
                  </h3>
                  <p className="text-sm text-muted-foreground">For Approvers</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Review pending applications, verify AI recommendations, and
                provide final approval decisions. Monitor application queues and
                agent performance.
              </p>
              <button
                onClick={() => setCurrentView("approver-login")}
                className="w-full px-6 py-3 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:scale-105 transition-transform"
              >
                Manager Login
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Powered by AI • Secured by Trust-Tech • Built for Filipinos
            </p>
            <p className="text-xs">© 2026 AutoLend IQ. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentView === "application" && (
        <LoanApplicationWizard
          onComplete={() => setCurrentView("review")}
          onBack={() => setCurrentView("landing")}
        />
      )}
      {currentView === "offers" && (
        <LoanOffersPage onBack={() => setCurrentView("landing")} />
      )}
      {currentView === "review" && (
        <LoanReviewDashboard onBack={() => setCurrentView("landing")} />
      )}
      {currentView === "approver-login" && (
        <ApproverLogin
          onLogin={handleApproverLogin}
          onBack={() => setCurrentView("landing")}
        />
      )}
      {currentView === "approver-dashboard" && approver && (
        <ApproverDashboard
          approver={approver}
          onLogout={handleApproverLogout}
          onReviewApplication={handleReviewApplication}
        />
      )}
      {currentView === "approver-review" &&
        approver &&
        reviewingApplicationId && (
          <ApplicationReviewDetail
            applicationId={reviewingApplicationId}
            onBack={() => setCurrentView("approver-dashboard")}
            onDecision={handleDecision}
          />
        )}
      {currentView === "progress-demo" && (
        <SmartApplicationProgress onBack={() => setCurrentView("landing")} />
      )}
      {currentView === "bank-admin" && (
        <BankPartnerAdmin onBack={() => setCurrentView("landing")} />
      )}
    </div>
  );
}
