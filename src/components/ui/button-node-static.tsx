import type { SlateElementProps } from 'platejs';

import { cn } from '@/lib/utils';
import { SlateElement } from 'platejs';
import { MyButtonElement } from '../editor/plate-types';
import { SIZE_STYLES } from './button-node';

export function ButtonElementStatic(props: SlateElementProps<MyButtonElement>) {
  const { element, attributes } = props;
  const {
    align,
    style,
    radius,
    label,
    href,
    target,
    size,
    textColor,
    backgroundColor,
  } = element;
  console.log(element);

  return (
    <SlateElement
      {...props}
      attributes={{
        ...attributes,
      }}
      className={cn(
        'my-2 w-fit',
        align == 'center' && 'mx-auto',
        align == 'left' && 'mr-auto',
        align == 'right' && 'ml-auto'
      )}
    >
      <a
        className={cn(
          'inline-flex items-center justify-center text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
          'px-6 py-3 font-semibold no-underline'
        )}
        style={{
          borderRadius:
            radius == 'round'
              ? 'calc(infinity * 1px)'
              : radius == 'sharp'
                ? '0'
                : 'calc(var(--radius) /* 0.25rem = 4px */ - 2px)',
          color: textColor,
          backgroundColor: style == 'outline' ? 'transparent' : backgroundColor,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: backgroundColor,
          ...SIZE_STYLES[size],
        }}
        href={href}
        target={target}
      >
        {label}
      </a>
    </SlateElement>
  );
}
