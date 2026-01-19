/**
 * @fileoverview Type definitions for Pandilla Landing Page (JSDoc)
 * @description Config-driven architecture types
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BASIC TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} LinkItem
 * @property {string} text - Display text
 * @property {string} href - Link URL
 * @property {boolean} [external] - Open in new tab
 */

/**
 * @typedef {Object} ImageItem
 * @property {string} src - Image source URL
 * @property {string} alt - Alt text
 * @property {number} [width] - Image width
 * @property {number} [height] - Image height
 */

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} NavItem
 * @property {string} label - Navigation label
 * @property {string} href - Link URL
 * @property {boolean} [external] - Open in new tab
 * @property {NavItem[]} [children] - Submenu items
 */

/**
 * @typedef {Object} NavigationConfig
 * @property {{text: string, icon?: string, href: string}} logo - Site logo
 * @property {NavItem[]} items - Navigation items
 * @property {LinkItem} [cta] - Call to action button
 */

// ═══════════════════════════════════════════════════════════════════════════════
// HERO TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} HeroBadge
 * @property {string} text - Badge text
 * @property {'default'|'secondary'|'outline'|'destructive'} [variant] - Badge variant
 */

/**
 * @typedef {Object} HeroTitle
 * @property {string} main - Main title text
 * @property {string} [highlight] - Highlighted text (gradient)
 * @property {string} [suffix] - Text after highlight
 */

/**
 * @typedef {Object} HeroCTA
 * @property {LinkItem} primary - Primary CTA button
 * @property {LinkItem} [secondary] - Secondary CTA button
 */

/**
 * @typedef {Object} HeroConfig
 * @property {HeroBadge} [badge] - Optional badge
 * @property {HeroTitle} title - Hero title
 * @property {string} description - Hero description
 * @property {HeroCTA} cta - Call to action buttons
 * @property {ImageItem} [image] - Hero image
 */

// ═══════════════════════════════════════════════════════════════════════════════
// NEWS TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} NewsItem
 * @property {string} id - Unique identifier
 * @property {string} title - Article title
 * @property {string} excerpt - Short description
 * @property {string} date - Publication date (ISO format)
 * @property {string} category - Category name
 * @property {string} image - Image URL
 * @property {string} href - Article link
 * @property {string} [author] - Author name
 * @property {boolean} [featured] - Is featured article
 */

/**
 * @typedef {Object} FeaturedNewsConfig
 * @property {string} [badge] - Section badge
 * @property {string} title - Section title
 * @property {string} [subtitle] - Section subtitle
 * @property {NewsItem[]} items - News items
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} CategoryItem
 * @property {string} id - Unique identifier
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {string} icon - Lucide icon name
 * @property {string} href - Category link
 * @property {string} [color] - Color theme (indigo, violet, emerald, etc.)
 * @property {number} [articleCount] - Number of articles
 */

/**
 * @typedef {Object} CategoriesConfig
 * @property {string} [badge] - Section badge
 * @property {string} title - Section title
 * @property {string} [subtitle] - Section subtitle
 * @property {CategoryItem[]} items - Category items
 * @property {2|3|4} [columns] - Grid columns
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} SocialLinks
 * @property {string} [twitter] - Twitter URL
 * @property {string} [linkedin] - LinkedIn URL
 * @property {string} [email] - Email address
 * @property {string} [github] - GitHub URL
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} id - Unique identifier
 * @property {string} name - Member name
 * @property {string} role - Job title/role
 * @property {string} [avatar] - Avatar image URL
 * @property {string} [bio] - Short biography
 * @property {SocialLinks} [social] - Social media links
 */

/**
 * @typedef {Object} TeamConfig
 * @property {string} [badge] - Section badge
 * @property {string} title - Section title
 * @property {string} [subtitle] - Section subtitle
 * @property {TeamMember[]} members - Team members
 */

// ═══════════════════════════════════════════════════════════════════════════════
// NEWSLETTER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} NewsletterConfig
 * @property {string} [badge] - Section badge
 * @property {string} title - Section title
 * @property {string} [subtitle] - Section subtitle
 * @property {string} placeholder - Input placeholder
 * @property {string} buttonText - Submit button text
 * @property {string} successMessage - Success message after submit
 * @property {boolean} [showContactForm] - Show full contact form
 */

// ═══════════════════════════════════════════════════════════════════════════════
// FOOTER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} FooterColumn
 * @property {string} title - Column title
 * @property {LinkItem[]} links - Column links
 */

/**
 * @typedef {Object} FooterSocial
 * @property {string} [twitter] - Twitter URL
 * @property {string} [facebook] - Facebook URL
 * @property {string} [instagram] - Instagram URL
 * @property {string} [youtube] - YouTube URL
 * @property {string} [linkedin] - LinkedIn URL
 */

/**
 * @typedef {Object} FooterConfig
 * @property {{text: string, icon?: string}} [logo] - Footer logo
 * @property {string} [description] - Footer description
 * @property {FooterColumn[]} columns - Footer columns
 * @property {FooterSocial} [social] - Social media links
 * @property {string} copyright - Copyright text
 * @property {LinkItem[]} [bottomLinks] - Bottom links (legal, etc.)
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SITE & UI TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} SiteConfig
 * @property {string} name - Site name
 * @property {string} description - Site description
 * @property {string} [url] - Site URL
 * @property {string} [ogImage] - Open Graph image
 * @property {string[]} [keywords] - SEO keywords
 */

/**
 * @typedef {Object} UIStrings
 * @property {string} readMore - "Read more" text
 * @property {string} viewAll - "View all" text
 * @property {string} subscribe - "Subscribe" text
 * @property {string} loading - "Loading" text
 * @property {string} lightMode - Light mode label
 * @property {string} darkMode - Dark mode label
 * @property {string} toggleMenu - Toggle menu label
 * @property {string} search - Search placeholder
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CONFIG TYPE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} LandingConfig
 * @property {SiteConfig} site - Site metadata
 * @property {UIStrings} ui - UI strings
 * @property {NavigationConfig} navigation - Navigation config
 * @property {HeroConfig} hero - Hero section config
 * @property {FeaturedNewsConfig} [featuredNews] - Featured news section
 * @property {CategoriesConfig} categories - Categories section
 * @property {TeamConfig} team - Team section
 * @property {NewsletterConfig} newsletter - Newsletter section
 * @property {FooterConfig} footer - Footer config
 */

export {};
