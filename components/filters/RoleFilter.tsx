'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoleFilterProps {
  paramName: string;
  placeholder?: string;
  className?: string;
}

const roleOptions = [
  { value: 'admin', label: 'Admin', color: '#3b82f6' },
  { value: 'user', label: 'User', color: '#6b7280' },
];

export default function RoleFilter({
  paramName,
  placeholder = 'Filter by role',
  className = ''
}: RoleFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentValue = searchParams.get(paramName) || 'all';

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === 'all') {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }

    // Reset to page 1 when filtering
    params.delete('page');

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={className}>
      <Select value={currentValue} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-full min-w-[150px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roleOptions.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              <div className="flex items-center gap-2">
                {role.color && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                )}
                {role.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
