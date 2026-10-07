import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, SupportLink, type LegalSection } from "@/components/legal/legal-page";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects your personal information.`,
};

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <p>
        {SITE.name} (&quot;we&quot;, &quot;us&quot;) is operated by {SITE.legalName}. We run the {SITE.name} website and mobile apps, where renters find flats
        listed by owners and property managers, and where owners manage their properties, tenants and rent. This policy explains what personal
        information we collect, why, and the choices you have.
      </p>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    body: (
      <>
        <p>
          <strong>Account details.</strong> Your name, email address, mobile number and password when you sign up, and a profile photo if you add one.
          Passwords are stored only in hashed form; we never see or store them in plain text.
        </p>
        <p>
          <strong>Renter activity.</strong> The listings you save, the viewings you request (property, date and time), their status, and any feedback you
          leave.
        </p>
        <p>
          <strong>Owner and team information.</strong> If you list property: your company name, property details (address, city, state, PIN code, map
          location, amenities, photos), flats and listings, and the name, email, mobile number and role of team members you add.
        </p>
        <p>
          <strong>Tenant records entered by owners.</strong> Owners can record a tenant&apos;s name and mobile number, upload up to five identity documents,
          and keep booking and rent records. The owner is responsible for having the tenant&apos;s permission to share this information with us.
        </p>
        <p>
          <strong>Search and location.</strong> When you search for flats near a place, the text you type is sent to Google Maps Platform to find the
          location. We use the result only to run your search.
        </p>
        <p>
          <strong>Technical information.</strong> Sign-in cookies (see Cookies below), and standard server logs such as IP address, browser type and the
          time of requests. Our mobile apps also store a device token so we can send push notifications.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use your information",
    body: (
      <ul>
        <li>To create and secure your account and keep you signed in.</li>
        <li>To show listings, save your favourites and send your viewing requests to the right owner.</li>
        <li>To let owners and their teams manage properties, flats, listings, tenants, bookings and monthly rent.</li>
        <li>To send service messages and notifications about your viewings and account.</li>
        <li>To keep the service safe, prevent misuse and fix problems.</li>
        <li>To meet legal obligations.</li>
      </ul>
    ),
  },
  {
    id: "what-others-see",
    title: "What other people can see",
    body: (
      <>
        <p>
          Listings are public. They show the flat&apos;s details and photos, the rent and deposit, the listing company&apos;s name, and the name and
          profile photo of the person who listed it. We do not show listers&apos; email addresses or phone numbers on listings.
        </p>
        <p>
          When you request a viewing, your name, email and mobile number are shared with the owner or property manager of that listing and with the
          team member assigned to the viewing, so they can contact you.
        </p>
      </>
    ),
  },
  {
    id: "service-providers",
    title: "Service providers we use",
    body: (
      <>
        <p>We share information only with providers that help us run the service, and only as much as they need:</p>
        <ul>
          <li>Hosting providers that run our website, servers and database.</li>
          <li>Google Firebase, to store photos and documents and to deliver push notifications in our apps.</li>
          <li>Google Maps Platform, for place search and maps.</li>
          <li>Google Play, which processes subscription purchases made in our Android app. We do not receive your card details.</li>
        </ul>
        <p>We do not sell your personal information, and we do not use advertising or analytics trackers on this website.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <>
        <p>
          We use a small number of essential cookies to keep you signed in. They hold your sign-in tokens and account type, are marked
          &quot;httpOnly&quot; so scripts in the page cannot read them, and expire after 90 days or when you sign out.
        </p>
        <p>Your light or dark theme choice is saved in your browser&apos;s local storage. We do not use cookies for advertising.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect your information",
    body: (
      <p>
        Data travels over encrypted HTTPS connections, passwords are hashed, and access to owner data is limited to members of that owner&apos;s
        company. No system is perfectly secure, so please use a strong password and keep it to yourself.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    body: (
      <p>
        We keep your information while your account is active. When you ask us to delete your account, we delete or anonymise your personal
        information, except where we must keep some records for legal, tax or dispute reasons, or where an owner keeps rental records they are
        entitled to keep.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your choices and rights",
    body: (
      <>
        <p>
          You can view and update your name, email, mobile number and photo from your profile at any time. You can also ask us to give you a copy of
          your information, correct it, or delete your account, and you can withdraw consent where we rely on it, including under India&apos;s Digital
          Personal Data Protection Act, 2023.
        </p>
        <p>
          To make a request or raise a concern, email <SupportLink />. We will respond within a reasonable time.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: <p>{SITE.name} is meant for people aged 18 and over. We do not knowingly collect information from children.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: <p>If we change this policy, we will update the date at the top of this page, and tell you in the app or by email if the change is significant.</p>,
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        Questions about privacy? Email <SupportLink />.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          Your privacy matters to us. This policy covers the {SITE.name} website and apps. By using {SITE.name} you agree to this policy and to our{" "}
          <Link href="/terms" className="font-medium text-link hover:underline">
            Terms of Service
          </Link>
          .
        </p>
      }
      sections={sections}
      related={{ href: "/terms", label: "Terms of Service" }}
    />
  );
}
