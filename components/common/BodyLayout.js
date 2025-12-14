import React from 'react'

const BodyLayout = ({children}) => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto md:p-2 md:px-5">
       {children}
      </div>
    </div>
  )
}

export default BodyLayout