import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  TrendingUp,
  Wallet,
  CreditCard,
} from "lucide-react";
import {
  getEmployments,
  getIncome,
  getListOfProviders,
} from "../../utils/getSmileApi";
import SmileWinkButton from "./smileapi/widget";
import { useSmileWink } from "../../hooks/useSmileWink";

interface BankVerificationStepProps {
  loanData: {
    bankConnected?: boolean;
    bankName?: string;
    accountVerified?: boolean;
    accountBalance?: number;
    monthlyIncome?: number;
  };
  setLoanData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  popular: boolean;
}

export function BankVerificationStep({
  loanData,
  setLoanData,
  onNext,
  onBack,
}: BankVerificationStepProps) {
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >(loanData.bankConnected ? "connected" : "idle");
  const [selectedBank, setSelectedBank] = useState<string | null>(
    loanData.bankName || null,
  );
  const [showBankList, setShowBankList] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const { isLoading, openWidget, closeWidget, iframeRef, isOpen } =
    useSmileWink({
      onSuccess: async (response) => {
        console.log(`response: `, response);
        setConnectionStatus("connected");
        await getEmployments();
        await getIncome();
      },
      onExit: () => {},
    });

  // Mock bank list - in production, this would come from GetSMILE API
  const [popularBanks, setPopularBanks] = useState([]);

  const [allBanks, setAllBanks] = useState([]);

  const processProviders = (items) => {
    // 1. Define high-priority IDs for the PH market
    const popularIds = [
      "bir_orus_ph", // BIR
      "bdo", // BDO
      "accenture_ph", // Accenture
      "711_ph", // 7-11
      "ace-hardware", // Ace Hardware
      "airasia_ph", // AirAsia
    ];

    // 2. Filter out popular ones
    const popular = items.filter((item) => popularIds.includes(item.id));

    // 3. Filter others (exclude popular and ensuring they are 'enabled')
    const others = items
      .filter((item) => !popularIds.includes(item.id) && item.enabled)
      .sort((a, b) => a.name.localeCompare(b.name));

    return { popular, others };
  };

  // Simulate GetSMILE API connection
  const connectToBank = async (bankId: string, bankName: string) => {
    setConnectionStatus("connecting");
    setSelectedBank(bankName);
    openWidget();
    // Simulate API call to GetSMILE
    // In production:
    // const response = await fetch('https://api.getsmileapi.com/v1/users/{userId}/accounts', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer YOUR_GETSMILE_API_KEY`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ provider: bankId })
    // });

    // setTimeout(() => {
    //   // Simulate successful connection with mock data
    //   const mockData = {
    //     bankConnected: true,
    //     bankName: bankName,
    //     accountVerified: true,
    //     accountBalance: 625000 + Math.random() * 2500000,
    //     monthlyIncome: 225000 + Math.random() * 250000,
    //   };

    //   setLoanData({ ...loanData, ...mockData });
    //   setConnectionStatus("connected");
    //   setShowBankList(false);

    //   // Verify the account
    //   setTimeout(() => {
    //     verifyAccount();
    //   }, 1000);
    // }, 2500);
  };

  const verifyAccount = () => {
    setIsVerifying(true);

    // Simulate account verification
    setTimeout(() => {
      setIsVerifying(false);
    }, 1500);
  };

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getListOfProviders();
      const popularSources = processProviders(response?.data?.items);
      const dataSources = popularSources?.popular?.map((item) => ({
        id: item?.id,
        name: item?.longName,
        logo: item?.logoUrl,
        popular: true,
      }));
      console.log(`data sources: `, dataSources);
      setPopularBanks(dataSources);
    };
    fetchProviders();
  }, []);

  const canProceed = connectionStatus === "connected";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-primary">Connect Your Bank Account</h1>
        <p className="text-muted-foreground">
          Securely connect your bank account to verify your income and financial
          standing. This helps us provide you with the best loan terms.
        </p>
      </div>
      {/* Security Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border border-[#e2e8f0] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="font-medium text-foreground">256-bit Encryption</p>
            <p className="text-xs text-muted-foreground">Bank-level security</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-[#e2e8f0] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Powered by GetSMILE</p>
            <p className="text-xs text-muted-foreground">Trusted by millions</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-[#e2e8f0] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="font-medium text-foreground">Read-only Access</p>
            <p className="text-xs text-muted-foreground">We never move money</p>
          </div>
        </div>
      </div>
      {/* Main Connection Card */}
      <div
        className="w-full h-[800px] mt-4 rounded-b-2xl shadow-2xl border-x border-b border-gray-200 overflow-hidden bg-card"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <iframe
          ref={iframeRef}
          title="Smile Wink"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "#fff",
          }}
        />
      </div>
      <div
        className="bg-card rounded-lg p-8 shadow-lg border border-[#e2e8f0]"
        style={{ display: isOpen ? "none" : "block" }}
      >
        {connectionStatus === "idle" && (
          <>
            <h2 className="mb-6">Select Your Provider</h2>

            {/* Popular Banks */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Popular Providers
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {popularBanks?.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => connectToBank(bank.id, bank.name)}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 border-[#e2e8f0] bg-white hover:border-primary hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-3xl">
                      <img
                        src={bank.logo}
                        style={{ width: 55, borderRadius: 15 }}
                      />
                    </span>
                    <span className="font-medium text-foreground">
                      {bank.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* All Banks Button */}
            <button
              onClick={() => setShowBankList(!showBankList)}
              className="w-full px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              {showBankList ? "Hide All Providers" : "View All Providers"}
            </button>

            {/* All Banks List */}
            {showBankList && (
              <div className="mt-4 p-4 bg-background rounded-lg border border-[#e2e8f0] max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {allBanks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => connectToBank(bank.id, bank.name)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors text-left"
                    >
                      <span className="text-2xl">{bank.logo}</span>
                      <span className="font-medium text-foreground">
                        {bank.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {connectionStatus === "connecting" && !isOpen && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-6" />
            <h2 className="mb-2 text-primary">
              Connecting to {selectedBank}...
            </h2>
            <p className="text-muted-foreground mb-6">
              Please complete the authentication in the popup window
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground text-left">
                  GetSMILE uses secure, encrypted connections. Your login
                  credentials are never stored by AutoLend IQ.
                </p>
              </div>
            </div>
          </div>
        )}

        {connectionStatus === "connected" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-[#e2e8f0]">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <div className="flex-1">
                <h2 className="text-success mb-1">
                  Bank Connected Successfully!
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedBank} • Account verified
                </p>
              </div>
            </div>

            {/* Account Details */}
            {loanData.accountVerified && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-6 border border-[#e2e8f0]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Account Balance
                        </p>
                        <p className="text-2xl font-semibold text-primary">
                          ₱
                          {(loanData.accountBalance || 0).toLocaleString(
                            "en-PH",
                            { maximumFractionDigits: 0 },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-success text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <div className="bg-background rounded-lg p-6 border border-[#e2e8f0]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Monthly Income
                        </p>
                        <p className="text-2xl font-semibold text-success">
                          ₱
                          {(loanData.monthlyIncome || 0).toLocaleString(
                            "en-PH",
                            { maximumFractionDigits: 0 },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-success text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>

                {/* Verification Status */}
                {isVerifying ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-primary font-medium">
                        Verifying your financial information...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-success/5 border border-success/20 rounded-lg p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm text-success font-medium mb-1">
                          Financial verification complete
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your income and account balance have been verified and
                          will help us determine your loan terms.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Change Bank */}
            <button
              onClick={() => {
                setConnectionStatus("idle");
                setSelectedBank(null);
                setLoanData({
                  ...loanData,
                  bankConnected: false,
                  bankName: undefined,
                  accountVerified: false,
                });
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Connect a different bank
            </button>
          </div>
        )}

        {connectionStatus === "error" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="mb-2 text-destructive">Connection Failed</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't connect to your bank. Please try again.
            </p>
            <button
              onClick={() => setConnectionStatus("idle")}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-primary mb-2">Why connect your bank?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Instantly verify your income and financial standing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Get pre-approved faster with automated verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Potentially qualify for better interest rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Your credentials are encrypted and never stored by us
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            px-8 py-4 rounded-lg font-medium shadow-md transition-all duration-200
            ${
              canProceed
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg"
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            }
          `}
        >
          {canProceed
            ? "Continue to Identity Verification"
            : "Connect your bank to continue"}
        </button>
      </div>
    </div>
  );
}
