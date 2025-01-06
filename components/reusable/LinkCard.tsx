import React from 'react'
import Link from 'next/link';

interface LinkCard {
    title: string;
    des: string;
    link: string
}

const LinkCard = ({ title, des, link }: LinkCard) => {
    return (
        <Link href={link} className='card'>
            <h2>{title}</h2>
            <p>{des}</p>
        </Link>
    )
}

export default LinkCard