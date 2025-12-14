import NFCLayout from '@/components/nfc/NFCLayout'
import NFCPreview from '@/views/nfc/preview'
import React from 'react'

const page = () => {
  return (
    <NFCLayout>
        <NFCPreview/>
    </NFCLayout>
  )
}

export default page