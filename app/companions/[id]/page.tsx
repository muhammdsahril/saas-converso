import CompanionComponent from "@/components/CompanionComponent";
import { getCompanion } from "@/lib/actions/companion.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import React from "react";

interface CompanionSessionPageProps {
  params: Promise<{ id: string}>;
}

const CompanionSession = async ({ params }: CompanionSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id) || {}; // Fetch the companion details by ID
  const user = await currentUser();

  const { name, subject, title, topic, duration } = companion; // Destructure the companion details

  if (!user) redirect("/sign-in"); // Redirect to sign-in if user is not authenticated
  if (!name) redirect("/companions"); // Redirect to companions page if no name is found

  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ background: getSubjectColor(subject) }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              alt={subject}
              width={35}
              height={35}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{name}</p>
              <div className="subject-badge max-md:hidden">
                {subject}
              </div>
            </div>
            <p className="text-lg">{topic}</p>
          </div>
        </div>
        <div className="items-start text-2xl max-md:hidden">{duration} minutes</div>
      </article>
      <CompanionComponent 
        {...companion} // Pass the companion details to the component
        companionId={id} // Pass the companion ID
        userName={user.firstName!} // Pass the user's first name
        userImage={user.imageUrl!} // Pass the user's image URL
      />
    </main>
  );
};

export default CompanionSession;
