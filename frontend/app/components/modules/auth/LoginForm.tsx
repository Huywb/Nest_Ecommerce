'use client'
import { useAuth } from '@/app/hooks/useAuth'
import { User, UserLogin } from '@/app/types/auth.type'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'

const LoginForm = () => {

    const [userInfo,setUserInfo] = useState<UserLogin>({
        email: '',
        password: ''
    })
    const [isLoading,setIsLoading] = useState(false)
    const [errorMessage,setErrorMessage] = useState<string | null>(null)

    const router =  useRouter()
    const {login} = useAuth()
    const handleSubmit = async(e:FormEvent<HTMLElement>)=>{
        e.preventDefault()
        console.log(userInfo)
        setIsLoading(true)
        setErrorMessage(null)
        try {
            const response = await login(userInfo)
            if(response){
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <section className='w-full h-screen flex items-center justify-center'>
      <div className='w-[60%] flex items-center justify-center'>
            <div className='flex flex-col items-center border min-w-80 p-4 gap-4'>
                <h1 className='font-bold text-3xl'>Welcome back</h1>
                <span className='text-md text-gray-700'>Sign in to your account to continue</span>

                <div className='flex flex-col gap-4 mt-4 w-full'>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className=' text-gray-800'>Email</label>
                        <input className=' p-2 rounded-md border-2' type="email" onChange={(e)=>setUserInfo((prev)=>({...prev,email: e.target.value}))} placeholder='user1@gmail.com' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="" className=' text-gray-800'>Password</label>
                        <input className=' p-2 rounded-md border-2'  type="password" onChange={(e)=>setUserInfo((prev)=>({...prev,password: e.target.value}))} placeholder='*********' />
                    </div>
                </div>

                <button onClick={handleSubmit} className='w-full p-3 cursor-pointer hover:bg-amber-700 transition-all duration-300 bg-amber-500 text-black font-medium rounded-md'>Sign in</button>
            </div>
      </div>
    </section>
  )
}

export default LoginForm
