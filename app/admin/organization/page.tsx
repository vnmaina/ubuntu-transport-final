"use client";

import { useState, Suspense } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Save, RefreshCw, Settings, Share2, Phone, Globe, Building2, Mail, MapPin, Calendar, Users, Briefcase, Link2, Landmark, CreditCard, Sun, Moon, ChevronDown } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaFacebook, FaYoutube, FaTiktok, FaPinterest, FaSnapchat, FaWhatsapp, FaDiscord, FaReddit, FaMedium, FaDribbble, FaBehance, FaVimeo, FaTwitch, FaTelegram } from "react-icons/fa";
import { ImageUpload } from "@/components/ui/image-upload";
import Image from "next/image";

function AdminOrganizationContent() {
  const organization = useQuery(api.organization.getOrganization);
  const upsertOrganization = useMutation(api.organization.upsertOrganization);
  const initializeDefaultOrganization = useMutation(api.organization.initializeDefaultOrganization);
  const collections = useQuery(api.collections.listCollections);

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    // Main brand colors
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    // Card colors
    cardBackground: "",
    cardForeground: "",
    cardBorder: "",
    // Button colors
    buttonBackground: "",
    buttonForeground: "",
    buttonHover: "",
    // Badge colors
    badgeBackground: "",
    badgeForeground: "",
    // Border colors
    borderColor: "",
    // Background colors
    background: "",
    foreground: "",
    // Dark mode overrides
    darkCardBackground: "",
    darkCardForeground: "",
    darkCardBorder: "",
    darkButtonBackground: "",
    darkButtonForeground: "",
    darkButtonHover: "",
    darkBadgeBackground: "",
    darkBadgeForeground: "",
    darkBorderColor: "",
    darkBackground: "",
    darkForeground: "",
    // Component border radius
    borderRadius: "",
    cardRadius: "",
    buttonRadius: "",
    badgeRadius: "",
    // Individual color opacity
    primaryOpacity: 1,
    secondaryOpacity: 1,
    accentOpacity: 1,
    cardBackgroundOpacity: 1,
    cardForegroundOpacity: 1,
    cardBorderOpacity: 1,
    buttonBackgroundOpacity: 1,
    buttonForegroundOpacity: 1,
    buttonHoverOpacity: 1,
    badgeBackgroundOpacity: 1,
    badgeForegroundOpacity: 1,
    borderColorOpacity: 1,
    backgroundOpacity: 1,
    foregroundOpacity: 1,
    darkCardBackgroundOpacity: 1,
    darkCardForegroundOpacity: 1,
    darkCardBorderOpacity: 1,
    darkButtonBackgroundOpacity: 1,
    darkButtonForegroundOpacity: 1,
    darkButtonHoverOpacity: 1,
    darkBadgeBackgroundOpacity: 1,
    darkBadgeForegroundOpacity: 1,
    darkBorderColorOpacity: 1,
    darkBackgroundOpacity: 1,
    darkForegroundOpacity: 1,
    // Dark mode gradient settings
    darkCardGradientEnabled: false,
    darkCardGradientStart: "",
    darkCardGradientEnd: "",
    darkCardGradientDirection: "",
    darkButtonGradientEnabled: false,
    darkButtonGradientStart: "",
    darkButtonGradientEnd: "",
    darkButtonGradientDirection: "",
    darkBadgeGradientEnabled: false,
    darkBadgeGradientStart: "",
    darkBadgeGradientEnd: "",
    darkBadgeGradientDirection: "",
    // Dark mode border styles
    darkCardBorderStyle: "",
    darkCardBorderWidth: "",
    darkCardBoxShadow: "",
    darkCardPadding: "",
    darkCardMargin: "",
    darkButtonBorderStyle: "",
    darkButtonBorderWidth: "",
    darkButtonBoxShadow: "",
    darkButtonPadding: "",
    darkButtonMargin: "",
    darkBadgeBorderStyle: "",
    darkBadgeBorderWidth: "",
    darkBadgeBoxShadow: "",
    darkBadgePadding: "",
    darkBadgeMargin: "",
    // Dark mode hover effects
    darkCardHoverScale: 1,
    darkCardHoverShadow: "",
    darkCardTransitionDuration: "",
    darkCardEnableHover: false,
    darkButtonHoverScale: 1,
    darkButtonHoverShadow: "",
    darkButtonTransitionDuration: "",
    darkButtonEnableHover: false,
    // Interactivity settings
    cardHoverScale: 1,
    cardHoverShadow: "",
    cardTransitionDuration: "",
    buttonHoverScale: 1,
    buttonHoverShadow: "",
    buttonTransitionDuration: "",
    cardEnableHover: false,
    buttonEnableHover: false,
    // Card comprehensive settings
    cardBorderStyle: "",
    cardBorderWidth: "",
    cardBoxShadow: "",
    cardPadding: "",
    cardMargin: "",
    cardGradientEnabled: false,
    cardGradientStart: "",
    cardGradientEnd: "",
    cardGradientDirection: "",
    // Button comprehensive settings
    buttonBorderStyle: "",
    buttonBorderWidth: "",
    buttonBoxShadow: "",
    buttonPadding: "",
    buttonMargin: "",
    buttonGradientEnabled: false,
    buttonGradientStart: "",
    buttonGradientEnd: "",
    buttonGradientDirection: "",
    // Badge comprehensive settings
    badgeBorderStyle: "",
    badgeBorderWidth: "",
    badgeBoxShadow: "",
    badgePadding: "",
    badgeMargin: "",
    badgeGradientEnabled: false,
    badgeGradientStart: "",
    badgeGradientEnd: "",
    badgeGradientDirection: "",
    // Gradient settings
    gradientEnabled: false,
    gradientType: "",
    gradientDirection: "",
    gradientStart: "",
    gradientEnd: "",
    // Component opacity (global)
    cardOpacity: 1,
    buttonOpacity: 1,
    badgeOpacity: 1,
    globalCollectionId: undefined as Id<"collections"> | undefined,
    // Social media with enable/disable
    twitter: "",
    twitterEnabled: false,
    linkedin: "",
    linkedinEnabled: false,
    github: "",
    githubEnabled: false,
    instagram: "",
    instagramEnabled: false,
    facebook: "",
    facebookEnabled: false,
    youtube: "",
    youtubeEnabled: false,
    tiktok: "",
    tiktokEnabled: false,
    pinterest: "",
    pinterestEnabled: false,
    snapchat: "",
    snapchatEnabled: false,
    whatsapp: "",
    whatsappEnabled: false,
    discord: "",
    discordEnabled: false,
    reddit: "",
    redditEnabled: false,
    medium: "",
    mediumEnabled: false,
    dribbble: "",
    dribbbleEnabled: false,
    behance: "",
    behanceEnabled: false,
    vimeo: "",
    vimeoEnabled: false,
    twitch: "",
    twitchEnabled: false,
    telegram: "",
    telegramEnabled: false,
    linkedcompany: "",
    linkedcompanyEnabled: false,
    // Contact info with enable/disable
    email: "",
    emailEnabled: false,
    phone: "",
    phoneEnabled: false,
    address: "",
    addressEnabled: false,
    website: "",
    websiteEnabled: false,
    // Additional details
    description: "",
    industry: "",
    companySize: "",
    foundedYear: "",
    // SEO defaults
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    defaultOgImage: "",
    defaultTwitterCard: "",
    defaultCanonicalUrl: "",
    defaultRobots: "",
    defaultKeywords: "",
    areasOfOperation: "",
    // Bank details
    bankName: "",
    accountNumber: "",
    accountName: "",
    branch: "",
    swiftCode: "",
    iban: "",
    routingNumber: "",
    bankAddress: "",
    // M-Pesa details
    mpesaPhoneNumber: "",
    mpesaBusinessNumber: "",
    mpesaAccountName: "",
    mpesaTillNumber: "",
    // Document assets
    stampUrl: "",
    signatureUrl: "",
    signatoryName: "",
    signatoryTitle: "",
    // Additional color settings
    popoverBackground: "",
    popoverForeground: "",
    destructive: "",
    ring: "",
    input: "",
    chart1: "",
    chart2: "",
    chart3: "",
    chart4: "",
    chart5: "",
    sidebarBackground: "",
    sidebarForeground: "",
    sidebarPrimary: "",
    sidebarPrimaryForeground: "",
    sidebarAccent: "",
    sidebarAccentForeground: "",
    sidebarBorder: "",
    sidebarRing: "",
    // Focus ring shadow
    focusRingShadow: "",
  });

  // Initialize form data when organization is loaded (render-phase adjustment)
  const [prevOrganization, setPrevOrganization] = useState(organization);
  if (organization !== prevOrganization) {
    setPrevOrganization(organization);
    if (organization) {
      setFormData(prev => ({
        ...prev,
        name: organization.name,
        logo: organization.logo || "",
        globalCollectionId: organization.globalCollectionId,

        // Social media
        twitter: organization.twitter || "",
        twitterEnabled: organization.twitterEnabled || false,
        linkedin: organization.linkedin || "",
        linkedinEnabled: organization.linkedinEnabled || false,
        github: organization.github || "",
        githubEnabled: organization.githubEnabled || false,
        instagram: organization.instagram || "",
        instagramEnabled: organization.instagramEnabled || false,
        facebook: organization.facebook || "",
        facebookEnabled: organization.facebookEnabled || false,
        youtube: organization.youtube || "",
        youtubeEnabled: organization.youtubeEnabled || false,
        tiktok: organization.tiktok || "",
        tiktokEnabled: organization.tiktokEnabled || false,
        pinterest: organization.pinterest || "",
        pinterestEnabled: organization.pinterestEnabled || false,
        snapchat: organization.snapchat || "",
        snapchatEnabled: organization.snapchatEnabled || false,
        whatsapp: organization.whatsapp || "",
        whatsappEnabled: organization.whatsappEnabled || false,
        discord: organization.discord || "",
        discordEnabled: organization.discordEnabled || false,
        reddit: organization.reddit || "",
        redditEnabled: organization.redditEnabled || false,
        medium: organization.medium || "",
        mediumEnabled: organization.mediumEnabled || false,
        dribbble: organization.dribbble || "",
        dribbbleEnabled: organization.dribbbleEnabled || false,
        behance: organization.behance || "",
        behanceEnabled: organization.behanceEnabled || false,
        vimeo: organization.vimeo || "",
        vimeoEnabled: organization.vimeoEnabled || false,
        twitch: organization.twitch || "",
        twitchEnabled: organization.twitchEnabled || false,
        telegram: organization.telegram || "",
        telegramEnabled: organization.telegramEnabled || false,
        linkedcompany: organization.linkedcompany || "",
        linkedcompanyEnabled: organization.linkedcompanyEnabled || false,
        // Contact info
        email: organization.email || "",
        emailEnabled: organization.emailEnabled ?? true,
        phone: organization.phone || "",
        phoneEnabled: organization.phoneEnabled ?? true,
        address: organization.address || "",
        addressEnabled: organization.addressEnabled ?? true,
        website: organization.website || "",
        websiteEnabled: organization.websiteEnabled ?? true,
        // Additional details
        description: organization.description || "",
        industry: organization.industry || "",
        companySize: organization.companySize || "",
        foundedYear: organization.foundedYear || "",
        // SEO defaults
        defaultMetaTitle: organization.defaultMetaTitle || "",
        defaultMetaDescription: organization.defaultMetaDescription || "",
        defaultOgImage: organization.defaultOgImage || "",
        defaultTwitterCard: organization.defaultTwitterCard || "",
        defaultCanonicalUrl: organization.defaultCanonicalUrl || "",
        defaultRobots: organization.defaultRobots || "",
        defaultKeywords: (organization.defaultKeywords || []).join(", "),
        areasOfOperation: (organization.areasOfOperation || []).join(", "),
        // Bank details
        bankName: organization.bankName || "",
        accountNumber: organization.accountNumber || "",
        accountName: organization.accountName || "",
        branch: organization.branch || "",
        swiftCode: organization.swiftCode || "",
        iban: organization.iban || "",
        routingNumber: organization.routingNumber || "",
        bankAddress: organization.bankAddress || "",
        // M-Pesa details
        mpesaPhoneNumber: organization.mpesaPhoneNumber || "",
        mpesaBusinessNumber: organization.mpesaBusinessNumber || "",
        mpesaAccountName: organization.mpesaAccountName || "",
        mpesaTillNumber: organization.mpesaTillNumber || "",
        // Document assets
        stampUrl: organization.stampUrl || "",
        signatureUrl: organization.signatureUrl || "",
        signatoryName: organization.signatoryName || "",
        signatoryTitle: organization.signatoryTitle || "",
      }));
    }
  }

  const handleInitializeDefaults = async () => {
    try {
      await initializeDefaultOrganization();
      toast.success("Default organization settings initialized successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initialize organization");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toList = (value: string) =>
        value.split(",").map((s) => s.trim()).filter(Boolean);
      await upsertOrganization({
        ...formData,
        defaultKeywords: toList(formData.defaultKeywords),
        areasOfOperation: toList(formData.areasOfOperation),
      });
      toast.success("Organization settings saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save organization settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!organization && collections) {
    return (
      <div className="min-h-screen w-full bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">Organization Settings</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Configure your organization&apos;s global settings and branding</p>
            </div>

            <Button
              onClick={handleInitializeDefaults}
              variant="outline"
              size="sm"
              className="h-11 w-full rounded-xl px-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Initialize Defaults
            </Button>
          </div>

          <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <CardContent className="flex min-h-[360px] flex-col items-center justify-center px-5 py-12 text-center sm:px-8 sm:py-16">
              <div className="text-muted-foreground mb-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No organization settings yet</h3>
              <p className="text-muted-foreground mb-4">Initialize default organization settings to get started</p>
              <Button onClick={handleInitializeDefaults} className="h-11 w-full rounded-xl px-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto">
                Initialize Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10">
        <div className="mb-8 flex flex-col gap-5 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">Organization Settings</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Configure your organization&apos;s global settings and branding</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="h-11 w-full rounded-xl px-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-1.5 rounded-2xl border border-border/60 bg-muted/50 p-1.5 sm:gap-2">
            <TabsTrigger value="basic" className="h-10 flex-1 rounded-xl px-3 text-xs transition-all sm:flex-none sm:px-4 sm:text-sm">Basic Info</TabsTrigger>
            <TabsTrigger value="theme" className="h-10 flex-1 rounded-xl px-3 text-xs transition-all sm:flex-none sm:px-4 sm:text-sm">Theme</TabsTrigger>
            <TabsTrigger value="social" className="h-10 flex-1 rounded-xl px-3 text-xs transition-all sm:flex-none sm:px-4 sm:text-sm">Socials</TabsTrigger>
            <TabsTrigger value="contact" className="h-10 flex-1 rounded-xl px-3 text-xs transition-all sm:flex-none sm:px-4 sm:text-sm">Contact</TabsTrigger>
            <TabsTrigger value="payment" className="h-10 flex-1 rounded-xl px-3 text-xs transition-all sm:flex-none sm:px-4 sm:text-sm">Payment</TabsTrigger>
            <TabsTrigger value="seo" className="h-10 flex-1 rounded-xl px-3 text-xs transition-all sm:flex-none sm:px-4 sm:text-sm">SEO Defaults</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-0 space-y-6 sm:space-y-8">
            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="w-5 h-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Core information about your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 px-5 py-6 sm:space-y-8 sm:px-7 sm:py-8 lg:px-8">
                <div>
                  <Label htmlFor="name" className="mb-2 text-sm font-medium">Organization Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Acme Inc."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div>
                  <ImageUpload
                    value={formData.logo}
                    onChange={(value) => setFormData({ ...formData, logo: value })}
                    label="Logo"
                    placeholder="https://example.com/logo.png"
                    aspectRatio="square"
                  />
                  <p className="text-xs text-muted-foreground mt-2">URL to your organization&apos;s logo image</p>
                </div>
                <div>
                  <Label htmlFor="description" className="mb-2 text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your organization..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="min-h-[130px] resize-y rounded-xl"
                  />

                </div>
                <div>
                  <Label htmlFor="industry" className="mb-2 text-sm font-medium">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Technology, Healthcare, Finance"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="companySize" className="mb-2 text-sm font-medium">Company Size</Label>
                    <Input
                      id="companySize"
                      placeholder="e.g., 1-10, 11-50, 50+"
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="foundedYear" className="mb-2 text-sm font-medium">Founded Year</Label>
                    <Input
                      id="foundedYear"
                      placeholder="e.g., 2020"
                      value={formData.foundedYear}
                      onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="globalCollectionId" className="mb-2 text-sm font-medium">Global Collection</Label>
                  <select
                    id="globalCollectionId"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    value={formData.globalCollectionId || ""}
                    onChange={(e) => setFormData({ ...formData, globalCollectionId: (e.target.value || undefined) as Id<"collections"> | undefined })}
                  >
                    <option value="">None</option>
                    {collections?.map((collection) => (
                      <option key={collection._id} value={collection._id}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">Collection that contains all your content</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="mt-0 space-y-6 sm:space-y-8">
            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <CardTitle className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Theme & Colors
                </CardTitle>
                <CardDescription>Customize your organization&apos;s appearance and color scheme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 px-5 py-6 sm:space-y-8 sm:px-7 sm:py-8 lg:px-8">
                {/* Mode Toggle */}
                <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div className="flex items-center gap-3">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <Moon className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">Color Mode</p>
                      <p className="text-xs text-muted-foreground">Edit colors for light or dark mode</p>
                    </div>
                  </div>
                </div>

                {/* Nested Tabs for Light/Dark Mode */}
                <Tabs defaultValue="light" className="w-full">
                  <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-muted/60 p-1">
                    <TabsTrigger value="light" className="h-10 flex-1 rounded-xl px-3 text-xs transition-all sm:flex-none sm:px-4 sm:text-sm">
                      <Sun className="w-4 h-4" />
                      Light Mode
                    </TabsTrigger>
                    <TabsTrigger value="dark" className="h-10 flex-1 rounded-xl px-3 text-xs transition-all sm:flex-none sm:px-4 sm:text-sm">
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </TabsTrigger>
                  </TabsList>

                  {/* Light Mode Tab */}
                  <TabsContent value="light" className="space-y-6 mt-6">
                    <Accordion className="w-full">
                      {/* General Colors */}
                      <AccordionItem value="general">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          🎨 General Colors
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            <div>
                              <Label htmlFor="primaryColor" className="mb-2 text-sm font-medium">Primary</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="primaryColor"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.primaryColor}
                                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                />
                                <Input
                                  value={formData.primaryColor}
                                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.primaryOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.primaryOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, primaryOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="secondaryColor" className="mb-2 text-sm font-medium">Secondary</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="secondaryColor"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.secondaryColor}
                                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                />
                                <Input
                                  value={formData.secondaryColor}
                                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.secondaryOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.secondaryOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, secondaryOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="accentColor" className="mb-2 text-sm font-medium">Accent</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="accentColor"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.accentColor}
                                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                />
                                <Input
                                  value={formData.accentColor}
                                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.accentOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.accentOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, accentOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Cards */}
                      <AccordionItem value="cards">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          📦 Cards
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          {/* Card Colors */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Colors & Opacity</h5>
                              <div className="flex items-center gap-3">
                                <Label htmlFor="cardColorMode" className="text-xs text-muted-foreground">Mode:</Label>
                                <select
                                  id="cardColorMode"
                                  className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.cardGradientEnabled ? "gradient" : "solid"}
                                  onChange={(e) => setFormData({ ...formData, cardGradientEnabled: e.target.value === "gradient" })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="gradient">Gradient</option>
                                </select>
                              </div>
                            </div>
                            {formData.cardGradientEnabled ? (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="cardGradientStart" className="mb-2 text-sm font-medium">Gradient Start</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="cardGradientStart"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.cardGradientStart}
                                      onChange={(e) => setFormData({ ...formData, cardGradientStart: e.target.value })}
                                    />
                                    <Input
                                      value={formData.cardGradientStart}
                                      onChange={(e) => setFormData({ ...formData, cardGradientStart: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="cardGradientEnd" className="mb-2 text-sm font-medium">Gradient End</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="cardGradientEnd"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.cardGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, cardGradientEnd: e.target.value })}
                                    />
                                    <Input
                                      value={formData.cardGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, cardGradientEnd: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="cardGradientDirection" className="mb-2 text-sm font-medium">Direction</Label>
                                  <select
                                    id="cardGradientDirection"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.cardGradientDirection}
                                    onChange={(e) => setFormData({ ...formData, cardGradientDirection: e.target.value })}
                                  >
                                    <option value="to right">To Right</option>
                                    <option value="to left">To Left</option>
                                    <option value="to bottom">To Bottom</option>
                                    <option value="to top">To Top</option>
                                    <option value="to bottom right">Bottom Right</option>
                                    <option value="to bottom left">Bottom Left</option>
                                    <option value="to top right">Top Right</option>
                                    <option value="to top left">Top Left</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="cardBackground" className="mb-2 text-sm font-medium">Card Background</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="cardBackground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.cardBackground}
                                      onChange={(e) => setFormData({ ...formData, cardBackground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.cardBackground}
                                      onChange={(e) => setFormData({ ...formData, cardBackground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.cardBackgroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.cardBackgroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, cardBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="cardForeground" className="mb-2 text-sm font-medium">Card Foreground (Text)</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="cardForeground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.cardForeground}
                                      onChange={(e) => setFormData({ ...formData, cardForeground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.cardForeground}
                                      onChange={(e) => setFormData({ ...formData, cardForeground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.cardForegroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.cardForegroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, cardForegroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="cardBorder" className="mb-2 text-sm font-medium">Card Border Color</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="cardBorder"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.cardBorder}
                                      onChange={(e) => setFormData({ ...formData, cardBorder: e.target.value })}
                                    />
                                    <Input
                                      value={formData.cardBorder}
                                      onChange={(e) => setFormData({ ...formData, cardBorder: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.cardBorderOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.cardBorderOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, cardBorderOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Border & Spacing */}
                          <div className="space-y-5 sm:space-y-6">
                            <h5 className="text-sm font-semibold text-muted-foreground">Border & Spacing</h5>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="cardRadius" className="mb-2 text-sm font-medium">Roundness</Label>
                                <select
                                  id="cardRadius"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.cardRadius}
                                  onChange={(e) => setFormData({ ...formData, cardRadius: e.target.value })}
                                >
                                  <option value="0.25rem">Sm</option>
                                  <option value="0.5rem">Md</option>
                                  <option value="0.75rem">Lg</option>
                                  <option value="1rem">Xl</option>
                                  <option value="1.25rem">2xl</option>
                                  <option value="1.5rem">3xl</option>
                                  <option value="9999px">Full</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="cardBorderStyle" className="mb-2 text-sm font-medium">Border Style</Label>
                                <select
                                  id="cardBorderStyle"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.cardBorderStyle}
                                  onChange={(e) => setFormData({ ...formData, cardBorderStyle: e.target.value })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                  <option value="double">Double</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="cardBorderWidth" className="mb-2 text-sm font-medium">Border Width</Label>
                                <Input
                                  id="cardBorderWidth"
                                  placeholder="1px"
                                  value={formData.cardBorderWidth}
                                  onChange={(e) => setFormData({ ...formData, cardBorderWidth: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cardPadding" className="mb-2 text-sm font-medium">Padding</Label>
                                <Input
                                  id="cardPadding"
                                  placeholder="1.5rem"
                                  value={formData.cardPadding}
                                  onChange={(e) => setFormData({ ...formData, cardPadding: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cardMargin" className="mb-2 text-sm font-medium">Margin</Label>
                                <Input
                                  id="cardMargin"
                                  placeholder="0"
                                  value={formData.cardMargin}
                                  onChange={(e) => setFormData({ ...formData, cardMargin: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cardBoxShadow" className="mb-2 text-sm font-medium">Box Shadow</Label>
                                <Input
                                  id="cardBoxShadow"
                                  placeholder="0 1px 3px rgba(0, 0, 0, 0.1)"
                                  value={formData.cardBoxShadow}
                                  onChange={(e) => setFormData({ ...formData, cardBoxShadow: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Card Interactivity */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Hover Effects</h5>
                              <Switch
                                checked={formData.cardEnableHover}
                                onCheckedChange={(checked) => setFormData({ ...formData, cardEnableHover: checked })}
                                className="h-11 rounded-xl"
                              />
                            </div>
                            {formData.cardEnableHover && (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="cardHoverScale" className="mb-2 text-sm font-medium">Hover Scale: {formData.cardHoverScale?.toFixed(2)}x</Label>
                                  <Slider
                                    id="cardHoverScale"
                                    min={1}
                                    max={1.1}
                                    step={0.01}
                                    value={[formData.cardHoverScale || 1.02]}
                                    onValueChange={(value) => setFormData({ ...formData, cardHoverScale: Array.isArray(value) ? value[0] : value })}
                                    className="h-11 rounded-xl"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cardHoverShadow" className="mb-2 text-sm font-medium">Hover Shadow</Label>
                                  <Input
                                    id="cardHoverShadow"
                                    placeholder="0 4px 12px rgba(0, 0, 0, 0.1)"
                                    value={formData.cardHoverShadow}
                                    onChange={(e) => setFormData({ ...formData, cardHoverShadow: e.target.value })}
                                    className="h-11 rounded-xl text-sm"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cardTransitionDuration" className="mb-2 text-sm font-medium">Transition Duration</Label>
                                  <select
                                    id="cardTransitionDuration"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.cardTransitionDuration}
                                    onChange={(e) => setFormData({ ...formData, cardTransitionDuration: e.target.value })}
                                  >
                                    <option value="100ms">Fast (100ms)</option>
                                    <option value="150ms">Quick (150ms)</option>
                                    <option value="200ms">Normal (200ms)</option>
                                    <option value="300ms">Slow (300ms)</option>
                                    <option value="500ms">Slower (500ms)</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Buttons */}
                      <AccordionItem value="buttons">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          🔘 Buttons
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          {/* Button Colors */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Colors & Opacity</h5>
                              <div className="flex items-center gap-3">
                                <Label htmlFor="buttonColorMode" className="text-xs text-muted-foreground">Mode:</Label>
                                <select
                                  id="buttonColorMode"
                                  className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.buttonGradientEnabled ? "gradient" : "solid"}
                                  onChange={(e) => setFormData({ ...formData, buttonGradientEnabled: e.target.value === "gradient" })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="gradient">Gradient</option>
                                </select>
                              </div>
                            </div>
                            {formData.buttonGradientEnabled ? (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="buttonGradientStart" className="mb-2 text-sm font-medium">Gradient Start</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="buttonGradientStart"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.buttonGradientStart}
                                      onChange={(e) => setFormData({ ...formData, buttonGradientStart: e.target.value })}
                                    />
                                    <Input
                                      value={formData.buttonGradientStart}
                                      onChange={(e) => setFormData({ ...formData, buttonGradientStart: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="buttonGradientEnd" className="mb-2 text-sm font-medium">Gradient End</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="buttonGradientEnd"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.buttonGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, buttonGradientEnd: e.target.value })}
                                    />
                                    <Input
                                      value={formData.buttonGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, buttonGradientEnd: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="buttonGradientDirection" className="mb-2 text-sm font-medium">Direction</Label>
                                  <select
                                    id="buttonGradientDirection"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.buttonGradientDirection}
                                    onChange={(e) => setFormData({ ...formData, buttonGradientDirection: e.target.value })}
                                  >
                                    <option value="to right">To Right</option>
                                    <option value="to left">To Left</option>
                                    <option value="to bottom">To Bottom</option>
                                    <option value="to top">To Top</option>
                                    <option value="to bottom right">Bottom Right</option>
                                    <option value="to bottom left">Bottom Left</option>
                                    <option value="to top right">Top Right</option>
                                    <option value="to top left">Top Left</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="buttonBackground" className="mb-2 text-sm font-medium">Button Background</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="buttonBackground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.buttonBackground}
                                      onChange={(e) => setFormData({ ...formData, buttonBackground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.buttonBackground}
                                      onChange={(e) => setFormData({ ...formData, buttonBackground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.buttonBackgroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.buttonBackgroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, buttonBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="buttonForeground" className="mb-2 text-sm font-medium">Button Foreground (Text)</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="buttonForeground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.buttonForeground}
                                      onChange={(e) => setFormData({ ...formData, buttonForeground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.buttonForeground}
                                      onChange={(e) => setFormData({ ...formData, buttonForeground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.buttonForegroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.buttonForegroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, buttonForegroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="buttonHover" className="mb-2 text-sm font-medium">Button Hover Color</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="buttonHover"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.buttonHover}
                                      onChange={(e) => setFormData({ ...formData, buttonHover: e.target.value })}
                                    />
                                    <Input
                                      value={formData.buttonHover}
                                      onChange={(e) => setFormData({ ...formData, buttonHover: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.buttonHoverOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.buttonHoverOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, buttonHoverOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Button Border & Spacing */}
                          <div className="space-y-5 sm:space-y-6">
                            <h5 className="text-sm font-semibold text-muted-foreground">Border & Spacing</h5>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="buttonRadius" className="mb-2 text-sm font-medium">Roundness</Label>
                                <select
                                  id="buttonRadius"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.buttonRadius}
                                  onChange={(e) => setFormData({ ...formData, buttonRadius: e.target.value })}
                                >
                                  <option value="0.25rem">Sm</option>
                                  <option value="0.5rem">Md</option>
                                  <option value="0.75rem">Lg</option>
                                  <option value="1rem">Xl</option>
                                  <option value="1.25rem">2xl</option>
                                  <option value="1.5rem">3xl</option>
                                  <option value="9999px">Full</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="buttonBorderStyle" className="mb-2 text-sm font-medium">Border Style</Label>
                                <select
                                  id="buttonBorderStyle"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.buttonBorderStyle}
                                  onChange={(e) => setFormData({ ...formData, buttonBorderStyle: e.target.value })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                  <option value="double">Double</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="buttonBorderWidth" className="mb-2 text-sm font-medium">Border Width</Label>
                                <Input
                                  id="buttonBorderWidth"
                                  placeholder="1px"
                                  value={formData.buttonBorderWidth}
                                  onChange={(e) => setFormData({ ...formData, buttonBorderWidth: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="buttonPadding" className="mb-2 text-sm font-medium">Padding</Label>
                                <Input
                                  id="buttonPadding"
                                  placeholder="0.5rem 1rem"
                                  value={formData.buttonPadding}
                                  onChange={(e) => setFormData({ ...formData, buttonPadding: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="buttonMargin" className="mb-2 text-sm font-medium">Margin</Label>
                                <Input
                                  id="buttonMargin"
                                  placeholder="0"
                                  value={formData.buttonMargin}
                                  onChange={(e) => setFormData({ ...formData, buttonMargin: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="buttonBoxShadow" className="mb-2 text-sm font-medium">Box Shadow</Label>
                                <Input
                                  id="buttonBoxShadow"
                                  placeholder="0 1px 2px rgba(0, 0, 0, 0.1)"
                                  value={formData.buttonBoxShadow}
                                  onChange={(e) => setFormData({ ...formData, buttonBoxShadow: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Button Interactivity */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Hover Effects</h5>
                              <Switch
                                checked={formData.buttonEnableHover}
                                onCheckedChange={(checked) => setFormData({ ...formData, buttonEnableHover: checked })}
                                className="h-11 rounded-xl"
                              />
                            </div>
                            {formData.buttonEnableHover && (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="buttonHoverScale" className="mb-2 text-sm font-medium">Hover Scale: {formData.buttonHoverScale?.toFixed(2)}x</Label>
                                  <Slider
                                    id="buttonHoverScale"
                                    min={1}
                                    max={1.1}
                                    step={0.01}
                                    value={[formData.buttonHoverScale || 1.05]}
                                    onValueChange={(value) => setFormData({ ...formData, buttonHoverScale: Array.isArray(value) ? value[0] : value })}
                                    className="h-11 rounded-xl"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="buttonHoverShadow" className="mb-2 text-sm font-medium">Hover Shadow</Label>
                                  <Input
                                    id="buttonHoverShadow"
                                    placeholder="0 4px 12px rgba(0, 0, 0, 0.15)"
                                    value={formData.buttonHoverShadow}
                                    onChange={(e) => setFormData({ ...formData, buttonHoverShadow: e.target.value })}
                                    className="h-11 rounded-xl text-sm"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="buttonTransitionDuration" className="mb-2 text-sm font-medium">Transition Duration</Label>
                                  <select
                                    id="buttonTransitionDuration"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.buttonTransitionDuration}
                                    onChange={(e) => setFormData({ ...formData, buttonTransitionDuration: e.target.value })}
                                  >
                                    <option value="100ms">Fast (100ms)</option>
                                    <option value="150ms">Quick (150ms)</option>
                                    <option value="200ms">Normal (200ms)</option>
                                    <option value="300ms">Slow (300ms)</option>
                                    <option value="500ms">Slower (500ms)</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Badges */}
                      <AccordionItem value="badges">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          🏷️ Badges
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          {/* Badge Colors */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Colors & Opacity</h5>
                              <div className="flex items-center gap-3">
                                <Label htmlFor="badgeColorMode" className="text-xs text-muted-foreground">Mode:</Label>
                                <select
                                  id="badgeColorMode"
                                  className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.badgeGradientEnabled ? "gradient" : "solid"}
                                  onChange={(e) => setFormData({ ...formData, badgeGradientEnabled: e.target.value === "gradient" })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="gradient">Gradient</option>
                                </select>
                              </div>
                            </div>
                            {formData.badgeGradientEnabled ? (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="badgeGradientStart" className="mb-2 text-sm font-medium">Gradient Start</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="badgeGradientStart"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.badgeGradientStart}
                                      onChange={(e) => setFormData({ ...formData, badgeGradientStart: e.target.value })}
                                    />
                                    <Input
                                      value={formData.badgeGradientStart}
                                      onChange={(e) => setFormData({ ...formData, badgeGradientStart: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="badgeGradientEnd" className="mb-2 text-sm font-medium">Gradient End</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="badgeGradientEnd"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.badgeGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, badgeGradientEnd: e.target.value })}
                                    />
                                    <Input
                                      value={formData.badgeGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, badgeGradientEnd: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="badgeGradientDirection" className="mb-2 text-sm font-medium">Direction</Label>
                                  <select
                                    id="badgeGradientDirection"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.badgeGradientDirection}
                                    onChange={(e) => setFormData({ ...formData, badgeGradientDirection: e.target.value })}
                                  >
                                    <option value="to right">To Right</option>
                                    <option value="to left">To Left</option>
                                    <option value="to bottom">To Bottom</option>
                                    <option value="to top">To Top</option>
                                    <option value="to bottom right">Bottom Right</option>
                                    <option value="to bottom left">Bottom Left</option>
                                    <option value="to top right">Top Right</option>
                                    <option value="to top left">Top Left</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="badgeBackground" className="mb-2 text-sm font-medium">Badge Background</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="badgeBackground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.badgeBackground}
                                      onChange={(e) => setFormData({ ...formData, badgeBackground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.badgeBackground}
                                      onChange={(e) => setFormData({ ...formData, badgeBackground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.badgeBackgroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.badgeBackgroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, badgeBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="badgeForeground" className="mb-2 text-sm font-medium">Badge Foreground (Text)</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="badgeForeground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.badgeForeground}
                                      onChange={(e) => setFormData({ ...formData, badgeForeground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.badgeForeground}
                                      onChange={(e) => setFormData({ ...formData, badgeForeground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.badgeForegroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.badgeForegroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, badgeForegroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Badge Border & Spacing */}
                          <div className="space-y-5 sm:space-y-6">
                            <h5 className="text-sm font-semibold text-muted-foreground">Border & Spacing</h5>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="badgeBorderStyle" className="mb-2 text-sm font-medium">Border Style</Label>
                                <select
                                  id="badgeBorderStyle"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.badgeBorderStyle}
                                  onChange={(e) => setFormData({ ...formData, badgeBorderStyle: e.target.value })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                  <option value="double">Double</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="badgeBorderWidth" className="mb-2 text-sm font-medium">Border Width</Label>
                                <Input
                                  id="badgeBorderWidth"
                                  placeholder="1px"
                                  value={formData.badgeBorderWidth}
                                  onChange={(e) => setFormData({ ...formData, badgeBorderWidth: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="badgePadding" className="mb-2 text-sm font-medium">Padding</Label>
                                <Input
                                  id="badgePadding"
                                  placeholder="0.25rem 0.75rem"
                                  value={formData.badgePadding}
                                  onChange={(e) => setFormData({ ...formData, badgePadding: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="badgeMargin" className="mb-2 text-sm font-medium">Margin</Label>
                                <Input
                                  id="badgeMargin"
                                  placeholder="0"
                                  value={formData.badgeMargin}
                                  onChange={(e) => setFormData({ ...formData, badgeMargin: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="badgeBoxShadow" className="mb-2 text-sm font-medium">Box Shadow</Label>
                                <Input
                                  id="badgeBoxShadow"
                                  placeholder="none"
                                  value={formData.badgeBoxShadow}
                                  onChange={(e) => setFormData({ ...formData, badgeBoxShadow: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Page Background */}
                      <AccordionItem value="page-background">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          🎨 Page Background
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                              <Label htmlFor="background" className="mb-2 text-sm font-medium">Background</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="background"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.background}
                                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                                />
                                <Input
                                  value={formData.background}
                                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.backgroundOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.backgroundOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, backgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="foreground" className="mb-2 text-sm font-medium">Foreground (Text)</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="foreground"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.foreground}
                                  onChange={(e) => setFormData({ ...formData, foreground: e.target.value })}
                                />
                                <Input
                                  value={formData.foreground}
                                  onChange={(e) => setFormData({ ...formData, foreground: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.foregroundOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.foregroundOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, foregroundOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="borderColor" className="mb-2 text-sm font-medium">Border Color</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="borderColor"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.borderColor}
                                  onChange={(e) => setFormData({ ...formData, borderColor: e.target.value })}
                                />
                                <Input
                                  value={formData.borderColor}
                                  onChange={(e) => setFormData({ ...formData, borderColor: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.borderColorOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.borderColorOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, borderColorOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>

                  {/* Dark Mode Tab */}
                  <TabsContent value="dark" className="space-y-6 mt-6">
                    <Accordion className="w-full">
                      {/* Dark General Colors */}
                      <AccordionItem value="dark-general">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          🎨 General Colors
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            <div>
                              <Label htmlFor="darkPrimaryColor" className="mb-2 text-sm font-medium">Primary</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="darkPrimaryColor"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.darkButtonBackground}
                                  onChange={(e) => setFormData({ ...formData, darkButtonBackground: e.target.value })}
                                />
                                <Input
                                  value={formData.darkButtonBackground}
                                  onChange={(e) => setFormData({ ...formData, darkButtonBackground: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkButtonBackgroundOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.darkButtonBackgroundOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, darkButtonBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="darkSecondaryColor" className="mb-2 text-sm font-medium">Secondary</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="darkSecondaryColor"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.darkCardBackground}
                                  onChange={(e) => setFormData({ ...formData, darkCardBackground: e.target.value })}
                                />
                                <Input
                                  value={formData.darkCardBackground}
                                  onChange={(e) => setFormData({ ...formData, darkCardBackground: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkCardBackgroundOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.darkCardBackgroundOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, darkCardBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="darkAccentColor" className="mb-2 text-sm font-medium">Accent</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="darkAccentColor"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.darkBadgeBackground}
                                  onChange={(e) => setFormData({ ...formData, darkBadgeBackground: e.target.value })}
                                />
                                <Input
                                  value={formData.darkBadgeBackground}
                                  onChange={(e) => setFormData({ ...formData, darkBadgeBackground: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkBadgeBackgroundOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.darkBadgeBackgroundOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, darkBadgeBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Dark Cards */}
                      <AccordionItem value="dark-cards">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          📦 Cards
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          {/* Dark Card Colors */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Colors & Opacity</h5>
                              <div className="flex items-center gap-3">
                                <Label htmlFor="darkCardColorMode" className="text-xs text-muted-foreground">Mode:</Label>
                                <select
                                  id="darkCardColorMode"
                                  className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.darkCardGradientEnabled ? "gradient" : "solid"}
                                  onChange={(e) => setFormData({ ...formData, darkCardGradientEnabled: e.target.value === "gradient" })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="gradient">Gradient</option>
                                </select>
                              </div>
                            </div>
                            {formData.darkCardGradientEnabled ? (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="darkCardGradientStart" className="mb-2 text-sm font-medium">Gradient Start</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkCardGradientStart"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkCardGradientStart}
                                      onChange={(e) => setFormData({ ...formData, darkCardGradientStart: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkCardGradientStart}
                                      onChange={(e) => setFormData({ ...formData, darkCardGradientStart: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkCardGradientEnd" className="mb-2 text-sm font-medium">Gradient End</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkCardGradientEnd"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkCardGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, darkCardGradientEnd: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkCardGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, darkCardGradientEnd: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkCardGradientDirection" className="mb-2 text-sm font-medium">Direction</Label>
                                  <select
                                    id="darkCardGradientDirection"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.darkCardGradientDirection}
                                    onChange={(e) => setFormData({ ...formData, darkCardGradientDirection: e.target.value })}
                                  >
                                    <option value="to right">To Right</option>
                                    <option value="to left">To Left</option>
                                    <option value="to bottom">To Bottom</option>
                                    <option value="to top">To Top</option>
                                    <option value="to bottom right">Bottom Right</option>
                                    <option value="to bottom left">Bottom Left</option>
                                    <option value="to top right">Top Right</option>
                                    <option value="to top left">Top Left</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="darkCardBackground" className="mb-2 text-sm font-medium">Card Background</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkCardBackground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkCardBackground}
                                      onChange={(e) => setFormData({ ...formData, darkCardBackground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkCardBackground}
                                      onChange={(e) => setFormData({ ...formData, darkCardBackground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkCardBackgroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.darkCardBackgroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, darkCardBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkCardForeground" className="mb-2 text-sm font-medium">Card Foreground (Text)</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkCardForeground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkCardForeground}
                                      onChange={(e) => setFormData({ ...formData, darkCardForeground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkCardForeground}
                                      onChange={(e) => setFormData({ ...formData, darkCardForeground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkCardForegroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.darkCardForegroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, darkCardForegroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkCardBorder" className="mb-2 text-sm font-medium">Card Border Color</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkCardBorder"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkCardBorder}
                                      onChange={(e) => setFormData({ ...formData, darkCardBorder: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkCardBorder}
                                      onChange={(e) => setFormData({ ...formData, darkCardBorder: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkCardBorderOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.darkCardBorderOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, darkCardBorderOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Dark Card Border & Spacing */}
                          <div className="space-y-5 sm:space-y-6">
                            <h5 className="text-sm font-semibold text-muted-foreground">Border & Spacing</h5>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="darkCardRadius" className="mb-2 text-sm font-medium">Roundness</Label>
                                <select
                                  id="darkCardRadius"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.cardRadius}
                                  onChange={(e) => setFormData({ ...formData, cardRadius: e.target.value })}
                                >
                                  <option value="0.25rem">Sm</option>
                                  <option value="0.5rem">Md</option>
                                  <option value="0.75rem">Lg</option>
                                  <option value="1rem">Xl</option>
                                  <option value="1.25rem">2xl</option>
                                  <option value="1.5rem">3xl</option>
                                  <option value="9999px">Full</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="darkCardBorderStyle" className="mb-2 text-sm font-medium">Border Style</Label>
                                <select
                                  id="darkCardBorderStyle"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.darkCardBorderStyle}
                                  onChange={(e) => setFormData({ ...formData, darkCardBorderStyle: e.target.value })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                  <option value="double">Double</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="darkCardBorderWidth" className="mb-2 text-sm font-medium">Border Width</Label>
                                <Input
                                  id="darkCardBorderWidth"
                                  placeholder="1px"
                                  value={formData.darkCardBorderWidth}
                                  onChange={(e) => setFormData({ ...formData, darkCardBorderWidth: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkCardPadding" className="mb-2 text-sm font-medium">Padding</Label>
                                <Input
                                  id="darkCardPadding"
                                  placeholder="1.5rem"
                                  value={formData.darkCardPadding}
                                  onChange={(e) => setFormData({ ...formData, darkCardPadding: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkCardMargin" className="mb-2 text-sm font-medium">Margin</Label>
                                <Input
                                  id="darkCardMargin"
                                  placeholder="0"
                                  value={formData.darkCardMargin}
                                  onChange={(e) => setFormData({ ...formData, darkCardMargin: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkCardBoxShadow" className="mb-2 text-sm font-medium">Box Shadow</Label>
                                <Input
                                  id="darkCardBoxShadow"
                                  placeholder="0 1px 3px rgba(0, 0, 0, 0.3)"
                                  value={formData.darkCardBoxShadow}
                                  onChange={(e) => setFormData({ ...formData, darkCardBoxShadow: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Dark Card Interactivity */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Hover Effects</h5>
                              <Switch
                                checked={formData.darkCardEnableHover}
                                onCheckedChange={(checked) => setFormData({ ...formData, darkCardEnableHover: checked })}
                                className="h-11 rounded-xl"
                              />
                            </div>
                            {formData.darkCardEnableHover && (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="darkCardHoverScale" className="mb-2 text-sm font-medium">Hover Scale: {formData.darkCardHoverScale?.toFixed(2)}x</Label>
                                  <Slider
                                    id="darkCardHoverScale"
                                    min={1}
                                    max={1.1}
                                    step={0.01}
                                    value={[formData.darkCardHoverScale || 1.02]}
                                    onValueChange={(value) => setFormData({ ...formData, darkCardHoverScale: Array.isArray(value) ? value[0] : value })}
                                    className="h-11 rounded-xl"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="darkCardHoverShadow" className="mb-2 text-sm font-medium">Hover Shadow</Label>
                                  <Input
                                    id="darkCardHoverShadow"
                                    placeholder="0 4px 12px rgba(0, 0, 0, 0.3)"
                                    value={formData.darkCardHoverShadow}
                                    onChange={(e) => setFormData({ ...formData, darkCardHoverShadow: e.target.value })}
                                    className="h-11 rounded-xl text-sm"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="darkCardTransitionDuration" className="mb-2 text-sm font-medium">Transition Duration</Label>
                                  <select
                                    id="darkCardTransitionDuration"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.darkCardTransitionDuration}
                                    onChange={(e) => setFormData({ ...formData, darkCardTransitionDuration: e.target.value })}
                                  >
                                    <option value="100ms">Fast (100ms)</option>
                                    <option value="150ms">Quick (150ms)</option>
                                    <option value="200ms">Normal (200ms)</option>
                                    <option value="300ms">Slow (300ms)</option>
                                    <option value="500ms">Slower (500ms)</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Dark Buttons */}
                      <AccordionItem value="dark-buttons">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          🔘 Buttons
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          {/* Dark Button Colors */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Colors & Opacity</h5>
                              <div className="flex items-center gap-3">
                                <Label htmlFor="darkButtonColorMode" className="text-xs text-muted-foreground">Mode:</Label>
                                <select
                                  id="darkButtonColorMode"
                                  className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.darkButtonGradientEnabled ? "gradient" : "solid"}
                                  onChange={(e) => setFormData({ ...formData, darkButtonGradientEnabled: e.target.value === "gradient" })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="gradient">Gradient</option>
                                </select>
                              </div>
                            </div>
                            {formData.darkButtonGradientEnabled ? (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="darkButtonGradientStart" className="mb-2 text-sm font-medium">Gradient Start</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkButtonGradientStart"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkButtonGradientStart}
                                      onChange={(e) => setFormData({ ...formData, darkButtonGradientStart: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkButtonGradientStart}
                                      onChange={(e) => setFormData({ ...formData, darkButtonGradientStart: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkButtonGradientEnd" className="mb-2 text-sm font-medium">Gradient End</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkButtonGradientEnd"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkButtonGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, darkButtonGradientEnd: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkButtonGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, darkButtonGradientEnd: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkButtonGradientDirection" className="mb-2 text-sm font-medium">Direction</Label>
                                  <select
                                    id="darkButtonGradientDirection"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.darkButtonGradientDirection}
                                    onChange={(e) => setFormData({ ...formData, darkButtonGradientDirection: e.target.value })}
                                  >
                                    <option value="to right">To Right</option>
                                    <option value="to left">To Left</option>
                                    <option value="to bottom">To Bottom</option>
                                    <option value="to top">To Top</option>
                                    <option value="to bottom right">Bottom Right</option>
                                    <option value="to bottom left">Bottom Left</option>
                                    <option value="to top right">Top Right</option>
                                    <option value="to top left">Top Left</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="darkButtonBackground" className="mb-2 text-sm font-medium">Button Background</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkButtonBackground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkButtonBackground}
                                      onChange={(e) => setFormData({ ...formData, darkButtonBackground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkButtonBackground}
                                      onChange={(e) => setFormData({ ...formData, darkButtonBackground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkButtonBackgroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.darkButtonBackgroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, darkButtonBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkButtonForeground" className="mb-2 text-sm font-medium">Button Foreground (Text)</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkButtonForeground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkButtonForeground}
                                      onChange={(e) => setFormData({ ...formData, darkButtonForeground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkButtonForeground}
                                      onChange={(e) => setFormData({ ...formData, darkButtonForeground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkButtonForegroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.darkButtonForegroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, darkButtonForegroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkButtonHover" className="mb-2 text-sm font-medium">Button Hover Color</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkButtonHover"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkButtonHover}
                                      onChange={(e) => setFormData({ ...formData, darkButtonHover: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkButtonHover}
                                      onChange={(e) => setFormData({ ...formData, darkButtonHover: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkButtonHoverOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.darkButtonHoverOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, darkButtonHoverOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Dark Button Border & Spacing */}
                          <div className="space-y-5 sm:space-y-6">
                            <h5 className="text-sm font-semibold text-muted-foreground">Border & Spacing</h5>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="darkButtonRadius" className="mb-2 text-sm font-medium">Roundness</Label>
                                <select
                                  id="darkButtonRadius"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.buttonRadius}
                                  onChange={(e) => setFormData({ ...formData, buttonRadius: e.target.value })}
                                >
                                  <option value="0.25rem">Sm</option>
                                  <option value="0.5rem">Md</option>
                                  <option value="0.75rem">Lg</option>
                                  <option value="1rem">Xl</option>
                                  <option value="1.25rem">2xl</option>
                                  <option value="1.5rem">3xl</option>
                                  <option value="9999px">Full</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="darkButtonBorderStyle" className="mb-2 text-sm font-medium">Border Style</Label>
                                <select
                                  id="darkButtonBorderStyle"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.darkButtonBorderStyle}
                                  onChange={(e) => setFormData({ ...formData, darkButtonBorderStyle: e.target.value })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                  <option value="double">Double</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="darkButtonBorderWidth" className="mb-2 text-sm font-medium">Border Width</Label>
                                <Input
                                  id="darkButtonBorderWidth"
                                  placeholder="1px"
                                  value={formData.darkButtonBorderWidth}
                                  onChange={(e) => setFormData({ ...formData, darkButtonBorderWidth: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkButtonPadding" className="mb-2 text-sm font-medium">Padding</Label>
                                <Input
                                  id="darkButtonPadding"
                                  placeholder="0.5rem 1rem"
                                  value={formData.darkButtonPadding}
                                  onChange={(e) => setFormData({ ...formData, darkButtonPadding: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkButtonMargin" className="mb-2 text-sm font-medium">Margin</Label>
                                <Input
                                  id="darkButtonMargin"
                                  placeholder="0"
                                  value={formData.darkButtonMargin}
                                  onChange={(e) => setFormData({ ...formData, darkButtonMargin: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkButtonBoxShadow" className="mb-2 text-sm font-medium">Box Shadow</Label>
                                <Input
                                  id="darkButtonBoxShadow"
                                  placeholder="0 1px 2px rgba(0, 0, 0, 0.3)"
                                  value={formData.darkButtonBoxShadow}
                                  onChange={(e) => setFormData({ ...formData, darkButtonBoxShadow: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Dark Button Interactivity */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Hover Effects</h5>
                              <Switch
                                checked={formData.darkButtonEnableHover}
                                onCheckedChange={(checked) => setFormData({ ...formData, darkButtonEnableHover: checked })}
                                className="h-11 rounded-xl"
                              />
                            </div>
                            {formData.darkButtonEnableHover && (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="darkButtonHoverScale" className="mb-2 text-sm font-medium">Hover Scale: {formData.darkButtonHoverScale?.toFixed(2)}x</Label>
                                  <Slider
                                    id="darkButtonHoverScale"
                                    min={1}
                                    max={1.1}
                                    step={0.01}
                                    value={[formData.darkButtonHoverScale || 1.05]}
                                    onValueChange={(value) => setFormData({ ...formData, darkButtonHoverScale: Array.isArray(value) ? value[0] : value })}
                                    className="h-11 rounded-xl"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="darkButtonHoverShadow" className="mb-2 text-sm font-medium">Hover Shadow</Label>
                                  <Input
                                    id="darkButtonHoverShadow"
                                    placeholder="0 4px 12px rgba(0, 0, 0, 0.4)"
                                    value={formData.darkButtonHoverShadow}
                                    onChange={(e) => setFormData({ ...formData, darkButtonHoverShadow: e.target.value })}
                                    className="h-11 rounded-xl text-sm"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="darkButtonTransitionDuration" className="mb-2 text-sm font-medium">Transition Duration</Label>
                                  <select
                                    id="darkButtonTransitionDuration"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.darkButtonTransitionDuration}
                                    onChange={(e) => setFormData({ ...formData, darkButtonTransitionDuration: e.target.value })}
                                  >
                                    <option value="100ms">Fast (100ms)</option>
                                    <option value="150ms">Quick (150ms)</option>
                                    <option value="200ms">Normal (200ms)</option>
                                    <option value="300ms">Slow (300ms)</option>
                                    <option value="500ms">Slower (500ms)</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Dark Badges */}
                      <AccordionItem value="dark-badges">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          🏷️ Badges
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          {/* Dark Badge Colors */}
                          <div className="space-y-5 sm:space-y-6">
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-semibold text-muted-foreground">Colors & Opacity</h5>
                              <div className="flex items-center gap-3">
                                <Label htmlFor="darkBadgeColorMode" className="text-xs text-muted-foreground">Mode:</Label>
                                <select
                                  id="darkBadgeColorMode"
                                  className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.darkBadgeGradientEnabled ? "gradient" : "solid"}
                                  onChange={(e) => setFormData({ ...formData, darkBadgeGradientEnabled: e.target.value === "gradient" })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="gradient">Gradient</option>
                                </select>
                              </div>
                            </div>
                            {formData.darkBadgeGradientEnabled ? (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="darkBadgeGradientStart" className="mb-2 text-sm font-medium">Gradient Start</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkBadgeGradientStart"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkBadgeGradientStart}
                                      onChange={(e) => setFormData({ ...formData, darkBadgeGradientStart: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkBadgeGradientStart}
                                      onChange={(e) => setFormData({ ...formData, darkBadgeGradientStart: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkBadgeGradientEnd" className="mb-2 text-sm font-medium">Gradient End</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkBadgeGradientEnd"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkBadgeGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, darkBadgeGradientEnd: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkBadgeGradientEnd}
                                      onChange={(e) => setFormData({ ...formData, darkBadgeGradientEnd: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkBadgeGradientDirection" className="mb-2 text-sm font-medium">Direction</Label>
                                  <select
                                    id="darkBadgeGradientDirection"
                                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                    value={formData.darkBadgeGradientDirection}
                                    onChange={(e) => setFormData({ ...formData, darkBadgeGradientDirection: e.target.value })}
                                  >
                                    <option value="to right">To Right</option>
                                    <option value="to left">To Left</option>
                                    <option value="to bottom">To Bottom</option>
                                    <option value="to top">To Top</option>
                                    <option value="to bottom right">Bottom Right</option>
                                    <option value="to bottom left">Bottom Left</option>
                                    <option value="to top right">Top Right</option>
                                    <option value="to top left">Top Left</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                  <Label htmlFor="darkBadgeBackground" className="mb-2 text-sm font-medium">Badge Background</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkBadgeBackground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkBadgeBackground}
                                      onChange={(e) => setFormData({ ...formData, darkBadgeBackground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkBadgeBackground}
                                      onChange={(e) => setFormData({ ...formData, darkBadgeBackground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkBadgeBackgroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.darkBadgeBackgroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, darkBadgeBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="darkBadgeForeground" className="mb-2 text-sm font-medium">Badge Foreground (Text)</Label>
                                  <div className="flex min-w-0 items-center gap-3">
                                    <Input
                                      id="darkBadgeForeground"
                                      type="color"
                                      className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                      value={formData.darkBadgeForeground}
                                      onChange={(e) => setFormData({ ...formData, darkBadgeForeground: e.target.value })}
                                    />
                                    <Input
                                      value={formData.darkBadgeForeground}
                                      onChange={(e) => setFormData({ ...formData, darkBadgeForeground: e.target.value })}
                                      className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                    />
                                  </div>
                                  <div className="mt-3 space-y-1">
                                    <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkBadgeForegroundOpacity || 1) * 100)}%</Label>
                                    <Slider
                                      min={0}
                                      max={1}
                                      step={0.01}
                                      value={[formData.darkBadgeForegroundOpacity || 1]}
                                      onValueChange={(value) => setFormData({ ...formData, darkBadgeForegroundOpacity: Array.isArray(value) ? value[0] : value })}
                                      className="h-11 rounded-xl"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Dark Badge Border & Spacing */}
                          <div className="space-y-5 sm:space-y-6">
                            <h5 className="text-sm font-semibold text-muted-foreground">Border & Spacing</h5>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                              <div>
                                <Label htmlFor="darkBadgeRadius" className="mb-2 text-sm font-medium">Roundness</Label>
                                <select
                                  id="darkBadgeRadius"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.badgeRadius}
                                  onChange={(e) => setFormData({ ...formData, badgeRadius: e.target.value })}
                                >
                                  <option value="0.25rem">Sm</option>
                                  <option value="0.5rem">Md</option>
                                  <option value="0.75rem">Lg</option>
                                  <option value="1rem">Xl</option>
                                  <option value="1.25rem">2xl</option>
                                  <option value="1.5rem">3xl</option>
                                  <option value="9999px">Full</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="darkBadgeBorderStyle" className="mb-2 text-sm font-medium">Border Style</Label>
                                <select
                                  id="darkBadgeBorderStyle"
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                                  value={formData.darkBadgeBorderStyle}
                                  onChange={(e) => setFormData({ ...formData, darkBadgeBorderStyle: e.target.value })}
                                >
                                  <option value="solid">Solid</option>
                                  <option value="dashed">Dashed</option>
                                  <option value="dotted">Dotted</option>
                                  <option value="double">Double</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor="darkBadgeBorderWidth" className="mb-2 text-sm font-medium">Border Width</Label>
                                <Input
                                  id="darkBadgeBorderWidth"
                                  placeholder="1px"
                                  value={formData.darkBadgeBorderWidth}
                                  onChange={(e) => setFormData({ ...formData, darkBadgeBorderWidth: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkBadgePadding" className="mb-2 text-sm font-medium">Padding</Label>
                                <Input
                                  id="darkBadgePadding"
                                  placeholder="0.25rem 0.75rem"
                                  value={formData.darkBadgePadding}
                                  onChange={(e) => setFormData({ ...formData, darkBadgePadding: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkBadgeMargin" className="mb-2 text-sm font-medium">Margin</Label>
                                <Input
                                  id="darkBadgeMargin"
                                  placeholder="0"
                                  value={formData.darkBadgeMargin}
                                  onChange={(e) => setFormData({ ...formData, darkBadgeMargin: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="darkBadgeBoxShadow" className="mb-2 text-sm font-medium">Box Shadow</Label>
                                <Input
                                  id="darkBadgeBoxShadow"
                                  placeholder="none"
                                  value={formData.darkBadgeBoxShadow}
                                  onChange={(e) => setFormData({ ...formData, darkBadgeBoxShadow: e.target.value })}
                                  className="h-11 rounded-xl text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Dark Page Background */}
                      <AccordionItem value="dark-page-background">
                        <AccordionTrigger className="text-base font-semibold tracking-tight sm:text-lg">
                          🎨 Page Background
                          <ChevronDown className="w-4 h-4" />
                        </AccordionTrigger>
                        <AccordionContent className="space-y-7 pt-4 sm:space-y-8">
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                              <Label htmlFor="darkBackground" className="mb-2 text-sm font-medium">Background</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="darkBackground"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.darkBackground}
                                  onChange={(e) => setFormData({ ...formData, darkBackground: e.target.value })}
                                />
                                <Input
                                  value={formData.darkBackground}
                                  onChange={(e) => setFormData({ ...formData, darkBackground: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkBackgroundOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.darkBackgroundOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, darkBackgroundOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="darkForeground" className="mb-2 text-sm font-medium">Foreground (Text)</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="darkForeground"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.darkForeground}
                                  onChange={(e) => setFormData({ ...formData, darkForeground: e.target.value })}
                                />
                                <Input
                                  value={formData.darkForeground}
                                  onChange={(e) => setFormData({ ...formData, darkForeground: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkForegroundOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.darkForegroundOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, darkForegroundOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="darkBorderColor" className="mb-2 text-sm font-medium">Border Color</Label>
                              <div className="flex min-w-0 items-center gap-3">
                                <Input
                                  id="darkBorderColor"
                                  type="color"
                                  className="h-11 w-14 shrink-0 cursor-pointer rounded-lg p-1"
                                  value={formData.darkBorderColor}
                                  onChange={(e) => setFormData({ ...formData, darkBorderColor: e.target.value })}
                                />
                                <Input
                                  value={formData.darkBorderColor}
                                  onChange={(e) => setFormData({ ...formData, darkBorderColor: e.target.value })}
                                  className="h-11 min-w-0 flex-1 rounded-xl text-sm"
                                />
                              </div>
                              <div className="mt-3 space-y-1">
                                <Label className="mb-1 text-xs text-muted-foreground">Opacity: {Math.round((formData.darkBorderColorOpacity || 1) * 100)}%</Label>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={[formData.darkBorderColorOpacity || 1]}
                                  onValueChange={(value) => setFormData({ ...formData, darkBorderColorOpacity: Array.isArray(value) ? value[0] : value })}
                                  className="h-11 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-0 space-y-6 sm:space-y-8">
            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <CardTitle className="flex items-center gap-3">
                  <Share2 className="w-5 h-5" />
                  Social Media Platforms
                </CardTitle>
                <CardDescription>Manage all your social media links with enable/disable toggles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 px-5 py-6 sm:space-y-8 sm:px-7 sm:py-8 lg:px-8">
                {/* Twitter/X */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaTwitter className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="twitter" className="text-sm font-semibold">Twitter/X</Label>
                      <Switch
                        checked={formData.twitterEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, twitterEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/yourcompany"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      disabled={!formData.twitterEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaLinkedin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="linkedin" className="text-sm font-semibold">LinkedIn</Label>
                      <Switch
                        checked={formData.linkedinEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, linkedinEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      disabled={!formData.linkedinEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaGithub className="w-5 h-5 text-gray-800 dark:text-gray-200" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="github" className="text-sm font-semibold">GitHub</Label>
                      <Switch
                        checked={formData.githubEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, githubEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="github"
                      placeholder="https://github.com/yourcompany"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      disabled={!formData.githubEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaInstagram className="w-5 h-5 text-pink-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="instagram" className="text-sm font-semibold">Instagram</Label>
                      <Switch
                        checked={formData.instagramEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, instagramEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="instagram"
                      placeholder="https://instagram.com/yourcompany"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      disabled={!formData.instagramEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="facebook" className="text-sm font-semibold">Facebook</Label>
                      <Switch
                        checked={formData.facebookEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, facebookEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="facebook"
                      placeholder="https://facebook.com/yourcompany"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      disabled={!formData.facebookEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* YouTube */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaYoutube className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="youtube" className="text-sm font-semibold">YouTube</Label>
                      <Switch
                        checked={formData.youtubeEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, youtubeEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="youtube"
                      placeholder="https://youtube.com/@yourcompany"
                      value={formData.youtube}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      disabled={!formData.youtubeEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* TikTok */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaTiktok className="w-5 h-5 text-black dark:text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="tiktok" className="text-sm font-semibold">TikTok</Label>
                      <Switch
                        checked={formData.tiktokEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, tiktokEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="tiktok"
                      placeholder="https://tiktok.com/@yourcompany"
                      value={formData.tiktok}
                      onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                      disabled={!formData.tiktokEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Pinterest */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaPinterest className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pinterest" className="text-sm font-semibold">Pinterest</Label>
                      <Switch
                        checked={formData.pinterestEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, pinterestEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="pinterest"
                      placeholder="https://pinterest.com/yourcompany"
                      value={formData.pinterest}
                      onChange={(e) => setFormData({ ...formData, pinterest: e.target.value })}
                      disabled={!formData.pinterestEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Snapchat */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaSnapchat className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="snapchat" className="text-sm font-semibold">Snapchat</Label>
                      <Switch
                        checked={formData.snapchatEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, snapchatEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="snapchat"
                      placeholder="https://snapchat.com/add/yourcompany"
                      value={formData.snapchat}
                      onChange={(e) => setFormData({ ...formData, snapchat: e.target.value })}
                      disabled={!formData.snapchatEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaWhatsapp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp" className="text-sm font-semibold">WhatsApp</Label>
                      <Switch
                        checked={formData.whatsappEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, whatsappEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="whatsapp"
                      placeholder="https://wa.me/1234567890"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      disabled={!formData.whatsappEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Discord */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaDiscord className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="discord" className="text-sm font-semibold">Discord</Label>
                      <Switch
                        checked={formData.discordEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, discordEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="discord"
                      placeholder="https://discord.gg/yourserver"
                      value={formData.discord}
                      onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                      disabled={!formData.discordEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Reddit */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaReddit className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reddit" className="text-sm font-semibold">Reddit</Label>
                      <Switch
                        checked={formData.redditEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, redditEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="reddit"
                      placeholder="https://reddit.com/r/yourcompany"
                      value={formData.reddit}
                      onChange={(e) => setFormData({ ...formData, reddit: e.target.value })}
                      disabled={!formData.redditEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Medium */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaMedium className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medium" className="text-sm font-semibold">Medium</Label>
                      <Switch
                        checked={formData.mediumEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, mediumEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="medium"
                      placeholder="https://medium.com/@yourcompany"
                      value={formData.medium}
                      onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                      disabled={!formData.mediumEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Dribbble */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaDribbble className="w-5 h-5 text-pink-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dribbble" className="text-sm font-semibold">Dribbble</Label>
                      <Switch
                        checked={formData.dribbbleEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, dribbbleEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="dribbble"
                      placeholder="https://dribbble.com/yourcompany"
                      value={formData.dribbble}
                      onChange={(e) => setFormData({ ...formData, dribbble: e.target.value })}
                      disabled={!formData.dribbbleEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Behance */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaBehance className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="behance" className="text-sm font-semibold">Behance</Label>
                      <Switch
                        checked={formData.behanceEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, behanceEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="behance"
                      placeholder="https://behance.net/yourcompany"
                      value={formData.behance}
                      onChange={(e) => setFormData({ ...formData, behance: e.target.value })}
                      disabled={!formData.behanceEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Vimeo */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaVimeo className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vimeo" className="cursor-pointer font-medium">Vimeo</Label>
                      <Switch
                        checked={formData.vimeoEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, vimeoEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="vimeo"
                      placeholder="https://vimeo.com/yourcompany"
                      value={formData.vimeo}
                      onChange={(e) => setFormData({ ...formData, vimeo: e.target.value })}
                      disabled={!formData.vimeoEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Twitch */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaTwitch className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="twitch" className="text-sm font-semibold">Twitch</Label>
                      <Switch
                        checked={formData.twitchEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, twitchEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="twitch"
                      placeholder="https://twitch.tv/yourcompany"
                      value={formData.twitch}
                      onChange={(e) => setFormData({ ...formData, twitch: e.target.value })}
                      disabled={!formData.twitchEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Telegram */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaTelegram className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="telegram" className="text-sm font-semibold">Telegram</Label>
                      <Switch
                        checked={formData.telegramEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, telegramEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="telegram"
                      placeholder="https://t.me/yourcompany"
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      disabled={!formData.telegramEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* LinkedIn Company */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FaLinkedin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="linkedcompany" className="text-sm font-semibold">LinkedIn Company Page</Label>
                      <Switch
                        checked={formData.linkedcompanyEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, linkedcompanyEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="linkedcompany"
                      placeholder="https://linkedin.com/company/yourcompany"
                      value={formData.linkedcompany}
                      onChange={(e) => setFormData({ ...formData, linkedcompany: e.target.value })}
                      disabled={!formData.linkedcompanyEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-0 space-y-6 sm:space-y-8">
            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <CardTitle className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>Manage contact details with enable/disable toggles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 px-5 py-6 sm:space-y-8 sm:px-7 sm:py-8 lg:px-8">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                      <Switch
                        checked={formData.emailEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, emailEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@yourcompany.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!formData.emailEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                      <Switch
                        checked={formData.phoneEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, phoneEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!formData.phoneEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="address" className="text-sm font-semibold">Address</Label>
                      <Switch
                        checked={formData.addressEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, addressEnabled: checked })}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Textarea
                      id="address"
                      placeholder="123 Business St, Suite 100, City, State 12345"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!formData.addressEnabled}
                      rows={3}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <Globe className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="website" className="text-sm font-semibold">Website</Label>
                      <Switch
                        checked={formData.websiteEnabled}
                        onCheckedChange={(checked) => setFormData({ ...formData, websiteEnabled: checked })}
                        className="min-h-[130px] resize-y rounded-xl"
                      />

                    </div>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourcompany.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      disabled={!formData.websiteEnabled}
                      className="h-11 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-0 space-y-6 sm:space-y-8">
            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <CardTitle className="flex items-center gap-3">
                  <Landmark className="w-5 h-5" />
                  Bank Details
                </CardTitle>
                <CardDescription>
                  Configure your bank account information for payments and invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 px-5 py-6 sm:space-y-8 sm:px-7 sm:py-8 lg:px-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g., Equity Bank, KCB, Standard Chartered"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="Your bank account number"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    placeholder="Name on the bank account"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      placeholder="Bank branch name"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                    <Input
                      id="swiftCode"
                      value={formData.swiftCode}
                      onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                      placeholder="e.g., EQBLKENA"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="iban">IBAN</Label>
                    <Input
                      id="iban"
                      value={formData.iban}
                      onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                      placeholder="International Bank Account Number"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      value={formData.routingNumber}
                      onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                      placeholder="Bank routing number"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankAddress">Bank Address</Label>
                  <Textarea
                    id="bankAddress"
                    value={formData.bankAddress}
                    onChange={(e) => setFormData({ ...formData, bankAddress: e.target.value })}
                    placeholder="Full bank address"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" />
                  M-Pesa Details
                </CardTitle>
                <CardDescription>
                  Configure M-Pesa payment information for mobile money transfers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 px-5 py-6 sm:space-y-8 sm:px-7 sm:py-8 lg:px-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mpesaPhoneNumber">M-Pesa Phone Number</Label>
                    <Input
                      id="mpesaPhoneNumber"
                      value={formData.mpesaPhoneNumber}
                      onChange={(e) => setFormData({ ...formData, mpesaPhoneNumber: e.target.value })}
                      placeholder="e.g., 0712345678"
                      className="min-h-[130px] resize-y rounded-xl"
                    />

                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesaBusinessNumber">Business Number (Paybill)</Label>
                    <Input
                      id="mpesaBusinessNumber"
                      value={formData.mpesaBusinessNumber}
                      onChange={(e) => setFormData({ ...formData, mpesaBusinessNumber: e.target.value })}
                      placeholder="e.g., 123456"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mpesaAccountName">Account Name</Label>
                    <Input
                      id="mpesaAccountName"
                      value={formData.mpesaAccountName}
                      onChange={(e) => setFormData({ ...formData, mpesaAccountName: e.target.value })}
                      placeholder="Your business name"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mpesaTillNumber">Till Number</Label>
                    <Input
                      id="mpesaTillNumber"
                      value={formData.mpesaTillNumber}
                      onChange={(e) => setFormData({ ...formData, mpesaTillNumber: e.target.value })}
                      placeholder="e.g., 123456"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <CardTitle className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Document Assets
                </CardTitle>
                <CardDescription>
                  Upload company stamp, signature, and signatory details for documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 px-5 py-6 sm:space-y-8 sm:px-7 sm:py-8 lg:px-8">
                <div className="space-y-5 sm:space-y-6">
                  <Label className="text-base font-semibold tracking-tight sm:text-lg">Company Stamp</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="stampUrl">Stamp Image URL</Label>
                      <Input
                        id="stampUrl"
                        value={formData.stampUrl}
                        onChange={(e) => setFormData({ ...formData, stampUrl: e.target.value })}
                        placeholder="URL to your company stamp image"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stampUpload">Or Upload Stamp Image</Label>
                      <Input
                        id="stampUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, stampUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    {formData.stampUrl && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                        <Image
                          src={formData.stampUrl}
                          alt="Stamp preview"
                          width={64}
                          height={64}
                          className="h-16 w-16 object-contain rounded border"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, stampUrl: "" })}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-5 sm:space-y-6">
                  <Label className="text-base font-semibold tracking-tight sm:text-lg">Authorized Signature</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="signatureUrl">Signature Image URL</Label>
                      <Input
                        id="signatureUrl"
                        value={formData.signatureUrl}
                        onChange={(e) => setFormData({ ...formData, signatureUrl: e.target.value })}
                        placeholder="URL to your signature image"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signatureUpload">Or Upload Signature Image</Label>
                      <Input
                        id="signatureUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, signatureUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    {formData.signatureUrl && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border">
                        <Image
                          src={formData.signatureUrl}
                          alt="Signature preview"
                          width={128}
                          height={48}
                          className="h-12 w-32 object-contain rounded border"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData({ ...formData, signatureUrl: "" })}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="signatoryName">Signatory Name</Label>
                    <Input
                      id="signatoryName"
                      value={formData.signatoryName}
                      onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                      placeholder="e.g., John Doe"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signatoryTitle">Signatory Title</Label>
                    <Input
                      id="signatoryTitle"
                      value={formData.signatoryTitle}
                      onChange={(e) => setFormData({ ...formData, signatoryTitle: e.target.value })}
                      placeholder="e.g., Executive Director"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="mt-0 space-y-6 sm:space-y-8">
            <Card className="overflow-hidden rounded-2xl border-border/60 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <CardTitle className="flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  Default SEO Settings
                </CardTitle>
                <CardDescription>Configure default SEO metadata for your pages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-7 px-5 py-6 sm:space-y-8 sm:px-7 sm:py-8 lg:px-8">
                <div>
                  <Label htmlFor="defaultMetaTitle" className="mb-2 text-sm font-medium">Default Meta Title</Label>
                  <Input
                    id="defaultMetaTitle"
                    placeholder="My Company - Professional Services"
                    value={formData.defaultMetaTitle}
                    onChange={(e) => setFormData({ ...formData, defaultMetaTitle: e.target.value })}
                    className="h-11 rounded-xl text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Default title for pages without custom SEO</p>
                </div>
                <div>
                  <Label htmlFor="defaultMetaDescription" className="mb-2 text-sm font-medium">Default Meta Description</Label>
                  <Textarea
                    id="defaultMetaDescription"
                    placeholder="Professional services and solutions for your business needs."
                    value={formData.defaultMetaDescription}
                    onChange={(e) => setFormData({ ...formData, defaultMetaDescription: e.target.value })}
                    rows={3}
                    className="h-11 rounded-xl text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Default description for pages without custom SEO</p>
                </div>
                <div>
                  <ImageUpload
                    value={formData.defaultOgImage}
                    onChange={(value) => setFormData({ ...formData, defaultOgImage: value })}
                    label="Default Open Graph Image (Social Sharing)"
                    placeholder="https://yourcompany.com/og-image.png"
                    aspectRatio="video"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Default image for social media previews (Facebook, Twitter/X, LinkedIn, WhatsApp). Recommended size: 1200×630px.
                  </p>
                </div>
                <div>
                  <Label htmlFor="defaultTwitterCard" className="mb-2 text-sm font-medium">Default Twitter Card Type</Label>
                  <select
                    id="defaultTwitterCard"
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
                    value={formData.defaultTwitterCard || ""}
                    onChange={(e) => setFormData({ ...formData, defaultTwitterCard: e.target.value })}
                  >
                    <option value="">None</option>
                    <option value="summary">Summary Card</option>
                    <option value="summary_large_image">Summary Card with Large Image</option>
                    <option value="app">App Card</option>
                    <option value="player">Player Card</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">Default Twitter card type for social sharing</p>
                </div>
                <div>
                  <Label htmlFor="defaultCanonicalUrl" className="mb-2 text-sm font-medium">Default Canonical URL</Label>
                  <Input
                    id="defaultCanonicalUrl"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={formData.defaultCanonicalUrl}
                    onChange={(e) => setFormData({ ...formData, defaultCanonicalUrl: e.target.value })}
                    className="h-11 rounded-xl text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Default canonical URL for SEO</p>
                </div>
                <div>
                  <Label htmlFor="defaultRobots" className="mb-2 text-sm font-medium">Default Robots Meta Tag</Label>
                  <Input
                    id="defaultRobots"
                    placeholder="index, follow"
                    value={formData.defaultRobots}
                    onChange={(e) => setFormData({ ...formData, defaultRobots: e.target.value })}
                    className="h-11 rounded-xl text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Default robots meta tag for search engines</p>
                </div>
                <div>
                  <Label htmlFor="defaultKeywords" className="mb-2 text-sm font-medium">Default Keywords</Label>
                  <Input
                    id="defaultKeywords"
                    placeholder="tours, travel, kenya, safari, transport"
                    value={formData.defaultKeywords}
                    onChange={(e) => setFormData({ ...formData, defaultKeywords: e.target.value })}
                    className="h-11 rounded-xl text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Comma-separated keywords used as fallback for pages without custom keywords</p>
                </div>
                <div>
                  <Label htmlFor="areasOfOperation" className="mb-2 text-sm font-medium">Areas of Operation</Label>
                  <Input
                    id="areasOfOperation"
                    placeholder="Nairobi, Kenya, East Africa"
                    value={formData.areasOfOperation}
                    onChange={(e) => setFormData({ ...formData, areasOfOperation: e.target.value })}
                    className="h-11 rounded-xl text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Comma-separated regions/cities emitted as areaServed in Organization structured data</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminOrganization() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading organization settings...</div>}>
      <AdminOrganizationContent />
    </Suspense>
  );
}
