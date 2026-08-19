export const LoadingSpinner = ({ text = 'Verifying authentication session...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100/90 backdrop-blur-md space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="absolute w-8 h-8 rounded-full border-4 border-secondary/30 border-b-secondary animate-spin [animation-direction:reverse]"></div>
        </div>
        <p className="text-sm font-bold text-base-content/80 animate-pulse tracking-wide">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      </div>
      <p className="text-xs font-semibold text-base-content/60 animate-pulse tracking-wide">{text}</p>
    </div>
  );
};
