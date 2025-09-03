import React, { useEffect, useMemo, useState } from 'react';
import { Input, Card, Textarea } from '@heroui/react'; // adjust imports if needed
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { SalesFormTypes } from '@/constants/formTypes';
import { getProductsListService } from '@/services/products';
import { AppToast, displaySuccessToast } from '@/helpers/toast';
import { mutationOnErrorHandler } from '@/helpers';
import { createSalesService, getSalesByIdService, updateSalesService } from '@/services/sales';

const ACTIONS = {
  save: 'save',
  save_and_add_another: 'save_and_add_another',
};

const AddEditSales: React.FC = () => {
  const navigate = useNavigate();
  const { id: salesId } = useParams();
  const [action, setAction] = useState<null | string>(null);

  const isEditMode = Boolean(salesId);

  const onBack = () => navigate(-1);

  const { mutateAsync: onAddProduct, isPending: isPendingCreate } = useMutation({
    mutationKey: ['add-user'],
    mutationFn: async (data: SalesFormTypes) => {
      const response = await createSalesService(data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      if (action === ACTIONS.save_and_add_another) {
        reset();
      } else {
        navigate('/sales');
      }
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const { mutateAsync: onUpdateProduct, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['update-sales'],
    mutationFn: async (data: SalesFormTypes) => {
      if (!salesId) throw new Error('salesId is undefined');

      const response = await updateSalesService(salesId, data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      navigate('/sales');
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const onSubmit = async (data: SalesFormTypes) => {
    if (!isEditMode) {
      const payload = {
        product_id: data.product_id,
        base_amount: +data.base_amount,
        sell_amount: +data.sell_amount,
        discount: +data.discount,
        remark: data.remark,
      };

      AppToast(onAddProduct(payload), 'Product adding in progress');
    } else {
      AppToast(onUpdateProduct(data), 'Product update in progress');
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SalesFormTypes>({
    defaultValues: {
      product_id: null,
      base_amount: 0,
      sell_amount: 0,
      discount: 0,
      remark: '',
    },
  });

  const baseAmount = watch('base_amount'); // watch base_amount value

  const { data: productsList } = useQuery({
    queryKey: ['products', 'list'],
    queryFn: async () => {
      const response = await getProductsListService({});

      return response?.data?.data;
    },
  });

  const productOptions = useMemo(() => {
    if (productsList) {
      return productsList?.results?.map((product: any) => ({
        key: product._id,
        label: product.name,
      }));
    }

    return [];
  }, [productsList]);

  const { data: salesData } = useQuery({
    queryKey: ['sales', 'data', salesId],
    queryFn: async () => {
      if (!salesId) throw new Error('Sales is undefined');
      const params = {};
      const response = await getSalesByIdService(salesId, params);

      return response?.data?.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (salesData) {
      const { base_amount, sell_amount, remark, product_id } = salesData;

      reset({
        product_id: product_id?._id?.toString() ?? '', // ensure string
        base_amount,
        sell_amount,
        remark,
      });
    }
  }, [salesData]);

  const onChangeProducts = (productId: string) => {
    const selectedProduct = productsList?.results?.find((item: any) => item?._id === productId);

    setValue('base_amount', selectedProduct?.base_amount);
    setValue('sell_amount', selectedProduct?.sell_amount);
  };

  return (
    <AnimatedPage>
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-sm rounded-2xl">
          <div className="flex gap-2 justify-start items-center mb-6">
            <ArrowLeft className="cursor-pointer" onClick={onBack} />

            <h2 className="text-2xl font-semibold text-gray-800">
              {isEditMode ? 'Edit' : 'Create'} Sales
            </h2>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div>
              {/* <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Product
              </label> */}
              {/* <Controller
                control={control}
                name="product_id"
                render={({ field }) => (
                  <Select
                    {...field}
                    errorMessage={errors.product_id && errors.product_id.message}
                    id="product_id"
                    isInvalid={!!errors.product_id}
                    isLoading={isLoadingProducts}
                    name="product_id"
                    placeholder="Select product"
                    radius="lg"
                    selectedKeys={field.value ? [field.value] : []} // match key as string
                    onChange={(e) => {
                      field.onChange(e);
                      onChangeProducts(e.target.value);
                    }}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;

                      field.onChange(selected);
                    }}
                  >
                    {productOptions.map((item: { key: string; label: string }) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                  </Select>
                )}
                rules={{ required: 'Product is required' }}
              /> */}

              <Controller
                control={control}
                name="product_id"
                render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {productOptions.map((item: { key: string; label: string }) => {
                      const isSelected = field.value === item.key;

                      return (
                        <button
                          key={item.key}
                          className={[
                            'cursor-pointer rounded-xl border-2 p-4 text-center transition-all duration-200',
                            'hover:shadow-sm hover:border-blue-400',
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 bg-white',
                          ].join(' ')}
                          type="button"
                          onClick={() => {
                            field.onChange(item.key);
                            onChangeProducts(item.key);
                          }}
                        >
                          <p
                            className={[
                              'font-medium text-sm md:text-lg',
                              isSelected ? 'text-blue-600' : 'text-gray-700',
                            ].join(' ')}
                          >
                            {item.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
                rules={{ required: 'Product is required' }}
              />
              {errors.product_id?.message && (
                <p className="text-red-500 text-sm mt-2">{String(errors.product_id.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Base Amount
              </label>
              <Controller
                control={control}
                name="base_amount"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.base_amount && errors.base_amount.message}
                    id="base_amount"
                    isInvalid={!!errors.base_amount}
                    placeholder="Enter base amount"
                    radius="lg"
                    type="number"
                    value={field.value?.toString() ?? ''} // Convert number → string
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
                rules={{
                  required: 'Base Amount is required',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Sell Amount
              </label>
              <Controller
                control={control}
                name="sell_amount"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.sell_amount && errors.sell_amount.message}
                    id="sell_amount"
                    isInvalid={!!errors.sell_amount}
                    placeholder="Enter sell amount"
                    radius="lg"
                    type="number"
                    value={field.value?.toString() ?? ''} // Convert number → string
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
                rules={{
                  required: 'Sell Amount is required',
                  validate: (value) =>
                    value > baseAmount || 'Sell Amount should be greater than Base Amount',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Discount
              </label>
              <Controller
                control={control}
                name="discount"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.discount && errors.discount.message}
                    id="discount"
                    isInvalid={!!errors.discount}
                    placeholder="Enter discount"
                    radius="lg"
                    type="number"
                    value={field.value?.toString() ?? ''} // Convert number → string
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
                // rules={{
                //   required: 'Sell Amount is required',
                //   validate: (value) =>
                //     value > baseAmount || 'Sell Amount should be greater than Base Amount',
                // }}
              />
            </div>

            {/* Remark Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Remark
              </label>
              <Controller
                control={control}
                name="remark"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    errorMessage={errors.remark && errors.remark.message}
                    id="remark"
                    isInvalid={!!errors.remark}
                    placeholder="Enter remark"
                    radius="lg"
                    type="text"
                  />
                )}
                // rules={{
                //   required: 'Remark is required',
                // }}
              />
            </div>

            {/* Submit Button */}
            <div className="text-right flex gap-2 justify-end">
              {/* <AppButton color="secondary" title="Back" type="button" onClick={onBack} /> */}
              {/* {!isEditMode && (
                <AppButton
                  color="success"
                  isLoading={isPendingCreate || isPendingUpdate}
                  title={'Save And Add Another'}
                  type="submit"
                  onClick={() => {
                    setAction(ACTIONS.save_and_add_another);
                    // handleSubmit(onSubmit)();
                  }}
                />
              )} */}
              <AppButton
                className="w-full sm:w-auto"
                color="primary"
                isLoading={isPendingCreate || isPendingUpdate}
                title={isEditMode ? 'Update' : 'Save Sale'}
                type="submit"
                onClick={() => {
                  setAction(ACTIONS.save);
                  handleSubmit(onSubmit)();
                }}
              />
            </div>
          </form>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default AddEditSales;
