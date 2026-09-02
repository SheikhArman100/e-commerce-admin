'use client';

import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CardInfoProps {
  /**
   * Text shown in the tooltip on hover.describing what the card is about.
   */
  description: string;
  /** Where the tooltip appears relative to the icon. Defaults to top. */
  side?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Info icon placed in the top-right corner of a dashboard card header.
 * On hover it reveals a short description of what the card is about.
 */
export default function CardInfo({ description, side = 'top' }: CardInfoProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="Card info"
          tabIndex={-1}
          className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs whitespace-normal text-center text-xs leading-relaxed">
        {description}
      </TooltipContent>
    </Tooltip>
  );
}