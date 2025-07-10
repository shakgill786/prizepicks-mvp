// web/src/components/PickForm.tsx
import { useForm, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitPick } from '../services/api'

const schema = yup
  .object({
    choice: yup
      .string()
      .oneOf(['over', 'under'], 'Select Over or Under')
      .required('Choice is required'),
  })
  .required()

type FormData = { choice: 'over' | 'under' }

export default function PickForm({
  contestId,
  userId,
}: {
  contestId: number
  userId: number
}) {
  const queryClient = useQueryClient()

  // v5: single options object
  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      submitPick(contestId, { userId, choice: data.choice }),
    onSuccess: () => {
      // refetch the leaderboard for this contest
      queryClient.invalidateQueries({ queryKey: ['leaderboard', contestId] })
      // (optionally) refetch this user's picks if you have a "my-picks" query
      queryClient.invalidateQueries({ queryKey: ['myPicks', userId] })
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: { choice: 'over' },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-start space-x-4"
      aria-labelledby="pick-form-heading"
    >
      <div className="flex-grow">
        <label htmlFor="choice" className="block mb-1 font-medium">
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
          <p className="text-red-500 text-sm mt-1">
            {errors.choice.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || mutation.isPending}
        className={`
          px-4 py-2 bg-green-500 text-white rounded
          focus:outline-none focus:ring focus:ring-primary focus:ring-offset-2
          ${!isValid || mutation.isPending
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-green-600'}
        `}
      >
        {mutation.isPending ? 'Submitting…' : 'Submit Pick'}
      </button>
    </form>
  )
}
