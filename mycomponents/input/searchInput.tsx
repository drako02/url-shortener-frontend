import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useCallback } from "react";

type SearchInputProps = {
  onSearch: (input: string) => unknown;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => unknown;
};
export const SearchInput = (props: SearchInputProps) => {
  const { onSearch, placeholder, onChange, value: externalValue } = props;

  const value = externalValue || "";

  const handleClear = useCallback(() => {
    onChange?.("");
  }, [onChange]);

  const handleSearch = () => {
    onSearch(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="flex gap-2"
    >
      <div className="flex items-center rounded-md border-[1.5px]">
        <label htmlFor="search-input" className="sr-only">
          {placeholder}
        </label>
        <Button
          variant="ghost"
          asChild
          className=" flex bg-transparent hover:bg-transparent shadow-none p-[2.5%]"
        >
          <Search className="flex-[0.1]" />
        </Button>
        <Input
          value={value}
          type="search"
          placeholder={placeholder || "Search"}
          className="flex-1 border-0 shadow-none focus-visible:ring-0 active:bo px-[1%]"
          // onChange={(e) => setInput(e.target.value)}
          onChange={handleChange}
        />
        <Button
          variant="ghost"
          asChild
          className=" flex bg-transparent hover:bg-transparent cursor-pointer shadow-none p-[2.5%]"
          onClick={handleClear}
        >
          <X className="flex-[0.1]" />
        </Button>
      </div>
      <Button
        type="submit"
        variant="default"
        className="flex shadow-none hover:bg-[#686868]"
        onClick={handleSearch}
        disabled={!value}
      >
        <Search />
      </Button>
    </form>
  );
};
