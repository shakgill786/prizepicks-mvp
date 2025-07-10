// web/src/components/AdminContestForm.tsx
import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSports, getTemplates, createContest } from '../services/api'

interface Sport { id: number; name: string }
interface Template { id: number; description: string }

const schema = yup
  .object({
    sportId: yup
      .number()
      .typeError('Sport is required')
      .positive()
      .integer()
      .required(),
    templateId: yup
      .number()
      .typeError('Template is required')
      .positive()
      .integer()
      .required(),
    contestType: yup
      .string()
      .oneOf(['daily','weekly'])
      .required(),
    startAt: yup.string().required('Start time is required'),
    endAt: yup
      .string()
      .required('End time is required')
      .test('is-after','End must be after start', function(val) {
        return new Date(val) > new Date(this.parent.startAt)
      }),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export default function AdminContestForm() {
  const qc = useQueryClient()

  // fetch sports
  const {
    data: sports = [],
    status: sportsStatus,
  } = useQuery<Sport[]>({
    queryKey: ['sports'],
    queryFn: getSports,
  })

  // fetch templates
  const {
    data: templates = [],
    status: templatesStatus,
  } = useQuery<Template[]>({
    queryKey: ['templates'],
    queryFn: getTemplates,
  })

  // mutation
  const { mutate, status: createStatus } = useMutation({
    mutationFn: createContest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contests'] })
      reset()
      alert('Contest created!')
    },
  })

  // form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
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
  })

  const onSubmit: SubmitHandler<FormData> = (data) => mutate(data)

  // loading & error flags
  const loadingSports     = sportsStatus     === 'pending'
  const errorSports       = sportsStatus     === 'error'
  const loadingTemplates  = templatesStatus  === 'pending'
  const errorTemplates    = templatesStatus  === 'error'
  const isCreating        = createStatus     === 'pending'

  if (loadingSports || loadingTemplates) {
    return <div>Loading form…</div>
  }
  if (errorSports || errorTemplates) {
    return (
      <div className="text-red-500">
        Failed to load sports or templates
      </div>
    )
  }

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
        <label htmlFor="sportId" className="block mb-1 font-medium">
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
          {sports.map((s: Sport) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.sportId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.sportId.message}
          </p>
        )}
      </div>

      {/* Template */}
      <div>
        <label htmlFor="templateId" className="block mb-1 font-medium">
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
          {templates.map((t: Template) => (
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
        <label htmlFor="contestType" className="block mb-1 font-medium">
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
        <label htmlFor="startAt" className="block mb-1 font-medium">
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
          <p className="text-red-500 text-sm mt-1">
            {errors.startAt.message}
          </p>
        )}
      </div>

      {/* End At */}
      <div>
        <label htmlFor="endAt" className="block mb-1 font-medium">
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
          <p className="text-red-500 text-sm mt-1">
            {errors.endAt.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isCreating}
        className={`
          w-full px-4 py-2 text-white rounded focus:ring focus:ring-primary focus:ring-offset-2
          ${!isValid || isCreating
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark'}
        `}
      >
        {isCreating ? 'Creating…' : 'Create Contest'}
      </button>
    </form>
  )
}
