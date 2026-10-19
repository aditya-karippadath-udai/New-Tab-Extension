import React from 'react';
import { BookmarkContextMenu } from './BookmarkContextMenu';
import { AddBookmarkDialog } from './AddBookmarkDialog';
import { AddFolderDialog } from './AddFolderDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ImportExportDialog } from './ImportExportDialog';

export const BookmarkModals: React.FC = () => {
  return (
    <>
      <BookmarkContextMenu />
      <AddBookmarkDialog />
      <AddFolderDialog />
      <DeleteConfirmDialog />
      <ImportExportDialog />
    </>
  );
};
