import React from 'react';
import { SettingsProvider } from '../context/SettingsContext';
import { TasksProvider } from '../context/TasksContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { BookmarkProvider } from '../context/BookmarkContext';
import { EventProvider } from '../context/EventContext';
import { Popup } from './Popup';

export const PopupApp: React.FC = () => {
  return (
    <SettingsProvider>
      <TasksProvider>
        <FavoritesProvider>
          <BookmarkProvider>
            <EventProvider>
              <Popup />
            </EventProvider>
          </BookmarkProvider>
        </FavoritesProvider>
      </TasksProvider>
    </SettingsProvider>
  );
};

export default PopupApp;
