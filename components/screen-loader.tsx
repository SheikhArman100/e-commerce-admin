'use client';

interface ScreenLoaderProps {
  title?: string;
}

export function ScreenLoader({ title = "Loading" }: ScreenLoaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 justify-center h-[calc(100vh-var(--header-height)-40px)] w-full transition-opacity duration-700 ease-in-out">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
      <div className="text-muted-foreground font-medium text-sm">
        {title}.....
      </div>
    </div>
  );
}
