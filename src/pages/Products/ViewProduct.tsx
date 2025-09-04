import React from 'react';
import { Card } from '@heroui/react'; // adjust imports if needed
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { getProductByIdService } from '@/services/products';

const ViewProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id: productsId } = useParams();

  const onBack = () => navigate(-1);

  const { data: productsData } = useQuery({
    queryKey: ['product', 'data', productsId],
    queryFn: async () => {
      if (!productsId) throw new Error('productId is undefined');
      const params = {};
      const response = await getProductByIdService(productsId, params);

      return response?.data?.data;
    },
    enabled: Boolean(productsId),
  });

  const getProfit = (base: number, sell: number) => {
    const calculation = sell - base;

    return calculation > 0 ? `${calculation} Profit` : `${calculation} Loss`;
  };

  return (
    <AnimatedPage>
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-sm rounded-2xl">
          <div className="flex gap-2 justify-start items-center mb-6">
            {/* <ArrowLeft className="cursor-pointer" onClick={onBack} /> */}

            {/* <h2 className="text-2xl font-semibold text-gray-800">View Product</h2> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <div className="text-lg text-gray-800 mt-1">{productsData?.name || '-'}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Remark</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {productsData?.remark || '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Purchase Amount</p>
              <div className="text-lg text-gray-800 mt-1">{productsData?.base_amount || 0}</div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Sell Amount</p>
              <div className="text-lg text-gray-800 mt-1 whitespace-pre-wrap">
                {productsData?.sell_amount || '-'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Earnings Per Item</p>
              <div className="text-lg text-gray-800 mt-1">
                {getProfit(productsData?.base_amount, productsData?.sell_amount)}
              </div>
            </div>
          </div>

          <div className="text-right flex gap-2 justify-end">
            <AppButton color="secondary" title="Back" type="button" onClick={onBack} />
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default ViewProduct;
