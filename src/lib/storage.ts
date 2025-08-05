import { 
  Visit, 
  Order, 
  Attendance, 
  Goal, 
  Representative, 
  EntityType, 
  FilterOptions, 
  SortOptions, 
  PaginationOptions 
} from '@/types/crm';

// Storage keys
const STORAGE_KEYS = {
  visits: 'crm_visits',
  orders: 'crm_orders',
  attendance: 'crm_attendance',
  goals: 'crm_goals',
  representatives: 'crm_representatives',
  currentUser: 'crm_current_user'
} as const;

// Generic storage operations
class CRMStorage {
  private getStorageKey(entityType: EntityType): string {
    return STORAGE_KEYS[entityType];
  }

  // Generic CRUD operations
  private getAll<T>(entityType: EntityType): T[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(entityType));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${entityType} from storage:`, error);
      return [];
    }
  }

  private saveAll<T>(entityType: EntityType, data: T[]): void {
    try {
      localStorage.setItem(this.getStorageKey(entityType), JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${entityType} to storage:`, error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // Visit operations
  getVisits(filters?: FilterOptions, sort?: SortOptions, pagination?: PaginationOptions): Visit[] {
    let visits = this.getAll<Visit>('visits');

    // Apply filters
    if (filters) {
      visits = this.applyFilters(visits, filters);
    }

    // Apply sorting
    if (sort) {
      visits = this.applySorting(visits, sort);
    }

    // Apply pagination
    if (pagination) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      visits = visits.slice(startIndex, startIndex + pagination.limit);
    }

