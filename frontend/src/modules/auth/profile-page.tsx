'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Camera,
  User,
  Shield,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/auth-store';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +5:30)' },
  { value: 'America/New_York', label: 'America/New_York (EST -5:00)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST -8:00)' },
  { value: 'Europe/London', label: 'Europe/London (GMT +0:00)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET +1:00)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST +9:00)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST +4:00)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST +10:00)' },
];

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'German', label: 'German' },
];

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

const CURRENCIES = [
  { value: 'INR', label: 'INR (₹) — Indian Rupee' },
  { value: 'USD', label: 'USD ($) — US Dollar' },
  { value: 'EUR', label: 'EUR (€) — Euro' },
  { value: 'GBP', label: 'GBP (£) — British Pound' },
  { value: 'AED', label: 'AED (د.إ) — UAE Dirham' },
];

export default function ProfilePage() {
  const { user, navigateTo, updateProfile } = useAuthStore();

  // Profile form state
  const [fullName, setFullName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [designation, setDesignation] = useState(user?.designation ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [timezone, setTimezone] = useState(user?.timezone ?? 'Asia/Kolkata');
  const [language, setLanguage] = useState(user?.language ?? 'English');
  const [bio, setBio] = useState(user?.bio ?? '');

  // Security form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Preferences state
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [currency, setCurrency] = useState('INR');

  // Notification state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReports: true,
    newTeamMember: true,
    securityAlerts: true,
    marketing: false,
    productUpdates: true,
  });

  // Success message state
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);
  const [preferencesSuccess, setPreferencesSuccess] = useState(false);
  const [notificationsSuccess, setNotificationsSuccess] = useState(false);

  const showSuccess = useCallback(
    (setter: (v: boolean) => void) => {
      setter(true);
      setTimeout(() => setter(false), 2500);
    },
    [],
  );

  const handleSaveProfile = () => {
    updateProfile({
      name: fullName,
      email,
      designation,
      phone,
      timezone,
      language,
      bio,
    });
    showSuccess(setProfileSuccess);
  };

  const handleUpdatePassword = () => {
    if (newPassword && newPassword !== confirmPassword) return;
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showSuccess(setSecuritySuccess);
  };

  const handleSavePreferences = () => {
    showSuccess(setPreferencesSuccess);
  };

  const handleSaveNotifications = () => {
    showSuccess(setNotificationsSuccess);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Clean white interface' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Easy on the eyes' },
    { value: 'system' as const, label: 'System', icon: Monitor, description: 'Follow your OS setting' },
  ];

  const notificationItems = [
    { key: 'email' as const, label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'push' as const, label: 'Push Notifications', description: 'Browser push notifications' },
    { key: 'sms' as const, label: 'SMS Notifications', description: 'Text message alerts to your phone' },
    { key: 'weeklyReports' as const, label: 'Weekly Reports', description: 'Receive weekly summary via email' },
    { key: 'newTeamMember' as const, label: 'New Team Member Alerts', description: 'Get notified when someone joins' },
    { key: 'securityAlerts' as const, label: 'Security Alerts', description: 'Important security event notifications' },
    { key: 'marketing' as const, label: 'Marketing Updates', description: 'News about features and promotions' },
    { key: 'productUpdates' as const, label: 'Product Updates', description: 'New features and improvements' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-app-3xl py-app-3xl sm:py-app-4xl">
        {/* Page Header */}
        <motion.div {...fadeUp} className="mb-app-3xl">
          <button
            onClick={() => navigateTo('login')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-app-2xl group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Profile &amp; Settings
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm sm:text-sm">
            Manage your account preferences
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="w-full sm:w-auto grid grid-cols-4 mb-app-2xl bg-gray-100 rounded-[var(--app-radius-lg)] p-1">
              <TabsTrigger
                value="profile"
                className="rounded-[var(--app-radius-lg)] text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-colors"
              >
                <User className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-[var(--app-radius-lg)] text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-colors"
              >
                <Shield className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="rounded-[var(--app-radius-lg)] text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-colors"
              >
                <Settings className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Prefs</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="rounded-[var(--app-radius-lg)] text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] transition-colors"
              >
                <Bell className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Notify</span>
              </TabsTrigger>
            </TabsList>

            {/* ─── Tab 1: Profile ─── */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Card className="rounded-[var(--app-radius-xl)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] border-gray-100 bg-white">
                  <CardContent className="p-6 sm:p-app-3xl">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-app-3xl">
                      <div className="relative group">
                        <Avatar className="w-20 h-20 border-2 border-gray-100 shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])]">
                          <AvatarImage src={user?.avatar} alt={user?.name ?? 'User'} />
                          <AvatarFallback className="text-xl font-bold bg-gray-900 text-white">
                            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2.5 font-medium">Change Photo</p>
                    </div>

                    <Separator className="mb-app-3xl" />

                    {/* Form Fields */}
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-app-xl sm:gap-app-2xl"
                    >
                      <motion.div variants={staggerItem} className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10""
                        />
                      </motion.div>

                      <motion.div variants={staggerItem} className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10""
                        />
                      </motion.div>

                      <motion.div variants={staggerItem} className="space-y-2">
                        <Label htmlFor="designation" className="text-sm font-medium text-gray-700">
                          Designation
                        </Label>
                        <Input
                          id="designation"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="Product Designer"
                          className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10""
                        />
                      </motion.div>

                      <motion.div variants={staggerItem} className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10""
                        />
                      </motion.div>

                      <motion.div variants={staggerItem} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Timezone</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10"">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent className="rounded-[var(--app-radius-lg)]">
                            {TIMEZONES.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={staggerItem} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10"">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="rounded-[var(--app-radius-lg)]">
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={staggerItem} className="sm:col-span-2 space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself..."
                          rows={3}
                          className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 resize-none"
                        />
                      </motion.div>
                    </motion.div>

                    {/* Save Button & Success */}
                    <div className="mt-app-3xl flex items-center gap-4">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-gray-900 text-white rounded-[var(--app-radius-lg)] hover:bg-gray-800 px-6 h-10  font-medium"
                      >
                        Save Changes
                      </Button>
                      <AnimatePresence>
                        {profileSuccess && (
                          <motion.p
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-sm font-medium text-emerald-600"
                          >
                            Profile updated successfully
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* ─── Tab 2: Security ─── */}
            <TabsContent value="security">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-app-2xl"
              >
                {/* Change Password */}
                <Card className="rounded-[var(--app-radius-xl)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] border-gray-100 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[var(--app-radius-lg)] bg-gray-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          Change Password
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          Update your account password
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10  pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10  pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10  pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <Button
                        onClick={handleUpdatePassword}
                        className="bg-gray-900 text-white rounded-[var(--app-radius-lg)] hover:bg-gray-800 px-6 h-10  font-medium"
                      >
                        Update Password
                      </Button>
                      <AnimatePresence>
                        {securitySuccess && (
                          <motion.p
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-sm font-medium text-emerald-600"
                          >
                            Password updated successfully
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>

                {/* Two-Factor Authentication */}
                <Card className="rounded-[var(--app-radius-xl)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] border-gray-100 bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[var(--app-radius-lg)] bg-gray-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          Two-Factor Authentication
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                          Add an extra layer of security to your account
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={twoFactorEnabled}
                          onCheckedChange={setTwoFactorEnabled}
                          className="data-[state=checked]:bg-gray-900"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Authenticator App
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Use an app to generate verification codes
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs font-medium rounded-[var(--app-radius-lg)] ${
                          twoFactorEnabled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200'
                        }`}
                      >
                        {twoFactorEnabled ? '2FA is enabled' : '2FA is disabled'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* ─── Tab 3: Preferences ─── */}
            <TabsContent value="preferences">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Card className="rounded-[var(--app-radius-xl)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] border-gray-100 bg-white">
                  <CardContent className="p-6 sm:p-app-3xl">
                    {/* Theme Selection */}
                    <div className="mb-app-3xl">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">Theme</h3>
                      <p className="text-xs text-gray-400 mb-4">Choose your preferred appearance</p>
                      <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        {themeOptions.map((option) => {
                          const isSelected = selectedTheme === option.value;
                          return (
                            <motion.button
                              key={option.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedTheme(option.value)}
                              className={`relative flex flex-col items-center gap-2.5 p-4 sm:p-app-xl rounded-[var(--app-radius-lg)] border-2 transition-colors cursor-pointer ${
                                isSelected
                                  ? 'border-gray-900 bg-gray-50'
                                  : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50'
                              }`}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center"
                                >
                                  <Check className="w-4 h-4 text-white" />
                                </motion.div>
                              )}
                              <option.icon
                                className={`w-6 h-6 ${
                                  isSelected ? 'text-gray-900' : 'text-gray-400'
                                }`}
                              />
                              <span
                                className={`text-sm font-medium ${
                                  isSelected ? 'text-gray-900' : 'text-gray-600'
                                }`}
                              >
                                {option.label}
                              </span>
                              <span className="text-[10px] sm:text-xs text-gray-400 text-center leading-tight">
                                {option.description}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    {/* Date Format */}
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-app-xl sm:gap-app-2xl"
                    >
                      <motion.div variants={staggerItem} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Date Format</Label>
                        <Select value={dateFormat} onValueChange={setDateFormat}>
                          <SelectTrigger className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10"">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent className="rounded-[var(--app-radius-lg)]">
                            {DATE_FORMATS.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={staggerItem} className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="rounded-[var(--app-radius-lg)] border-gray-200 focus:border-gray-400 h-10"">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent className="rounded-[var(--app-radius-lg)]">
                            {CURRENCIES.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </motion.div>

                    {/* Save */}
                    <div className="mt-app-3xl flex items-center gap-4">
                      <Button
                        onClick={handleSavePreferences}
                        className="bg-gray-900 text-white rounded-[var(--app-radius-lg)] hover:bg-gray-800 px-6 h-10  font-medium"
                      >
                        Save Preferences
                      </Button>
                      <AnimatePresence>
                        {preferencesSuccess && (
                          <motion.p
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-sm font-medium text-emerald-600"
                          >
                            Preferences saved successfully
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* ─── Tab 4: Notifications ─── */}
            <TabsContent value="notifications">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Card className="rounded-[var(--app-radius-xl)] shadow-[var(--app-shadow-md)]-[var(--app-shadow-[var(--app-shadow-sm)])] border-gray-100 bg-white">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Choose how you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                      className="space-y-0 divide-gray-100"
                    >
                      {notificationItems.map((item) => (
                        <motion.div
                          key={item.key}
                          variants={staggerItem}
                          className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                        >
                          <div className="flex-1 mr-4 min-w-0">
                            <p className="text-sm font-medium text-gray-700">{item.label}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                          </div>
                          <Switch
                            checked={notifications[item.key]}
                            onCheckedChange={() => toggleNotification(item.key)}
                            className="data-[state=checked]:bg-gray-900 flex-shrink-0"
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    <div className="mt-app-3xl flex items-center gap-4">
                      <Button
                        onClick={handleSaveNotifications}
                        className="bg-gray-900 text-white rounded-[var(--app-radius-lg)] hover:bg-gray-800 px-6 h-10  font-medium"
                      >
                        Save Notification Settings
                      </Button>
                      <AnimatePresence>
                        {notificationsSuccess && (
                          <motion.p
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            className="text-sm font-medium text-emerald-600"
                          >
                            Notification settings saved successfully
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
