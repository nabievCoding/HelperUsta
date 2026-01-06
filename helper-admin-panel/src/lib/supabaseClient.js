// src/lib/supabaseClient.js
import { supabase, isSupabaseConfigured, safeSupabaseQuery } from './supabase';

/**
 * Generic function to get data from Supabase
 */
export const getSupabaseData = async (tableName, options = {}) => {
  // Return empty array if Supabase not configured
  if (!supabase) {
    console.warn(`⚠️ Supabase not configured for ${tableName}`);
    return [];
  }

  return safeSupabaseQuery(async () => {
    let query = supabase.from(tableName).select('*');

    // Apply filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    // Apply sorting
    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending || false,
      });
    } else if (options.orderBy !== false) {
      // Default sort by created_at if exists
      try {
        const { data: sample } = await supabase
          .from(tableName)
          .select('created_at')
          .limit(1);
        
        if (sample && sample.length > 0 && sample[0].created_at) {
          query = query.order('created_at', { ascending: false });
        }
      } catch (e) {
        // Ignore sorting if error
      }
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`❌ Error fetching ${tableName}:`, error);
      throw error;
    }

    console.log(`✅ ${tableName}: ${data?.length || 0} records`);
    return data || [];
  }, []);
};

/**
 * Get data with count
 */
export const getSupabaseDataWithCount = async (tableName, options = {}) => {
  if (!supabase) {
    return { data: [], count: 0, error: 'Supabase not configured' };
  }

  try {
    let query = supabase.from(tableName).select('*', { count: 'exact' });

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return { data: data || [], count: count || 0, error: null };
  } catch (error) {
    console.error(`Error fetching ${tableName} with count:`, error);
    return { data: [], count: 0, error };
  }
};

/**
 * Dashboard Stats
 */
export const getDashboardStatsFromSupabase = async () => {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured for dashboard stats');
    return null;
  }

  try {
    // Execute all queries in parallel
    const [
      usersRes,
      mastersRes,
      ordersRes,
      paymentsRes,
      categoriesRes
    ] = await Promise.all([
      supabase.from('users').select('id'),
      supabase.from('masters').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('payments').select('*').eq('status', 'completed'),
      supabase.from('categories').select('*')
    ]);

    // Check for errors
    const errors = [usersRes.error, mastersRes.error, ordersRes.error, paymentsRes.error, categoriesRes.error]
      .filter(error => error);
    
    if (errors.length > 0) {
      console.error('Errors fetching dashboard stats:', errors);
      throw new Error('Failed to fetch dashboard data');
    }

    const users = usersRes.data || [];
    const masters = mastersRes.data || [];
    const orders = ordersRes.data || [];
    const payments = paymentsRes.data || [];
    const categories = categoriesRes.data || [];

    // Calculate stats
    const totalUsers = users.length;
    const totalMasters = masters.length;
    const totalOrders = orders.length;
    
    const activeOrders = orders.filter(o => 
      ['new', 'accepted', 'in_progress'].includes(o.status)
    ).length;
    
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    
    const totalRevenue = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const totalCommission = payments.reduce((sum, p) => sum + (parseFloat(p.commission) || 0), 0);
    
    // Monthly revenue (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyPayments = payments.filter(p => {
      const date = new Date(p.created_at || p.completed_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const monthlyCommission = monthlyPayments.reduce((sum, p) => sum + (parseFloat(p.commission) || 0), 0);
    
    // Today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayPayments = payments.filter(p => {
      const date = new Date(p.created_at || p.completed_at);
      return date >= today && date < tomorrow;
    });
    
    const todayRevenue = todayPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    
    // Master stats
    const activeMasters = masters.filter(m => m.status === 'active' && m.is_available).length;
    const verifiedMasters = masters.filter(m => m.is_verified).length;
    const proMasters = masters.filter(m => m.is_pro).length;
    
    const avgMasterRating = masters.length > 0 
      ? parseFloat((masters.reduce((sum, m) => sum + (parseFloat(m.rating) || 0), 0) / masters.length).toFixed(1))
      : 0;
    
    const avgOrderValue = totalOrders > 0 ? Math.floor(totalRevenue / totalOrders) : 0;

    return {
      totalUsers,
      totalMasters,
      totalClients: totalUsers,
      totalOrders,
      activeOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      monthlyRevenue,
      todayRevenue,
      totalCommission,
      monthlyCommission,
      avgOrderValue,
      activeMasters,
      verifiedMasters,
      proMasters,
      avgMasterRating,
      categories,
      ordersChange: '+0%',
      revenueChange: '+0%',
      usersChange: '+0%',
      mastersChange: '+0%',
    };

  } catch (error) {
    console.error('❌ Error in getDashboardStatsFromSupabase:', error);
    return null;
  }
};

/**
 * Get Monthly Chart Data
 */
export const getMonthlyChartDataFromSupabase = async (months = 6) => {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured for chart data');
    return [];
  }

  try {
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'completed');

    if (error) throw error;

    const completedPayments = payments || [];
    const monthlyData = [];
    const monthNames = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthPayments = completedPayments.filter(p => {
        const paymentDate = new Date(p.created_at || p.completed_at);
        return paymentDate.getMonth() === month && paymentDate.getFullYear() === year;
      });
      
      const revenue = monthPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
      const commission = monthPayments.reduce((sum, p) => sum + (parseFloat(p.commission) || 0), 0);
      
      monthlyData.push({
        month: monthNames[month],
        revenue,
        commission,
        orders: monthPayments.length,
        avgOrderValue: monthPayments.length > 0 ? Math.floor(revenue / monthPayments.length) : 0,
      });
    }
    
    return monthlyData;
  } catch (error) {
    console.error('Error in getMonthlyChartDataFromSupabase:', error);
    return [];
  }
};

/**
 * Get Recent Activity
 */
export const getRecentActivityFromSupabase = async (limit = 10) => {
  if (!supabase) {
    console.warn('⚠️ Supabase not configured for recent activity');
    return [];
  }

  try {
    const activities = [];
    
    // Get recent orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (!ordersError && orders) {
      orders.forEach(order => {
        activities.push({
          id: `order-${order.id}`,
          type: 'order',
          message: `Yangi buyurtma: ${order.service_name || 'Nomalum xizmat'}`,
          timestamp: new Date(order.created_at).toLocaleString('uz-UZ', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          icon: '🛠️',
          color: 'blue',
        });
      });
    }
    
    // Get recent completed payments
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(3);
    
    if (!paymentsError && payments) {
      payments.forEach(payment => {
        activities.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          message: `${parseFloat(payment.amount || 0).toLocaleString()} so'm to'lov amalga oshirildi`,
          timestamp: new Date(payment.completed_at || payment.created_at).toLocaleString('uz-UZ', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          icon: '💰',
          color: 'green',
        });
      });
    }
    
    // Get recent reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(2);
    
    if (!reviewsError && reviews) {
      reviews.forEach(review => {
        activities.push({
          id: `review-${review.id}`,
          type: 'review',
          message: `Yangi baho: ${review.rating || 0} yulduz`,
          timestamp: new Date(review.created_at).toLocaleString('uz-UZ', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          icon: '⭐',
          color: 'yellow',
        });
      });
    }
    
    // Sort by timestamp and limit
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

  } catch (error) {
    console.error('Error in getRecentActivityFromSupabase:', error);
    return [];
  }
};

// Export all functions
export default {
  getSupabaseData,
  getSupabaseDataWithCount,
  getDashboardStatsFromSupabase,
  getMonthlyChartDataFromSupabase,
  getRecentActivityFromSupabase,
  isSupabaseConfigured,
};