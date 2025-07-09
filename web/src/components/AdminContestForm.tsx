import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getSports, getTemplates, createContest } from '../services/api';

const schema = yup
  .object({
    sportId: yup
      .number()
      .typeError('Sport is required')
      .positive()
      .integer()
      .required('Sport is required'),
    templateId: yup
      .number()
      .typeError('Template is required')
      .positive()
      .integer()
      .required('Template is required'),
    contestType: yup
      .string()
      .oneOf(['daily', 'weekly'])
      .required('Type is required'),
    startAt: yup.string().required('Start time is required'),
    endAt: yup
      .string()
      .required('End time is required')
      .test(
        'is-after',
        'End time must be after start time',
        function (value) {
          const { startAt } = this.parent;
          return new Date(value) > new Date(startAt);
        }
      ),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

export default function AdminContestForm() {
  const [sports, setSports] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      sportId: 0,
      templateId: 0,
      contestType: 'daily',
      startAt: '',
      endAt: '',
    },
  });

  useEffect(() => {
    getSports().then(setSports);
    getTemplates().then(setTemplates);
  }, []);

  const onSubmit = async (data: FormData) => {
    await createContest(data);
    alert('Contest created!');
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-md mx-auto"
      aria-labelledby="admin-form-heading"
    >
      <h2 id="admin-form-heading" className="text-2xl font-bold">
        Create New Contest
      </h2>

      {/* Sport */}
      <div>
        <label htmlFor="sportId" className="block font-medium mb-1">
          Sport
        </label>
        <select
          id="sportId"
          {...register('sportId')}
          className={`
            w-full border rounded px-3 py-2
            focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
            ${errors.sportId ? 'border-red-500' : ''}
          `}
        >
          <option value="">Select sport</option>
          {sports.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.sportId && (
          <p className="text-red-500 text-sm mt-1">{errors.sportId.message}</p>
        )}
      </div>

      {/* Template */}
      <div>
        <label htmlFor="templateId" className="block font-medium mb-1">
          Template
        </label>
        <select
          id="templateId"
          {...register('templateId')}
          className={`
            w-full border rounded px-3 py-2
            focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
            ${errors.templateId ? 'border-red-500' : ''}
          `}
        >
          <option value="">Select template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.description}
            </option>
          ))}
        </select>
        {errors.templateId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.templateId.message}
          </p>
        )}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="contestType" className="block font-medium mb-1">
          Type
        </label>
        <select
          id="contestType"
          {...register('contestType')}
          className={`
            w-full border rounded px-3 py-2
            focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
            ${errors.contestType ? 'border-red-500' : ''}
          `}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        {errors.contestType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.contestType.message}
          </p>
        )}
      </div>

      {/* Start At */}
      <div>
        <label htmlFor="startAt" className="block font-medium mb-1">
          Start At
        </label>
        <input
          id="startAt"
          type="datetime-local"
          {...register('startAt')}
          className={`
            w-full border rounded px-3 py-2
            focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
            ${errors.startAt ? 'border-red-500' : ''}
          `}
        />
        {errors.startAt && (
          <p className="text-red-500 text-sm mt-1">{errors.startAt.message}</p>
        )}
      </div>

      {/* End At */}
      <div>
        <label htmlFor="endAt" className="block font-medium mb-1">
          End At
        </label>
        <input
          id="endAt"
          type="datetime-local"
          {...register('endAt')}
          className={`
            w-full border rounded px-3 py-2
            focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
            ${errors.endAt ? 'border-red-500' : ''}
          `}
        />
        {errors.endAt && (
          <p className="text-red-500 text-sm mt-1">{errors.endAt.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className={`
          w-full text-center px-4 py-2 bg-blue-600 text-white rounded
          focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
          ${!isValid || isSubmitting
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-blue-700'}
        `}
      >
        {isSubmitting ? 'Creating…' : 'Create Contest'}
      </button>
    </form>
  );
}
