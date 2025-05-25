import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  onSearch: (input: string) => unknown;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => unknown;
  className?: string;
};

export const SearchInput = (props: SearchInputProps) => {
  const { onSearch, placeholder, onChange, value: externalValue, className } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const value = externalValue || "";

  const handleClear = useCallback(() => {
    onChange?.("");
  }, [onChange]);

  const handleSearch = async () => {
    if (!value.trim()) return;
    
    try {
      setIsLoading(true);
      await onSearch(value);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className={cn("flex gap-2 w-full max-w-md transition-all", className)}
    >
      <div 
        className={cn(
          "flex items-center w-full rounded-md border transition-all duration-200",
          "bg-background/50 hover:border-muted-foreground/25",
          isFocused ? "border-primary ring-1 ring-primary/20 shadow-sm" : "border-input"
        )}
      >
        <Search 
          className="h-4 w-4 mx-3 text-muted-foreground" 
        />
        
        <Input
          value={value}
          type="search"
          placeholder={placeholder || "Search..."}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 bg-transparent"
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          aria-label={placeholder || "Search"}
        />
        
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 mr-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
      
      <Button
        type="submit"
        variant={value.trim() ? "default" : "secondary"}
        className={cn(
          "flex items-center gap-2 transition-all duration-200",
          "min-w-[46px] px-4"
        )}
        onClick={handleSearch}
        disabled={!value.trim() || isLoading}
      >
        {isLoading ? (
          <svg 
            className="animate-spin h-4 w-4" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" cy="12" r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" 
            />
          </svg>
        ) : (
          <>
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </>
        )}
      </Button>
    </form>
  );
};
