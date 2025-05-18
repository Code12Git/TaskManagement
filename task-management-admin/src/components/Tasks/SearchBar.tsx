'use client'
import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { filteredTasks } from '@/redux/actions/taskAction'
const SearchBar = () => {
    const [searchTerm,setSearchTerm] = useState('')
    const dispatch = useAppDispatch()

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            dispatch(filteredTasks(searchTerm))
        },1000)
        return ()=>clearTimeout(timeout)
    },[searchTerm,dispatch])

  return (
    <motion.div  className='mb-5 max-w-full'>
        <input type='text' name='searchTerm' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className='border border-black rounded-lg text-black indent-1 w-full p-2' placeholder='Search using title and description...' />
        </motion.div>
  )
}

export default SearchBar