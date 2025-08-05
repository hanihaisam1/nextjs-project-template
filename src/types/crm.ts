export interface Visit {
  id: string;
  facilityName: string;
  facilityType: 'Hospital' | 'Clinic' | 'Pharmacy' | 'Doctor Office';
  date: string;
  time: string;
  notes: string;
  status: 'Planned' | 'Completed' | 'Cancelled';
  representativeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerType: 'Hospital' | 'Clinic' | 'Pharmacy' | 'Doctor';
  products: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  date: string;
  representativeId: string;
  visitId?: string; // Link to related visit
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Half Day';
  representativeId: string;
  workingHours?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  type: 'Visits' | 'Orders' | 'Revenue';
  title: string;
  target: number;
  achieved: number;
  period: 'Weekly' | 'Monthly';
  startDate: string;
  endDate: string;
  representativeId: string;
  status: 'Active' | 'Completed' | 'Overdue';
  createdAt: string;
  updatedAt: string;
}

export interface Representative {
  id: string;
  name: string;
  email: string;
  phone: string;
  territory: string;
  joinDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalVisits: {
    current: number;
    previous: number;
    percentageChange: number;
  };
  plannedVisits: {
    thisWeek: number;
    nextWeek: number;
  };
  orders: {
    current: number;
    previous: number;
    percentageChange: number;
    totalRevenue: number;
  };
  completionRate: {
    visits: number;
    orders: number;
    goals: number;
  };
  attendance: {
    thisMonth: number;
    daysPresent: number;
    totalWorkingDays: number;
  };
}

export interface PerformanceMetrics {
  visitToOrderConversion: number;
  averageOrderValue: number;
  monthlyTarget: number;
  monthlyAchieved: number;
  weeklyTarget: number;
  weeklyAchieved: number;
  territoryRanking: number;
  customerSatisfaction: number;
}

export interface SalesAnalytics {
  salesTrend: {
    date: string;
    visits: number;
    orders: number;
    revenue: number;
  }[];
  productPerformance: {
    productName: string;
    quantity: number;
    revenue: number;
    growth: number;
  }[];
  territoryAnalysis: {
    territory: string;
    visits: number;
    orders: number;
    revenue: number;
  }[];
  customerAnalysis: {
    customerType: string;
    count: number;
    revenue: number;
    averageOrderValue: number;
  }[];
}

export interface HRReport {
  representativeId: string;
  representativeName: string;
  attendanceRate: number;
  totalWorkingDays: number;
  daysPresent: number;
  averageWorkingHours: number;
  performanceScore: number;
  goalsAchieved: number;
  totalGoals: number;
  salesAchievement: number;
  period: string;
}

// Utility types
export type EntityType = 'visits' | 'orders' | 'attendance' | 'goals' | 'representatives';

export interface FilterOptions {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  facilityType?: string;
  customerType?: string;
  representativeId?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}
