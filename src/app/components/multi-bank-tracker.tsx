import { CheckCircle2, Clock, XCircle, AlertCircle, Building2 } from 'lucide-react';
import { BankApplication } from '../types/bank-partner';

interface MultiBankTrackerProps {
  applications: BankApplication[];
  onViewOffer?: (application: BankApplication) => void;
}

export function MultiBankTracker({
  applications,
  onViewOffer,
}: MultiBankTrackerProps) {
  const getStatusIcon = (status: BankApplication['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'accepted':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'pending_final_approval':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'fully_approved':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'disbursed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'under_review':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'submitted':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'withdrawn':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: BankApplication['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'accepted':
        return 'bg-success/20 text-success border-success/40';
      case 'pending_final_approval':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'fully_approved':
        return 'bg-success/30 text-success border-success/50';
      case 'disbursed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'under_review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'withdrawn':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: BankApplication['status']) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'accepted':
        return 'Accepted';
      case 'pending_final_approval':
        return 'Pending Final Approval';
      case 'fully_approved':
        return 'Fully Approved';
      case 'disbursed':
        return 'Disbursed';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
      case 'submitted':
        return 'Submitted';
      case 'withdrawn':
        return 'Withdrawn';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate stats
  const stats = {
    total: applications.length,
    approved: applications.filter((a) => a.status === 'approved' || a.status === 'accepted').length,
    pending: applications.filter(
      (a) => a.status === 'submitted' || a.status === 'under_review'
    ).length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e2e8f0] rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Applied</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-xs text-success mb-1">Approved</p>
          <p className="text-2xl font-bold text-success">{stats.approved}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-xs text-amber-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-xs text-destructive mb-1">Rejected</p>
          <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
        </div>
      </div>

      {/* Applications Timeline */}
      <div className="space-y-3">
        {applications.map((application) => (
          <div
            key={application.id}
            className="bg-white border border-[#e2e8f0] rounded-lg p-4 sm:p-6 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Bank Info */}
              <div className="flex items-start gap-3 flex-1">
                <Building2 className="w-10 h-10 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1">
                    {application.bankName}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatCurrency(application.appliedAmount)} for{' '}
                    {application.appliedTerm} months
                  </p>

                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusIcon(application.status)}
                    <span className="text-sm font-medium">
                      {getStatusLabel(application.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="flex flex-col gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Submitted</p>
                  <p className="font-medium text-foreground">
                    {formatDate(application.submittedAt)}
                  </p>
                </div>
                {application.statusUpdatedAt && (
                  <div>
                    <p className="text-muted-foreground text-xs">Last Updated</p>
                    <p className="font-medium text-foreground">
                      {formatDate(application.statusUpdatedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center">
                {application.status === 'approved' && application.offer && onViewOffer && (
                  <button
                    onClick={() => onViewOffer(application)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap"
                  >
                    View Offer
                  </button>
                )}
                {application.status === 'under_review' && (
                  <div className="text-xs text-muted-foreground text-right">
                    <p>Processing...</p>
                    <p className="font-medium text-amber-600">Check back soon</p>
                  </div>
                )}
                {application.status === 'rejected' && application.rejectionReason && (
                  <div className="text-xs text-right">
                    <p className="text-muted-foreground">Reason:</p>
                    <p className="font-medium text-destructive">
                      {application.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Offer Details (if approved) */}
            {application.status === 'approved' && application.offer && (
              <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Interest Rate</p>
                    <p className="font-semibold text-success">
                      {application.offer.interestRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      Monthly Payment
                    </p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(application.offer.monthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Total Interest</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(application.offer.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">
                      Processing Fee
                    </p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(application.offer.processingFeeAmount)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {application.notes && (
              <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
                <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                <p className="text-sm text-foreground">{application.notes}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12 bg-white border border-[#e2e8f0] rounded-lg">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No bank applications yet</p>
        </div>
      )}
    </div>
  );
}