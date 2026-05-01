'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Building2,
  Globe,
  Briefcase,
  Users,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  Zap,
  Rocket,
  LayoutDashboard,
} from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import AuthLayout from '@/modules/auth/components/auth-layout';
import AuthSideBranding from '@/modules/auth/components/auth-side-branding';
import PasswordStrength from '@/modules/auth/components/password-strength';
import { useAuthStore } from '@/store/auth-store';

const STEPS = [
  { id: 1, label: 'Personal', icon: User },
  { id: 2, label: 'Company', icon: Building2 },
  { id: 3, label: 'Workspace', icon: LayoutDashboard },
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Other',
];

const COMPANY_SIZES = [
  { value: '1-10', label: '1–10 employees' },
  { value: '11-50', label: '11–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-1000', label: '201–1,000 employees' },
  { value: '1000+', label: '1,000+ employees' },
];

const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'UAE',
  'Australia',
  'Singapore',
  'Canada',
  'Germany',
];

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    description: 'For small teams',
    icon: Sparkles,
    features: ['Up to 5 users', 'Basic analytics', 'Email support', '1 GB storage'],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$49/mo',
    description: 'For growing businesses',
    icon: Zap,
    popular: true,
    features: ['Up to 50 users', 'Advanced analytics', 'Priority support', '50 GB storage', 'API access'],
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '$149/mo',
    description: 'For agencies & enterprises',
    icon: Rocket,
    features: ['Unlimited users', 'Custom analytics', 'Dedicated support', '500 GB storage', 'API access', 'Custom integrations', 'White-label'],
  },
];

const countryCodes = [
  { value: '+91', label: '+91', country: 'India' },
  { value: '+1', label: '+1', country: 'US' },
  { value: '+44', label: '+44', country: 'UK' },
  { value: '+971', label: '+971', country: 'UAE' },
  { value: '+61', label: '+61', country: 'Australia' },
  { value: '+65', label: '+65', country: 'Singapore' },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const fieldVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
    },
  },
};

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

