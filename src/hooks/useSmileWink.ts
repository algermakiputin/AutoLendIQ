import { useEffect, useState, useCallback, useRef } from "react";
import { initializeSmileLink } from "../utils/getSmileApi";

interface UseSmileWinkOptions {
  onSuccess?: (data: any) => void;
  onExit?: (reason: string) => void;
  templateId?: string;
}

export const useSmileWink = ({
  onSuccess,
  onExit,
  templateId = "wtpl-9c633223be7d4c42824c76707fdf03b7",
}: UseSmileWinkOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};

      if (type === "SMILE_CONNECTED") {
        onSuccess?.(payload);
      }

      if (type === "SMILE_CLOSED") {
        onExit?.(payload?.reason || "closed");
        setIsOpen(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onSuccess, onExit]);

  const openWidget = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const iframe = iframeRef.current;
      if (!iframe) {
        console.error("Smile iframe not mounted");
        setIsLoading(false);
        return;
      }

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        console.error("Unable to access iframe document");
        setIsLoading(false);
        return;
      }

      // 1) Get user token from your backend
      const response = await initializeSmileLink();
      const userToken = response.token;

      // 2) Inject minimal HTML + Smile script into the iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Smile Wink</title>
          </head>
          <body style="margin:0;padding:0;">
            <div id="smile-root"></div>
            <script>
              (function() {
                function loadScript(src) {
                  return new Promise(function(resolve, reject) {
                    var s = document.createElement('script');
                    s.src = src;
                    s.async = true;
                    s.onload = resolve;
                    s.onerror = reject;
                    document.head.appendChild(s);
                  });
                }

                async function init() {
                  try {
                    await loadScript('https://web.smileapi.io/v2/smile.v2.js');

                    var modal = new window.SmileLinkModal({
                      userToken: '${userToken}',
                      templateId: '${templateId}',

                      onAccountConnected: function(data) {
                        window.parent.postMessage(
                          { type: 'SMILE_CONNECTED', payload: data },
                          '*'
                        );
                      },
                      onClose: function(params) {
                        var reason = params && params.reason ? params.reason : 'closed';
                        window.parent.postMessage(
                          { type: 'SMILE_CLOSED', payload: { reason: reason } },
                          '*'
                        );
                      }
                    });

                    modal.open();
                  } catch (e) {
                    console.error('Failed to init Smile in iframe', e);
                    window.parent.postMessage(
                      { type: 'SMILE_CLOSED', payload: { reason: 'error' } },
                      '*'
                    );
                  }
                }

                init();
              })();
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();

      setIsOpen(true);
    } catch (e) {
      console.error("Failed to open Smile Wink:", e);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, templateId]);

  const closeWidget = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    openWidget,
    closeWidget,
    isLoading,
    isOpen,
    iframeRef,
  };
};
