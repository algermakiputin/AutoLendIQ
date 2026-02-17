import { useState } from 'react';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Search,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  MoreVertical,
} from 'lucide-react';
import { BankPartner } from '../types/bank-partner';
import { MOCK_BANK_PARTNERS } from '../data/bank-partners';

interface BankPartnerAdminProps {
  onBack?: () => void;
}

export function BankPartnerAdmin({ onBack }: BankPartnerAdminProps) {
  const [banks, setBanks] = useState<BankPartner[]>(MOCK_BANK_PARTNERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter banks
  const filteredBanks = banks.filter((bank) => {
    const matchesSearch =
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || bank.tier === filterTier;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && bank.isActive) ||
      (filterStatus === 'inactive' && !bank.isActive);

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: banks.length,
    active: banks.filter((b) => b.isActive).length,
    inactive: banks.filter((b) => !b.isActive).length,
    avgApprovalRate:
      banks.reduce((sum, b) => sum + b.approvalRate, 0) / banks.length,
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'universal':
        return 'bg-blue-100 text-blue-700';
      case 'commercial':
        return 'bg-purple-100 text-purple-700';
      case 'digital':
        return 'bg-emerald-100 text-emerald-700';
      case 'fintech':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Bank Partner Management
              </h1>
              <p className="text-muted-foreground">
                Manage your lending network and partner banks
              </p>
            </div>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 border border-[#e2e8f0] rounded-lg hover:bg-primary/5 transition-colors"
              >
                Back to Dashboard
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Partners</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-destructive">
                    {stats.inactive}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Approval</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(stats.avgApprovalRate * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white border border-[#e2e8f0] rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search banks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Tier Filter */}
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Tiers</option>
              <option value="universal">Universal Banks</option>
              <option value="commercial">Commercial Banks</option>
              <option value="digital">Digital Banks</option>
              <option value="fintech">Fintech Lenders</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            {/* Add Bank Button */}
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              Add Bank
            </button>
          </div>
        </div>

        {/* Banks Table */}
        <div className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[#e2e8f0]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Bank
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Tier
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Interest Rate
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Loan Range
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Approval Rate
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredBanks.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={bank.logoUrl}
                          alt={bank.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#e2e8f0]"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{bank.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {bank.avgApprovalTime}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getTierColor(
                          bank.tier
                        )}`}
                      >
                        {bank.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">
                        {bank.interestRateRange[0]}% - {bank.interestRateRange[1]}%
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground">
                        {formatCurrency(bank.minAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        to {formatCurrency(bank.maxAmount)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success rounded-full"
                            style={{ width: `${bank.approvalRate * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {Math.round(bank.approvalRate * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {bank.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-success/10 text-success">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-muted-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBanks.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No banks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
