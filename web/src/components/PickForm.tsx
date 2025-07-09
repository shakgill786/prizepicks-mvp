// web/src/components/PickForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { submitPick } from '../services/api';

const schema = yup
  .object({
    choice: yup
      .string()
      .oneOf(['over', 'under'], 'Select Over or Under')
      .required('Choice is required'),
  })
  .required();

type FormData = { choice: 'over' | 'under' };

export default function PickForm({
  contestId,
  userId,
}: {
  contestId: number;
  userId: number;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { choice: 'over' },
  });

  const onSubmit = async (data: FormData) => {
    console.log('🔄 Submitting pick:', {
      contestId,
      userId,
      choice: data.choice,
    });
    try {
      const result = await submitPick(contestId, {
        userId,
        choice: data.choice,
      });
      console.log('✅ Pick result:', result);
      alert('Pick submitted!');
    } catch (err: any) {
      console.error('❌ submitPick error:', err);
      alert('Error submitting pick: ' + (err.message || err));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-start space-x-4"
      aria-labelledby="pick-form-heading"
    >
      <div className="flex-grow">
        <label htmlFor="choice" className="block font-medium mb-1">
          Your Pick
        </label>
        <select
          id="choice"
          {...register('choice')}
          className={`
            w-full border rounded px-3 py-2
            focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
            ${errors.choice ? 'border-red-500' : ''}
          `}
        >
          <option value="over">Over</option>
          <option value="under">Under</option>
        </select>
        {errors.choice && (
          <p className="text-red-500 text-sm mt-1">{errors.choice.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`
          px-4 py-2 bg-green-500 text-white rounded
          focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
          ${!isValid || isSubmitting
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-green-600'}
        `}
      >
        {isSubmitting ? 'Submitting…' : 'Submit Pick'}
      </button>
    </form>
  );
}
