/**
 * @fileoverview Dynamic Icon Component
 * @description Renders Lucide icons by string name
 */

import {
  // Navigation & UI
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Search,
  Settings,
  Home,

  // Social Media
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Github,

  // Communication
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Send,

  // Content & Media
  Newspaper,
  FileText,
  Image,
  Video,
  Play,
  Pause,
  Music,
  Music2,
  Music4,

  // Categories & Topics
  Landmark,
  TrendingUp,
  Cpu,
  Trophy,
  Palette,
  Globe,
  Heart,
  Star,
  Bookmark,
  Tag,
  Crown,
  Sparkles,
  PartyPopper,
  Footprints,
  Drama,

  // Business & Finance
  DollarSign,
  CreditCard,
  BarChart3,
  PieChart,
  LineChart,
  Building,
  Briefcase,

  // Tech & Science
  Zap,
  Shield,
  Lock,
  Unlock,
  Cloud,
  Database,
  Server,
  Code,
  Terminal,

  // People & Users
  User,
  Users,
  UserPlus,
  UserCheck,

  // Time & Calendar
  Clock,
  Calendar,
  CalendarDays,

  // Actions
  Check,
  Plus,
  Minus,
  Edit,
  Trash,
  Download,
  Upload,
  Share,
  Copy,

  // Misc
  Sun,
  Moon,
  AlertCircle,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
  MapPin,
  Link,
  Rss,

} from 'lucide-react';

/**
 * Icon map - string name to Lucide component
 */
const iconMap = {
  // Navigation & UI
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Search,
  Settings,
  Home,

  // Social Media
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Github,

  // Communication
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Send,

  // Content & Media
  Newspaper,
  FileText,
  Image,
  Video,
  Play,
  Pause,
  Music,
  Music2,
  Music4,

  // Categories & Topics
  Landmark,
  TrendingUp,
  Cpu,
  Trophy,
  Palette,
  Globe,
  Heart,
  Star,
  Bookmark,
  Tag,
  Crown,
  Sparkles,
  PartyPopper,
  Footprints,
  Drama,

  // Business & Finance
  DollarSign,
  CreditCard,
  BarChart3,
  PieChart,
  LineChart,
  Building,
  Briefcase,

  // Tech & Science
  Zap,
  Shield,
  Lock,
  Unlock,
  Cloud,
  Database,
  Server,
  Code,
  Terminal,

  // People & Users
  User,
  Users,
  UserPlus,
  UserCheck,

  // Time & Calendar
  Clock,
  Calendar,
  CalendarDays,

  // Actions
  Check,
  Plus,
  Minus,
  Edit,
  Trash,
  Download,
  Upload,
  Share,
  Copy,

  // Misc
  Sun,
  Moon,
  AlertCircle,
  Info,
  HelpCircle,
  Eye,
  EyeOff,
  MapPin,
  Link,
  Rss,
};

/**
 * Dynamic Icon Component
 * Renders a Lucide icon by string name
 *
 * @param {Object} props
 * @param {string} props.name - Icon name (e.g., "Newspaper", "TrendingUp")
 * @param {string} [props.className] - Additional CSS classes
 * @param {number} [props.size=24] - Icon size in pixels
 * @param {string} [props.strokeWidth=2] - Stroke width
 * @returns {JSX.Element|null}
 *
 * @example
 * <DynamicIcon name="Newspaper" size={24} className="text-primary" />
 */
export function DynamicIcon({
  name,
  className = '',
  size = 24,
  strokeWidth = 2,
  ...props
}) {
  const Icon = iconMap[name];

  if (!Icon) {
    console.warn(`DynamicIcon: Icon "${name}" not found in iconMap`);
    return null;
  }

  return (
    <Icon
      className={className}
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}

/**
 * Get list of available icon names
 * @returns {string[]}
 */
export function getAvailableIcons() {
  return Object.keys(iconMap);
}

export default DynamicIcon;
