import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/Home.module.css';

export default function Home() {


  return (
    <div className='flex items-center justify-center h-screen flex-col gap-4'>
   <h1 className='text-slate-900 text-5xl'>HELLO FROM TAILWIND</h1>
   <button className="btn btn-active btn-primary">Hello from daisyUi</button>
   </div>

  );
}
