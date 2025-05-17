import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MutableRefObject } from 'react';
import useAction from '@/lib/core/useAction';

interface PrivacyPolicyProps {
  privacyPolicyRef: MutableRefObject<HTMLDivElement | null>;
}

export default function PrivacyPolicy({ privacyPolicyRef }: PrivacyPolicyProps) {
  const { action } = useAction();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-left mb-2" ref={privacyPolicyRef}>
          {action === 'scrollToPrivacyPolicy' ? '💡 ' : ''}Privacy Policy
        </CardTitle>
        <CardTitle className="text-md font-medium text-left mb-4">
          Last updated on: 27 Nov 2024
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="overview">
            <AccordionTrigger>Overview</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <h3 className="text-lg font-semibold mb-2">General Information</h3>
              <p>
                The following notes provide a simple overview of what happens to your personal data
                when you visit this website. Personal data is any data that can be used to identify
                you personally. For detailed information on the subject of data protection, please
                refer to our privacy policy listed below this text.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Data Collection on This Website</h3>
              <h4 className="text-md font-semibold mb-1">
                Who is responsible for data collection on this website?
              </h4>
              <p>
                Data processing on this website is carried out by the website operator. You can find
                their contact details in the section &apos;Information on the Responsible
                Party&apos; in this privacy policy.
              </p>

              <h4 className="text-md font-semibold mt-3 mb-1">How do we collect your data?</h4>
              <p>
                Your data is collected in part when you provide it to us. This could be data you
                enter in a contact form, for example.
              </p>
              <p>
                Other data is automatically collected or collected with your consent by our IT
                systems when you visit the website. This is primarily technical data (e.g., internet
                browser, operating system, or time of page view). This data is collected
                automatically as soon as you enter our website.
              </p>

              <h4 className="text-md font-semibold mt-3 mb-1">What do we use your data for?</h4>
              <p>
                Part of the data is collected to ensure error-free provision of the website. Other
                data may be used to analyze your user behavior.
              </p>

              <h4 className="text-md font-semibold mt-3 mb-1">
                What rights do you have regarding your data?
              </h4>
              <p>
                You have the right to receive information about the origin, recipient, and purpose
                of your stored personal data free of charge at any time. You also have the right to
                request the correction or deletion of this data. If you have given consent for data
                processing, you can revoke this consent at any time for the future. You also have
                the right to request the restriction of the processing of your personal data under
                certain circumstances. Furthermore, you have the right to lodge a complaint with the
                competent supervisory authority.
              </p>
              <p>
                You can contact us at any time regarding this and other questions on the topic of
                data protection.
              </p>

              <h4 className="text-md font-semibold mt-3 mb-1">
                Analysis Tools and Third-Party Tools
              </h4>
              <p>
                When visiting this website, your surfing behavior may be statistically analyzed.
                This is done primarily with so-called analysis programs.
              </p>
              <p>
                Detailed information about these analysis programs can be found in the following
                privacy policy.
              </p>
              <h5 className="text-md font-semibold mb-2">Vercel Web Analytics</h5>
              <p>
                This website uses <strong>Vercel Web Analytics</strong> to collect anonymized
                information about visitor interactions, such as page views and duration. This data
                is used to understand usage patterns and improve website performance.
              </p>
              <p>
                Vercel Analytics does not store any personally identifiable information (PII) and
                operates in compliance with privacy laws such as the GDPR.
              </p>
              <p>
                The legal basis for this processing is Art. 6(1)(f) GDPR – legitimate interest in
                optimizing our website.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hosting">
            <AccordionTrigger>Hosting and Content Delivery Networks (CDN)</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <h3 className="text-lg font-semibold mb-2">External Hosting</h3>
              <p>
                This website is hosted by an external service provider (hoster). The personal data
                collected on this website is stored on the hoster&apos;s servers. This may include
                IP addresses, contact requests, meta and communication data, contract data, contact
                details, names, website accesses, and other data generated via a website.
              </p>
              <p>
                The hoster is used for the purpose of fulfilling contracts with our potential and
                existing customers (Art. 6 para. 1 lit. b GDPR) and in the interest of a secure,
                fast, and efficient provision of our online offer by a professional provider (Art. 6
                para. 1 lit. f GDPR).
              </p>
              <p>
                Our hoster will only process your data to the extent necessary to fulfill its
                performance obligations and will follow our instructions regarding this data.
              </p>

              <h4 className="text-md font-semibold mt-3 mb-1">
                We use the following hoster and infrastructure provider:
              </h4>
              <div className="flex flex-col gap-2">
                <div>
                  <h5 className="font-medium mb-1">for our website:</h5>
                  <p className="text-sm">
                    Vercel Inc.
                    <br />
                    340 S Lemon Ave #4133
                    <br />
                    Walnut, CA 91789
                    <br />
                    privacy@vercel.com
                    <br />
                    <Link
                      href="https://vercel.com"
                      rel={'nofollow'}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      vercel.com
                    </Link>
                  </p>
                </div>
                <div>
                  <h5 className="font-medium mb-1">for our server and database:</h5>
                  <p className="text-sm">
                    DMCA Agent
                    <br />
                    Fly.io
                    <br />
                    2261 Market Street
                    <br />
                    #4990 San Francisco, CA 94114
                    <br />
                    support@fly.io
                    <br />
                    <Link
                      rel={'nofollow'}
                      href="https://fly.io"
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      fly.io
                    </Link>
                  </p>
                </div>
              </div>

              <h4 className="text-md font-semibold mt-3 mb-1">
                Conclusion of a Contract for Order Processing
              </h4>
              <p>
                To ensure data protection compliant processing, we have concluded a contract for
                order processing with our hoster.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="general">
            <AccordionTrigger>General Information and Mandatory Information</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <h3 className="text-lg font-semibold mb-2">Data Protection</h3>
              <p>
                The operators of these pages take the protection of your personal data very
                seriously. We treat your personal data confidentially and in accordance with the
                statutory data protection regulations and this privacy policy.
              </p>
              <p>
                When you use this website, various personal data is collected. Personal data is data
                that can be used to identify you personally. This privacy policy explains what data
                we collect and what we use it for. It also explains how and for what purpose this is
                done.
              </p>
              <p>
                We would like to point out that data transmission over the Internet (e.g., when
                communicating by e-mail) may have security gaps. Complete protection of data against
                access by third parties is not possible.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">
                Information on the Responsible Party
              </h3>
              <p>The responsible party for data processing on this website is:</p>
              <p className="mt-2 mb-2">
                QUIKK Software GmbH
                <br />
                Hahler Straße 285
                <br />
                32427 Minden
                <br />
                E-Mail: hello@pattern-paradise.shop
              </p>
              <p>
                The responsible party is the natural or legal person who alone or jointly with
                others determines the purposes and means of the processing of personal data (e.g.,
                names, e-mail addresses, etc.).
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Storage Duration</h3>
              <p>
                Unless a more specific storage period has been specified within this privacy policy,
                your personal data will remain with us until the purpose for data processing no
                longer applies. If you assert a legitimate request for deletion or revoke your
                consent to data processing, your data will be deleted unless we have other legally
                permissible reasons for storing your personal data (e.g., retention periods under
                tax or commercial law); in the latter case, the data will be deleted once these
                reasons no longer apply.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Rights of the Data Subject</h3>
              <p>
                You have the right to receive information about your stored personal data, its
                origin, recipient, and the purpose of data processing free of charge at any time.
                You also have the right to request the correction or deletion of this data. You can
                contact us at any time at the address given in the imprint if you have further
                questions about personal data.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">
                Right to Object to Data Collection in Special Cases and to Direct Advertising
              </h3>
              <p>
                If the data processing is based on Art. 6 para. 1 lit. e or f GDPR, you have the
                right to object to the processing of your personal data at any time for reasons
                arising from your particular situation; this also applies to profiling based on
                these provisions. The respective legal basis on which processing is based can be
                found in this privacy policy. If you object, we will no longer process your personal
                data concerned unless we can demonstrate compelling legitimate grounds for the
                processing which override your interests, rights and freedoms, or the processing
                serves the purpose of asserting, exercising or defending legal claims (objection
                under Art. 21 para. 1 GDPR).
              </p>
              <p>
                If your personal data is processed for the purpose of direct advertising, you have
                the right to object at any time to the processing of personal data concerning you
                for the purpose of such advertising; this also applies to profiling insofar as it is
                associated with such direct advertising. If you object, your personal data will
                subsequently no longer be used for the purpose of direct advertising (objection
                pursuant to Art. 21 (2) GDPR).
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">
                Right of Appeal to the Competent Supervisory Authority
              </h3>
              <p>
                In the event of violations of the GDPR, data subjects have a right of appeal to a
                supervisory authority, in particular in the Member State of their habitual
                residence, their place of work or the place of the alleged violation. The right of
                appeal is without prejudice to any other administrative or judicial remedy.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Right to Data Portability</h3>
              <p>
                You have the right to have data that we process automatically on the basis of your
                consent or in fulfillment of a contract handed over to you or to a third party in a
                common, machine-readable format. If you request the direct transfer of the data to
                another responsible party, this will only be done insofar as it is technically
                feasible.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">SSL or TLS Encryption</h3>
              <p>
                For security reasons and to protect the transmission of confidential content, such
                as orders or inquiries that you send to us as the site operator, this site uses SSL
                or TLS encryption. You can recognize an encrypted connection by the fact that the
                address line of the browser changes from &apos;http://&apos; to &apos;https://&apos;
                and by the lock symbol in your browser line.
              </p>
              <p>
                If SSL or TLS encryption is activated, the data you transmit to us cannot be read by
                third parties.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">
                Information, Deletion, and Correction
              </h3>
              <p>
                Within the framework of the applicable legal provisions, you have the right at any
                time to free information about your stored personal data, its origin and recipient
                and the purpose of data processing and, if necessary, a right to correction or
                deletion of this data. For this purpose, as well as for further questions regarding
                personal data, you can contact us at any time at the address given in the imprint.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">
                Right to Restriction of Processing
              </h3>
              <p>
                You have the right to request the restriction of the processing of your personal
                data. You can contact us at any time at the address given in the imprint. The right
                to restrict processing exists in the following cases:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>
                  If you contest the accuracy of your personal data stored by us, we usually need
                  time to verify this. For the duration of the verification, you have the right to
                  request the restriction of the processing of your personal data.
                </li>
                <li>
                  If the processing of your personal data happened/is happening unlawfully, you can
                  request the restriction of data processing instead of deletion.
                </li>
                <li>
                  If we no longer need your personal data, but you need it to exercise, defend or
                  assert legal claims, you have the right to request restriction of the processing
                  of your personal data instead of deletion.
                </li>
                <li>
                  If you have lodged an objection pursuant to Art. 21 (1) GDPR, a balancing of your
                  and our interests must be carried out. As long as it has not been determined whose
                  interests prevail, you have the right to demand the restriction of the processing
                  of your personal data.
                </li>
              </ul>
              <p>
                If you have restricted the processing of your personal data, this data may - apart
                from being stored - only be processed with your consent or for the assertion,
                exercise or defense of legal claims or for the protection of the rights of another
                natural or legal person or for reasons of important public interest of the European
                Union or a Member State.
              </p>

              <h3 className="text-lg font-semibold mb-2">Authentication Services</h3>
              <p>
                We use <strong>NextAuth.js</strong> together with <strong>Keycloak</strong> to
                manage secure user authentication via the OAuth 2.0 protocol. When you log in, your
                authentication data (e.g., user ID, token) is processed by these services to verify
                your identity and manage sessions.
              </p>
              <p>
                All authentication infrastructure is <strong>self-hosted</strong> and fully managed
                by us. We do <strong>not</strong> rely on any third-party authentication providers
                or external identity services. Your authentication data remains within our
                controlled environment.
              </p>
              <p>
                This data is stored and processed in accordance with GDPR Art. 6(1)(b) – processing
                necessary for the performance of a contract or pre-contractual measures.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data-collection">
            <AccordionTrigger>Data Collection on This Website</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <h3 className="text-lg font-semibold mb-2">Cookies</h3>
              <p>
                Our websites use so-called &apos;cookies&apos;. Cookies are small text files and do
                not cause any damage to your device. They are stored either temporarily for the
                duration of a session (session cookies) or permanently (permanent cookies) on your
                device. Session cookies are automatically deleted at the end of your visit.
                Permanent cookies remain stored on your device until you delete them yourself or
                until they are automatically deleted by your web browser.
              </p>
              <p>
                In some cases, cookies from third-party companies may also be stored on your device
                when you enter our site (third-party cookies). These enable us or you to use certain
                services of the third-party company (e.g. cookies for processing payment services).
              </p>
              <p>
                Cookies have various functions. Many cookies are technically necessary, as certain
                website functions would not work without them (e.g. the shopping cart function or
                the display of videos). Other cookies are used to evaluate user behavior or display
                advertising.
              </p>
              <p>
                Cookies that are necessary to carry out the electronic communication process
                (necessary cookies) or to provide certain functions that you have requested
                (functional cookies, e.g. for the shopping cart function) or to optimize the website
                (e.g. cookies to measure the web audience) are stored on the basis of Art. 6 (1)
                lit. f GDPR, unless another legal basis is specified. The website operator has a
                legitimate interest in storing cookies for the technically error-free and optimized
                provision of its services. If consent to store cookies has been requested, the
                storage of the cookies in question is based exclusively on this consent (Art. 6
                para. 1 lit. a GDPR); consent can be revoked at any time.
              </p>
              <p>
                You can set your browser so that you are informed about the setting of cookies and
                only allow cookies in individual cases, exclude the acceptance of cookies for
                certain cases or in general and activate the automatic deletion of cookies when
                closing the browser. When deactivating cookies, the functionality of this website
                may be limited.
              </p>
              <p>
                Insofar as cookies are used by third-party companies or for analysis purposes, we
                will inform you separately about this within the framework of this data protection
                declaration and, if necessary, request your consent.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Server Log Files</h3>
              <p>
                The provider of the pages automatically collects and stores information in so-called
                server log files, which your browser automatically transmits to us. These are:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Browser type and browser version</li>
                <li>Operating system used</li>
                <li>Referrer URL</li>
                <li>Host name of the accessing computer</li>
                <li>Time of the server request</li>
                <li>IP address</li>
              </ul>
              <p>This data is not merged with other data sources.</p>
              <p>
                The collection of this data is based on Art. 6 para. 1 lit. f GDPR. The website
                operator has a legitimate interest in the technically error-free presentation and
                optimization of its website - for this purpose, the server log files must be
                collected.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Contact Form</h3>
              <p>
                If you send us inquiries via the contact form, your details from the inquiry form,
                including the contact details you provided there, will be stored by us for the
                purpose of processing the inquiry and in case of follow-up questions. We do not pass
                on this data without your consent.
              </p>
              <p>
                The processing of this data is based on Art. 6 (1) (b) GDPR, if your request is
                related to the execution of a contract or if it is necessary to carry out
                pre-contractual measures. In all other cases, the processing is based on our
                legitimate interest in the effective processing of the requests addressed to us
                (Art. 6 (1) (f) GDPR) or on your consent (Art. 6 (1) (a) GDPR) if this has been
                requested.
              </p>
              <p>
                The data you enter in the contact form remains with us until you request us to
                delete it, revoke your consent to store it, or the purpose for storing the data no
                longer applies (e.g. after we have completed processing your request). Mandatory
                statutory provisions - in particular retention periods - remain unaffected.
              </p>

              <h3 className="text-lg font-semibold mb-2">Request by E-mail, Telephone, or Fax</h3>
              <p>
                If you contact us by e-mail, telephone, or fax, your request, including all
                resulting personal data (name, request) will be stored and processed by us for the
                purpose of processing your request. We do not pass on this data without your
                consent.
              </p>
              <p>
                The processing of this data is based on Art. 6 (1) (b) GDPR, if your request is
                related to the execution of a contract or if it is necessary to carry out
                pre-contractual measures. In all other cases, the processing is based on our
                legitimate interest in the effective processing of the requests addressed to us
                (Art. 6 (1) (f) GDPR) or on your consent (Art. 6 (1) (a) GDPR) if this has been
                requested.
              </p>
              <p>
                The data you send to us via contact requests remains with us until you request us to
                delete it, revoke your consent to store it, or the purpose for storing the data no
                longer applies (e.g. after your request has been processed). Mandatory statutory
                provisions - in particular statutory retention periods - remain unaffected.
              </p>

              <h3 className="text-lg font-semibold mb-2">5. Newsletter</h3>
              <h4 className="text-md font-semibold mb-1">Newsletter Data</h4>
              <p>
                If you would like to receive the newsletter offered on the website, we require an
                e-mail address from you as well as information that allows us to verify that you are
                the owner of the e-mail address provided and that you agree to receive the
                newsletter. Further data is not collected or only on a voluntary basis. We use this
                data exclusively for sending the requested information and do not pass it on to
                third parties.
              </p>
              <p>
                The processing of the data entered in the newsletter registration form is based
                exclusively on your consent (Art. 6 (1) (a) GDPR). You can revoke your consent to
                the storage of the data, the e-mail address, and their use for sending the
                newsletter at any time, for example via the &apos;unsubscribe&apos; link in the
                newsletter. The legality of the data processing operations already carried out
                remains unaffected by the revocation.
              </p>
              <p>
                The data you provide for the purpose of receiving the newsletter will be stored by
                us or the newsletter service provider until you unsubscribe from the newsletter and
                will be deleted from the newsletter distribution list after you unsubscribe from the
                newsletter or after the purpose has ceased to apply. We reserve the right to delete
                or block e-mail addresses from our newsletter distribution list at our own
                discretion within the scope of our legitimate interest in accordance with Art.
                6(1)(f) GDPR.
              </p>
              <p>
                After you unsubscribe from the newsletter distribution list, your e-mail address may
                be stored by us or the newsletter service provider in a blacklist to prevent future
                mailings. The data from the blacklist is used only for this purpose and is not
                merged with other data. This serves both your interest and our interest in complying
                with the legal requirements when sending newsletters (legitimate interest within the
                meaning of Art. 6(1)(f) GDPR). The storage in the blacklist is indefinite. You may
                object to the storage if your interests outweigh our legitimate interest.
              </p>

              <h3 className="text-lg font-semibold mb-2">6. Plugins and Tools</h3>
              <h4 className="text-md font-semibold mb-1">Google Web Fonts (Local Hosting)</h4>
              <p>
                This site uses so-called Web Fonts provided by Google for the uniform display of
                fonts. The Google Fonts are installed locally. A connection to Google servers does
                not take place.
              </p>
              <p>
                For more information about Google Web Fonts, please visit
                https://developers.google.com/fonts/faq and read Google&apos;s privacy policy:
                https://policies.google.com/privacy?hl=en.
              </p>

              <h3 className="text-lg font-semibold mb-2">7. Links to External Sites</h3>
              <p>
                Our website may contain links to external websites such as Instagram, TikTok,
                Pinterest or other social media platforms. We have no control over the content and
                practices of these third-party websites and cannot accept responsibility or
                liability for their respective privacy policies.
              </p>
              <p>
                We encourage users to review the privacy policies of any external sites before
                providing any personal information.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="mt-4 text-right text-xs">
          Source:{' '}
          <Link
            className="text-blue-500 underline"
            rel={'nofollow'}
            href="https://datenschutzerklaerung.de"
            target="_blank"
          >
            datenschutzerklaerung.de
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
