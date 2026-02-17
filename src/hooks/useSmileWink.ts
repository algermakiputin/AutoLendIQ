import { useEffect, useState, useCallback, useRef } from "react";
import { initializeSmileLink } from "../utils/getSmileApi";
import { LoanApplicationData } from "../utils/api";

interface UseSmileWinkOptions {
  applicationData?: {
    applicantName?: string;
    applicantEmail?: string;
    applicantPhone?: string;
  };
  onSuccess?: (data: any) => void;
  onExit?: (reason: string) => void;
  templateId?: string;
}

export const useSmileWink = ({
  applicationData,
  onSuccess,
  onExit,
  templateId = "wtpl-9c633223be7d4c42824c76707fdf03b7",
}: UseSmileWinkOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // 1. Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      console.log("Received message from iframe:", type, payload);
      // Capture specific Account ID (e.g., a-xxxx)
      if (type === "SMILE_ACCOUNT_CREATED") {
        console.log("Captured Account ID:", payload?.accountId);
        onSuccess?.(payload);
      }

      // General connection success
      if (type === "SMILE_CONNECTED") {
        setIsConnected(true);
        onSuccess?.(payload);
      }

      if (type === "SMILE_CLOSED") {
        if (isConnected) {
          onExit?.(payload?.reason);
          setIsOpen(false);
        } else {
          onExit?.("closed");
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSuccess, onExit]);

  // 2. Initialize the iframe content ONCE
  const initIframe = useCallback(async () => {
    const iframe = iframeRef.current;
    if (!iframe || iframe.getAttribute("data-initialized") === "true") return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    setIsLoading(true);
    try {
      const { token: userToken } = await initializeSmileLink({
        name: applicationData?.applicantName ?? "",
        email: applicationData?.applicantEmail ?? "",
        phoneNumber: applicationData?.applicantPhone ?? "",
      });

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head><meta charset="UTF-8" /></head>
          <body style="margin:0;padding:0;background:transparent;">
            <script src="https://web.smileapi.io/v2/smile.v2.js"></script>
            <script>
              window.smileModal = null;
              window.addEventListener('message', function(event) {
                if (event.data.type === 'COMMAND_OPEN') {
                  if (!window.smileModal) {
                    window.smileModal = new window.SmileLinkModal({
                      userToken: '${userToken}',
                      templateId: '${templateId}',
                      
                      // Triggered immediately when the specific test account is linked
                      onAccountCreated: function(data) {
                        window.parent.postMessage({ 
                          type: 'SMILE_ACCOUNT_CREATED', 
                          payload: data 
                        }, '*');
                      },

                      // Triggered when the whole flow is finished
                      onAccountConnected: function(data) {
                        window.parent.postMessage({ 
                          type: 'SMILE_CONNECTED', 
                          payload: data 
                        }, '*');
                      },

                      onClose: (params) => {
                        window.parent.postMessage({ 
                          type: 'SMILE_CLOSED', 
                          payload: params 
                        }, '*');
                      }
                    });
                  }
                  window.smileModal.open();
                }
              });
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();
      iframe.setAttribute("data-initialized", "true");
    } catch (e) {
      console.error("Smile Init Error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    initIframe();
  }, [initIframe]);

  const openWidget = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    setIsOpen(true);
    iframeRef.current.contentWindow.postMessage({ type: "COMMAND_OPEN" }, "*");
  }, []);

  const closeWidget = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { openWidget, closeWidget, isLoading, isOpen, iframeRef };
};
