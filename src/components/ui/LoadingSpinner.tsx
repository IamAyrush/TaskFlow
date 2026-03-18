interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status">
      <div className={`${sizeMap[size]} relative`}>
        <div className={`${sizeMap[size]} rounded-full border-2 border-yellow-500/20 absolute`} />
        <div className={`${sizeMap[size]} rounded-full border-t-2 border-yellow-500 animate-spin absolute`} />
      </div>
      {text && <p className="text-yellow-500/70 text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
