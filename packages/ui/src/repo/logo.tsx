'use client';

import Link from 'next/link';

import { Sparkle } from 'lucide-react';

export default function Logo({ name = 'trenning' }: { name?: string }) {
  return (
    <Link href="#" className="group flex items-center gap-2">
      <div className="relative grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm transition-transform group-hover:scale-[1.03]">
        <Sparkle className="h-4 w-4" />
      </div>
      <span className="text-lg font-semibold tracking-tight">{name}</span>
    </Link>
  );
}
