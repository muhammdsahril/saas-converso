"use client";

import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchInput = () => {
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Use router to navigate
  const searchParams = useSearchParams(); // Get the current search parameters
  const query = searchParams.get("topic") || ""; // Get the current topic from search params

  const [searchQuery, setSearchQuery] = useState(""); // Initialize state with an empty string

  useEffect(() => { // Effect to handle search query changes
    const delayDebounceFn = setTimeout(() => { // Debounce the search input, make the search have delay
      if (searchQuery) { // If searchQuery is not empty, update the URL with the new topic
        const newUrl = formUrlQuery({ // Form a new URL with the updated topic
          params: searchParams.toString(), // Convert searchParams to string
          key: "topic", // Specify the key to update
          value: searchQuery, // Set the value to the current searchQuery state
        });

        router.push(newUrl, { scroll: false }); // Navigate to the new URL without scrolling
      } else { // If searchQuery is empty, remove the topic from the URL
        if (pathname === "/companions") { // Only remove topic if on companions page
          const newUrl = removeKeysFromUrlQuery({ // Remove the topic key from the URL
            params: searchParams.toString(), // Convert searchParams to string
            keysToRemove: ["topic"], // Specify the key to remove
          });

          router.push(newUrl, { scroll: false }); // Navigate to the new URL without scrolling
        }
      }
    }, 500); // Seconds of delay
  }, [searchQuery, router, searchParams, pathname]); // Re-run effect when searchQuery, router, searchParams, or pathname change

  return (
    <div className="relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit">
      <Image src={"/icons/search.svg"} alt="search" width={15} height={15} />
      <input
        placeholder="Search companion..."
        className="outline-none"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
