import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-primary transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li>
              {item.href ? (
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium max-w-[200px] truncate block">{item.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
