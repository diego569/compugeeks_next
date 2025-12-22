import React from 'react';
import { Cpu } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-background py-10 mt-20">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl text-foreground">Compu<span className="text-primary">geeks</span></span>
        </div>
        <p className="text-sm text-muted-foreground">© 2025 Compugeeks Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
