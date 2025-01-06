"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Navbar = () => {
    const navLinks = [
        {
            title: "Entry Asset",
            link: '/asset_entry'
        },
        {
            title: "Sections Asset",
            link: '/view_assets'
        }
    ]
    const pathname = usePathname();

    return (
        <div className='my-3 flex  bg-[#007F40] text-white  font-semibold text-lg'>
            {navLinks?.map(navlink => <Link className={`py-5 px-3  hover:bg-[#022d17] ${pathname === navlink.link ? ' bg-[#022d17] ' : ''}  `} key={navlink.link} href={navlink.link}>{navlink.title}</Link>)}

        </div>
    )
}

export default Navbar