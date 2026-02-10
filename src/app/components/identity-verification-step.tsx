import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Shield, Lock } from 'lucide-react';

interface IdentityVerificationStepProps {
  loanData: {
    documents: File[];
  };
  setLoanData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function IdentityVerificationStep({
  loanData,
  setLoanData,
  onNext,
  onBack,
}: IdentityVerificationStepProps) {
  const [documents, setDocuments] = useState<File[]>(loanData.documents || []);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    
    // Simulate upload process
    setUploadStatus('uploading');
    setTimeout(() => {
      setDocuments([...documents, ...newFiles]);
      setLoanData({ ...loanData, documents: [...documents, ...newFiles] });
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    }, 1500);
  };

  const removeDocument = (index: number) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
    setLoanData({ ...loanData, documents: newDocuments });
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const canProceed = documents.length >= 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-primary">Verify Your Identity</h1>
        <p className="text-muted-foreground">
          We need to confirm your identity to keep your loan secure. Upload a clear photo of your government-issued ID.
        </p>
      </div>

      {/* Security Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-4 border border-[#e2e8f0] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="font-medium text-foreground">Bank-level security</p>
            <p className="text-xs text-muted-foreground">256-bit encryption</p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Your data is safe</p>
            <p className="text-xs text-muted-foreground">Never shared or sold</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-card rounded-lg p-8 shadow-lg border border-[#e2e8f0]">
        <h2 className="mb-6">Upload Documents</h2>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 md:p-16 text-center transition-all duration-200
            ${
              dragActive
                ? 'border-primary bg-primary/5'
                : uploadStatus === 'success'
                ? 'border-success bg-success/5'
                : uploadStatus === 'error'
                ? 'border-destructive bg-destructive/5'
                : 'border-[#e2e8f0] bg-background hover:border-primary/50 hover:bg-primary/5'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleChange}
            accept="image/*,.pdf"
            className="hidden"
          />

          {uploadStatus === 'uploading' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-muted-foreground">Uploading your documents...</p>
            </div>
          ) : uploadStatus === 'success' ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <p className="text-success font-medium">Upload successful!</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="mb-2 text-foreground">
                {dragActive ? 'Drop your files here' : 'Drag and drop your files here'}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                or click to browse from your device
              </p>
              <button
                onClick={onButtonClick}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-md"
              >
                Choose Files
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                Supported formats: JPG, PNG, PDF (Max 10MB per file)
              </p>
            </>
          )}
        </div>

        {/* Uploaded Files List */}
        {documents.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-foreground">Uploaded Documents ({documents.length})</h3>
            <div className="space-y-3">
              {documents.map((file, index) => (
                <div
                  key={index}
                  className="bg-background rounded-lg p-4 flex items-center justify-between border border-[#e2e8f0] hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-success" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                  </div>
                  <button
                    onClick={() => removeDocument(index)}
                    className="ml-4 p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove document"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Requirements Checklist */}
      <div className="bg-warning/5 border border-warning/20 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-warning mb-2">Document Requirements</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Photo must be clear and all text must be readable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Document must not be expired</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-warning mt-0.5">•</span>
                <span>Acceptable documents: Driver's License, Passport, or State ID</span>
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
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            }
          `}
        >
          {canProceed ? 'Submit for Review' : 'Upload at least 1 document'}
        </button>
      </div>
    </div>
  );
}