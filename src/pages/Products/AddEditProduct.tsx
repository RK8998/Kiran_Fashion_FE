import React, { useEffect } from 'react';
import { Input, Textarea, Card } from '@heroui/react'; // adjust imports if needed
import { useNavigate, useParams } from 'react-router-dom';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';
import { ProductFormTypes } from '@/constants/formTypes';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createProductsService,
  getProductByIdService,
  updateProductsService,
} from '@/services/products';
import { AxiosError } from 'axios';
import { AppToast, displaySuccessToast } from '@/helpers/toast';
import { mutationOnErrorHandler } from '@/helpers';
import { ArrowLeft } from 'lucide-react';

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const isEditMode = Boolean(productId);

  const onBack = () => navigate(-1);

  const { mutateAsync: onAddProduct, isPending: isPendingCreate } = useMutation({
    mutationKey: ['add-user'],
    mutationFn: async (data: ProductFormTypes) => {
      const response = await createProductsService(data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      navigate('/products');
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const { mutateAsync: onUpdateProduct, isPending: isPendingUpdate } = useMutation({
    mutationKey: ['update-user'],
    mutationFn: async (data: ProductFormTypes) => {
      if (!productId) throw new Error('userId is undefined');

      const response = await updateProductsService(productId, data);

      return response?.data;
    },
    onSuccess: (response) => {
      displaySuccessToast(response?.message);
      navigate('/users');
    },
    onError: (error) => {
      mutationOnErrorHandler({ error: error as AxiosError });
    },
  });

  const onSubmit = async (data: ProductFormTypes) => {
    if (!isEditMode) {
      AppToast(onAddProduct(data), 'Product adding in progress');
    } else {
      AppToast(onUpdateProduct(data), 'Product update in progress');
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductFormTypes>({
    defaultValues: {
      name: '',
      remark: '',
    },
  });

  const { data: userData } = useQuery({
    queryKey: ['user', 'data', productId],
    queryFn: async () => {
      if (!productId) throw new Error('user is undefined');
      const params = {};
      const response = await getProductByIdService(productId, params);

      return response?.data?.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (userData) {
      const { name, remark } = userData;

      reset({
        name,
        remark,
      });
    }
  }, [userData]);

  return (
    <AnimatedPage>
      <div className="min-w-full mx-auto p-4">
        <Card className="p-6 shadow-lg rounded-2xl">
          <div className="flex gap-2 justify-start items-center mb-6">
            <ArrowLeft className="cursor-pointer" onClick={onBack} />

            <h2 className="text-2xl font-semibold text-gray-800">
              {isEditMode ? 'Edit' : 'Create'} Product
            </h2>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Name
              </label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    errorMessage={errors.name && errors.name.message}
                    id="name"
                    isInvalid={!!errors.name}
                    placeholder="Enter name"
                    radius="lg"
                    type="text"
                  />
                )}
                rules={{ required: 'Name is required' }}
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
                  <Input
                    {...field}
                    errorMessage={errors.remark && errors.remark.message}
                    id="email"
                    isInvalid={!!errors.remark}
                    placeholder="Enter remark"
                    radius="lg"
                    type="text"
                  />
                )}
                rules={{
                  required: 'Remark is required',
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="text-right flex gap-2 justify-end">
              <AppButton color="secondary" title="Back" type="button" onClick={onBack} />
              <AppButton
                color="primary"
                title={isEditMode ? 'Update' : 'Save Product'}
                type="submit"
              />
            </div>
          </form>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default AddEditProduct;
