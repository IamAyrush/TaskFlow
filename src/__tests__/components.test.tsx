import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import ParticleBackground from '../components/ui/ParticleBackground';

describe('LoadingSpinner', () => {
  test('renders with default size', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders with text', () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders with lg size', () => {
    render(<LoadingSpinner size="lg" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders with sm size', () => {
    render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  test('renders title and description', () => {
    render(<EmptyState title="No items" description="Add some items" />);
    expect(screen.getByText('No items')).toBeInTheDocument();
    expect(screen.getByText('Add some items')).toBeInTheDocument();
  });

  test('renders with action', () => {
    render(<EmptyState title="No items" description="Add items" action={<button>Add</button>} />);
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  test('renders without action', () => {
    render(<EmptyState title="No items" description="Add items" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('ParticleBackground', () => {
  test('renders canvas element', () => {
    render(<ParticleBackground />);
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });
});
