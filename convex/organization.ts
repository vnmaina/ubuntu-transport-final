import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get organization settings
export const getOrganization = query({
  handler: async (ctx) => {
    const organizations = await ctx.db.query("organization").collect();
    return organizations[0] || null;
  },
});

// Create or update organization settings
export const upsertOrganization = mutation({
  args: {
    name: v.string(),
    logo: v.optional(v.string()),
    // Main brand colors with opacity
    primaryColor: v.optional(v.string()),
    primaryOpacity: v.optional(v.number()),
    secondaryColor: v.optional(v.string()),
    secondaryOpacity: v.optional(v.number()),
    accentColor: v.optional(v.string()),
    accentOpacity: v.optional(v.number()),
    // Card colors with opacity
    cardBackground: v.optional(v.string()),
    cardBackgroundOpacity: v.optional(v.number()),
    cardForeground: v.optional(v.string()),
    cardForegroundOpacity: v.optional(v.number()),
    cardBorder: v.optional(v.string()),
    cardBorderOpacity: v.optional(v.number()),
    // Button colors with opacity
    buttonBackground: v.optional(v.string()),
    buttonBackgroundOpacity: v.optional(v.number()),
    buttonForeground: v.optional(v.string()),
    buttonForegroundOpacity: v.optional(v.number()),
    buttonHover: v.optional(v.string()),
    buttonHoverOpacity: v.optional(v.number()),
    // Badge colors with opacity
    badgeBackground: v.optional(v.string()),
    badgeBackgroundOpacity: v.optional(v.number()),
    badgeForeground: v.optional(v.string()),
    badgeForegroundOpacity: v.optional(v.number()),
    // Border colors with opacity
    borderColor: v.optional(v.string()),
    borderColorOpacity: v.optional(v.number()),
    // Background colors with opacity
    background: v.optional(v.string()),
    backgroundOpacity: v.optional(v.number()),
    foreground: v.optional(v.string()),
    foregroundOpacity: v.optional(v.number()),
    // Dark mode overrides with opacity
    darkCardBackground: v.optional(v.string()),
    darkCardBackgroundOpacity: v.optional(v.number()),
    darkCardForeground: v.optional(v.string()),
    darkCardForegroundOpacity: v.optional(v.number()),
    darkCardBorder: v.optional(v.string()),
    darkCardBorderOpacity: v.optional(v.number()),
    darkButtonBackground: v.optional(v.string()),
    darkButtonBackgroundOpacity: v.optional(v.number()),
    darkButtonForeground: v.optional(v.string()),
    darkButtonForegroundOpacity: v.optional(v.number()),
    darkButtonHover: v.optional(v.string()),
    darkButtonHoverOpacity: v.optional(v.number()),
    darkBadgeBackground: v.optional(v.string()),
    darkBadgeBackgroundOpacity: v.optional(v.number()),
    darkBadgeForeground: v.optional(v.string()),
    darkBadgeForegroundOpacity: v.optional(v.number()),
    darkBorderColor: v.optional(v.string()),
    darkBorderColorOpacity: v.optional(v.number()),
    darkBackground: v.optional(v.string()),
    darkBackgroundOpacity: v.optional(v.number()),
    darkForeground: v.optional(v.string()),
    darkForegroundOpacity: v.optional(v.number()),
    // Dark mode gradient settings
    darkCardGradientEnabled: v.optional(v.boolean()),
    darkCardGradientStart: v.optional(v.string()),
    darkCardGradientEnd: v.optional(v.string()),
    darkCardGradientDirection: v.optional(v.string()),
    darkButtonGradientEnabled: v.optional(v.boolean()),
    darkButtonGradientStart: v.optional(v.string()),
    darkButtonGradientEnd: v.optional(v.string()),
    darkButtonGradientDirection: v.optional(v.string()),
    darkBadgeGradientEnabled: v.optional(v.boolean()),
    darkBadgeGradientStart: v.optional(v.string()),
    darkBadgeGradientEnd: v.optional(v.string()),
    darkBadgeGradientDirection: v.optional(v.string()),
    // Dark mode border styles
    darkCardBorderStyle: v.optional(v.string()),
    darkCardBorderWidth: v.optional(v.string()),
    darkCardBoxShadow: v.optional(v.string()),
    darkCardPadding: v.optional(v.string()),
    darkCardMargin: v.optional(v.string()),
    darkButtonBorderStyle: v.optional(v.string()),
    darkButtonBorderWidth: v.optional(v.string()),
    darkButtonBoxShadow: v.optional(v.string()),
    darkButtonPadding: v.optional(v.string()),
    darkButtonMargin: v.optional(v.string()),
    darkBadgeBorderStyle: v.optional(v.string()),
    darkBadgeBorderWidth: v.optional(v.string()),
    darkBadgeBoxShadow: v.optional(v.string()),
    darkBadgePadding: v.optional(v.string()),
    darkBadgeMargin: v.optional(v.string()),
    // Dark mode hover effects
    darkCardHoverScale: v.optional(v.number()),
    darkCardHoverShadow: v.optional(v.string()),
    darkCardTransitionDuration: v.optional(v.string()),
    darkCardEnableHover: v.optional(v.boolean()),
    darkButtonHoverScale: v.optional(v.number()),
    darkButtonHoverShadow: v.optional(v.string()),
    darkButtonTransitionDuration: v.optional(v.string()),
    darkButtonEnableHover: v.optional(v.boolean()),
    // Shadow settings
    cardBoxShadow: v.optional(v.string()),
    buttonBoxShadow: v.optional(v.string()),
    badgeBoxShadow: v.optional(v.string()),
    // Gradient settings
    gradientEnabled: v.optional(v.boolean()),
    gradientType: v.optional(v.string()),
    gradientDirection: v.optional(v.string()),
    gradientStart: v.optional(v.string()),
    gradientEnd: v.optional(v.string()),
    // Border radius
    borderRadius: v.optional(v.string()),
    cardRadius: v.optional(v.string()),
    buttonRadius: v.optional(v.string()),
    // Opacity settings
    cardOpacity: v.optional(v.number()),
    buttonOpacity: v.optional(v.number()),
    badgeOpacity: v.optional(v.number()),
    // Interactivity settings
    cardHoverScale: v.optional(v.number()),
    cardHoverShadow: v.optional(v.string()),
    cardTransitionDuration: v.optional(v.string()),
    buttonHoverScale: v.optional(v.number()),
    buttonHoverShadow: v.optional(v.string()),
    buttonTransitionDuration: v.optional(v.string()),
    cardEnableHover: v.optional(v.boolean()),
    buttonEnableHover: v.optional(v.boolean()),
    // Card comprehensive settings
    cardBorderStyle: v.optional(v.string()),
    cardBorderWidth: v.optional(v.string()),
    cardPadding: v.optional(v.string()),
    cardMargin: v.optional(v.string()),
    cardGradientEnabled: v.optional(v.boolean()),
    cardGradientStart: v.optional(v.string()),
    cardGradientEnd: v.optional(v.string()),
    cardGradientDirection: v.optional(v.string()),
    // Button comprehensive settings
    buttonBorderStyle: v.optional(v.string()),
    buttonBorderWidth: v.optional(v.string()),
    buttonPadding: v.optional(v.string()),
    buttonMargin: v.optional(v.string()),
    buttonGradientEnabled: v.optional(v.boolean()),
    buttonGradientStart: v.optional(v.string()),
    buttonGradientEnd: v.optional(v.string()),
    buttonGradientDirection: v.optional(v.string()),
    // Badge comprehensive settings
    badgeBorderStyle: v.optional(v.string()),
    badgeBorderWidth: v.optional(v.string()),
    badgePadding: v.optional(v.string()),
    badgeMargin: v.optional(v.string()),
    badgeGradientEnabled: v.optional(v.boolean()),
    badgeGradientStart: v.optional(v.string()),
    badgeGradientEnd: v.optional(v.string()),
    badgeGradientDirection: v.optional(v.string()),
    badgeRadius: v.optional(v.string()),
    // Focus ring shadow
    focusRingShadow: v.optional(v.string()),
    // Additional color settings
    popoverBackground: v.optional(v.string()),
    popoverForeground: v.optional(v.string()),
    destructive: v.optional(v.string()),
    ring: v.optional(v.string()),
    input: v.optional(v.string()),
    chart1: v.optional(v.string()),
    chart2: v.optional(v.string()),
    chart3: v.optional(v.string()),
    chart4: v.optional(v.string()),
    chart5: v.optional(v.string()),
    sidebarBackground: v.optional(v.string()),
    sidebarForeground: v.optional(v.string()),
    sidebarPrimary: v.optional(v.string()),
    sidebarPrimaryForeground: v.optional(v.string()),
    sidebarAccent: v.optional(v.string()),
    sidebarAccentForeground: v.optional(v.string()),
    sidebarBorder: v.optional(v.string()),
    sidebarRing: v.optional(v.string()),
    globalCollectionId: v.optional(v.id("collections")),
    // Social links with enable/disable toggles
    twitter: v.optional(v.string()),
    twitterEnabled: v.optional(v.boolean()),
    linkedin: v.optional(v.string()),
    linkedinEnabled: v.optional(v.boolean()),
    github: v.optional(v.string()),
    githubEnabled: v.optional(v.boolean()),
    instagram: v.optional(v.string()),
    instagramEnabled: v.optional(v.boolean()),
    facebook: v.optional(v.string()),
    facebookEnabled: v.optional(v.boolean()),
    youtube: v.optional(v.string()),
    youtubeEnabled: v.optional(v.boolean()),
    tiktok: v.optional(v.string()),
    tiktokEnabled: v.optional(v.boolean()),
    pinterest: v.optional(v.string()),
    pinterestEnabled: v.optional(v.boolean()),
    snapchat: v.optional(v.string()),
    snapchatEnabled: v.optional(v.boolean()),
    whatsapp: v.optional(v.string()),
    whatsappEnabled: v.optional(v.boolean()),
    discord: v.optional(v.string()),
    discordEnabled: v.optional(v.boolean()),
    reddit: v.optional(v.string()),
    redditEnabled: v.optional(v.boolean()),
    medium: v.optional(v.string()),
    mediumEnabled: v.optional(v.boolean()),
    dribbble: v.optional(v.string()),
    dribbbleEnabled: v.optional(v.boolean()),
    behance: v.optional(v.string()),
    behanceEnabled: v.optional(v.boolean()),
    vimeo: v.optional(v.string()),
    vimeoEnabled: v.optional(v.boolean()),
    twitch: v.optional(v.string()),
    twitchEnabled: v.optional(v.boolean()),
    telegram: v.optional(v.string()),
    telegramEnabled: v.optional(v.boolean()),
    linkedcompany: v.optional(v.string()),
    linkedcompanyEnabled: v.optional(v.boolean()),
    // Contact info with enable/disable toggles
    email: v.optional(v.string()),
    emailEnabled: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    phoneEnabled: v.optional(v.boolean()),
    address: v.optional(v.string()),
    addressEnabled: v.optional(v.boolean()),
    website: v.optional(v.string()),
    websiteEnabled: v.optional(v.boolean()),
    // Additional organization details
    description: v.optional(v.string()),
    industry: v.optional(v.string()),
    companySize: v.optional(v.string()),
    foundedYear: v.optional(v.string()),
    // SEO defaults
    defaultMetaTitle: v.optional(v.string()),
    defaultMetaDescription: v.optional(v.string()),
    defaultOgImage: v.optional(v.string()),
    defaultTwitterCard: v.optional(v.string()),
    defaultCanonicalUrl: v.optional(v.string()),
    defaultRobots: v.optional(v.string()),
    defaultKeywords: v.optional(v.array(v.string())),
    areasOfOperation: v.optional(v.array(v.string())),
    // Bank details
    bankName: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    accountName: v.optional(v.string()),
    branch: v.optional(v.string()),
    swiftCode: v.optional(v.string()),
    iban: v.optional(v.string()),
    routingNumber: v.optional(v.string()),
    bankAddress: v.optional(v.string()),
    // M-Pesa details
    mpesaPhoneNumber: v.optional(v.string()),
    mpesaBusinessNumber: v.optional(v.string()),
    mpesaAccountName: v.optional(v.string()),
    mpesaTillNumber: v.optional(v.string()),
    // Document assets
    stampUrl: v.optional(v.string()),
    signatureUrl: v.optional(v.string()),
    signatoryName: v.optional(v.string()),
    signatoryTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingOrg = await ctx.db.query("organization").first();
    
    if (existingOrg) {
      await ctx.db.patch(existingOrg._id, args);
      return existingOrg._id;
    } else {
      const orgId = await ctx.db.insert("organization", args);
      return orgId;
    }
  },
});

