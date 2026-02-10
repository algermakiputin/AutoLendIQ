import React, { useEffect, useRef, useState } from "react";
import { initializeSmileLink } from "../../../utils/getSmileApi";

interface SmileWinkButtonProps {
  onConnectSuccess?: (data: any) => void;
  onExit?: (reason: string) => void;
}

const SmileWinkButton: React.FC<SmileWinkButtonProps> = ({
  onConnectSuccess,
  onExit,
}) => {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showContainer, setShowContainer] = useState(false);

  // Ref to the DOM element where the iframe will live
  const containerRef = useRef<HTMLDivElement>(null);

  // Load the Smile SDK Script dynamically

  const initializeWidget = async () => {
    if (!sdkReady) return;

    setLoading(true);
    setShowContainer(true);

    try {
      const response = await initializeSmileLink();

      const userToken = response.token;

      // 2. Initialize the Modal inside the ref container
      const smileLinkModal = new (window as any).SmileLinkModal({
        userToken: userToken,
        // Points the SDK to our specific DIV ID
        templateId: "wtpl-9c633223be7d4c42824c76707fdf03b7",
        containerId: "smile-sdk-host",
        topProviders: ["bir_orus_ph", "bdo", "accenture_ph", "711_ph"],

        onAccountConnected: (data: any) => {
          console.log("Account connected:", data);
          if (onConnectSuccess) onConnectSuccess(data);
        },
        onClose: ({ reason }: { reason: string }) => {
          setShowContainer(false);
          if (onExit) onExit(reason);
        },
        onUIEvent: (event) => {
          console.log("Smile UI event:", event);
        },
      });

      smileLinkModal.open();
    } catch (error) {
      console.error("Failed to launch Smile Wink:", error);
      setShowContainer(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!showContainer ? (
        <button
          onClick={initializeWidget}
          disabled={!sdkReady || loading}
          className={`group relative flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
            loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-emerald-200/50"
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              Agent Orchestrating...
            </span>
          ) : (
            <>
              <span>Link Financial Account</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </>
          )}
        </button>
      ) : (
        /* DEVICE FRAME CONTAINER */
        <div className="w-full max-w-[450px] animate-in fade-in zoom-in duration-500">
          <div className="bg-navy-900 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center border-b border-navy-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest">
                Secure Agent Link
              </span>
            </div>
            <button
              onClick={() => setShowContainer(false)}
              className="hover:text-red-400 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {showContainer && (
        <>
          <div
            id="smile-sdk-host"
            ref={containerRef}
            className="w-full h-[550px] bg-white rounded-b-2xl shadow-2xl border-x border-b border-gray-200 overflow-hidden"
          >
            {/* The Smile Iframe will render inside here */}
          </div>

          <p className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Bank-grade encrypted connection
          </p>
        </>
      )}
    </div>
  );
};

export default SmileWinkButton;
