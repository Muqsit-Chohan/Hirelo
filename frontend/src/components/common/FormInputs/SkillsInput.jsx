import { CircleX } from 'lucide-react';
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'

const SkillsInput = ({label,name}) => {
  const{setValue,watch,trigger,formState:{ errors }}=useFormContext();

  const skills = watch(name) || [];

const showError = Boolean(errors?.[name]);
    const [currentSkills, setcurrentSkills] = useState('');

    const addSkills =async()=>{
        if (currentSkills.trim() && !skills.includes(currentSkills.trim())) {
            const newSkill = [...skills,currentSkills.trim()];
            setValue(name,newSkill);
            setcurrentSkills('');
            await trigger(name);
          }
    }

    const removeSkill =async(removeIndex)=>{
        const newSkill = skills.filter((_,index)=>index !==removeIndex)
        setValue(name,newSkill);
        await trigger(name);
      }

    const handleKeyPress =(e)=>{
        if (e.key==="Enter") {
            e.preventDefault()
            addSkills()
        }
    }

  return (
    <div className='mb-4 mt-4'>
      <label className='text-md font-medium'>
        {label}<span className='ml-1 text-red-600'>*</span>
      </label>
      
      {/* Selected skills display */}
      <div className={`rounded-lg p-3 mb-3 bg-white ${skills.length > 1 ? 'max-h-[120px] overflow-y-auto' : 'min-h-[60px]'}`}>
        {skills.length > 0 ? (
          <div className='flex flex-wrap gap-2'>
            {skills.map((skill, index) => (
              <span 
                key={index}
                className='bg-gray-200 px-3 py-1 rounded-full inline-flex flex-wrap items-center gap-1'
              >
                {skill}
                <button 
                  type="button"
                  onClick={() => removeSkill(index)}
                  className='hover:text-red-600 ml-1'
                >
                  <CircleX className='w-4 h-4' />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No skill Added</p>
        )}
      </div>

      {/* Add skill input */}
      <div className='flex'>
        <input 
          value={currentSkills}
          onChange={(e) => setcurrentSkills(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`border-2 border-gray-400 border-r-0 w-full p-3 rounded-l-lg focus:ring-1 focus:outline-none focus:border-[#263953] ${showError? "border-red-500":"border-gray-300"}`} 
          placeholder='Enter a skill'
        />
        <button 
          type="button"
          onClick={addSkills}
          className='bg-[#20365c] text-white font-bold px-4 py-3 rounded-r-lg border-2 border-[#263953] hover:bg-[#263953] transition-colors'
        >
          Add
        </button>
        </div>
        {showError && (
          <p className="text-red-600 text-sm mt-3 font-bold text-md">{errors[name]?.message}</p>
        )}
    </div>
  )
}

export default SkillsInput