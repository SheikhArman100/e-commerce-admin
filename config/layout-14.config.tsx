import { MenuConfig } from "@/config/types";
import {
  ChartLine,
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
  BarChart3,
  MessageCircle,
  User,
  Settings,
  Shield,
  CreditCard,
  Heart,
  SlidersHorizontal,
  ShoppingCart,
  ShoppingBag,
  TicketPercent,
  Bell
} from "lucide-react";

export const MENU_SIDEBAR_MAIN: MenuConfig = [
  {
    heading: 'Overview',
    children: [
      {
        title: 'Overview',
        path: '/',
        icon: BarChart3
      },
      {
        title: 'Sales Analytics',
        path: '/sales-analytics',
        icon: BarChart2
      },
      {
        title: 'Product Performance',
        path: '/product-performance',
        icon: ChartLine
      },
      {
        title: 'Customer Insights',
        path: '/customer-insights',
        icon: UserRoundCog
      }
    ],
  },
  {
    heading: 'Catalog',
    children: [
      {
        title: 'Categories',
        path: '/categories',
        icon: Grid
      },
      {
        title: 'Products',
        path: '/products',
        icon: ClipboardList
      },
    ],
  },
  {
    heading: 'Variant',
    children: [
      {
        title: 'Flavors',
        path: '/flavors',
        icon: Palette
      },
      {
        title: 'Sizes',
        path: '/sizes',
        icon: SlidersHorizontal
      },
    ],
  },
  {
    heading: 'Sales',
    children: [
      {
        title: 'Orders',
        path: '/orders',
        icon: ShoppingCart
      },
      {
        title: 'Payments',
        path: '/payments',
        icon: CreditCard
      },
    ],
  },
  {
    heading: 'Marketing',
    children: [
      {
        title: 'Coupons',
        path: '/coupons',
        icon: TicketPercent
      },
      {
        title: 'Campaigns',
        path: '/campaigns',
        icon: Megaphone
      },
    ],
  },
  {
    heading: 'Engagement',
    children: [
      {
        title: 'Reviews',
        path: '/reviews',
        icon: MessageCircle
      },
      {
        title: 'Wishlists',
        path: '/wishlists',
        icon: Heart
      },
      {
        title: 'Carts',
        path: '/carts',
        icon: ShoppingBag
      },
    ],
  },
  {
    heading: 'Notifications',
    children: [
      {
        title: 'Notifications',
        path: '/notifications',
        icon: Bell
      },
    ],
  },
  {
    heading: 'User Management',
    children: [
      {
        title: 'Users',
        path: '/users',
        icon: Users
      },
    ],
  },
  // {
  //   heading: 'Your Account',
  //   children: [
  //     {
  //       title: 'Profile',
  //       path: '/account/profile',
  //       icon: User
  //     },
  //     {
  //       title: 'Preferences',
  //       path: '/account/preferences',
  //       icon: Settings
  //     },
  //     {
  //       title: 'Security',
  //       path: '/account/security',
  //       icon: Shield
  //     },
  //     {
  //       title: 'Billing',
  //       path: '/account/billing',
  //       icon: CreditCard
  //     },
  //   ],
  // },
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
