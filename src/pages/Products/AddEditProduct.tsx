import React, { useState } from 'react';
import { Input, Textarea, Card } from '@heroui/react'; // adjust imports if needed
import { useNavigate } from 'react-router-dom';

import AppButton from '@/components/AppButton';
import { AnimatedPage } from '@/components/AnimatedPage';

const AddEditProduct = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onBack = () => navigate(-1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description });
    // TODO: handle create note logic
  };

  return (
    <AnimatedPage>
      <div className="max-w-2xl mx-auto p-4">
        <Card className="p-6 shadow-lg rounded-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Product</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                Name
              </label>
              <Input
                required
                id="name"
                placeholder="Enter product name"
                radius="lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="remark">
                Remark
              </label>
              <Textarea
                required
                id="remark"
                placeholder="Write your remark here..."
                radius="lg"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="text-right flex gap-2 justify-end">
              <AppButton color="secondary" title="Back" type="button" onClick={onBack} />
              <AppButton color="primary" title="Save Product" type="submit" />
            </div>
          </form>
        </Card>
      </div>
    </AnimatedPage>
  );
};

export default AddEditProduct;
