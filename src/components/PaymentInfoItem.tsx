import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface PaymentInfoItemProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}

const PaymentInfoItem: React.FC<PaymentInfoItemProps> = ({ 
  icon: Icon, 
  label, 
  value,
  className = '' 
}) => {
  return (
    <div className={className}>
      <p className="text-sm dark:text-gray-100 text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#bd9554]" />
        <strong>{label}:</strong>
      </p>
      <span className="text-gray-900 dark:text-gray-100 text-ellipsis">
        {value}
      </span>
    </div>
  );
};

export default PaymentInfoItem;
