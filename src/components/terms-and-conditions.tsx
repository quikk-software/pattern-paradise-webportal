'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PrivacyPolicy from '@/components/privacy-policy';
import Imprint from '@/components/imprint';
import Link from 'next/link';
import useAction from '@/lib/core/useAction';
import { MutableRefObject, useEffect, useRef } from 'react';

export default function TermsAndConditions() {
  const { action } = useAction();

  const paymentPolicyRef = useRef<HTMLDivElement | null>(null);

  const executeScroll = (ref: MutableRefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView();
  };

  useEffect(() => {
    switch (action) {
      case 'scrollToPaymentPolicy':
        executeScroll(paymentPolicyRef);
        break;
      default:
        break;
    }
  }, [action]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-4">
      <Imprint />
      <PrivacyPolicy />
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-left mb-4">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            By accessing or using this website, you confirm that you have read, understood, and
            agreed to the following Terms and Conditions.
          </p>
          <p className="mb-4">
            In the following we refer to us, QUIKK Software GmbH, as &apos;Pattern Paradise&apos;,
            &apos;we&apos;, &apos;us&apos; or &apos;our&apos;. or &apos;our&apos;. You, the user of
            this website, are referred to as &apos;you&apos; or &apos;your&apos;.
          </p>
          <Accordion type="single" collapsible className="w-full" value={'payment-policy'}>
            <AccordionItem value="supplemental-terms">
              <AccordionTrigger>Supplemental Terms</AccordionTrigger>
              <AccordionContent>
                <p>
                  Additional terms or policies may be posted on the website periodically, and such
                  documents are considered part of this agreement by reference. We reserve the right
                  to modify these Terms and Conditions, including our Payments Policy, at any time
                  and for any reason, at our sole discretion.
                </p>
                <p>
                  Updates to these terms will be indicated by the &apos;Last updated&apos; date, and
                  you waive any requirement for specific notification of changes. It is your
                  responsibility to review these Terms and Conditions regularly. Continued use of
                  the website after revised terms are posted constitutes your acceptance of the
                  updates.
                </p>
                <p>
                  The information provided on the website is not intended for use or distribution in
                  any jurisdiction or country where such use would violate applicable laws or
                  require registration. Users accessing the website from other regions are
                  responsible for ensuring compliance with local laws.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="users-under-18">
              <AccordionTrigger>Users Under 18</AccordionTrigger>
              <AccordionContent>
                <p>
                  If you are under 18, you must have parental or guardian permission and supervision
                  to use the website. By allowing a minor to use the website, the parent or guardian
                  agrees to these Terms and Conditions on their behalf.
                </p>
                <p>
                  If you use the website on behalf of a company or organization, you confirm that
                  you have the authority to act on its behalf and bind it to this agreement.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="user-representations">
              <AccordionTrigger>User Representations</AccordionTrigger>
              <AccordionContent>
                <p>
                  By registering, you confirm that the information you provide is accurate, current,
                  and complete. You agree to promptly update your registration details as necessary
                  to maintain their accuracy. You also affirm that you have the legal capacity to
                  agree to these Terms and Conditions.
                </p>
                <p>
                  If you are a minor, you have obtained parental or guardian permission to use the
                  website. You will not access the website through automated or non-human means,
                  such as bots or scripts. Additionally, you agree not to use the website for any
                  illegal or unauthorized purposes. Your use of the website must comply with all
                  applicable laws and regulations.
                </p>
                <p>
                  If any information you provide is found to be false, inaccurate, outdated, or
                  incomplete, we reserve the right to suspend or terminate your account and deny
                  future access to the website.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="user-registration">
              <AccordionTrigger>User Registration</AccordionTrigger>
              <AccordionContent>
                <p>
                  By registering on this website, you agree to maintain the confidentiality of your
                  password and accept responsibility for all activities that occur under your
                  account. We reserve the right to modify, reclaim, or remove any username we
                  determine, at our sole discretion, to be inappropriate, obscene, or otherwise
                  objectionable.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="prohibited-activities">
              <AccordionTrigger>Prohibited Activities</AccordionTrigger>
              <AccordionContent>
                <p>
                  The website may only be used for its intended purposes and in accordance with our
                  terms. Commercial activities are prohibited unless expressly endorsed or approved
                  by us.
                </p>
                <p>
                  You may not systematically extract data or content from the website to create a
                  collection, compilation, database, or directory without prior written consent.
                  Using the website without authorization, including collecting user information for
                  unsolicited communications or creating accounts under false pretenses, is
                  prohibited.
                </p>
                <p>
                  The use of agents or proxies to make purchases on the website is also forbidden.
                  You are not permitted to access, reproduce, distribute, or otherwise use website
                  content except as explicitly permitted by the website, its rights holders, or
                  applicable law.
                </p>
                <p>
                  Advertising or selling goods and services on the website in unauthorized ways is
                  not allowed. Making the website or its content accessible to multiple devices or
                  users simultaneously without authorization is prohibited. Redirecting traffic to
                  external websites other than the website is not permitted.
                </p>
                <p>
                  You must not bypass, disable, or interfere with the website&apos;s security
                  features or features restricting access and usage. Manipulating user engagement
                  metrics, such as views, likes, or ratings, through deceptive means or incentives
                  is strictly forbidden.
                </p>
                <p>
                  Framing or linking to the website without proper authorization is not allowed.
                  Misleading or defrauding others, including attempting to gain sensitive account
                  information, is prohibited. The website should only be used for personal,
                  non-commercial purposes.
                </p>
                <p>
                  Abusing support services or submitting false reports of misconduct is not allowed.
                  Automated systems, such as scripts, bots, or data mining tools, cannot be used to
                  interact with the website without authorization. Disrupting or overloading the
                  website&apos;s infrastructure or connected networks is prohibited.
                </p>
                <p>
                  Impersonating other users or using another&apos;s username is forbidden. You may
                  not sell or transfer your user profile to another party. Using website-obtained
                  information to harass, harm, or abuse individuals is not allowed.
                </p>
                <p>
                  Promoting hate speech or discrimination, including but not limited to harassment
                  or violent behavior targeting personal attributes such as religion, race, gender
                  identity, sexual orientation, or disability, is strictly prohibited.
                </p>
                <p>
                  Using the website or its content for unauthorized revenue-generating activities or
                  to compete with the website is not allowed. Decompiling, reverse-engineering, or
                  disassembling website software is prohibited. Circumventing measures that restrict
                  access to parts of the website is forbidden.
                </p>
                <p>
                  Harassing, intimidating, or threatening employees or agents of the website is not
                  permitted. You must not remove copyright or proprietary notices from website
                  content. Copying or adapting the website&apos;s software, including code such as
                  PHP, HTML, JavaScript, or CSS, is prohibited.
                </p>
                <p>
                  Uploading or transmitting harmful materials, such as viruses, excessive
                  capitalized text, or spam, that disrupt the website&apos;s functionality is not
                  allowed. Uploading or transmitting passive information-collecting mechanisms, such
                  as cookies, web bugs, or spyware, is forbidden.
                </p>
                <p>
                  Launching or distributing unauthorized automated systems, including scrapers,
                  spiders, or offline readers, to interact with the website is prohibited.
                  Tarnishing, disparaging, or harming the website in any way is forbidden. Finally,
                  using the website in violation of any applicable laws or regulations is not
                  allowed.
                </p>
                <p>
                  All rights not expressly granted in this agreement remain with Pattern Paradise or
                  the respective rights holders. For example, accessing content on the website does
                  not grant ownership of intellectual property rights associated with it.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pattern-paradise-products">
              <AccordionTrigger>Pattern Paradise Products and Services Policy</AccordionTrigger>
              <AccordionContent>
                <p>
                  The website offers a variety of digital products and services, including PDF
                  patterns and Pattern Paradise Pro subscriptions. By using the website, you agree
                  to our Pattern Paradise Products and Services Policy, which is incorporated into
                  these Terms and Conditions.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="intellectual-property">
              <AccordionTrigger>Intellectual Property Rights</AccordionTrigger>
              <AccordionContent>
                <p>
                  The website contains various forms of content, including but not limited to text,
                  images, videos, music, interactive features, software, branding, and databases
                  (collectively referred to as &apos;Content&apos;). Content may be uploaded by
                  users or provided by Pattern Paradise, which functions as a hosting service.
                </p>
                <p>
                  Unless otherwise stated, all Content is protected by copyright, trademark, and
                  other intellectual property laws under the United Kingdom and international
                  regulations.
                </p>
                <p>
                  Content on the website is provided &apos;AS IS&apos; for personal, informational
                  use only. You are prohibited from copying, reproducing, distributing, selling,
                  licensing, or using the website&apos;s Content for commercial purposes without
                  prior written permission from Pattern Paradise.
                </p>
                <p>
                  Eligible users are granted a limited, non-commercial license to access the
                  website. All rights not explicitly granted remain reserved by us.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="partner-products">
              <AccordionTrigger>Partner Products</AccordionTrigger>
              <AccordionContent>
                <p>
                  Our website may feature products from partners, available for purchase directly or
                  through external links.
                </p>
                <p>
                  At Pattern Paradise, we are committed to transparency. We will clearly identify
                  the partner responsible for each product featured on our platform. Please note
                  that we may receive compensation for featuring or linking to partner products, at
                  no additional cost to you. However, we are not responsible for the quality,
                  safety, or legality of any partner products. Should any issues arise, we recommend
                  addressing them directly with the respective partner. Additionally, we suggest
                  reviewing a partner&apos;s policies before making any purchases to ensure a smooth
                  experience.
                </p>
                <p>
                  Purchasing partner products does not transfer intellectual property rights
                  associated with them. Offerings from partners are subject to change without
                  notice, and Pattern Paradise is not liable for such modifications.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="user-contributions">
              <AccordionTrigger>User Generated Contributions</AccordionTrigger>
              <AccordionContent>
                <p>
                  The website may allow users to upload content, engage in chats, review boards, and
                  other interactive features. By doing so, you may submit, post, display, transmit,
                  or share materials such as text, writings, videos, audio files, photographs,
                  graphics, comments, suggestions, or other content (collectively referred to as
                  &apos;Contributions&apos;).
                </p>
                <p>
                  Contributions may be visible to other users. As such, any Contributions you share
                  are considered non-confidential and non-proprietary. By submitting Contributions,
                  you confirm and warrant the following:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Your Contributions do not and will not infringe on the intellectual property
                    rights of any third party.
                  </li>
                  <li>
                    You have obtained the necessary permissions, licenses, consents, and releases to
                    use and authorize others to use your Contributions.
                  </li>
                  <li>Your Contributions are truthful, accurate, and not misleading.</li>
                  <li>
                    Your Contributions do not contain content that is obscene, lewd, harassing,
                    libelous, slanderous, or otherwise objectionable.
                  </li>
                  <li>
                    Your Contributions do not promote violence or advocate for the overthrow of any
                    government.
                  </li>
                  <li>
                    Your Contributions comply with all applicable laws, rules, and regulations.
                  </li>
                  <li>
                    Your Contributions do not solicit personal information from minors or exploit
                    them in any way.
                  </li>
                  <li>
                    Your Contributions avoid offensive comments related to race, gender, sexual
                    orientation, national origin, or physical disabilities.
                  </li>
                  <li>
                    Your Contributions do not include AI-generated content without explicit
                    approval.
                  </li>
                  <li>
                    Your Contributions are transparent and accurate, containing original photographs
                    or detailed product descriptions where applicable.
                  </li>
                </ul>
                <p>
                  Violations of these terms may lead to suspension or termination of your rights to
                  use the website.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="contribution-license">
              <AccordionTrigger>Contribution License</AccordionTrigger>
              <AccordionContent>
                <p>
                  By posting or sharing Contributions on the website, you grant us a non-exclusive,
                  unlimited, irrevocable, perpetual, transferable, royalty-free, worldwide license
                  to use, reproduce, publish, display, distribute, and modify your Contributions.
                  This includes preparing derivative works, sublicensing, and using your name,
                  trademarks, and associated images for commercial, advertising, and other purposes.
                </p>
                <p>
                  You retain full ownership of your Contributions and associated intellectual
                  property rights. We do not claim ownership over your Contributions.
                </p>
                <p>
                  You are solely responsible for your Contributions and agree not to hold us liable
                  for any statements or representations within them. We reserve the right to edit,
                  re-categorize, or remove any Contributions at our discretion without notice.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="duration-of-license">
              <AccordionTrigger>Duration of License</AccordionTrigger>
              <AccordionContent>
                <p>
                  The license remains valid until you remove your Contributions from the website.
                  However, certain uses may continue under legal or operational requirements, such
                  as for offline viewing by other users or legal archiving purposes.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="removal-of-contributions">
              <AccordionTrigger>Removal of Contributions</AccordionTrigger>
              <AccordionContent>
                <p>
                  You can remove your Contributions at any time. You must do so if you no longer
                  hold the necessary rights to the content. We may also remove Contributions if we
                  reasonably believe they breach these Terms or could harm our platform, users, or
                  third parties.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="payment-policy" ref={paymentPolicyRef}>
              <AccordionTrigger
                style={{
                  fontWeight: action === 'scrollToPaymentPolicy' ? 'bold' : 'normal',
                }}
              >
                {action === 'scrollToPaymentPolicy' ? '💡 ' : ''}Payment Policy
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  All payments on Pattern Paradise are processed securely through our payment
                  gateway partner{' '}
                  <Link
                    href="https://paypal.com"
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    PayPal
                  </Link>
                  . Buyers can purchase crochet and knitting patterns directly from designers via a
                  seamless and secure checkout process. Upon successful payment, buyers will receive
                  access to their purchased digital pattern(s) as downloadable files.
                </p>

                <p>
                  Pattern Paradise operates on a commission-based business model. To support the
                  maintenance and improvement of our platform, we retain a 5% commission fee from
                  the gross value of each pattern sold. This commission is automatically deducted
                  from the payment received by the seller. The remaining amount is transferred to
                  the seller&apos;s account after processing.
                </p>

                <p className="mt-1">For example:</p>

                <p className="mb-1">
                  If a pattern is sold for $10.00, Pattern Paradise will keep $0.50 as platform fee
                  and $9.50 will be transferred to the PayPal account provided by the seller.
                  Regarding fees of our payment gateway partner PayPal, please refer to{' '}
                  <Link
                    href="https://www.paypal.com/al/webapps/mpp/merchant-fees"
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    PayPal Merchant Fees
                  </Link>
                  .
                </p>

                <p>
                  Patterns sold on Pattern Paradise are digital products delivered instantly after
                  purchase. Due to the intangible and non-returnable nature of digital goods,
                  refunds or exchanges are not possible once a pattern has been purchased and
                  downloaded. Buyers are encouraged to review the product details and any
                  accompanying previews or descriptions carefully before completing their purchase.
                  We try to ensure that only satisfactory patterns are published on Pattern Paradise
                  by encouraging sellers to test their patterns with public tester calls. Patterns
                  that are not free and haven&apos;t been officially tested through a tester call
                  will be marked and ranked lower on the platform.
                </p>

                <p>Buyers are responsible for ensuring:</p>

                <p>
                  That they have the necessary tools, skills, and materials to use the purchased
                  patterns. That the pattern meets their requirements before completing the
                  purchase, as all sales are final due to the digital nature of the products. If a
                  buyer encounters issues with accessing a purchased pattern, they should contact
                  our support team at{' '}
                  <Link href="mailto:help@pattern-paradise.shop">help@pattern-paradise.shop</Link>{' '}
                  or our <Link href="/help">contact form</Link> for assistance. We track when a
                  pattern has been downloaded by a user. If we see evidence that the user has not
                  downloaded the pattern after they have successfully purchased it and they ask for
                  a refund, we will arrange for a refund to be made.
                </p>

                <p>Sellers are responsible for ensuring:</p>

                <p>
                  The originality and quality of the patterns they upload to the platform, that the
                  patterns meet the descriptions provided in their listings and timely resolution of
                  buyer inquiries related to their products.
                </p>

                <p>
                  While refunds are not possible after digital products have been downloaded,
                  Pattern Paradise is committed to fostering trust and satisfaction within our
                  community. If a buyer believes a pattern they purchased is defective or
                  significantly different from its description, they can report the issue to our
                  support team by{' '}
                  <Link href="mailto:help@pattern-paradise.shop">writing us an email</Link> or using
                  our <Link href="/help">contact form</Link>. We will review the claim and work with
                  both the buyer and seller to resolve the matter fairly.
                </p>

                <p>
                  By purchasing or selling on Pattern Paradise, you agree to this Payment Policy. We
                  reserve the right to update this policy as needed to reflect changes in our
                  business model or applicable regulations. Any updates will be communicated to
                  users and posted on our platform.
                </p>

                <p>Thank you for being part of the Pattern Paradise community!</p>

                <p>
                  If you have questions or concerns about this policy, please contact us at{' '}
                  <Link href="mailto:help@pattern-paradise.shop">help@pattern-paradise.shop</Link>.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="review-guidelines">
              <AccordionTrigger>Guidelines for Reviews</AccordionTrigger>
              <AccordionContent>
                <p>
                  Users may post reviews or ratings, provided they follow certain guidelines.
                  Reviews should reflect genuine, firsthand experiences. It is important to avoid
                  the use of profanity, abusive, or hateful language, and content that discriminates
                  based on race, religion, gender, sexual orientation, or disability is strictly
                  prohibited. References to illegal activity should not be included in reviews.
                  Additionally, users should refrain from reviewing contributions from competitors
                  or related parties. Legal claims or assumptions should not be made, and reviews
                  must not contain false or misleading information. Campaigns aimed at soliciting
                  positive or negative reviews are not allowed, and links or traffic redirection to
                  external websites are prohibited.
                </p>
                <p>
                  We reserve the right to edit, accept, or remove reviews at our discretion. Please
                  note that reviews represent individual opinions and do not reflect the views of
                  the website or its affiliates. By posting a review, you grant us a perpetual,
                  worldwide, royalty-free license to use, reproduce, modify, and display the content
                  of your review.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="submissions">
              <AccordionTrigger>Submissions</AccordionTrigger>
              <AccordionContent>
                <p>
                  By providing any questions, comments, suggestions, ideas, feedback, or other
                  information related to the website (&apos;Submissions&apos;) to us, you
                  acknowledge and agree that such Submissions are non-confidential and become our
                  exclusive property. We will own all rights, including intellectual property
                  rights, to these Submissions and may use or distribute them for any lawful
                  purpose, including commercial use, without requiring acknowledgment or
                  compensation to you.
                </p>
                <p>
                  You waive all moral rights to your Submissions and warrant that they are original
                  to you or that you have the legal right to share them. You agree not to pursue any
                  claims against us for alleged or actual infringement of any proprietary rights in
                  your Submissions.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="third-party-websites">
              <AccordionTrigger>Third-Party Websites and Content</AccordionTrigger>
              <AccordionContent>
                <p>
                  The website may include links to third-party websites (&apos;Third-Party
                  Websites&apos;) or content created by third parties, such as articles, graphics,
                  videos, applications, or software (&apos;Third-Party Content&apos;). We do not
                  review or monitor the accuracy, appropriateness, or completeness of Third-Party
                  Websites or Content and are not responsible for their availability, privacy
                  practices, policies, or content.
                </p>
                <p>
                  Our inclusion of links to Third-Party Websites or Content does not imply
                  endorsement. Accessing these links or using third-party applications is at your
                  own risk, and our Terms and Conditions no longer apply when you leave the website.
                  You are encouraged to review the terms and policies of any third-party platforms
                  you use.
                </p>
                <p>
                  We assume no responsibility for purchases or interactions made through Third-Party
                  Websites, which are solely between you and the respective third party.
                  Additionally, you agree to hold us harmless from any harm, losses, or disputes
                  arising from Third-Party Content or Websites.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="site-management">
              <AccordionTrigger>website Management</AccordionTrigger>
              <AccordionContent>
                <p>
                  We reserve the right, though we are not obligated, to monitor the website for any
                  violations of these Terms and Conditions. We may take legal action, at our
                  discretion, against users who violate laws or these Terms, including reporting
                  such violations to the appropriate authorities. Additionally, we may restrict or
                  refuse access to content or contributions, or disable them, at our discretion and
                  without prior notice. We also reserve the right to remove or disable files or
                  content that are excessively large or place a significant burden on our systems.
                  Furthermore, we may manage the website as necessary to ensure its proper
                  functionality and to protect our rights and property.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="privacy-policy">
              <AccordionTrigger>Privacy Policy</AccordionTrigger>
              <AccordionContent>
                <p>
                  We prioritize data privacy and security. Please review our{' '}
                  <a href="https://ribblr.com/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  , which is incorporated into these Terms and Conditions. By using the website, you
                  agree to its terms.
                </p>
                <p>
                  The website is primarily hosted in Europe. If you access the website from outside
                  Europe, such as the United States or Asia, you consent to your data being
                  transferred to and processed in Europe or the United States, in accordance with
                  applicable laws.
                </p>
                <p>
                  We do not knowingly collect data from or market to individuals under 13 years of
                  age. In compliance with the U.S. Children&apos;s Online Privacy Protection Act, if
                  we become aware that a child under 13 has submitted personal information without
                  verified parental consent, we will promptly delete that data.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="copyright-infringements">
              <AccordionTrigger>Copyright Infringements</AccordionTrigger>
              <AccordionContent>
                <p>
                  We respect the intellectual property rights of others. If you believe material on
                  the website infringes your copyright, you can notify us by sending a formal
                  notification (&apos;Notification&apos;). Please note that under German law,
                  providing false claims in such Notifications may lead to liability for damages. If
                  uncertain about potential infringement, consider consulting legal counsel before
                  filing a Notification.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="user-data">
              <AccordionTrigger>User Data</AccordionTrigger>
              <AccordionContent>
                <p>
                  While we maintain data transmitted to the website for operational purposes and
                  perform routine backups, you are responsible for any data you transmit or
                  activities undertaken on the website. We are not liable for the loss or corruption
                  of such data, and you waive any right to claim damages arising from these issues.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
