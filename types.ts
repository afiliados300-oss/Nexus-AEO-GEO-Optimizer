export interface AnalysisResult {
  id: string;
  userId: string; // Link to the user who created it
  userName?: string; // Denormalized for admin view
  date: string;
  title: string;
  originalContentPreview: string;
  fullResponse: string;
  seoScore: number;
  aeoScore: number;
  geoScore: number;
}

export interface User {
  email: string;
  name: string;
  role: 'admin' | 'editor';
  password?: string; // Stored in mock DB
  createdAt?: string;
}

export type ViewState = 'dashboard' | 'optimizer' | 'history' | 'settings' | 'admin';

export interface DashboardStats {
  totalOptimized: number;
  avgSeoScore: number;
  trafficIncrease: number;
}