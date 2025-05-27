import React from 'react';

export default function AuthWrapper({ children }: { children: React.ReactNode;  }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
    <div className="w-full max-w-sm md:max-w-3xl">
    {children}
    </div>
  </div>

    // <div className="h-full flex flex-col gap-y-8 items-center justify-center p-8">
    //   <h1 className="text-3xl font-black">{title}</h1>
    //   {children}
    // </div>
  )
}
