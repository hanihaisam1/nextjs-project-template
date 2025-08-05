'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Visit, 
  Order, 
  Attendance, 
  Goal, 
  Representative, 
  DashboardMetrics, 
  PerformanceMetrics, 
  SalesAnalytics, 
  HRReport,
  FilterOptions, 
  SortOptions, 
  PaginationOptions 
} from '@/types/crm';
import { crmStorage } from '@/lib/storage';

// Custom hook for CRM data management
export const useCRMData = () => {
  const [currentUser, setCurrentUser] = useState<Representative | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    try {
      crmStorage.initializeSampleData();
      const user = crmStorage.getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
    } catch (err) {
      setError('Failed to initialize CRM data');
      setLoading(false);
    }
  }, []);

  // Visit operations
  const visitOperations = {
    getAll: useCallback((filters?: FilterOptions, sort?: SortOptions, pagination?: PaginationOptions) => {
      try {
        return crmStorage.getVisits(filters, sort, pagination);
      } catch (err) {
        setError('Failed to fetch visits');
        return [];
      }
    }, []),

    getById: useCallback((id: string) => {
      try {
        return crmStorage.getVisitById(id);
      } catch (err) {
        setError('Failed to fetch visit');
        return null;
      }
    }, []),

    create: useCallback((visitData: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newVisit = crmStorage.createVisit(visitData);
        return { success: true, data: newVisit };
      } catch (err) {
        setError('Failed to create visit');
        return { success: false, error: 'Failed to create visit' };
      }
    }, []),

    update: useCallback((id: string, updateData: Partial<Visit>) => {
      try {
        const updatedVisit = crmStorage.updateVisit(id, updateData);
        if (updatedVisit) {
          return { success: true, data: updatedVisit };
        }
        return { success: false, error: 'Visit not found' };
      } catch (err) {
        setError('Failed to update visit');
        return { success: false, error: 'Failed to update visit' };
      }
    }, []),

    delete: useCallback((id: string) => {
      try {
        const success = crmStorage.deleteVisit(id);
        return { success };
      } catch (err) {
        setError('Failed to delete visit');
        return { success: false };
      }
    }, [])
  };

  // Order operations
  const orderOperations = {
    getAll: useCallback((filters?: FilterOptions, sort?: SortOptions, pagination?: PaginationOptions) => {
      try {
        return crmStorage.getOrders(filters, sort, pagination);
      } catch (err) {
        setError('Failed to fetch orders');
        return [];
      }
    }, []),

    getById: useCallback((id: string) => {
      try {
        return crmStorage.getOrderById(id);
      } catch (err) {
        setError('Failed to fetch order');
        return null;
      }
    }, []),

    create: useCallback((orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newOrder = crmStorage.createOrder(orderData);
        return { success: true, data: newOrder };
      } catch (err) {
        setError('Failed to create order');
        return { success: false, error: 'Failed to create order' };
      }
    }, []),

    update: useCallback((id: string, updateData: Partial<Order>) => {
      try {
        const updatedOrder = crmStorage.updateOrder(id, updateData);
        if (updatedOrder) {
          return { success: true, data: updatedOrder };
        }
        return { success: false, error: 'Order not found' };
      } catch (err) {
        setError('Failed to update order');
        return { success: false, error: 'Failed to update order' };
      }
    }, []),

    delete: useCallback((id: string) => {
      try {
        const success = crmStorage.deleteOrder(id);
        return { success };
      } catch (err) {
        setError('Failed to delete order');
        return { success: false };
      }
    }, [])
  };

  // Attendance operations
  const attendanceOperations = {
    getAll: useCallback((filters?: FilterOptions, sort?: SortOptions, pagination?: PaginationOptions) => {
      try {
        return crmStorage.getAttendance(filters, sort, pagination);
      } catch (err) {
        setError('Failed to fetch attendance');
        return [];
      }
    }, []),

    getByDate: useCallback((date: string, representativeId: string) => {
      try {
        return crmStorage.getAttendanceByDate(date, representativeId);
      } catch (err) {
        setError('Failed to fetch attendance for date');
        return null;
      }
    }, []),

    checkIn: useCallback((representativeId: string, notes?: string) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const existingAttendance = crmStorage.getAttendanceByDate(today, representativeId);
        
        if (existingAttendance) {
          return { success: false, error: 'Already checked in today' };
        }

        const attendanceData = {
          date: today,
          checkIn: new Date().toISOString(),
          status: 'Present' as const,
          representativeId,
          notes
        };

        const newAttendance = crmStorage.createAttendance(attendanceData);
        return { success: true, data: newAttendance };
      } catch (err) {
        setError('Failed to check in');
        return { success: false, error: 'Failed to check in' };
      }
    }, []),

    checkOut: useCallback((representativeId: string) => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const existingAttendance = crmStorage.getAttendanceByDate(today, representativeId);
        
        if (!existingAttendance) {
          return { success: false, error: 'No check-in record found for today' };
        }

        if (existingAttendance.checkOut) {
          return { success: false, error: 'Already checked out today' };
        }

        const checkOutTime = new Date().toISOString();
        const checkInTime = new Date(existingAttendance.checkIn);
        const workingHours = (new Date(checkOutTime).getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

        const updatedAttendance = crmStorage.updateAttendance(existingAttendance.id, {
          checkOut: checkOutTime,
          workingHours: Math.round(workingHours * 100) / 100
        });

        return { success: true, data: updatedAttendance };
      } catch (err) {
        setError('Failed to check out');
        return { success: false, error: 'Failed to check out' };
      }
    }, [])
  };

  // Goal operations
  const goalOperations = {
    getAll: useCallback((filters?: FilterOptions, sort?: SortOptions, pagination?: PaginationOptions) => {
      try {
        return crmStorage.getGoals(filters, sort, pagination);
      } catch (err) {
        setError('Failed to fetch goals');
        return [];
      }
    }, []),

    create: useCallback((goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newGoal = crmStorage.createGoal(goalData);
        return { success: true, data: newGoal };
      } catch (err) {
        setError('Failed to create goal');
        return { success: false, error: 'Failed to create goal' };
      }
    }, []),

    update: useCallback((id: string, updateData: Partial<Goal>) => {
      try {
        const updatedGoal = crmStorage.updateGoal(id, updateData);
        if (updatedGoal) {
          return { success: true, data: updatedGoal };
        }
        return { success: false, error: 'Goal not found' };
      } catch (err) {
        setError('Failed to update goal');
        return { success: false, error: 'Failed to update goal' };
      }
    }, [])
  };

  // Analytics and metrics
  const getDashboardMetrics = useCallback((): DashboardMetrics => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      // Get current month data
      const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
      
      // Get previous month data
      const previousMonthStart = new Date(previousYear, previousMonth, 1).toISOString().split('T')[0];
      const previousMonthEnd = new Date(previousYear, previousMonth + 1, 0).toISOString().split('T')[0];

      const currentVisits = crmStorage.getVisits({
        dateFrom: currentMonthStart,
        dateTo: currentMonthEnd,
        representativeId: currentUser?.id
      });

      const previousVisits = crmStorage.getVisits({
        dateFrom: previousMonthStart,
        dateTo: previousMonthEnd,
        representativeId: currentUser?.id
      });

      const currentOrders = crmStorage.getOrders({
        dateFrom: currentMonthStart,
        dateTo: currentMonthEnd,
        representativeId: currentUser?.id
      });

      const previousOrders = crmStorage.getOrders({
        dateFrom: previousMonthStart,
        dateTo: previousMonthEnd,
        representativeId: currentUser?.id
      });

      // Calculate percentage changes
      const visitChange = previousVisits.length > 0 
        ? ((currentVisits.length - previousVisits.length) / previousVisits.length) * 100 
        : 0;

      const orderChange = previousOrders.length > 0 
        ? ((currentOrders.length - previousOrders.length) / previousOrders.length) * 100 
        : 0;

      // Get planned visits for next week
      const nextWeekStart = new Date();
      nextWeekStart.setDate(nextWeekStart.getDate() + 7);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);

      const plannedVisits = crmStorage.getVisits({
        dateFrom: nextWeekStart.toISOString().split('T')[0],
        dateTo: nextWeekEnd.toISOString().split('T')[0],
        status: 'Planned',
        representativeId: currentUser?.id
      });

      // Calculate completion rates
      const completedVisits = currentVisits.filter(v => v.status === 'Completed').length;
      const completedOrders = currentOrders.filter(o => o.status === 'Completed').length;

      const visitCompletionRate = currentVisits.length > 0 
        ? (completedVisits / currentVisits.length) * 100 
        : 0;

      const orderCompletionRate = currentOrders.length > 0 
        ? (completedOrders / currentOrders.length) * 100 
        : 0;

      // Get attendance data
      const attendanceRecords = crmStorage.getAttendance({
        dateFrom: currentMonthStart,
        dateTo: currentMonthEnd,
        representativeId: currentUser?.id
      });

      const presentDays = attendanceRecords.filter(a => a.status === 'Present').length;
      const totalWorkingDays = new Date(currentYear, currentMonth + 1, 0).getDate();
      const attendanceRate = totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0;

      return {
        totalVisits: {
          current: currentVisits.length,
          previous: previousVisits.length,
          percentageChange: Math.round(visitChange * 100) / 100
        },
        plannedVisits: {
          thisWeek: currentVisits.filter(v => v.status === 'Planned').length,
          nextWeek: plannedVisits.length
        },
        orders: {
          current: currentOrders.length,
          previous: previousOrders.length,
          percentageChange: Math.round(orderChange * 100) / 100,
          totalRevenue: currentOrders.reduce((sum, order) => sum + order.totalAmount, 0)
        },
        completionRate: {
          visits: Math.round(visitCompletionRate * 100) / 100,
          orders: Math.round(orderCompletionRate * 100) / 100,
          goals: 85 // This would be calculated from actual goals
        },
        attendance: {
          thisMonth: Math.round(attendanceRate * 100) / 100,
          daysPresent: presentDays,
          totalWorkingDays
        }
      };
    } catch (err) {
      setError('Failed to calculate dashboard metrics');
      return {
        totalVisits: { current: 0, previous: 0, percentageChange: 0 },
        plannedVisits: { thisWeek: 0, nextWeek: 0 },
        orders: { current: 0, previous: 0, percentageChange: 0, totalRevenue: 0 },
        completionRate: { visits: 0, orders: 0, goals: 0 },
        attendance: { thisMonth: 0, daysPresent: 0, totalWorkingDays: 0 }
      };
    }
  }, [currentUser]);

  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const monthEnd = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

      const visits = crmStorage.getVisits({
        dateFrom: monthStart,
        dateTo: monthEnd,
        representativeId: currentUser?.id
      });

      const orders = crmStorage.getOrders({
        dateFrom: monthStart,
        dateTo: monthEnd,
        representativeId: currentUser?.id
      });

      const visitToOrderConversion = visits.length > 0 
        ? (orders.length / visits.length) * 100 
        : 0;

      const averageOrderValue = orders.length > 0 
        ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length 
        : 0;

      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

      return {
        visitToOrderConversion: Math.round(visitToOrderConversion * 100) / 100,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        monthlyTarget: 50000, // This would come from goals
        monthlyAchieved: totalRevenue,
        weeklyTarget: 12500,
        weeklyAchieved: totalRevenue / 4, // Rough weekly average
        territoryRanking: 3,
        customerSatisfaction: 4.2
      };
    } catch (err) {
      setError('Failed to calculate performance metrics');
      return {
        visitToOrderConversion: 0,
        averageOrderValue: 0,
        monthlyTarget: 0,
        monthlyAchieved: 0,
        weeklyTarget: 0,
        weeklyAchieved: 0,
        territoryRanking: 0,
        customerSatisfaction: 0
      };
    }
  }, [currentUser]);

  // Data management utilities
  const dataOperations = {
    export: useCallback(() => {
      try {
        return crmStorage.exportData();
      } catch (err) {
        setError('Failed to export data');
        return '';
      }
    }, []),

    import: useCallback((jsonData: string) => {
      try {
        const success = crmStorage.importData(jsonData);
        if (success) {
          // Refresh current user data
          const user = crmStorage.getCurrentUser();
          setCurrentUser(user);
        }
        return success;
      } catch (err) {
        setError('Failed to import data');
        return false;
      }
    }, []),

    clearAll: useCallback(() => {
      try {
        crmStorage.clearAllData();
        setCurrentUser(null);
        return true;
      } catch (err) {
        setError('Failed to clear data');
        return false;
      }
    }, [])
  };

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    currentUser,
    loading,
    error,
    
    // Operations
    visits: visitOperations,
    orders: orderOperations,
    attendance: attendanceOperations,
    goals: goalOperations,
    
    // Analytics
    getDashboardMetrics,
    getPerformanceMetrics,
    
    // Data management
    data: dataOperations,
    
    // Utilities
    clearError
  };
};

export default useCRMData;
