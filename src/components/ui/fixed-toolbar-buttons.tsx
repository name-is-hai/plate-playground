'use client';

import * as React from 'react';

import {
  // ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  MoreHorizontalIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { AlignToolbarButton } from './align-toolbar-button';
import { CommentToolbarButton } from './comment-toolbar-button';
import { EmojiToolbarButton } from './emoji-toolbar-button';
// import { ExportToolbarButton } from './export-toolbar-button';
import { FontColorToolbarButton } from './font-color-toolbar-button';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
// import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
// import { ImportToolbarButton } from './import-toolbar-button';
import {
  IndentToolbarButton,
  OutdentToolbarButton,
} from './indent-toolbar-button';
import { InsertToolbarButton } from './insert-toolbar-button';
import { LineHeightToolbarButton } from './line-height-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import {
  BulletedListToolbarButton,
  NumberedListToolbarButton,
  TodoListToolbarButton,
} from './list-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { ModeToolbarButton } from './mode-toolbar-button';
import {
  KeyboardInputButton,
  SubscriptButton,
  SuperscriptButton,
} from './more-toolbar-button';
import { TableToolbarButton } from './table-toolbar-button';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { Button } from './button';

interface ToolbarGroupDef {
  id: string;
  items: ToolbarItem[];
}

interface ToolbarItem {
  id: string;
  element: React.ReactNode;
}

function getToolbarGroups(isStudentSite?: boolean): ToolbarGroupDef[] {
  return [
    {
      id: 'insert',
      items: [
        { id: 'insert', element: <InsertToolbarButton /> },
        { id: 'turninto', element: <TurnIntoToolbarButton /> },
        { id: 'fontsize', element: <FontSizeToolbarButton /> },
      ],
    },
    {
      id: 'marks',
      items: [
        {
          id: 'bold',
          element: (
            <MarkToolbarButton nodeType={KEYS.bold}>
              <BoldIcon />
            </MarkToolbarButton>
          ),
        },
        {
          id: 'italic',
          element: (
            <MarkToolbarButton nodeType={KEYS.italic}>
              <ItalicIcon />
            </MarkToolbarButton>
          ),
        },
        {
          id: 'underline',
          element: (
            <MarkToolbarButton nodeType={KEYS.underline}>
              <UnderlineIcon />
            </MarkToolbarButton>
          ),
        },
        {
          id: 'strike',
          element: (
            <MarkToolbarButton nodeType={KEYS.strikethrough}>
              <StrikethroughIcon />
            </MarkToolbarButton>
          ),
        },
        {
          id: 'code',
          element: (
            <MarkToolbarButton nodeType={KEYS.code}>
              <Code2Icon />
            </MarkToolbarButton>
          ),
        },
        {
          id: 'color',
          element: (
            <FontColorToolbarButton nodeType={KEYS.color}>
              <BaselineIcon />
            </FontColorToolbarButton>
          ),
        },
        {
          id: 'bgcolor',
          element: (
            <FontColorToolbarButton nodeType={KEYS.backgroundColor}>
              <PaintBucketIcon />
            </FontColorToolbarButton>
          ),
        },
      ],
    },
    {
      id: 'lists',
      items: [
        { id: 'align', element: <AlignToolbarButton /> },
        { id: 'numlist', element: <NumberedListToolbarButton /> },
        { id: 'bullist', element: <BulletedListToolbarButton /> },
        { id: 'todolist', element: <TodoListToolbarButton /> },
        { id: 'toggle', element: <ToggleToolbarButton /> },
      ],
    },
    {
      id: 'insert2',
      items: [
        { id: 'link', element: <LinkToolbarButton /> },
        { id: 'table', element: <TableToolbarButton /> },
        { id: 'emoji', element: <EmojiToolbarButton /> },
      ],
    },
    {
      id: 'media',
      items: [
        { id: 'img', element: <MediaToolbarButton nodeType={KEYS.img} /> },
        { id: 'video', element: <MediaToolbarButton nodeType={KEYS.video} /> },
        { id: 'audio', element: <MediaToolbarButton nodeType={KEYS.audio} /> },
        { id: 'file', element: <MediaToolbarButton nodeType={KEYS.file} /> },
      ],
    },
    {
      id: 'indent',
      items: [
        { id: 'lineheight', element: <LineHeightToolbarButton /> },
        { id: 'outdent', element: <OutdentToolbarButton /> },
        { id: 'indent', element: <IndentToolbarButton /> },
      ],
    },
    {
      id: 'more',
      items: [
        { id: 'keyboardinput', element: <KeyboardInputButton /> },
        { id: 'superscript', element: <SuperscriptButton /> },
        { id: 'subscript', element: <SubscriptButton /> },
      ],
    },
    // {
    //     id: 'undoredo',
    //     items: [
    //         { id: 'undo', element: <UndoToolbarButton /> },
    //         { id: 'redo', element: <RedoToolbarButton /> },
    //     ],
    // },
    // {
    //     id: 'export',
    //     items: [
    //         { id: 'import', element: <ImportToolbarButton /> },
    //         {
    //             id: 'export', element: <ExportToolbarButton><ArrowUpToLineIcon /></ExportToolbarButton>
    //         },
    //     ],
    // },
    ...(isStudentSite
      ? []
      : [
          {
            id: 'extra',
            items: [
              {
                id: 'highlight',
                element: (
                  <MarkToolbarButton nodeType={KEYS.highlight}>
                    <HighlighterIcon />
                  </MarkToolbarButton>
                ),
              },
              { id: 'comment', element: <CommentToolbarButton /> },
              { id: 'mode', element: <ModeToolbarButton /> },
            ],
          },
        ]),
  ];
}

