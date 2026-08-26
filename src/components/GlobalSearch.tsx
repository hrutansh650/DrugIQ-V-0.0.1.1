import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const searchItems = [
    { title: 'Home', path: '/', category: 'Pages' },
    { title: 'Drugs', path: '/drugs', category: 'Pages' },
    { title: 'Categories', path: '/categories', category: 'Pages' },
    { title: 'Analytics', path: '/analytics', category: 'Pages' },
    { title: 'Patients', path: '/patients', category: 'Pages' },
    { title: 'Profile', path: '/profile', category: 'Pages' },
    { title: 'Metformin', path: '/drugs', category: 'Drugs' },
    { title: 'Amlodipine', path: '/drugs', category: 'Drugs' },
    { title: 'Atorvastatin', path: '/drugs', category: 'Drugs' },
  ];

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <div className="relative hidden sm:block w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search... (Ctrl+K)"
          className="pl-9 pr-4"
          onClick={() => setOpen(true)}
          readOnly
        />
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for drugs, pages, or features..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {['Pages', 'Drugs'].map((category) => (
            <CommandGroup key={category} heading={category}>
              {searchItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <CommandItem
                    key={item.path + item.title}
                    onSelect={() => handleSelect(item.path)}
                  >
                    {item.title}
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;