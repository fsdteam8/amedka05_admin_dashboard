import React from 'react'
import ProfileForm from './_components/profileForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const page = () => {
  return (
    <div className='text-white space-y-[24px] px-12 py-10'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='font-bold text-[24px] mb-3'>Settings</p>
        <p className='text-[#E7E7E7] text-[16px] font-medium'>Customize your dashboard experience and preferences.</p>
        </div>
        <Link href='/dashboard/setting' className='flex text-[#929292] items-center gap-1  cursor-pointer'>
          <ArrowLeft /> Back
        </Link>
      </div>
      <ProfileForm />
    </div>
  )
}

export default page