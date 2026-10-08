import React from 'react';
import { SettingsProvider } from '../context/SettingsContext';
import { TasksProvider } from '../context/TasksContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { BookmarkProvider } from '../context/BookmarkContext';
import { Popup } from './Popup';

export const PopupApp: React.FC = () => {
  return (
    <SettingsProvider>
      <TasksProvider>
        <FavoritesProvider>
          <BookmarkProvider>
            <Popup />
          </BookmarkProvider>
        </FavoritesProvider>
      </TasksProvider>
    </SettingsProvider>
  );
};

export default PopupApp;
