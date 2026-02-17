import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';

interface SmileWidgetIframeProps {
  userToken: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export function SmileWidgetIframe({ userToken, onSuccess, onError, onClose }: SmileWidgetIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from Smile API
      if (event.origin !== 'https://web.smileapi.io') {
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'smile-success':
          console.log('Smile widget success:', data);
          onSuccess?.(data);
          break;
        case 'smile-error':
          console.error('Smile widget error:', data);
          setHasError(true);
          onError?.(data);
          break;
        case 'smile-close':
          console.log('Smile widget closed');
          onClose?.();
          break;
        case 'smile-ready':
          console.log('Smile widget ready');
          setIsLoading(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSuccess, onError, onClose]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.({ message: 'Failed to load Smile widget iframe' });
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Widget</h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
          We couldn't load the verification widget. Please check your internet connection and try again.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Try Again
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // Construct the Smile Wink widget URL
  // In production, you'll get the user token from your backend
  const widgetUrl = `https://link.getsmile.com/v1/wink?token=${userToken}`;

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-sm text-muted-foreground">Loading secure widget...</p>
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white border border-[#e2e8f0] hover:bg-gray-50 transition-colors flex items-center justify-center shadow-sm"
          aria-label="Close widget"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={widgetUrl}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        className="w-full h-full min-h-[600px] border-0 rounded-lg"
        allow="camera; geolocation; microphone"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        title="Smile ID Verification Widget"
      />
    </div>
  );
}
