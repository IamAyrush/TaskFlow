interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 mb-6 relative">
        <div className="absolute inset-0 bg-yellow-500/10 rounded-full animate-ping" />
        <div className="relative w-24 h-24 bg-gray-100 dark:bg-zinc-900 border border-yellow-500/20 rounded-full flex items-center justify-center transition-colors duration-300">
          <svg className="w-10 h-10 text-yellow-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">{title}</h3>
      <p className="text-gray-500 dark:text-zinc-400 max-w-sm mb-6 transition-colors duration-300">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
