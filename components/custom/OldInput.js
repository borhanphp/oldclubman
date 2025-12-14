import React from 'react'

const OldInput = ({
  type = 'text',
  label = "",
  name,
  value,
  onChange,
  placeholder,
  className = '',
  required = false,
  ...props
}) => {
  return (
   <>

    {label && <label htmlFor="middle_name" className="block text-sm font-medium text-gray-600 mb-2">
      {label}
    </label>}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-slate-200 rounded-md px-[1rem] py-[0.3rem] focus:border-[#155DFC] focus:outline-none ${className}`}
      required={required}
      {...props}
    />
   </>
  )
}

export default OldInput