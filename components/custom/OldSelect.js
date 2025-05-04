import React from 'react'

const OldSelect = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`border border-slate-200 rounded-md px-[1rem] py-[0.3rem] focus:border-[#155DFC] focus:outline-none appearance-none ${className}`}
      required={required}
      {...props}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default OldSelect 