// Initialize default organization
export const initializeDefaultOrganization = mutation({
  handler: async (ctx) => {
    const existingOrg = await ctx.db.query("organization").first();
    if (existingOrg) {
      return existingOrg._id;
    }

    const orgId = await ctx.db.insert("organization", {
      name: "My Company",
      primaryColor: "oklch(0.553 0.195 38.402)",
      secondaryColor: "oklch(0.967 0.001 286.375)",
      accentColor: "oklch(0.967 0.001 286.375)",
      cardBackground: "oklch(1 0 0)",
      cardForeground: "oklch(0.141 0.005 285.823)",
      cardBorder: "oklch(0.92 0.004 286.32)",
      buttonBackground: "oklch(0.553 0.195 38.402)",
      buttonForeground: "oklch(0.98 0.016 73.684)",
      badgeBackground: "oklch(0.967 0.001 286.375)",
      badgeForeground: "oklch(0.21 0.006 285.885)",
      borderColor: "oklch(0.92 0.004 286.32)",
      background: "oklch(1 0 0)",
      foreground: "oklch(0.141 0.005 285.823)",
      darkCardBackground: "oklch(0.21 0.006 285.885)",
      darkCardForeground: "oklch(0.985 0 0)",
      darkCardBorder: "oklch(1 0 0 / 10%)",
      darkButtonBackground: "oklch(0.47 0.157 37.304)",
      darkButtonForeground: "oklch(0.98 0.016 73.684)",
      darkBadgeBackground: "oklch(0.274 0.006 286.033)",
      darkBadgeForeground: "oklch(0.985 0 0)",
      darkBorderColor: "oklch(1 0 0 / 10%)",
      darkBackground: "oklch(0.141 0.005 285.823)",
      darkForeground: "oklch(0.985 0 0)",
      defaultMetaTitle: "My Company - Professional Services",
      defaultMetaDescription: "Professional services and solutions for your business needs.",
      // Enable contact info by default
      emailEnabled: true,
      phoneEnabled: true,
      addressEnabled: true,
      websiteEnabled: true,
    });
    
    return orgId;
  },
});
