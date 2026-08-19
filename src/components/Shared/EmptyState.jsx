import { Link } from 'react-router-dom';
import { PackageOpen, ArrowRight, RotateCcw } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Records Found',
  message = 'There is currently no data matching your request.',
  actionText = '',
  actionPath = '',
  onActionClick = null,
}) => {
  return (
    <div className="card bg-base-100 border border-base-200 p-12 text-center rounded-3xl space-y-4 shadow-sm max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-base-200/70 text-base-content/40 flex items-center justify-center mx-auto">
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="font-extrabold text-lg text-base-content tracking-tight">{title}</h3>
        <p className="text-xs text-base-content/60 max-w-sm mx-auto leading-relaxed">{message}</p>
      </div>

      {(actionText && actionPath) && (
        <div className="pt-2">
          <Link to={actionPath} className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs shadow-sm">
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {(actionText && onActionClick) && (
        <div className="pt-2">
          <button
            onClick={onActionClick}
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 text-xs shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
};
