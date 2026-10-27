import Script from "next/script";
import { ClarityScope } from "./ClarityScope";

const CLARITY_PROJECT_ID = (process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "").trim();

/**
 * Microsoft Clarity (session recordings + heatmaps). Rendered from the landing
 * page only (app/page.tsx), never the root layout, so /privacy, /terms and
 * /review are not recorded. Renders NOTHING unless
 * NEXT_PUBLIC_CLARITY_PROJECT_ID is set to a well-formed id; NEXT_PUBLIC_
 * values are baked in at build time, so a change needs a redeploy.
 */
export function Clarity() {
  if (!/^[a-z0-9]+$/i.test(CLARITY_PROJECT_ID)) return null;

  return (
    <>
      <Script id="ms-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
      </Script>
      <ClarityScope />
    </>
  );
}
