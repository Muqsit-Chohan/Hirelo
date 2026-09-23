import React from 'react'
import { useFormContext } from 'react-hook-form'

const CheckBoxInput = () => {
  const { register, formState: { errors } } = useFormContext()

  const showError = Boolean(errors?.perks);
  const perksOptions = [
    "Remote Work",
    "Health Insurance",
    "Paid Leave",
    "Flexible Hours",
    "Performance Bonus",
    // "Mark this job as Featured?"
  ];
  return (
    <div>
      <div className='mb-5'>
        <div className='flex gap-2 items-center'>
          <input {...register("negotiable")} type='checkbox' className={`w-4 h-4 ${errors[name] ? "border-red-500" : "border-gray-300"}`}></input>
          <label>Salary is negotiable</label>
        </div>
      </div>

      <div className='mb-6'>
        <label className='font-bold'>Perks & Benefits</label>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          {perksOptions.map((perk, i) => (
            <div key={i} className='flex gap-2 items-center mt-4'>
              <input
                {...register("perks")}
                value={perk}
                type='checkbox'
                className={`w-4 h-4 ${errors.perks ? "border-red-500" : "border-gray-300"}`}
              />
              <label>{perk}</label>
            </div>
          ))}


        </div>
      {showError && (
        <p className="text-red-600 mt-2 font-bold text-md">{errors.perks?.message}</p>
      )}
      </div>
    </div>
  )
}

export default CheckBoxInput;