import React from "react";
import Image from "next/image";
import Link from "next/link";

const Cta = () => {
  return (
    <section className="cta-section">
      <div className="cta-badge">Start learning you way.</div>
      <h2 className="text-3xl font-bold">
        Build and Personalize Learning Companion
      </h2>
      <p>
        Pick a name, subject, voice, & personality — and start learning through
        voice conversations that feel natural and fun.
      </p>
      <Image src={"images/cta.svg"} alt="CTA" width={362} height={232} />
      <Link
        href={"/companions/new"}
        className="btn-primary bg-orange-500 w-full justify-center"
      >
        <button className="flex items-center justify-center gap-2">
          <Image
            src={"/icons/plus.svg"}
            alt="button cta"
            height={12}
            width={12}
            className="hidden md:block"
          />
          <p>Build New Companion</p>
        </button>
      </Link>
    </section>
  );
};

export default Cta;
