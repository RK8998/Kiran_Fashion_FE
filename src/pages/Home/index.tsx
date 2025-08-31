import React, { useState } from 'react';
import { DollarSign, TrendingUp, Package } from 'lucide-react';
import { RangeValue } from '@heroui/react';
import { DateRangePicker } from '@heroui/date-picker';
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { AnimatedPage } from '@/components/AnimatedPage';
import { getDashboardDataService } from '@/services/dashboard';

const convertDateIntoYYYYMMDD = (dateValue: any) => {
  if (!dateValue) return '';

  const jsDate = dateValue.toDate(getLocalTimeZone());
  const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(jsDate.getDate()).padStart(2, '0');
  const year = jsDate.getFullYear();

  return `${year}-${month}-${day}`;
};

const Home: React.FC = () => {
  // const [selectedDate, setSelectedDate] = useState<CalendarDate | null>(today(getLocalTimeZone()));
  const [selectedRange, setSelectedRange] = useState<RangeValue<CalendarDate> | null>({
    start: today(getLocalTimeZone()), // default start = today
    end: today(getLocalTimeZone()), // default end = today
  });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', 'data', { selectedRange }],
    queryFn: async () => {
      const params = {
        start_date: convertDateIntoYYYYMMDD(selectedRange?.start),
        end_date: convertDateIntoYYYYMMDD(selectedRange?.end),
      };
      const response = await getDashboardDataService(params);

      return response?.data?.data;
    },
    placeholderData: keepPreviousData,
  });

  return (
    <AnimatedPage>
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

          {/* Right section: Search + Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <DateRangePicker
              showMonthAndYearPickers
              className="w-full sm:w-64"
              selectorButtonPlacement="end"
              value={selectedRange}
              onChange={(value) => setSelectedRange(value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            key={'total_products'}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-sm border border-gray-200 bg-purple-50`}
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              {/* <p className="text-lg font-semibold">{salesList?.totalProducts || 0}</p> */}
              <p className="text-lg font-semibold">{dashboardData?.counts?.totalProducts || 0}</p>
            </div>
          </div>
          <div
            key={'total_sale'}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-sm border border-gray-200 bg-blue-50`}
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sale</p>
              {/* <p className="text-lg font-semibold">₹ {salesList?.totalSales || 0}</p> */}
              <p className="text-lg font-semibold">₹ {dashboardData?.counts?.totalSales || 0}</p>
            </div>
          </div>
          <div
            key={'total_profit'}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-sm border border-gray-200 bg-green-50`}
          >
            <div className="p-2 bg-white rounded-full shadow-sm">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Profit</p>
              {/* <p className="text-lg font-semibold">₹ {salesList?.totalProfit || 0}</p> */}
              <p className="text-lg font-semibold">₹ {dashboardData?.counts?.totalProfit || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Home;
