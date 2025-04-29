import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

type SearchInputProps = {
  onSearch: (input: string) => unknown;
  placeholder?: string;
  // value?:string;
  onChange?: (value:string) => unknown
};
export const SearchInput = (props: SearchInputProps) => {
  const [value, setValue] = useState<string>("");
  const { onSearch, placeholder, onChange } = props;

  const handleClear = useCallback(() => {
    setValue("");
    onChange?.("");
  }, [onChange]);
  
  const handleSearch = () => {
    onSearch(value);
    console.log("search", value);
    // setValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
    setValue(e.target.value);
  }

  return (
    <div className="flex gap-2">
      <div className="flex items-center rounded-md border-[1.5px]">
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
        variant="default"
        className="flex shadow-none hover:bg-[#686868]"
        onClick={handleSearch}
      >
        <Search />
      </Button>
    </div>
  );
};
