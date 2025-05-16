import UserChart from '@/components/Users/UserChart'
import UserDetails from '@/components/Users/UserDetails'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col'>
    <UserChart />
    <UserDetails />
    </div>
  )
}

export default Page