// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  className = ''
}) => {
  return <Card className={`${className} h-full`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardContent>
    </Card>;
};
export default StatsCard;