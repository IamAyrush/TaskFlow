import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

const renderWithProvider = () =>
  render(
    <ThemeProvider>
      <ThemeConsumer />
    </ThemeProvider>
  );

describe('ThemeContext', () => {
  beforeEach(() => localStorage.clear());

  test('defaults to dark mode', () => {
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('toggles to light mode', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('toggles back to dark mode', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle'));
    fireEvent.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('persists theme to localStorage', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle'));
    expect(localStorage.getItem('taskflow_theme')).toBe('light');
  });

  test('reads theme from localStorage on mount', () => {
    localStorage.setItem('taskflow_theme', 'light');
    renderWithProvider();
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });
});
