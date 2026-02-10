import { useState, useEffect } from "react";
import {
  LogOut,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  User,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { DatabaseSetupNotice } from "./database-setup-notice";
import { getAllLoanApplications } from "../../utils/api";
import { projectId } from "/utils/supabase/info";

interface Application {
  id: string;
  applicantName: string;
  amount: number;
  purpose: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  aiScore: number;
  riskLevel: "low" | "medium" | "high";
  monthlyIncome?: number;
  creditScore?: number;
}

interface ApproverDashboardProps {
  approver: {
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
  onReviewApplication: (applicationId: string) => void;
}

export function ApproverDashboard({
  approver,
  onLogout,
  onReviewApplication,
}: ApproverDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected" | "under_review"
  >("all");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setIsLoading(true);
        const data = await getAllLoanApplications();
        // Map API response to component interface
        const mappedData = data.map((app: any) => ({
          id: app.id || "",
          applicantName: app.applicant_name || "Unknown Applicant",
          amount: app.loan_amount || 0,
          purpose: app.loan_term?.toString() || "N/A",
          submittedDate: app.created_at || new Date().toISOString(),
          status: app.status || "pending",
          aiScore: app.ai_score || 0,
          riskLevel: "medium" as const,
          monthlyIncome: app.monthly_income,
          creditScore: app.credit_score,
        }));
        setApplications(mappedData);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApps();
  }, []);

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const applicantName =
      app.applicantName || `Loan #${app.id?.slice(0, 8) || "Unknown"}`;
    const matchesSearch =
      applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.id || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const stats = {
    pending: applications.filter((a) => a.status === "pending").length,
    under_review: applications.filter((a) => a.status === "under_review")
      .length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    total: applications.length,
  };

  const getRiskLevel = (aiScore?: number): "low" | "medium" | "high" => {
    if (!aiScore) return "medium";
    if (aiScore >= 80) return "low";
    if (aiScore >= 65) return "medium";
    return "high";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-success bg-success/10 border-success/20";
      case "medium":
        return "text-warning bg-warning/10 border-warning/20";
      case "high":
        return "text-destructive bg-destructive/10 border-destructive/20";
      default:
        return "text-muted-foreground bg-secondary border-border";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-warning bg-warning/10 border-warning/20";
      case "under_review":
        return "text-primary bg-primary/10 border-primary/20";
      case "approved":
        return "text-success bg-success/10 border-success/20";
      case "rejected":
        return "text-destructive bg-destructive/10 border-destructive/20";
      default:
        return "text-muted-foreground bg-secondary border-border";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "under_review":
        return "UNDER REVIEW";
      default:
        return status.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-primary text-base sm:text-lg lg:text-xl truncate">
                  AutoLend IQ
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Approver Portal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-foreground">
                  {approver.name}
                </p>
                <p className="text-xs text-muted-foreground">{approver.role}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive touch-manipulation"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Total Apps
              </p>
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground">
              {stats.total}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Pending
              </p>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold text-warning">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Approved
              </p>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold text-success">
              {stats.approved}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Rejected
              </p>
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
            </div>
            <p className="text-2xl sm:text-3xl font-semibold text-destructive">
              {stats.rejected}
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-[#e2e8f0] shadow-sm mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or ID..."
                className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white touch-manipulation"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-lg p-8 sm:p-12 border border-[#e2e8f0] shadow-sm text-center">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                Loading applications...
              </p>
            </div>
          ) : applications.length === 0 && !isLoading ? (
            <>
              <DatabaseSetupNotice projectId={projectId} />
              <div className="bg-white rounded-lg p-8 sm:p-12 border border-[#e2e8f0] shadow-sm text-center">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground">
                  No applications found. Make sure you've set up the database
                  tables.
                </p>
              </div>
            </>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg p-8 sm:p-12 border border-[#e2e8f0] shadow-sm text-center">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                No applications match your search criteria
              </p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg p-4 sm:p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col gap-4">
                  {/* Header Section */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-medium text-foreground truncate">
                          {app.applicantName || "Unknown Applicant"}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 sm:py-1 rounded border ${getStatusColor(app.status)} whitespace-nowrap`}
                        >
                          {getStatusLabel(app.status)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">
                        ID: {app.id?.slice(0, 12)}...
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg sm:text-2xl font-semibold text-primary">
                        ₱{(app.amount / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-muted-foreground">Loan</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Submitted
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-foreground">
                        {app.submittedDate
                          ? new Date(app.submittedDate).toLocaleDateString(
                              "en-PH",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        AI Score
                      </p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs sm:text-sm font-medium text-foreground">
                          {Math.round(app.aiScore || 0)}/100
                        </p>
                        <TrendingUp
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${(app.aiScore || 0) >= 80 ? "text-success" : (app.aiScore || 0) >= 65 ? "text-warning" : "text-destructive"}`}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Risk Level
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border inline-block ${getRiskColor(getRiskLevel(app.aiScore))}`}
                      >
                        {getRiskLevel(app.aiScore).toUpperCase()}
                      </span>
                    </div>

                    <div className="hidden sm:block">
                      <p className="text-xs text-muted-foreground mb-1">
                        Monthly Income
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-foreground">
                        {app.monthlyIncome
                          ? `₱${(app.monthlyIncome / 1000).toFixed(0)}K`
                          : "N/A"}
                      </p>
                    </div>

                    <div className="hidden lg:block">
                      <p className="text-xs text-muted-foreground mb-1">
                        Loan Term
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-foreground">
                        {app.purpose} mo
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {(app.status === "pending" ||
                    app.status === "under_review") && (
                    <button
                      onClick={() => onReviewApplication(app.id)}
                      className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                    >
                      Review Application
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
