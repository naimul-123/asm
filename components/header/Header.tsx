import React from 'react'
import Image from 'next/image'
import logo from '@/public/bb_logo.png'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useAuth } from '@/contexts/authContext'
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import UserInfo from './UserInfo'

const Header = () => {
    const { user, isOpenModal, setIsOpemModal } = useAuth()

    return (
        <header className='header'>
            <div className='flex justify-between items-center'>
                <Link href="/">
                    <div className='flex justify-center items-center gap-3'>
                        <Image src={logo} alt="alt" width={100} height={100} />
                        <div className='space-y-1'>
                            <h1>Bangladesh Bank</h1>
                            <hr className='border-[#007f40] border-2' />
                            <h2>বাংলাদেশ ব্যাংক</h2>
                        </div>
                    </div>
                </Link>
                <div className='flex flex-col items-end'>
                    <div className='relative'>
                        {
                            user &&
                            <>

                                <div className='flex items-center gap-2'>
                                    <h3>Welcome {user.name}</h3>
                                    <Button size="icon" variant="destructive" onClick={() => setIsOpemModal(!isOpenModal)} >
                                        {isOpenModal ? <IoMdArrowDropupCircle className='text-2xl' /> : <IoMdArrowDropdownCircle className='text-2xl' />}
                                    </Button>
                                </div>
                                <UserInfo />
                            </>
                        }

                    </div>

                    <h2 className='text-4xl'>Asset Management System</h2>

                </div>

            </div>


        </header>
    )
}

export default Header