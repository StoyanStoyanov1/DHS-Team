import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    message: string;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    const typeToClassName = {
        success: 'bg-green-50 text-green-700 border-green-200',
        error: 'bg-red-50 text-red-700 border-red-200',
        warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        info: 'bg-blue-50 text-blue-700 border-blue-200',
    };

    const typeToIcon = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <XCircle size={20} className="text-red-500" />,
        warning: <AlertTriangle size={20} className="text-yellow-500" />,
        info: <Info size={20} className="text-blue-500" />,
    };

    return (
        <div className={`rounded-md border p-4 mb-4 flex items-start ${typeToClassName[type]}`}>
            <div className="flex-shrink-0 mr-3 mt-0.5">
                {typeToIcon[type]}
            </div>
            <div className="flex-1 text-sm">
                {message}
            </div>
            {onClose && (
                <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    onClick={onClose}
                >
                    <span className="sr-only">Dismiss</span>
                    <XCircle size={16} className="text-gray-400 hover:text-gray-500" />
                </button>
            )}
        </div>
    );
};

export default Alert;