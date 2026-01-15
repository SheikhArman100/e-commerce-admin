import { MenuConfig } from "@/config/types";
import {
  ChartLine,
  Cog,
  UserRoundCog,
  Bolt,
  Users,
  Download,
  FileChartLine,
  SquareActivity,
  Newspaper,
  Briefcase,
  Megaphone,
  Palette,
  BarChart2,
  Handshake,
  ClipboardList,
  Grid,
  Calendar,
  BarChart3,
  Network,
  Phone,
  MessageCircle,
  User,
  Settings,
  Shield,
  CreditCard,
  Activity,
  LogIn,
  ShieldCheck,
  Monitor,
  Key,
  FileText,
  Search,
  AlertTriangle,
  File,
  Image,
  Video,
  Archive,
  Inbox,
  Send,
  Edit,
  Trash,
  UserCheck,
  Lock,
  FileCheck,
  Heart
} from "lucide-react";

export const MENU_SIDEBAR_MAIN: MenuConfig = [
  
  {
    title: 'Dashboard',
    children: [
      {
        title: 'Dashboard',
        path: '/',
        icon: BarChart3
      },
      
    ],
  },
  {
    title: 'User Management',
    children: [
      {
        title: 'User Management',
        path: '/users',
        icon: Users
      },
      
    ],
  },
  {
    title: 'Category Management',
    children: [
      {
        title: 'Categories',
        path: '/categories',
        icon: Grid
      },
    ],
  },
  {
    title: 'Variant Management',
    children: [
      {
        title: 'Flavors',
        path: '/flavors',
        icon: Palette
      },
      {
        title: 'Sizes',
        path: '/sizes',
        icon: BarChart3
      },
      
    ],
  },
  {
    title:"Product Management",
    children:[
      {
        title: 'Products',
        path: '/products',
        icon: ClipboardList
      },
    ],
  },
  {
    title: 'Review Management',
    children: [
      {
        title: 'Reviews',
        path: '/reviews',
        icon: MessageCircle
      }
    ],
  },
  {
    title: 'Wishlist Management',
    children: [
      {
        title: 'Wishlist',
        path: '/wishlists',
        icon: Heart
      }
    ],
  },
  {
    title: 'Cart Management',
    children: [
      {
        title: 'Carts',
        path: '/carts',
        icon: FileText
      }
    ],
  },
  {
    title: 'Account',
    children: [
      {
        title: 'Profile Settings',
        path: '/account/profile',
        icon: User
      },
      {
        title: 'Preferences',
        path: '/account/preferences',
        icon: Settings
      },
      {
        title: 'Security',
        path: '/account/security',
        icon: Shield
      },
      {
        title: 'Billing',
        path: '/account/billing',
        icon: CreditCard
      },
    ],
  },
];

export const MENU_SIDEBAR_RESOURCES: MenuConfig = [
  {
    title: 'Resources',
    children: [
      {
        title: 'About Metronic',
        path: '#',
        icon: Download
      },
      {
        title: 'Advertise',
        path: '#',
        icon: FileChartLine,
        badge: 'Pro'
      },
      {
        title: 'Help',
        path: '#',
        icon: SquareActivity
      },
      {
        title: 'Blog',
        path: '#',
        icon: Newspaper
      },
      {
        title: 'Careers',
        path: '#',
        icon: Briefcase
      },
      {
        title: 'Press',
        path: '#',
        icon: Megaphone
      },
    ],
  }
];

export const MENU_SIDEBAR_WORKSPACES: MenuConfig = [
  {
    title: 'Workspaces',
    children: [
      {
        title: 'Business Concepts',
        path: '#',
        icon: Briefcase
      },
      {
        title: 'KeenThemes Studio',
        path: '#',
        icon: Palette
      },
      {
        title: 'Teams',
        path: '#',
        icon: Handshake,
        badge: 'Pro'
      },
      {
        title: 'Reports',
        path: '#',
        icon: BarChart2
      },
    ],
  }
];

export const MENU_TOOLBAR: MenuConfig = [
  {
    title: 'Overview',
    path: '/',
    icon: BarChart3
  },
  {
    title: 'Analytics',
    path: '/?tab=analytics',
    icon: BarChart2
  },
  {
    title: 'AI Assistant',
    path: '/?tab=ai',
    icon: Bolt
  },
];
