import React from 'react';
import { SettingsProvider } from '../context/SettingsContext';
import { TasksProvider } from '../context/TasksContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { BookmarkProvider } from '../context/BookmarkContext';
import { BackgroundLayer } from '../components/layout/BackgroundLayer';
import { MainDashboard } from '../components/layout/MainDashboard';

export const NewTabPage: React.FC = () => {
  return (
    <SettingsProvider>
      <TasksProvider>
        <FavoritesProvider>
          <BookmarkProvider>
            <div className="min-h-screen relative font-sans text-neutral-100 antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
              {/* Wallpaper, Scrim & Animation Layer */}
              <BackgroundLayer />

              {/* Dashboard Interface */}
              <MainDashboard />
            </div>
          </BookmarkProvider>
        </FavoritesProvider>
      </TasksProvider>
    </SettingsProvider>
  );
};

export default NewTabPage;