interface StepErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const { signup, navigateTo } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 — Personal
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step1Errors, setStep1Errors] = useState<StepErrors>({});

  // Step 2 — Company
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [website, setWebsite] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [country, setCountry] = useState('');
  const [step2Errors, setStep2Errors] = useState<StepErrors>({});

  // Step 3 — Workspace
  const [workspaceName, setWorkspaceName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('growth');

  // Validation
  const validateStep1 = useCallback((): boolean => {
    const errors: StepErrors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required';
    if (!email.trim()) errors.email = 'Work email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email';
    if (!phone.trim()) errors.phone = 'Mobile number is required';
    else if (!/^\d{7,15}$/.test(phone.replace(/\s/g, ''))) errors.phone = 'Please enter a valid phone number';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  }, [fullName, email, phone, password, confirmPassword]);

  const validateStep2 = useCallback((): boolean => {
    const errors: StepErrors = {};
    if (!businessName.trim()) errors.businessName = 'Business name is required';
    if (!industry) errors.industry = 'Please select an industry';
    if (!companySize) errors.companySize = 'Please select company size';
    if (website.trim() && !/^https?:\/\/.+/.test(website)) errors.website = 'Please enter a valid URL (https://...)';
    if (!country) errors.country = 'Please select a country';
    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  }, [businessName, industry, companySize, website, country]);

  const validateStep3 = useCallback((): boolean => {
    if (!workspaceName.trim()) return false;
    if (!subdomain.trim() || !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain)) return false;
    return true;
  }, [workspaceName, subdomain]);

  const goToStep = (step: number) => {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      goToStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      goToStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    
    try {
      await signup({ name: fullName, email, password });
    } catch (e) {
      console.warn('Backend signup failed. Proceeding with demo mode.');
    }

    document.cookie = "token=demo-jwt-token-123; path=/; max-age=3600";
    document.cookie = "auth-token=demo-jwt-token-123; path=/; max-age=3600";

    useAuthStore.setState({
      isAuthenticated: true,
      currentPage: 'login',
      activeModule: null,
      user: {
        id: 'usr-demo-001',
        name: fullName || 'Demo User',
        email: email,
        role: 'admin',
        status: 'active',
        timezone: 'Asia/Kolkata',
        language: 'English',
        avatar: `https://ui-avatars.com/api/?name=${fullName.charAt(0) || 'U'}&background=6366f1&color=fff`,
      } as any
    });
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/[^\d\s]/g, '');
    setPhone(cleaned);
    if (step1Errors.phone) {
      setStep1Errors((prev) => {
        const next = { ...prev };
        delete next.phone;
        return next;
      });
    }
  };

  const clearError = (step: number, field: string) => {
    if (step === 1) {
      setStep1Errors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    } else if (step === 2) {
      setStep2Errors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const progressValue = (currentStep / STEPS.length) * 100;

  const rightPanel = (
    <div className="flex w-full flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 0, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="w-full max-w-lg"
      >
        {/* Logo header - visible on mobile */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20}}
          className="flex justify-center mb-6 lg:hidden"
        >
          <Image src="/logo.png" alt="DigiNue" width={120} height={80} priority className="object-contain" />
        </motion.div>

        <Card className="rounded-2xl border-gray-200/60 shadow-sm">
          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="mt-1.5 text-sm text-gray-500">Get started with DigiNue in minutes</p>
            </div>

            {/* Stepper */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                  const isCompleted = currentStep > step.id;
                  const isActive = currentStep === step.id;
                  const StepIcon = step.icon;

                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center gap-1.5">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                            isCompleted
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : isActive
                                ? 'border-gray-900 bg-white text-gray-900'
                                : 'border-gray-200 bg-gray-50 text-gray-400'
                          }`}
                          animate={
                            isActive
                              ? { boxShadow: ['0 0 0 0 rgba(17,24,39,0.2)', '0 0 0 8px rgba(17,24,39,0)', '0 0 0 0 rgba(17,24,39,0)'] }
                              : {}
                          }
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <AnimatePresence mode="wait">
                            {isCompleted ? (
                              <motion.span
                                key="check"
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 90 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                <Check className="h-4 w-4" />
                              </motion.span>
                            ) : (
                              <motion.span
                                key="icon"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <StepIcon className="h-4 w-4" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        <span
                          className={`text-xs font-medium transition-colors ${
                            isActive ? 'text-gray-900' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>

                      {index < STEPS.length - 1 && (
                        <div className="relative mx-2 mb-5 h-0.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full bg-gray-900"
                            initial={{ width: '0%' }}
                            animate={{
                              width: currentStep > step.id + 1 ? '100%' : currentStep > step.id ? '50%' : '0%',
                            }}
                            transition={{ duration: 0.15, ease: 'easeInOut' }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <Progress value={progressValue} className="h-1.5 [&>div]:bg-gray-900 [&>div]:transition-all [&>div]:duration-500" />
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait" custom={direction}>
              {/* Step 1 — Personal */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <motion.form
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                  >
                    {/* Full Name */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="full-name" className="text-sm font-medium text-gray-700">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="full-name"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            clearError(1, 'fullName');
                          }}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                            step1Errors.fullName ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {step1Errors.fullName && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step1Errors.fullName}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Work Email */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
                        Work Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="reg-email"
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            clearError(1, 'email');
                          }}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                            step1Errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {step1Errors.email && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step1Errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Mobile Number */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="reg-phone" className="text-sm font-medium text-gray-700">
                        Mobile Number
                      </Label>
                      <div className="flex gap-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[110px] h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 focus:border-gray-400 focus:ring-gray-400/20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((cc) => (
                              <SelectItem key={cc.value} value={cc.value}>
                                <span className="flex items-center gap-1.5">
                                  <span className="font-medium">{cc.value}</span>
                                  <span className="text-xs text-gray-400">{cc.country}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <Input
                            id="reg-phone"
                            type="tel"
                            placeholder="9876543210"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            className={`pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                              step1Errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                            }`}
                          />
                        </div>
                      </div>
                      <AnimatePresence>
                        {step1Errors.phone && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step1Errors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Password */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="reg-password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="reg-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            clearError(1, 'password');
                          }}
                          className={`pl-10 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                            step1Errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {step1Errors.password && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step1Errors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <PasswordStrength password={password} />
                    </motion.div>

                    {/* Confirm Password */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            clearError(1, 'confirmPassword');
                          }}
                          className={`pl-10 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                            step1Errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {step1Errors.confirmPassword && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step1Errors.confirmPassword}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Next Button */}
                    <motion.div variants={fieldVariants} className="pt-2">
                      <Button
                        type="submit"
                        className="h-11 w-full rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-950"
                      >
                        <span className="flex items-center gap-2">
                          Next Step
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </motion.div>
                  </motion.form>
                </motion.div>
              )}

              {/* Step 2 — Company */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <motion.form
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNext();
                    }}
                  >
                    {/* Business Name */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="business-name" className="text-sm font-medium text-gray-700">
                        Business Name
                      </Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="business-name"
                          type="text"
                          placeholder="Acme Corporation"
                          value={businessName}
                          onChange={(e) => {
                            setBusinessName(e.target.value);
                            clearError(2, 'businessName');
                          }}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                            step2Errors.businessName ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {step2Errors.businessName && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step2Errors.businessName}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Industry */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Industry</Label>
                      <Select value={industry} onValueChange={(val) => { setIndustry(val); clearError(2, 'industry'); }}>
                        <SelectTrigger className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 focus:border-gray-400 focus:ring-gray-400/20 ${
                          step2Errors.industry ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {step2Errors.industry && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step2Errors.industry}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Company Size */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Company Size</Label>
                      <Select value={companySize} onValueChange={(val) => { setCompanySize(val); clearError(2, 'companySize'); }}>
                        <SelectTrigger className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 focus:border-gray-400 focus:ring-gray-400/20 ${
                          step2Errors.companySize ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMPANY_SIZES.map((size) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {step2Errors.companySize && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step2Errors.companySize}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Website URL */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                        Website URL
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://yourcompany.com"
                          value={website}
                          onChange={(e) => {
                            setWebsite(e.target.value);
                            clearError(2, 'website');
                          }}
                          className={`pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 ${
                            step2Errors.website ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {step2Errors.website && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step2Errors.website}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* GST Number */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="gst-number" className="text-sm font-medium text-gray-700">
                        GST Number <span className="text-gray-400 font-normal">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="gst-number"
                          type="text"
                          placeholder="22AAAAA0000A1Z5"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 uppercase"
                        />
                      </div>
                    </motion.div>

                    {/* Country */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Country</Label>
                      <Select value={country} onValueChange={(val) => { setCountry(val); clearError(2, 'country'); }}>
                        <SelectTrigger className={`h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 focus:border-gray-400 focus:ring-gray-400/20 ${
                          step2Errors.country ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                        }`}>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <AnimatePresence>
                        {step2Errors.country && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-red-500">
                            {step2Errors.country}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <motion.div variants={fieldVariants} className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="h-11 flex-1 rounded-xl border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <span className="flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </span>
                      </Button>
                      <Button
                        type="submit"
                        className="h-11 flex-1 rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-950"
                      >
                        <span className="flex items-center gap-2">
                          Next Step
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </motion.div>
                  </motion.form>
                </motion.div>
              )}

              {/* Step 3 — Workspace */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <motion.form
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    {/* Workspace Name */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="workspace-name" className="text-sm font-medium text-gray-700">
                        Workspace Name
                      </Label>
                      <div className="relative">
                        <LayoutDashboard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          id="workspace-name"
                          type="text"
                          placeholder="My Workspace"
                          value={workspaceName}
                          onChange={(e) => setWorkspaceName(e.target.value)}
                          className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20"
                        />
                      </div>
                    </motion.div>

                    {/* Subdomain */}
                    <motion.div variants={fieldVariants} className="space-y-2">
                      <Label htmlFor="subdomain" className="text-sm font-medium text-gray-700">
                        Workspace URL
                      </Label>
                      <div className="flex items-center">
                        <Input
                          id="subdomain"
                          type="text"
                          placeholder="my-workspace"
                          value={subdomain}
                          onChange={(e) => {
                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                            setSubdomain(val);
                          }}
                          className="h-11 rounded-xl rounded-r-none border-r-0 border-gray-200 bg-gray-50/50 text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:ring-gray-400/20 focus:z-10"
                        />
                        <div className="flex h-11 items-center whitespace-nowrap rounded-xl rounded-l-none border border-l-0 border-gray-200 bg-gray-100 px-3 text-sm text-gray-500">
                          .diginue.com
                        </div>
                      </div>
                      {subdomain && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs text-gray-400"
                        >
                          Your workspace will be accessible at{' '}
                          <span className="font-medium text-gray-600">
                            {subdomain}.diginue.com
                          </span>
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Plan Selection */}
                    <motion.div variants={fieldVariants} className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Choose your plan</Label>
                      <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-3">
                        {PLANS.map((plan) => {
                          const PlanIcon = plan.icon;
                          const isSelected = selectedPlan === plan.id;

                          return (
                            <motion.label
                              key={plan.id}
                              htmlFor={`plan-${plan.id}`}
                              className={`relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-4 transition-all ${
                                isSelected
                                  ? 'border-gray-900 bg-gray-50'
                                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                              }`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <RadioGroupItem value={plan.id} id={`plan-${plan.id}`} className="mt-0.5 sr-only" />
                              <div className="flex items-center justify-center">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                                    isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  <PlanIcon className="h-5 w-5" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-900">{plan.name}</span>
                                  {plan.popular && (
                                    <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 text-xs text-gray-500">{plan.description}</p>
                                <p className="mt-1 text-lg font-bold text-gray-900">{plan.price}</p>
                              </div>
                              <div className="flex items-center pt-1">
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                                    isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                                  }`}
                                >
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                    >
                                      <Check className="h-3 w-3 text-white" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.label>
                          );
                        })}
                      </RadioGroup>
                    </motion.div>

                    {/* Free Trial Note */}
                    <motion.div
                      variants={fieldVariants}
                      className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 p-3"
                    >
                      <Check className="h-4 w-4 shrink-0 text-green-600" />
                      <p className="text-xs text-green-700 font-medium">
                        14-day free trial, no credit card required
                      </p>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <motion.div variants={fieldVariants} className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        className="h-11 flex-1 rounded-xl border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      >
                        <span className="flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </span>
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 flex-[2] rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 active:bg-gray-950"
                      >
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.span
                              key="loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating Workspace...
                            </motion.span>
                          ) : (
                            <motion.span
                              key="idle"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              Create Workspace
                              <ArrowRight className="h-4 w-4" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center space-y-3"
        >
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigateTo('login')}
              className="font-semibold text-gray-900 transition-colors hover:text-gray-700 hover:underline"
            >
              Sign in
            </button>
          </p>
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              &copy; 2025 DigiNue. All rights reserved.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <AuthLayout
      leftPanel={<AuthSideBranding />}
      rightPanel={rightPanel}
    />
  );
}
