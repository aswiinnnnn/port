import type { LucideIcon } from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'live-map'
  | 'vessels'
  | 'communications'
  | 'analytics'
  | 'resources';

export interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SystemStatus {
  aiOnline: string; // e.g. "7/7"
  portStatus: 'Good' | 'Warning' | 'Critical';
  activeVessels: number;
}

export interface WeatherStats {
  windSpeed: string; // e.g. "SW 14 kt"
  visibility: string; // e.g. "12 NM vis"
  temperature: string; // e.g. "24°C"
  status: string; // e.g. "Port: Good"
}
