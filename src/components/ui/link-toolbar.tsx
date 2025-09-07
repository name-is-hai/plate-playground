'use client';

import * as React from 'react';

import type { TLinkElement } from 'platejs';

import {
  type UseVirtualFloatingOptions,
  flip,
  offset,
} from '@platejs/floating';
import { getLinkAttributes, upsertLink, validateUrl } from '@platejs/link';
import {
  type LinkFloatingToolbarState,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
} from '@platejs/link/react';
import { cva } from 'class-variance-authority';
import { ExternalLink, Link, Text, Unlink } from 'lucide-react';
import { KEYS } from 'platejs';
import {
  useEditorRef,
  useEditorSelection,
  useFormInputProps,
  usePluginOption,
} from 'platejs/react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from './input';
import { Switch } from './switch';
const popoverVariants = cva(
  'z-50 w-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-hidden'
);

const inputVariants = cva(
  'flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base placeholder:text-muted-foreground focus-visible:ring-transparent focus-visible:outline-none md:text-sm'
);

export function LinkFloatingToolbar({
  state,
}: {
  state?: LinkFloatingToolbarState;
}) {
  const activeCommentId = usePluginOption({ key: KEYS.comment }, 'activeId');
  const activeSuggestionId = usePluginOption(
    { key: KEYS.suggestion },
    'activeId'
  );
  const editor = useEditorRef();
  const selection = useEditorSelection();

  const floatingOptions: UseVirtualFloatingOptions = React.useMemo(() => {
    return {
      middleware: [
        offset(8),
        flip({
          fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
          padding: 12,
        }),
      ],
      placement:
        activeSuggestionId || activeCommentId ? 'top-start' : 'bottom-start',
    };
  }, [activeCommentId, activeSuggestionId]);

  const insertState = useFloatingLinkInsertState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    hidden,
    props: insertProps,
    ref: insertRef,
    textInputProps,
  } = useFloatingLinkInsert(insertState);

  const editState = useFloatingLinkEditState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    editButtonProps,
    props: editProps,
    ref: editRef,
    unlinkButtonProps,
  } = useFloatingLinkEdit(editState);
  const inputProps = useFormInputProps({
    preventDefaultOnEnterKeydown: true,
  });

  const attributes = (() => {
    const entry = editor.api.node<TLinkElement>({
      match: { type: editor.getType(KEYS.link) },
    });
    if (!entry) {
      return {};
    }
    const [element] = entry;
    const text = element.children[0].text as string;

    const linkAttributes = getLinkAttributes(editor, element);
    return { href: linkAttributes.href, text, target: linkAttributes.target };
  })();

  const [url, setUrl] = React.useState(attributes.href!);
  const [text, setText] = React.useState(attributes.text!);
  const [target, setTarget] = React.useState<
    '_self' | '_blank' | '_parent' | '_top' | (string & {})
  >(attributes.target!);

  React.useEffect(() => {
    if (editState.isEditing) {
      setUrl(attributes.href ?? '');
      setText(attributes.text ?? '');
      setTarget(attributes.target ?? '_self');
    } else if (insertState.isOpen) {
      setUrl('');
      setText('');
      setTarget('_self');
    }
  }, [attributes.href, editState.isEditing, insertState.isOpen]);

  const isDisabled =
    !validateUrl(editState.editor, url ?? '') ||
    (url === attributes.href &&
      target === attributes.target &&
      text === attributes.text);

  const handleSubmit = () => {
    if (url.trim() === '') return;

    if (editState.isEditing) {
      upsertLink(editor, { url, target });
      editState.floating.context.onOpenChange(false);
      insertState.floating.context.onOpenChange(false);
    } else {
      upsertLink(editor, { url, text, target });
      insertState.floating.context.onOpenChange(false);
    }
  };

  if (hidden) return null;

  const input = (
    <div className="flex w-[330px] flex-col" {...inputProps}>
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Link className="size-4" />
        </div>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={inputVariants()}
          placeholder="Paste link"
          data-plate-focus
        />
      </div>
      <Separator className="my-1" />
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Text className="size-4" />
        </div>
        <Input
          disabled={editState.isEditing}
          className={inputVariants()}
          placeholder="Text to display"
          data-plate-focus
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <Separator className="my-1" />
      <div className="flex items-center gap-3">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <ExternalLink className="size-4" />
        </div>
        <Switch
          checked={target === '_blank'}
          onCheckedChange={(checked) => {
            setTarget(checked ? '_blank' : '_self');
          }}
        />
        <label className="text-sm text-muted-foreground">
          Mở link bằng tab mới
        </label>
      </div>
      <Separator className="my-1" />
      <Button disabled={isDisabled} type="button" onClick={handleSubmit}>
        Update link
      </Button>
    </div>
  );

  const editContent = editState.isEditing ? (
    input
  ) : (
    <div className="box-content flex items-center">
      <button
        className={buttonVariants({ size: 'sm', variant: 'ghost' })}
        type="button"
        {...editButtonProps}
      >
        Edit link
      </button>

      <Separator orientation="vertical" />

      <LinkOpenButton />

      <Separator orientation="vertical" />

      <button
        className={buttonVariants({
          size: 'sm',
          variant: 'ghost',
        })}
        type="button"
        {...unlinkButtonProps}
      >
        <Unlink width={18} />
      </button>
    </div>
  );

  return (
    <>
      <div ref={insertRef} className={popoverVariants()} {...insertProps}>
        {input}
      </div>

      {editState.floating.context.open && (
        <div ref={editRef} className={popoverVariants()} {...editProps}>
          {editContent}
        </div>
      )}
    </>
  );
}

function LinkOpenButton() {
  const editor = useEditorRef();
  const selection = useEditorSelection();

  const attributes = React.useMemo(
    () => {
      const entry = editor.api.node<TLinkElement>({
        match: { type: editor.getType(KEYS.link) },
      });
      if (!entry) {
        return {};
      }
      const [element] = entry;
      return getLinkAttributes(editor, element);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]
  );

  return (
    <a
      {...attributes}
      className={buttonVariants({
        size: 'sm',
        variant: 'ghost',
      })}
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      aria-label="Open link in a new tab"
      target="_blank"
    >
      <ExternalLink width={18} />
    </a>
  );
}
