"use client";

import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { subjects } from "@/constants";

const SubjectFilter = () => {
  const router = useRouter(); // Use router to navigate
  const searchParams = useSearchParams(); // Get the current search parameters
  const query = searchParams.get("subject") || ""; // Get the current subject from search params

  const [subject, setSubject] = useState(query); // Initialize state with the current query

  useEffect(() => {
    // Effect to handle subject changes
    let newUrl = ""; // Initialize newUrl
    if (subject === "all") {
      // If subject is 'all', remove the subject from the URL
      newUrl = removeKeysFromUrlQuery({
        // Remove the subject key from the URL
        params: searchParams.toString(), // Convert searchParams to string
        keysToRemove: ["subject"], // Specify the key to remove
      });
    } else {
      // If subject is not 'all', update the URL with the new subject
      newUrl = formUrlQuery({
        // Form a new URL with the updated subject
        params: searchParams.toString(), // Convert searchParams to string
        key: "subject", // Specify the key to update
        value: subject, // Set the value to the current subject state
      });
    }
    router.push(newUrl, { scroll: false }); // Navigate to the new URL without scrolling
  }, [subject, router, searchParams]); // Re-run effect when subject, router, or searchParams change

  return (
    <Select onValueChange={setSubject} value={subject}>
      <SelectTrigger className="input capitalize">
        <SelectValue placeholder="Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Subject</SelectItem>
        {subjects.map((subject) => (
          <SelectItem key={subject} value={subject} className="capitalize">
            {subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
