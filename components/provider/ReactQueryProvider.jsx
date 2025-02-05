"use client"
import React from 'react'
import {QueryClientProvider , QueryClient} from '@tanstack/react-query'


export default function ReactQueryProvider({children}) {
    const queryclient = new QueryClient()

  return (
    <>
            <QueryClientProvider client={queryclient}>
{children}
</QueryClientProvider>
    </>
  )
}
