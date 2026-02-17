import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface SmileWidgetProps {
  userToken: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export function SmileWidget({ userToken, onSuccess, onError, onClose }: SmileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Check if script is already loaded
    if (scriptLoadedRef.current || (window as any).SmileIdentity) {
      initializeWidget();
      return;
    }

    // Load the Smile script dynamically
    const script = document.createElement('script');
    script.src = 'https://web.smileapi.io/v2/smile.v2.js';
    script.async = true;
    script.id = 'smile-widget-script';

    script.onload = () => {
      scriptLoadedRef.current = true;
      setIsLoading(false);
      initializeWidget();
    };

    script.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      console.error('Failed to load Smile widget script');
      onError?.({ message: 'Failed to load Smile widget' });
    };

    // Append script to document head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the widget container content on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  const initializeWidget = () => {
    try {
      const SmileIdentity = (window as any).SmileIdentity;
      
      if (!SmileIdentity) {
        console.error('SmileIdentity not found on window');
        setHasError(true);
        return;
      }

      // Initialize the Smile widget
      const smileWidget = new SmileIdentity({
        userToken: userToken,
        
        // Callback when user successfully connects
        onSuccess: (data: any) => {
          console.log('Smile widget success:', data);
          onSuccess?.(data);
        },

        // Callback when there's an error
        onError: (error: any) => {
          console.error('Smile widget error:', error);
          setHasError(true);
          onError?.(error);
        },

        // Callback when user closes the widget
        onClose: () => {
          console.log('Smile widget closed');
          onClose?.();
        },

        // Callback when widget is ready
        onReady: () => {
          console.log('Smile widget ready');
          setIsLoading(false);
        },
      });

      // Open the widget
      smileWidget.open();

    } catch (error) {
      console.error('Error initializing Smile widget:', error);
      setHasError(true);
      setIsLoading(false);
      onError?.(error);
    }
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
        <button
          onClick={() => {
            setHasError(false);
            setIsLoading(true);
            scriptLoadedRef.current = false;
            initializeWidget();
          }}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Loading secure widget...</p>
      </div>
    );
  }

  // The widget will render in a modal/overlay created by SmileIdentity
  return (
    <div ref={containerRef} className="smile-widget-container" />
  );
}