    return visits;
  }

  getVisitById(id: string): Visit | null {
    const visits = this.getAll<Visit>('visits');
    return visits.find(visit => visit.id === id) || null;
  }

  createVisit(visitData: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>): Visit {
    const visits = this.getAll<Visit>('visits');
    const newVisit: Visit = {
      ...visitData,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp()
    };
    
    visits.push(newVisit);
    this.saveAll('visits', visits);
    return newVisit;
  }

  updateVisit(id: string, updateData: Partial<Visit>): Visit | null {
    const visits = this.getAll<Visit>('visits');
    const index = visits.findIndex(visit => visit.id === id);
    
    if (index === -1) return null;
    
    visits[index] = {
      ...visits[index],
      ...updateData,
      updatedAt: this.getCurrentTimestamp()
    };
    
    this.saveAll('visits', visits);
    return visits[index];
  }

  deleteVisit(id: string): boolean {
    const visits = this.getAll<Visit>('visits');
    const filteredVisits = visits.filter(visit => visit.id !== id);
    
    if (filteredVisits.length === visits.length) return false;
    
    this.saveAll('visits', filteredVisits);
    return true;
  }

  // Order operations
  getOrders(filters?: FilterOptions, sort?: SortOptions, pagination?: PaginationOptions): Order[] {
    let orders = this.getAll<Order>('orders');

    if (filters) {
      orders = this.applyFilters(orders, filters);
    }

    if (sort) {
      orders = this.applySorting(orders, sort);
    }

    if (pagination) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      orders = orders.slice(startIndex, startIndex + pagination.limit);
    }

    return orders;
  }

  getOrderById(id: string): Order | null {
    const orders = this.getAll<Order>('orders');
    return orders.find(order => order.id === id) || null;
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getAll<Order>('orders');
    const newOrder: Order = {
      ...orderData,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp()
    };
    
    orders.push(newOrder);
    this.saveAll('orders', orders);
    return newOrder;
  }

  updateOrder(id: string, updateData: Partial<Order>): Order | null {
    const orders = this.getAll<Order>('orders');
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) return null;
    
    orders[index] = {
      ...orders[index],
      ...updateData,
      updatedAt: this.getCurrentTimestamp()
    };
    
    this.saveAll('orders', orders);
    return orders[index];
  }

  deleteOrder(id: string): boolean {
    const orders = this.getAll<Order>('orders');
    const filteredOrders = orders.filter(order => order.id !== id);
    
    if (filteredOrders.length === orders.length) return false;
    
    this.saveAll('orders', filteredOrders);
    return true;
  }

  // Attendance operations
  getAttendance(filters?: FilterOptions, sort?: SortOptions, pagination?: PaginationOptions): Attendance[] {
    let attendance = this.getAll<Attendance>('attendance');

    if (filters) {
      attendance = this.applyFilters(attendance, filters);
    }

    if (sort) {
      attendance = this.applySorting(attendance, sort);
    }

    if (pagination) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      attendance = attendance.slice(startIndex, startIndex + pagination.limit);
    }

    return attendance;
  }

  getAttendanceById(id: string): Attendance | null {
    const attendance = this.getAll<Attendance>('attendance');
    return attendance.find(record => record.id === id) || null;
  }

  getAttendanceByDate(date: string, representativeId: string): Attendance | null {
    const attendance = this.getAll<Attendance>('attendance');
    return attendance.find(record => 
      record.date === date && record.representativeId === representativeId
    ) || null;
  }

  createAttendance(attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Attendance {
    const attendance = this.getAll<Attendance>('attendance');
    const newAttendance: Attendance = {
      ...attendanceData,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp()
    };
    
    attendance.push(newAttendance);
    this.saveAll('attendance', attendance);
    return newAttendance;
  }

  updateAttendance(id: string, updateData: Partial<Attendance>): Attendance | null {
    const attendance = this.getAll<Attendance>('attendance');
    const index = attendance.findIndex(record => record.id === id);
    
    if (index === -1) return null;
    
    attendance[index] = {
      ...attendance[index],
      ...updateData,
      updatedAt: this.getCurrentTimestamp()
    };
    
    this.saveAll('attendance', attendance);
    return attendance[index];
  }

  // Goal operations
  getGoals(filters?: FilterOptions, sort?: SortOptions, pagination?: PaginationOptions): Goal[] {
    let goals = this.getAll<Goal>('goals');

    if (filters) {
      goals = this.applyFilters(goals, filters);
    }

    if (sort) {
      goals = this.applySorting(goals, sort);
    }

    if (pagination) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      goals = goals.slice(startIndex, startIndex + pagination.limit);
    }

    return goals;
  }

  createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal {
    const goals = this.getAll<Goal>('goals');
    const newGoal: Goal = {
      ...goalData,
      id: this.generateId(),
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp()
    };
    
    goals.push(newGoal);
    this.saveAll('goals', goals);
    return newGoal;
  }

  updateGoal(id: string, updateData: Partial<Goal>): Goal | null {
    const goals = this.getAll<Goal>('goals');
    const index = goals.findIndex(goal => goal.id === id);
    
    if (index === -1) return null;
    
    goals[index] = {
      ...goals[index],
      ...updateData,
      updatedAt: this.getCurrentTimestamp()
    };
    
    this.saveAll('goals', goals);
    return goals[index];
  }

  // Representative operations
  getRepresentatives(): Representative[] {
    return this.getAll<Representative>('representatives');
  }

  getCurrentUser(): Representative | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.currentUser);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error reading current user from storage:', error);
      return null;
    }
  }

  setCurrentUser(user: Representative): void {
    try {
      localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user to storage:', error);
    }
  }

  // Utility methods
  private applyFilters<T extends Record<string, any>>(data: T[], filters: FilterOptions): T[] {
    return data.filter(item => {
      if (filters.dateFrom && item.date < filters.dateFrom) return false;
      if (filters.dateTo && item.date > filters.dateTo) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.facilityType && item.facilityType !== filters.facilityType) return false;
      if (filters.customerType && item.customerType !== filters.customerType) return false;
      if (filters.representativeId && item.representativeId !== filters.representativeId) return false;
      return true;
    });
  }

  private applySorting<T extends Record<string, any>>(data: T[], sort: SortOptions): T[] {
    return [...data].sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Data management utilities
  exportData(): string {
    const allData = {
      visits: this.getAll<Visit>('visits'),
      orders: this.getAll<Order>('orders'),
      attendance: this.getAll<Attendance>('attendance'),
      goals: this.getAll<Goal>('goals'),
      representatives: this.getAll<Representative>('representatives'),
      exportDate: this.getCurrentTimestamp()
    };
    
    return JSON.stringify(allData, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.visits) this.saveAll('visits', data.visits);
      if (data.orders) this.saveAll('orders', data.orders);
      if (data.attendance) this.saveAll('attendance', data.attendance);
      if (data.goals) this.saveAll('goals', data.goals);
      if (data.representatives) this.saveAll('representatives', data.representatives);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Initialize with sample data
  initializeSampleData(): void {
    const currentUser: Representative = {
      id: 'rep_001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1-555-0123',
      territory: 'North District',
      joinDate: '2023-01-15',
      isActive: true,
      createdAt: this.getCurrentTimestamp(),
      updatedAt: this.getCurrentTimestamp()
    };

    // Only initialize if no data exists
    if (this.getRepresentatives().length === 0) {
      this.saveAll('representatives', [currentUser]);
      this.setCurrentUser(currentUser);
    }
  }
}

// Export singleton instance
export const crmStorage = new CRMStorage();
