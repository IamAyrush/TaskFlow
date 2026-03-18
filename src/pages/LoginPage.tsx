import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { loginThunk, clearError } from '../store/authSlice';
import { useTheme } from '../context/ThemeContext';
import ParticleBackground from '../components/ui/ParticleBackground';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit: (values) => {
      dispatch(loginThunk(values));
    },
  });

  const inputClass = (field: 'username' | 'password') =>
    `w-full bg-gray-100 dark:bg-zinc-800/60 border rounded-xl px-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
      formik.touched[field] && formik.errors[field]
        ? 'border-red-400 dark:border-red-500/50 focus:ring-red-500/30'
        : 'border-gray-300 dark:border-zinc-700 focus:ring-yellow-500/30 focus:border-yellow-500/50'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      <ParticleBackground />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-yellow pointer-events-none" />

      {/* Theme toggle (top-right corner) */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:text-yellow-500 hover:border-yellow-500/50 transition-all duration-200 shadow-sm"
      >
        {theme === 'dark' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-2xl shadow-2xl shadow-yellow-500/40 mb-4">
            <svg className="w-9 h-9 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
            Task<span className="text-yellow-500">Flow</span>
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 mt-2 text-sm transition-colors duration-300">Manage your work, beautifully.</p>
        </div>

        {/* Form card */}
        <div className="bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl shadow-black/10 dark:shadow-black/50 transition-colors duration-300">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">Welcome back</h2>
            <p className="text-gray-400 dark:text-zinc-500 text-sm mb-6 transition-colors duration-300">
              Sign in with{' '}
              <code className="text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded text-xs">test</code>
              {' / '}
              <code className="text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded text-xs">test123</code>
            </p>

            {error && (
              <div className="mb-5 flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-3.5 transition-colors duration-300">
                <svg className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-gray-700 dark:text-zinc-300 text-sm font-medium mb-2 transition-colors duration-300" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                  className={inputClass('username')}
                  {...formik.getFieldProps('username')}
                />
                {formik.touched.username && formik.errors.username && (
                  <p className="mt-1.5 text-red-500 dark:text-red-400 text-xs">{formik.errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 dark:text-zinc-300 text-sm font-medium mb-2 transition-colors duration-300" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={inputClass('password')}
                  {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1.5 text-red-500 dark:text-red-400 text-xs">{formik.errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-2 rounded-xl bg-yellow-500 text-black font-bold text-base hover:bg-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-400 dark:text-zinc-600 text-xs mt-6 transition-colors duration-300">
          TaskFlow &copy; {new Date().getFullYear()} — Frontend Demo
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
