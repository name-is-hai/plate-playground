'use client';

import { cn } from '@/lib/utils';
import { BaselineIcon, EraserIcon, PaintBucketIcon } from 'lucide-react';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import * as React from 'react';
import { useState } from 'react';
import { MyButtonElement } from '../editor/plate-types';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  ColorDropdownMenuItems,
  DEFAULT_COLORS,
} from './font-color-toolbar-button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Separator } from './separator';
import { Switch } from './switch';
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarMenuGroup,
} from './toolbar';

export const MY_BUTTON_STYLES = ['filled', 'outline'] as const;
export const MY_BUTTON_RADIUS = ['sharp', 'smooth', 'round'] as const;
export const SIZE_STYLES = {
  sm: { padding: '0.25rem 0.5rem', fontSize: '0.75rem' },
  md: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  lg: { padding: '1rem 2rem', fontSize: '1rem' },
  xl: { padding: '1.25rem 2.5rem', fontSize: '1.25rem' },
  xxl: { padding: '1.75rem 3rem', fontSize: '1.5rem' },
} as const;

export function ButtonElement(props: PlateElementProps<MyButtonElement>) {
  const { editor, element, attributes } = props;
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

  const [editLabel, setEditLabel] = useState(label);
  const [editUrl, setEditUrl] = useState(href);
  const [editStyle, setEditStyle] = useState(style);
  const [editRadius, setEditRadius] = useState(radius);
  const [editTarget, setEditTarget] = useState(target == '_blank');
  const [editTextColor, setTextColor] = useState(textColor);
  const [editBackgroundColor, setBackgroundColor] = useState(backgroundColor);
  const [editSize, setEditSize] = useState<keyof typeof SIZE_STYLES>(
    size ?? 'md'
  );

  return (
    <PlateElement
      {...props}
      className={cn(
        'my-2 w-fit',
        align == 'center' && 'mx-auto',
        align == 'left' && 'mr-auto',
        align == 'right' && 'ml-auto'
      )}
      attributes={{
        ...attributes,
        contentEditable: false,
      }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <button
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
              color: editTextColor,
              backgroundColor:
                editStyle == 'filled' ? editBackgroundColor : 'transparent',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: editBackgroundColor,
              ...SIZE_STYLES[editSize],
            }}
            type="button"
          >
            {editLabel}
          </button>
        </PopoverTrigger>
        <PopoverContent align="center" className="space-y-4 p-4">
          <label className="text-sm font-medium">Thêm label</label>
          <Input
            value={editLabel}
            onChange={(e) => {
              setEditLabel(e.target.value);
              editor.tf.setNodes({ label: e.target.value });
            }}
            placeholder="Enter label here"
          />
          <label className="text-sm font-medium">Thêm đường dẫn ở đây</label>
          <Input
            value={editUrl}
            onChange={(e) => {
              setEditUrl(e.target.value);
              editor.tf.setNodes({ href: e.target.value });
            }}
            placeholder="Thêm đường dẫn ở đây"
          />

          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">Style</p>
            <div className="flex gap-2">
              {MY_BUTTON_STYLES.map((item, index) => (
                <Button
                  key={index}
                  variant={editStyle == item ? 'default' : 'ghost'}
                  className="flex-1 font-normal capitalize"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditStyle(item);
                    editor.tf.setNodes({ style: item });
                  }}
                  type="button"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500">CornerRadius</p>
            <div className="flex gap-2">
              {MY_BUTTON_RADIUS.map((item, index) => (
                <Button
                  key={index}
                  variant={editRadius == item ? 'default' : 'ghost'}
                  className="flex-1 font-normal capitalize"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditRadius(item);
                    editor.tf.setNodes({ radius: item });
                  }}
                  type="button"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Color</p>
            <Toolbar contentEditable={false}>
              <ToolbarGroup>
                <ColorDropdownMenu
                  onUpdateElement={(color) => {
                    editor.tf.setNodes({ backgroundColor: color });
                    setBackgroundColor(color);
                  }}
                  onClearElement={() => {
                    editor.tf.setNodes({ backgroundColor: undefined });
                    setBackgroundColor(undefined);
                  }}
                  tooltip="Background color"
                >
                  <PaintBucketIcon />
                </ColorDropdownMenu>
                <ColorDropdownMenu
                  onUpdateElement={(color) => {
                    editor.tf.setNodes({ textColor: color });
                    setTextColor(color);
                  }}
                  onClearElement={() => {
                    editor.tf.setNodes({ textColor: undefined });
                    setTextColor(undefined);
                  }}
                  tooltip="Text color"
                >
                  <BaselineIcon />
                </ColorDropdownMenu>
              </ToolbarGroup>
            </Toolbar>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Size</p>
            <div className="flex gap-2">
              {Object.keys(SIZE_STYLES).map((item) => (
                <Button
                  key={item}
                  variant={editSize === item ? 'default' : 'ghost'}
                  className="flex-1 font-normal capitalize"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setEditSize(item as keyof typeof SIZE_STYLES);
                    editor.tf.setNodes({ size: item });
                  }}
                  type="button"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex gap-3">
            <label className="text-sm font-medium">Mở tab mới</label>
            <Switch
              checked={editTarget}
              onCheckedChange={(checked) => {
                setEditTarget(checked);
                editor.tf.setNodes({ target: checked ? '_blank' : '_self' });
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
      {props.children}
    </PlateElement>
  );
}

function ColorDropdownMenu({
  children,
  tooltip,
  onUpdateElement,
  onClearElement,
}: {
  children: React.ReactNode;
  tooltip: string;
  onUpdateElement: (color: string) => void;
  onClearElement: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const onUpdateColor = (color: string) => {
    setOpen(false);
    onUpdateElement(color);
  };

  const onClearColor = () => {
    setOpen(false);
    onClearElement();
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton tooltip={tooltip}>{children}</ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <ToolbarMenuGroup label="Colors">
          <ColorDropdownMenuItems
            className="px-2"
            colors={DEFAULT_COLORS}
            updateColor={onUpdateColor}
          />
        </ToolbarMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-2" onClick={onClearColor}>
            <EraserIcon />
            <span>Clear</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
