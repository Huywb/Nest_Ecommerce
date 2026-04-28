'use client'
import { useAuth } from '@/app/hooks/useAuth'
import { useCart } from '@/app/hooks/useCart'
import { LucideLayoutDashboard, ShoppingBagIcon, ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/app/services/axios'
import { API_BASE } from '@/app/services/api-route'
import { store } from '@/app/store'
import { clearAuth } from '@/app/store/slices/authSlice'

const Header = () => {
    const router = useRouter()
    const {totalItems} = useCart()
    const {isAuthenticated, isLoading,error,user, logOut} = useAuth()
    
    const handleLogout = async() =>{
        try {
            await logOut()
            store.dispatch(clearAuth())
        } catch (error){
            console.error('Logout failed', error)
        }
    }

    const handleLogin = () =>{
        router.push('/auth/login')
    }

    const handleDashboard = ()=>{
        if(user && user.role === 'ADMIN') {
            router.push('/admin')
        }else{
            router.push("/user")
        }
    }
  return (
    <header className='w-full border-b-2 border-gray-300 bg-white sticky top-0 z-100 shadow-md'>
      <div className='max-w-300 mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href={'/'} className='font-bold text-xl hover:opacity-70 transition-all duration-400'>
          STORE
        </Link>
        <div className='flex gap-4 items-center'>
            <Link href={'/cart'} className='relative hover:opacity-70 transition-all duration-400'>
              <ShoppingCartIcon className='p-2 border border-gray-300' size={38}/>
              <span className='absolute rounded-full  border px-1 text-xs -top-1.5 -right-1.5 z-10 bg-black text-white'>
                {totalItems > 0 ? totalItems : 0}
              </span>
            </Link>
            {
                isAuthenticated && (
                    <Link href={'/dashboard'} className='cursor-pointer  hover:opacity-70 transition-all duration-400'>
                        <LucideLayoutDashboard />
                    </Link>
                )
            }

            {
                !isAuthenticated ? (

            <Link href={'/auth/login'} className='rounded-md cursor-pointer p-2 text-sm bg-black text-white px-8 hover:opacity-70 transition-all duration-400'>
              Login
            </Link>
                ) : (
                    <button onClick={handleLogout} className='rounded-md cursor-pointer p-2 text-sm bg-black text-white px-8 hover:opacity-70 transition-all duration-400'>Log out</button>
                )
            }
        </div>
      </div>
    </header>
  )
}

export default Header
