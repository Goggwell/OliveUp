"use client";

import { useMemo } from "react";
import debounce from "lodash.debounce";
import { $queryId } from "@/lib/store";
import { Input } from "@/components/ui/input";

export const Search = () => {
  const onQueryChange = useMemo(
    () =>
      debounce(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        $queryId.set(value || "");
      }, 300),
    []
  );

  return (
    <Input
      type="search"
      placeholder="Search..."
      className="w-[100px] md:w-[200px] lg:w-[300px]"
      onChange={onQueryChange}
    />
  );
};
