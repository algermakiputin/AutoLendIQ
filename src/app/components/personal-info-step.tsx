import { useState } from 'react';
import { User, Mail, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface PersonalInfoStepProps {
  loanData: {
    applicantName?: string;
    applicantEmail?: string;
    applicantPhone?: string;
    [key: string]: any;
  };
  setLoanData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PersonalInfoStep({
  loanData,
  setLoanData,
  onNext,
  onBack,
}: PersonalInfoStepProps) {
  const [name, setName] = useState(loanData.applicantName || '');
  const [email, setEmail] = useState(loanData.applicantEmail || '');
  const [phone, setPhone] = useState(loanData.applicantPhone || '');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Philippine phone number format: 09XX XXX XXXX or +639XX XXX XXXX
    const phoneRegex = /^(\+639|09)\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone
    if (!phone.trim()) {
      newErrors.phone = 'Contact number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid Philippine mobile number (e.g., 09XX XXX XXXX)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save data and proceed
    setLoanData({
      ...loanData,
      applicantName: name.trim(),
      applicantEmail: email.trim(),
      applicantPhone: phone.trim().replace(/\s/g, ''),
    });
    onNext();
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as 09XX XXX XXXX
    if (cleaned.startsWith('09') && cleaned.length <= 11) {
      if (cleaned.length > 7) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 11)}`;
      } else if (cleaned.length > 4) {
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
      }
      return cleaned;
    }
    
    // Format as +639XX XXX XXXX
    if (cleaned.startsWith('639') && cleaned.length <= 12) {
      if (cleaned.length > 8) {
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`;
      } else if (cleaned.length > 5) {
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
      } else if (cleaned.length > 2) {
        return `+${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
      }
      return `+${cleaned}`;
    }
    
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-primary mb-1">Personal Information</h2>
            <p className="text-muted-foreground text-sm">
              Tell us a bit about yourself to get started
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Your information is secure
            </p>
            <p className="text-xs text-muted-foreground">
              We use bank-level encryption to protect your personal data. Your information will only be used to process your loan application.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              className={`
                w-full pl-12 pr-4 py-3 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                transition-colors
                ${errors.name ? 'border-destructive' : 'border-[#e2e8f0]'}
              `}
              placeholder="Juan dela Cruz"
            />
          </div>
          {errors.name && (
            <div className="flex items-center gap-2 mt-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{errors.name}</p>
            </div>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              className={`
                w-full pl-12 pr-4 py-3 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                transition-colors
                ${errors.email ? 'border-destructive' : 'border-[#e2e8f0]'}
              `}
              placeholder="juan.delacruz@email.com"
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-2 mt-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{errors.email}</p>
            </div>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
            Contact Number <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`
                w-full pl-12 pr-4 py-3 border rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                transition-colors
                ${errors.phone ? 'border-destructive' : 'border-[#e2e8f0]'}
              `}
              placeholder="09XX XXX XXXX"
            />
          </div>
          {errors.phone && (
            <div className="flex items-center gap-2 mt-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{errors.phone}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            We'll use this to contact you about your loan application
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 border-2 border-[#e2e8f0] rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors font-medium text-foreground"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold shadow-md hover:shadow-lg"
        >
          Continue
        </button>
      </div>

      {/* Privacy Note */}
      <div className="pt-4 border-t border-[#e2e8f0]">
        <p className="text-xs text-muted-foreground text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
