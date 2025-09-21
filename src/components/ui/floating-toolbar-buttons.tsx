'use client';

import {
    BoldIcon,
    Code2Icon,
    ItalicIcon,
    StrikethroughIcon,
    UnderlineIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly, usePluginOption } from 'platejs/react';
import { CommentToolbarButton } from './comment-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MoreToolbarButton } from './more-toolbar-button';
import { SuggestionToolbarButton } from './suggestion-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoToolbarButton } from './turn-into-toolbar-button';
import { SuggestionPlugin } from '@platejs/suggestion/react';

export function FloatingToolbarButtons({ isStudentSite }: { isStudentSite?: boolean; }) {
    const readOnly = useEditorReadOnly();
    const isSuggesting = usePluginOption(SuggestionPlugin, 'isSuggesting');

    return (
        <>
            {!readOnly && (
                <>
                    <ToolbarGroup>
                        <TurnIntoToolbarButton />

                        <MarkToolbarButton
                            nodeType={KEYS.bold}
                            tooltip="Bold (⌘+B)"
                        >
                            <BoldIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={KEYS.italic}
                            tooltip="Italic (⌘+I)"
                        >
                            <ItalicIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={KEYS.underline}
                            tooltip="Underline (⌘+U)"
                        >
                            <UnderlineIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={KEYS.strikethrough}
                            tooltip="Strikethrough (⌘+⇧+M)"
                        >
                            <StrikethroughIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={KEYS.code}
                            tooltip="Code (⌘+E)"
                        >
                            <Code2Icon />
                        </MarkToolbarButton>
                        <LinkToolbarButton />
                    </ToolbarGroup>
                </>
            )}

            <ToolbarGroup>
                {!isStudentSite || isSuggesting && <>
                    <CommentToolbarButton />
                    <SuggestionToolbarButton />
                </>
                }

                {!readOnly && <MoreToolbarButton />}
            </ToolbarGroup>
        </>
    );
}
