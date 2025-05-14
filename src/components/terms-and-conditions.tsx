import React, { MutableRefObject } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';
import useAction from '@/lib/core/useAction';
import Link from 'next/link';

interface TermsAndConditionsProps {
  termsAndConditionsRef: MutableRefObject<HTMLDivElement | null>;
}

export default function TermsAndConditions({ termsAndConditionsRef }: TermsAndConditionsProps) {
  const { action } = useAction();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-left mb-4" ref={termsAndConditionsRef}>
          {action === 'scrollToTermsAndConditions' ? '💡 ' : ''}Terms and Conditions
        </CardTitle>
        <CardTitle className="text-md font-medium text-left mb-4">
          Last updated on: 17 Mai 2025
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-6">
          By accessing or using Pattern Paradise (operated by{' '}
          <Link href="https://quikk.de" target="_blank" className="text-blue-500 underline">
            QUIKK Software GmbH
          </Link>
          ), you agree to the following Terms and Conditions. These are designed to ensure a
          transparent, respectful, and legally secure environment for all users. For each section,
          we&apos;ve added practical examples to help clarify what they mean in everyday use.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="users-under-18" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              1. Users Under 18
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  Users under the age of 18 may only use Pattern Paradise with the permission and
                  supervision of a parent or legal guardian. By granting access, the parent or
                  guardian accepts these Terms and Conditions on the minor&apos;s behalf and takes
                  responsibility for their use of the platform.
                </p>
              </div>
              <PracticalExample>
                If you&apos;re under 18, your parent or guardian needs to give permission and help
                guide your use of the platform. They agree to the rules for you, so it&apos;s
                important they&apos;re involved.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="user-generated-contributions" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              7. User Generated Contributions
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  You may submit content (&apos;Contributions&apos;). You&apos;re responsible for
                  ensuring it&apos;s lawful, original, and non-offensive.
                </p>
              </div>
              <PracticalExample>
                When uploading a pattern, make sure it&apos;s yours, not copied from someone else,
                and doesn&apos;t include harmful or misleading content.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="contribution-license" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              8. Contribution License
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  By uploading content to Pattern Paradise, you grant us a non-exclusive,
                  royalty-free license to use it for the limited purpose of operating and promoting
                  the platform. This includes activities such as displaying your content on
                  listings, featuring it in search previews, or sharing it in marketing formats
                  (e.g., on social media or in newsletters) — always linking back to your original
                  listing. You retain full ownership of your content, and we will never sell or
                  distribute your pattern files themselves. Our use of your content is always within
                  the context of promoting your listing or the overall platform, not for independent
                  commercial gain.
                </p>
              </div>
              <PracticalExample>
                Uploading a pattern means we may promote it by creating things like Pinterest Pins
                or Google Shopping listings using your product image and title — all to drive more
                traffic to your listing. We don&apos;t claim ownership of your design or share the
                pattern file itself — we&apos;re just helping people find it.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="duration-of-license" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              9. Duration of License
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  The license we rely on to operate and promote your content ends once you remove
                  the content from Pattern Paradise. We will no longer use it in any active or
                  public-facing way. Please note, however, that we cannot control how third-party
                  systems like search engines or social media platforms handle cached or previously
                  indexed content, which may remain visible beyond our reach.
                </p>
              </div>
              <PracticalExample>
                Once you delete your listing, we won&apos;t show or promote it on the platform
                anymore. Your pattern and listing will no longer be accessible to other users.
                However, some copies may still exist on services like Google Search or Pinterest,
                where we have no technical ability to remove previously indexed content.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="removal-of-contributions" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              10. Removal of Contributions
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  You can remove your content anytime. We may also remove content that violates our
                  terms or could negatively impact the platform or its users. We do not remove
                  content arbitrarily. In cases where an issue arises, we will make reasonable
                  efforts to contact the creator and provide an opportunity to respond or correct
                  the issue. If we do not receive a response within a reasonable period of time, we
                  reserve the right to moderate or remove the content without further notice.
                </p>
              </div>
              <PracticalExample>
                You can take down your own listing at any time. If we find a listing that violates
                our rules, we&apos;ll try to reach out to you first to sort things out. But if we
                don&apos;t hear back in a reasonable timeframe, we may need to remove it to protect
                the platform and its users.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="payment-policy" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              11. Payment Policy
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  Payments are handled via Stripe or PayPal. We take a 5% commission on sales.
                  Refunds are not available once a digital product is downloaded. This is because
                  digital files, once accessed, cannot be returned in the same way physical goods
                  can, and the content could already have been copied or used.
                </p>
              </div>
              <PracticalExample>
                If you sell a $10 pattern, you keep $9.50 before Stripe/PayPal fees. Once a buyer
                downloads the file, the purchase is final — just like opening a digital book or PDF.
                Since the content is immediately accessible and non-returnable, we can&apos;t offer
                refunds after download.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reviews" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">12. Reviews</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  Reviews must reflect real experiences and must not be abusive or misleading.
                  Reviews should be directly related to the pattern and may include feedback about
                  the overall experience with the creator. While we welcome critique, we do not
                  remove reviews arbitrarily. However, content that includes insults, hate speech,
                  or otherwise harmful behavior will be swiftly moderated and may be removed.
                </p>
              </div>
              <PracticalExample>
                You can leave a review for a pattern you&apos;ve bought or tested, and it&apos;s
                okay to give honest, even critical feedback — as long as it&apos;s respectful and
                relevant. We won&apos;t remove reviews just because they&apos;re negative, but if
                they include insults or harmful language, we will step in.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="submissions" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              13. Submissions
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  If you send us suggestions or feedback, you agree that we can use it freely
                  without compensation.
                </p>
              </div>
              <PracticalExample>
                If you suggest a new feature, we might build it — but we&apos;re not obligated to
                credit or pay you for the idea.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="third-party-links" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              14. Third-Party Links
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  Pattern Paradise may contain links to external websites or services operated by
                  third parties. These links are provided for your convenience, but we do not
                  control or endorse the content, products, policies, or practices of those
                  third-party sites. Accessing such sites is at your own discretion, and we are not
                  responsible for any issues arising from their use, including but not limited to
                  data handling, terms of service, or product quality.
                </p>
              </div>
              <PracticalExample>
                If you follow a link from Pattern Paradise to another website — for example, to buy
                a yarn kit or read more about a featured product — keep in mind that you&apos;re now
                interacting with that external site, not us. Be sure to review their terms and
                policies, especially when making a purchase or sharing personal information.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="site-management" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              15. Site Management
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  We reserve the right to monitor activity on the platform and to remove or restrict
                  content as necessary to maintain a safe, respectful, and functional environment.
                  However, content is not removed arbitrarily. Actions we take under this policy are
                  consistent with the terms outlined in sections such as Contribution License,
                  Removal of Contributions, and Reviews. In general, we will attempt to resolve
                  issues through communication whenever appropriate and reserve intervention for
                  cases involving serious violations, harm to users, or legal risks.
                </p>
              </div>
              <PracticalExample>
                We actively monitor the platform to keep it safe and welcoming. If someone is
                posting spam, harmful content, or disrupting the community, we&apos;ll take action —
                but we always aim to be fair and consistent, and follow the same standards
                we&apos;ve outlined in other parts of these Terms.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="copyright-infringements" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">
              16. Copyright Infringements
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  We comply with copyright law. You may report suspected violations, but must do so
                  truthfully. This includes reporting patterns or content that may infringe on
                  someone else&apos;s rights, not just your own.
                </p>
              </div>
              <PracticalExample>
                If you see a pattern that looks like it was copied from another creator — whether
                it&apos;s yours or someone else&apos;s — you can report it. Just be sure you have
                good reason to believe it&apos;s a genuine violation.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="user-data" className="border rounded-lg px-4">
            <AccordionTrigger className="text-lg font-medium py-4">17. User Data</AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div>
                <p>
                  We retain user data necessary to operate the platform and provide services,
                  including backup and recovery processes. While we take reasonable steps to protect
                  and preserve data integrity, we are not liable for any data loss or corruption
                  that occurs due to technical failures, user actions, or factors beyond our
                  control. Users remain responsible for maintaining their own copies of important
                  information and content uploaded to the platform.
                </p>
              </div>
              <PracticalExample>
                We regularly back up listings and user profiles as part of running the platform, but
                we recommend keeping your own backup of any patterns or key information — just to be
                safe.
              </PracticalExample>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            If you have any questions about these terms, feel free to contact us at
            <Link className="text-blue-500 underline" href="mailto:help@pattern-paradise.shop">
              help@pattern-paradise.shop
            </Link>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PracticalExample({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/50 border border-muted rounded-md p-4 relative">
      <div className="flex items-start gap-3">
        <InfoIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-sm mb-1">What this means in practice:</h4>
          <p className="text-sm text-muted-foreground">{children}</p>
        </div>
      </div>
    </div>
  );
}
