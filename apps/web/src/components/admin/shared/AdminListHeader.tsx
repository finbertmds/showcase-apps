import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AdminListHeaderProps {
  title: string;
  description: string;
  actionButton?: {
    href?: string;
    onClick?: () => void;
    text: string;
    icon?: ReactNode;
  };
}

export function AdminListHeader({ title, description, actionButton }: AdminListHeaderProps) {
  const ActionButton = actionButton ? (
    actionButton.href ? (
      <Link
        href={actionButton.href}
        className="btn-primary inline-flex items-center space-x-2 p-2"
      >
        {actionButton.icon || <PlusIcon className="h-4 w-4" />}
        <span>{actionButton.text}</span>
      </Link>
    ) : (
      <button
        onClick={actionButton.onClick}
        className="btn-primary inline-flex items-center space-x-2 p-2"
      >
        {actionButton.icon || <PlusIcon className="h-4 w-4" />}
        <span>{actionButton.text}</span>
      </button>
    )
  ) : null;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {ActionButton}
    </div>
  );
}
