import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import PriceInput from '@/lib/components/PriceInput';
import { DatePicker } from '@/components/date-picker';
import dayjs from '@/lib/core/dayjs';
import { useForm } from 'react-hook-form';
import { useUpdateProductSale } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { LoadingSpinnerComponent } from '@/components/loading-spinner';
import RequestStatus from '@/lib/components/RequestStatus';

interface SaleFormProps {
  productId: string;
  isFree: boolean;
  currency?: string;
  initialSalePrice?: string;
  initialSalePriceDueDate?: string;
  setNewSalePrice?: (newSalePrice: number | undefined) => void;
  setNewSalePriceDueDate?: (newSalePriceDueDate: string | undefined) => void;
}

export default function SaleForm({
  productId,
  isFree,
  currency,
  initialSalePrice,
  initialSalePriceDueDate,
  setNewSalePrice,
  setNewSalePriceDueDate,
}: SaleFormProps) {
  const [salePriceDueDate, setSalePriceDueDate] = useState<Date | undefined>(
    initialSalePriceDueDate ? new Date(initialSalePriceDueDate) : undefined,
  );

  const { mutate, isLoading, isSuccess, isError, errorDetail, validationErrors } =
    useUpdateProductSale();

  const {
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm({
    defaultValues: {
      salePrice: initialSalePrice ?? '',
    },
  });

  const onSubmit = async (data: any) => {
    await mutate(productId, {
      salePrice: isFree
        ? undefined
        : data.salePrice
          ? parseFloat(data.salePrice.replace(',', '.'))
          : undefined,
      salePriceDueDate: isFree || !salePriceDueDate ? undefined : salePriceDueDate.toISOString(),
    });
    setNewSalePrice?.(data.salePrice ? parseFloat(data.salePrice.replace(',', '.')) : undefined);
    setNewSalePriceDueDate?.(salePriceDueDate ? salePriceDueDate?.toISOString() : undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <Label htmlFor="price" className="block text-md font-semibold">
              Sale Price{currency ? ` (in ${currency})` : ''}
            </Label>
            <PriceInput
              isFree={isFree}
              handleKeyDown={handleKeyDown}
              name="salePrice"
              control={control}
              getValues={getValues}
              overrideRequired={false}
              currency={currency}
              placeholder={'Enter Sale Price'}
            />
            {errors.salePrice ? (
              <p className="text-sm text-red-500 mb-2">{errors.salePrice.message as string}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="price" className="block text-md font-semibold">
              Sale Due Date
            </Label>
            <DatePicker
              date={salePriceDueDate}
              setDate={setSalePriceDueDate}
              min={dayjs().add(1, 'days').toDate()}
              disabled={isFree}
            />
            <p className="text-secondary-foreground text-sm">
              Leave this blank if the sale price should not expire
            </p>
          </div>
        </div>
        <Button type="submit">
          {isLoading ? <LoadingSpinnerComponent size="sm" className="text-white" /> : null}
          Save Sale
        </Button>
        <RequestStatus
          isSuccess={isSuccess}
          isError={isError}
          successMessage="Sale updated successfully"
          errorMessage={
            <span>
              {errorDetail}
              {validationErrors.length > 1
                ? validationErrors.map((error, index) => (
                    <span key={index}>
                      <br />
                      {error}
                    </span>
                  ))
                : null}
            </span>
          }
        />
      </div>
    </form>
  );
}
