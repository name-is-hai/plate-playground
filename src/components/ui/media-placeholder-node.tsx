'use client';

import * as React from 'react';

import type { TPlaceholderElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';

import {
  PlaceholderPlugin,
  PlaceholderProvider,
  updateUploadHistory,
} from '@platejs/media/react';
import { AudioLines, FileUp, Film, ImageIcon, Loader2Icon } from 'lucide-react';
import { KEYS } from 'platejs';
import {
  PlateElement,
  useEditorPlugin,
  useReadOnly,
  withHOC,
} from 'platejs/react';
import { useFilePicker } from 'use-file-picker';

import { useUploadFile } from '@/hooks/use-upload-file';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

const CONTENT: Record<
  string,
  {
    accept: string[];
    content: React.ReactNode;
    icon: React.ReactNode;
  }
> = {
  [KEYS.audio]: {
    accept: ['audio/*'],
    content: 'Add an audio file',
    icon: <AudioLines />,
  },
  [KEYS.file]: {
    accept: ['*'],
    content: 'Add a file',
    icon: <FileUp />,
  },
  [KEYS.img]: {
    accept: ['image/*'],
    content: 'Add an image',
    icon: <ImageIcon />,
  },
  [KEYS.video]: {
    accept: ['video/*'],
    content: 'Add a video',
    icon: <Film />,
  },
};

export const PlaceholderElement = withHOC(
  PlaceholderProvider,
  function PlaceholderElement(props: PlateElementProps<TPlaceholderElement>) {
    const { editor, element } = props;

    const { api } = useEditorPlugin(PlaceholderPlugin);

    const readOnly = useReadOnly();
    console.log(readOnly);

    const { isUploading, progress, uploadedFile, uploadFile, uploadingFile } =
      useUploadFile();

    const loading = isUploading && uploadingFile;

    const currentContent = CONTENT[element.mediaType];

    const isImage = element.mediaType === KEYS.img;

    const imageRef = React.useRef<HTMLImageElement>(null);

    const [open, setOpen] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'upload' | 'embed'>(
      'upload'
    );
    const [embedUrl, setEmbedUrl] = React.useState('');

    const { openFilePicker } = useFilePicker({
      accept: currentContent.accept,
      multiple: true,
      onFilesSelected: ({ plainFiles: updatedFiles }) => {
        const firstFile = updatedFiles[0];
        const restFiles = updatedFiles.slice(1);

        replaceCurrentPlaceholder(firstFile);

        if (restFiles.length > 0) {
          editor.getTransforms(PlaceholderPlugin).insert.media(restFiles);
        }
      },
    });

    const replaceCurrentPlaceholder = React.useCallback(
      (file: File) => {
        void uploadFile(file);
        api.placeholder.addUploadingFile(element.id as string, file);
      },
      [api.placeholder, element.id, uploadFile]
    );

    React.useEffect(() => {
      if (!uploadedFile) return;

      const path = editor.api.findPath(element);

      editor.tf.withoutSaving(() => {
        editor.tf.removeNodes({ at: path });

        const node = {
          children: [{ text: '' }],
          initialHeight: imageRef.current?.height,
          initialWidth: imageRef.current?.width,
          isUpload: true,
          name: element.mediaType === KEYS.file ? uploadedFile.name : '',
          placeholderId: element.id as string,
          type: element.mediaType!,
          url: uploadedFile.ufsUrl,
        };

        editor.tf.insertNodes(node, { at: path });

        updateUploadHistory(editor, node);
      });

      api.placeholder.removeUploadingFile(element.id as string);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uploadedFile, element.id]);

    // React dev mode will call React.useEffect twice
    const isReplaced = React.useRef(false);

    /** Paste and drop */
    React.useEffect(() => {
      if (isReplaced.current) return;

      isReplaced.current = true;
      const currentFiles = api.placeholder.getUploadingFile(
        element.id as string
      );

      if (!currentFiles) return;

      replaceCurrentPlaceholder(currentFiles);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReplaced]);

    return (
      <PlateElement className="my-1" {...props}>
        {(!loading || !isImage) && (
          <Popover
            open={open}
            onOpenChange={(value) => {
              if (!loading && !readOnly) setOpen(value);
              else setOpen(false);
            }}
            modal={false}
          >
            <PopoverTrigger asChild>
              <div
                className={cn(
                  'flex cursor-pointer items-center rounded-sm bg-muted p-3 pr-9 select-none hover:bg-primary/10'
                )}
                contentEditable={false}
              >
                <div className="relative mr-3 flex text-muted-foreground/80 [&_svg]:size-6">
                  {currentContent.icon}
                </div>
                <div className="text-sm whitespace-nowrap text-muted-foreground">
                  <div>
                    {loading ? uploadingFile?.name : currentContent.content}
                  </div>

                  {loading && !isImage && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <div>{formatBytes(uploadingFile?.size ?? 0)}</div>
                      <div>–</div>
                      <div className="flex items-center">
                        <Loader2Icon className="mr-1 size-3.5 animate-spin text-muted-foreground" />
                        {progress ?? 0}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="flex w-72 flex-col gap-2">
              <div className="mb-2 flex border-b">
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('upload')}
                >
                  Upload
                </button>
                <button
                  className={`px-4 py-2 font-medium ${activeTab === 'embed' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setActiveTab('embed')}
                >
                  Embed link
                </button>
              </div>
              {activeTab === 'upload' ? (
                <div className="flex flex-col items-center gap-2">
                  <Button
                    size={'sm'}
                    className="w-full"
                    onClick={() => {
                      setOpen(false);
                      openFilePicker();
                    }}
                  >
                    Upload file
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    The maximum size per file is 5MB
                  </span>
                </div>
              ) : (
                <div className="flex w-full flex-col items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paste the link..."
                    className="mb-2 w-full rounded border px-2 py-1"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                  />
                  <Button
                    className="w-full"
                    size={'sm'}
                    disabled={!embedUrl.trim()}
                    onClick={() => {
                      if (!embedUrl.trim()) return;
                      const path = editor.api.findPath(element);
                      const node = {
                        children: [{ text: '' }],
                        type: element.mediaType,
                        url: embedUrl.trim(),
                        placeholderId: element.id,
                      };
                      editor.tf.withoutSaving(() => {
                        editor.tf.removeNodes({ at: path });
                        editor.tf.insertNodes(node, { at: path });
                        updateUploadHistory(editor, node);
                      });
                      setEmbedUrl('');
                      setOpen(false);
                    }}
                  >
                    Embed image
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}

        {isImage && loading && (
          <ImageProgress
            file={uploadingFile}
            imageRef={imageRef}
            progress={progress}
          />
        )}

        {props.children}
      </PlateElement>
    );
  }
);

export function ImageProgress({
  className,
  file,
  imageRef,
  progress = 0,
}: {
  file: File;
  className?: string;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  progress?: number;
}) {
  const [objectUrl, setObjectUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!objectUrl) {
    return null;
  }

  return (
    <div className={cn('relative', className)} contentEditable={false}>
      <img
        ref={imageRef}
        className="h-auto w-full rounded-sm object-cover"
        alt={file.name}
        src={objectUrl}
      />
      {progress < 100 && (
        <div className="absolute right-1 bottom-1 flex items-center space-x-2 rounded-full bg-black/50 px-1 py-0.5">
          <Loader2Icon className="size-3.5 animate-spin text-muted-foreground" />
          <span className="text-xs font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];

  if (bytes === 0) return '0 Byte';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}