export function FixedToolbarButtons({
  isStudentSite,
}: {
  isStudentSite?: boolean;
}) {
  const readOnly = useEditorReadOnly();
  const [visibleGroups, setVisibleGroups] = React.useState<ToolbarGroupDef[]>(
    []
  );
  const [hiddenGroups, setHiddenGroups] = React.useState<ToolbarGroupDef[]>([]);
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);

  const groups = React.useMemo(
    () => getToolbarGroups(isStudentSite),
    [isStudentSite]
  );

  const calculate = React.useCallback(() => {
    if (!toolbarRef.current || !measureRef.current) return;
    const availableWidth = toolbarRef.current.offsetWidth - 80;

    let total = 0;
    let visibleCount = 0;
    const els = measureRef.current.children;

    for (let i = 0; i < els.length; i++) {
      const w = (els[i] as HTMLElement).offsetWidth + 4;
      if (total + w <= availableWidth) {
        total += w;
        visibleCount++;
      } else {
        break;
      }
    }

    setVisibleGroups(groups.slice(0, visibleCount));
    setHiddenGroups(groups.slice(visibleCount));
  }, [groups]);

  React.useEffect(() => {
    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, [calculate]);

  if (readOnly) return null;

  return (
    <div className="flex w-full items-center overflow-hidden" ref={toolbarRef}>
      <div
        ref={measureRef}
        className="pointer-events-none fixed -top-96 flex opacity-0"
      >
        {groups.map((group) => (
          <ToolbarGroup key={group.id}>
            {group.items.map((item) => (
              <div key={item.id}>{item.element}</div>
            ))}
          </ToolbarGroup>
        ))}
      </div>

      {visibleGroups.map((group) => (
        <ToolbarGroup key={group.id}>
          {group.items.map((item) => (
            <React.Fragment key={item.id}>{item.element}</React.Fragment>
          ))}
        </ToolbarGroup>
      ))}

      {hiddenGroups.length > 0 && (
        <DropdownMenu modal>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="px-2">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-1 p-2">
            {hiddenGroups.map((group) => (
              <ToolbarGroup key={group.id} showSeparator={false}>
                {group.items.map((item) => (
                  <React.Fragment key={item.id}>{item.element}</React.Fragment>
                ))}
              </ToolbarGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
