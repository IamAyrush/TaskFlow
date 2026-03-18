import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logoutThunk } from '../../store/authSlice';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const user = useAppSelector(state => state.auth.user);
  const tasks = useAppSelector(state => state.tasks.tasks);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  const completedCount = tasks.filter(t => t.status === 'done').length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-yellow-500/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight transition-colors duration-300">
            Task<span className="text-yellow-500">Flow</span>
          </span>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="text-center">
            <div className="text-yellow-500 font-bold text-lg leading-none">{tasks.length}</div>
            <div className="text-gray-400 dark:text-zinc-500 text-xs mt-0.5 transition-colors duration-300">Total</div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-zinc-800 transition-colors duration-300" />
          <div className="text-center">
            <div className="text-green-500 dark:text-green-400 font-bold text-lg leading-none transition-colors duration-300">{completedCount}</div>
            <div className="text-gray-400 dark:text-zinc-500 text-xs mt-0.5 transition-colors duration-300">Done</div>
          </div>
        </div>

        {/* Right side: theme toggle + user + logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:text-yellow-500 dark:hover:text-yellow-500 hover:border-yellow-500/50 transition-all duration-200"
          >
            {theme === 'dark' ? (
              /* Sun icon for switching to light */
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              /* Moon icon for switching to dark */
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <span className="text-yellow-500 text-sm font-bold">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-600 dark:text-zinc-300 text-sm font-medium transition-colors duration-300">{user?.username}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:border-yellow-500/50 transition-all duration-200 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
