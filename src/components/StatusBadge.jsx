// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Badge } from '@/components/ui';

export function StatusBadge({
  status
}) {
  const statusConfig = {
    pending: {
      label: '待接收',
      variant: 'secondary',
      className: 'bg-gray-100 text-gray-800'
    },
    'in-progress': {
      label: '检验中',
      variant: 'default',
      className: 'bg-blue-100 text-blue-800'
    },
    completed: {
      label: '已完成',
      variant: 'success',
      className: 'bg-green-100 text-green-800'
    },
    urgent: {
      label: '紧急',
      variant: 'destructive',
      className: 'bg-red-100 text-red-800'
    }
  };
  const config = statusConfig[status] || statusConfig.pending;
  return <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>;
}