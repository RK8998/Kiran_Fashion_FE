import React from 'react';
import { Card } from '@heroui/react'; // adjust imports if needed
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { getSalesByIdService } from '@/services/sales';

const ViewSales: React.FC = () => {
  const navigate = useNavigate();
  const { id: salesId } = useParams();

  const onBack = () => navigate(-1);

  const { data: salesData } = useQuery({
    queryKey: ['sales', 'data', salesId],
    queryFn: async () => {
      if (!salesId) throw new Error('salesId is undefined');
      const params = {};
      const response = await getSalesByIdService(salesId, params);

      return response?.data?.data;
    },
    enabled: Boolean(salesId),
  });

  return (
    <AnimatedPage>
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-sm rounded-2xl">
          <div className="flex gap-2 justify-start items-center mb-6">
            {/* <ArrowLeft className="cursor-pointer" onClick={onBack} /> */}

            {/* <h2 className="text-2xl font-semibold text-gray-800">View Sales</h2> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Product</p>
              <div className="text-lg text-gray-800 mt-1">{salesData?.product_id?.name || '-'}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Sale by</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {salesData?.user_id?.name || '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Base Amount</p>
              <div className="text-lg text-gray-800 mt-1">₹{salesData?.base_amount || '-'}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Sell Amount</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                ₹{salesData?.sell_amount}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Discount</p>
              <div className="text-lg text-gray-800 mt-1">₹{salesData?.discount || '-'}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Profit</p>
              <div className="text-lg text-gray-800 mt-1">₹{salesData?.profit || '-'}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Remark</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {salesData?.remark || '-'}
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="text-right flex gap-2 justify-end">
            <AppButton color="secondary" title="Back" type="button" onClick={onBack} />
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ViewSales;
