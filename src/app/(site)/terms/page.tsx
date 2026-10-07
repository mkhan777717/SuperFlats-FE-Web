import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, SupportLink, type LegalSection } from "@/components/legal/legal-page";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply when you use ${SITE.name}.`,
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "About these terms",
    body: (
      <p>
        These terms are an agreement between you and {SITE.legalName} for your use of the {SITE.name} website and apps. By creating an account or using{" "}
        {SITE.name}, you agree to these terms and to our{" "}
        <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do not use the service.
      </p>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    body: (
      <ul>
        <li>You must be at least 18 years old and able to enter into a binding contract.</li>
        <li>Give accurate information and keep it up to date.</li>
        <li>Keep your password secret. You are responsible for activity on your account.</li>
        <li>Tell us straight away at <SupportLink /> if you think someone else has used your account.</li>
      </ul>
    ),
  },
  {
    id: "renters",
    title: "For renters",
    body: (
      <>
        <p>
          Listings are created by owners and property managers, not by {SITE.name}. We do not inspect properties or verify every detail, so we cannot
          guarantee that a listing is accurate, available or suitable.
        </p>
        <p>
          A viewing request is a request to see the property. It is not a booking, reservation or rental agreement. Please visit the property, check the
          documents and agree the terms with the owner before paying any money.
        </p>
      </>
    ),
  },
  {
    id: "owners",
    title: "For owners and property managers",
    body: (
      <ul>
        <li>Only list properties you own or are authorised to rent out.</li>
        <li>Keep listings accurate, including rent, deposit, photos and availability, and close them when a flat is no longer available.</li>
        <li>Only upload photos and documents you have the right to use.</li>
        <li>
          If you add tenant details or identity documents, you must have the tenant&apos;s permission and handle their information lawfully.
        </li>
        <li>You are responsible for your rental agreements and for following the laws that apply to renting property.</li>
        <li>You are responsible for the actions of team members you add to your account.</li>
      </ul>
    ),
  },
  {
    id: "plans",
    title: "Plans and payments",
    body: (
      <>
        <p>
          Browsing, saving listings and requesting viewings are free for renters. Owners can use a free plan or a paid plan (Pro or Org) with higher
          limits, such as the number of active listings and team members, as shown in the app at the time of purchase.
        </p>
        <p>
          Paid plans are currently bought through Google Play in our Android app and are also subject to Google Play&apos;s terms, including its billing,
          renewal and refund rules. If a paid plan ends, your account returns to the free plan&apos;s limits.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When using {SITE.name}, you must not:</p>
        <ul>
          <li>Post fake, misleading or duplicate listings, or listings for properties that are not available.</li>
          <li>Harass, threaten or unlawfully discriminate against anyone.</li>
          <li>Send spam or use people&apos;s contact details for anything other than the rental in question.</li>
          <li>Copy, scrape or resell listings or other data from the service.</li>
          <li>Try to access accounts or data that are not yours, or interfere with how the service works.</li>
          <li>Break any law.</li>
        </ul>
      </>
    ),
  },
  {
    id: "content",
    title: "Your content",
    body: (
      <p>
        You keep ownership of the listings, photos and other content you add. You give us permission to store, display and adapt that content (for
        example, resizing photos) so we can run and promote the service. We may remove content that breaks these terms.
      </p>
    ),
  },
  {
    id: "our-role",
    title: "Our role",
    body: (
      <p>
        {SITE.name} is a platform that connects renters with owners and gives owners tools to manage their properties. We are not a party to any rental
        agreement between renters and owners, and we are not responsible for the condition of a property or for what either side does.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Suspension and closing accounts",
    body: (
      <p>
        You can stop using {SITE.name} at any time and ask us to delete your account by emailing <SupportLink />. We may suspend or close accounts that
        break these terms or put other users at risk.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Disclaimers and liability",
    body: (
      <p>
        We work to keep {SITE.name} available and accurate, but the service is provided &quot;as is&quot; and may sometimes be unavailable or contain
        errors. To the extent the law allows, we are not liable for indirect or consequential losses, or for losses arising from listings, viewings or
        rental arrangements between users.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These terms are governed by the laws of India, and disputes will be handled by the courts of India that have jurisdiction.</p>,
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: <p>We may update these terms. We will change the date at the top of this page and let you know about significant changes before they apply.</p>,
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        Questions about these terms? Email <SupportLink />.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={<p>Please read these terms carefully. They explain your rights and responsibilities when you use {SITE.name}.</p>}
      sections={sections}
      related={{ href: "/privacy", label: "Privacy Policy" }}
    />
  );
}
