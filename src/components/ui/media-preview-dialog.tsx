'use client';

import {
    PreviewImage,
    useImagePreview,
    useImagePreviewValue
} from '@platejs/media/react';
import { cva } from 'class-variance-authority';
import { Download, Minimize2Icon, Minus, Plus } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { cn } from '@/lib/utils';

const buttonVariants = cva('rounded bg-[rgba(0,0,0,0.5)] px-1', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: 'text-white',
      disabled: 'cursor-not-allowed text-gray-400',
    },
  },
});

const SCROLL_SPEED = 4;

export function MediaPreviewDialog() {
  const editor = useEditorRef();
  const isOpen = useImagePreviewValue('isOpen', editor.id);
  const scale = useImagePreviewValue('scale');
  const {
    closeProps,
    maskLayerProps,
    scaleTextProps,
    zommOutProps,
    zoomInDisabled,
    zoomInProps,
    zoomOutDisabled,
  } = useImagePreview({ scrollSpeed: SCROLL_SPEED });

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-50 h-screen w-screen select-none',
        !isOpen && 'hidden'
      )}
      onContextMenu={(e) => e.stopPropagation()}
      {...maskLayerProps}
    >
      <div className="absolute inset-0 size-full bg-black opacity-75"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex max-h-screen w-full items-center">
          <PreviewImage
            className={cn(
              'mx-auto block max-h-[calc(100vh-4rem)] w-auto object-contain transition-transform'
            )}
          />
          <div
            className="absolute bottom-8 left-1/2 z-40 flex w-fit -translate-x-1/2 justify-center gap-2 p-2 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 rounded bg-[rgba(0,0,0,0.85)] px-3 py-1">
              <button
                className={cn(
                  buttonVariants({
                    variant: zoomOutDisabled ? 'disabled' : 'default',
                  }),
                  'cursor-pointer'
                )}
                {...zommOutProps}
                type="button"
              >
                <Minus className="size-4" />
              </button>
              <span
                className="text-sm font-medium text-white"
                {...scaleTextProps}
              >
                {scale * 100 + ' %'}
              </span>
              <button
                className={cn(
                  buttonVariants({
                    variant: zoomInDisabled ? 'disabled' : 'default',
                  }),
                  'cursor-pointer'
                )}
                {...zoomInProps}
                type="button"
              >
                <Plus className="size-4" />
              </button>
              <button
                className={cn(buttonVariants(), 'cursor-pointer')}
                type="button"
                onClick={() => {
                  const img = document.querySelector(
                    '.mx-auto.block.object-contain'
                  );
                  if (img && img instanceof HTMLImageElement && img.src) {
                    const link = document.createElement('a');
                    link.href = img.src;
                    link.target = '_blank';
                    link.download = img.src.split('/').pop() || 'image.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
              >
                <Download className="size-4" />
              </button>
              <button
                {...closeProps}
                className={cn(buttonVariants(), 'cursor-pointer')}
                type="button"
              >
                <Minimize2Icon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
