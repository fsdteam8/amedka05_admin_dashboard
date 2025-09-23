import { Key, User2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='text-white space-y-[24px] px-12 py-10'>
      <div>
        <p className='font-bold text-[24px] mb-3'>Settings</p>
        <p className='text-[#E7E7E7] text-[16px] font-medium'>Customize your dashboard experience and preferences.</p>
      </div>
      <div className='flex p-2 cursor-pointer rounded-lg flex-col border border-[#1F2937] bg-[#1A1A1A] gap-4'>
        <Link href='/setting/profile' className='bg-[#252525] hover:bg-[#252525]/80 rounded-lg py-[18px] px-[16px] text-[#7DD3DD] font-semibold text-sm items-center flex gap-3'>
          <User2 />
          <p>Profile</p>
        </Link>
        <Link href='/setting/password' className='bg-[#252525] hover:bg-[#252525]/80 rounded-lg py-[18px] px-[16px] text-[#7DD3DD] font-semibold text-sm items-center flex gap-3'>
          <Key />
          <p>Password</p>
        </Link>
      </div>
    </div>
  )
}

export default page