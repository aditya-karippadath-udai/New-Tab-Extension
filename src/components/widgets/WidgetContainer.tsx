import React from 'react';
import { useSettings } from '../../context/SettingsContext';

interface WidgetContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  id?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  children,
  className = '',
  title,
  icon,
  headerAction,
  id,
}) => {
  const { settings, effectiveTheme } = useSettings();
  const { density } = settings;

  // Density padding
  const paddingClass =
    density === 'compact'
      ? 'p-3.5 sm:p-4'
      : density === 'spacious'
      ? 'p-6 sm:p-7'
      : 'p-4 sm:p-5';

  const isDark = effectiveTheme === 'dark';

  return (
    <section
      id={id}
      className={`glass-panel rounded-2xl transition-all duration-200 border ${
        isDark
          ? 'bg-neutral-900/60 border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.35)]'
          : 'bg-white/70 border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
      } ${paddingClass} ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 dark:border-white/10 border-neutral-200/60">
          <div className="flex items-center gap-2">
            {icon && <span className="text-neutral-400 dark:text-neutral-300">{icon}</span>}
            {title && (
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                {title}
              </h2>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
