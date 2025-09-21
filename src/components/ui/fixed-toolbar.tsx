'use client';

import { cn } from '@/lib/utils';

import { useEditorReadOnly } from 'platejs/react';
import { Toolbar } from './toolbar';

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
    const readOnly = useEditorReadOnly();

    return (
        !readOnly && <Toolbar
            {...props}
            className={cn(
                'sticky top-0 left-0 z-1 scrollbar-hide w-full justify-between overflow-x-auto rounded-t-lg border-b border-b-border bg-background/95 p-1 backdrop-blur-sm supports-backdrop-blur:bg-background/60',
                props.className
            )}
        />
    );
}
