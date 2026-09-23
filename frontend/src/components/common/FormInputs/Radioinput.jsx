import React from 'react'
import { useFormContext } from 'react-hook-form';

const Radioinput = ({ radioOptions = [], name, label }) => {
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext();
  const selectedValue = watch(name);
  const hasError = (errors[name])
  const showError = hasError && selectedValue?.trim() !== "";
  return (
    <div className='mb-6'>
      <label className="font-bold block mb-4">
        {label} <span className="ml-1 text-red-600">*</span>
      </label>
      <div className="space-y-3">
        {radioOptions.map((option) => (
          <div key={option.value} className='flex gap-3 items-center'>
            <input
              {...register(name)}
              type='radio'
              value={option.value}
              disabled={option?.disabled}
              title={option?.disabled ? "Coming Soon" : ""}
              className={`w-4 h-4 accent-[#20365c] text-darkgreen focus:ring-[#20365c] border-gray-300 ${errors ? "border-red-500" : "border-gray-300"}`}
            />
            <label className="text-gray-700 text-md">{option.label}</label>

          </div>

        ))}

      </div>
      {showError && (
        <p className="text-red-600 text-sm mt-2">{errors.applyMethod.message}</p>
      )}

      {/* Conditional field - Application URL */}
      {selectedValue === "external" && (
        <div className='mt-5'>
          <label className='font-bold block mb-2'>
            Application URL<span className='ml-1 text-red-600'>*</span>
          </label>
          <input
            {...register("applicationUrl")}
            className={`border-2 border-gray-400 w-full p-4 rounded-lg focus:ring-1 focus:outline-none focus:border-[#263953] ${errors ? "border-red-500" : "border-gray-300"}`}
            type='text'
            placeholder='https://...'

          />
          {showError && (
            <p className="text-red-600 text-sm mt-1">
              {errors.applicationUrl.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Radioinput