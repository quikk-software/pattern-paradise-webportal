import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Imprint() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-left mb-4">Imprint</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="font-semibold text-lg mb-4">Company Information</h3>
          <p className="font-semibold mb-1">QUIKK Software GmbH</p>
          <p>Hahler Straße 285</p>
          <p className="mb-4">32427 Minden</p>
          <p>Commercial Register: HRB 17559</p>
          <p>Registration Court: Bad Oeynhausen</p>
          <p>Jurisdication: Germany</p>
          <p>VAT ID: DE339709992</p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Represented by</h3>
          <p>Joyce Marvin Rafflenbeul</p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Contact</h3>
          <p>Email: hello@pattern-paradise.shop</p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Responsible according to § 18 MStV:</h3>
          <p>Joyce Marvin Rafflenbeul</p>
          <p>Hahler Straße 285</p>
          <p>32427 Minden</p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">EU Dispute Resolution</h3>
          <p>
            The European Commission provides a platform for online dispute resolution (OS):{' '}
            <Link
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              className="text-blue-500 underline"
              rel={'nofollow'}
            >
              https://ec.europa.eu/consumers/odr
            </Link>
            .
          </p>
          <p>You can find our email address in the imprint above.</p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">
            Consumer Dispute Resolution/Universal Arbitration Board
          </h3>
          <p>
            We are not willing or obliged to participate in dispute resolution proceedings before a
            consumer arbitration board.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Liability for Contents</h3>
          <p>
            As a service provider, we are responsible for our own content on these pages in
            accordance with general laws pursuant to § 7 Para.1 TMG. However, according to §§ 8 to
            10 TMG, we are not obligated as a service provider to monitor transmitted or stored
            third-party information or to investigate circumstances that indicate illegal activity.
          </p>
          <p>
            Obligations to remove or block the use of information under general law remain
            unaffected. However, liability in this regard is only possible from the point in time at
            which a concrete legal violation becomes known. If we become aware of any such legal
            violations, we will remove these contents immediately.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Liability for Links</h3>
          <p>
            Our offer contains links to external third-party websites, over whose contents we have
            no influence. Therefore, we cannot assume any liability for these external contents. The
            respective provider or operator of the pages is always responsible for the contents of
            the linked pages. The linked pages were checked for possible legal violations at the
            time of linking. Illegal contents were not recognizable at the time of linking.
          </p>
          <p>
            However, a permanent control of the contents of the linked pages is not reasonable
            without concrete evidence of a violation of law. If we become aware of any
            infringements, we will remove such links immediately.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Copyright</h3>
          <p>
            The contents and works on these pages created by the site operators are subject to
            German copyright law. Duplication, processing, distribution, or any form of
            commercialization of such material beyond the scope of the copyright law shall require
            the prior written consent of its respective author or creator. Downloads and copies of
            these pages are only permitted for private, non-commercial use.
          </p>
          <p>
            Insofar as the content on this site was not created by the operator, the copyrights of
            third parties are respected. In particular, third-party content is marked as such.
            Should you become aware of any copyright infringement, please inform us accordingly. If
            we become aware of any infringements, we will remove such content immediately.
          </p>
        </section>

        <section>
          <p className="text-right text-xs">
            Source:{' '}
            <Link
              href="https://e-recht24.de"
              target={'_blank'}
              className="text-blue-500 underline"
              rel={'nofollow'}
            >
              e-recht24.de
            </Link>
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Image Credits</h3>
          <p>
            We use illustrations from{' '}
            <Link
              rel={'nofollow'}
              href="https://undraw.co"
              target="_blank"
              className="text-blue-500 underline"
            >
              undraw.co
            </Link>{' '}
            and technology icons provided by{' '}
            <Link
              rel={'nofollow'}
              href="https://lucide.dev/"
              target="_blank"
              className="text-blue-500 underline"
            >
              lucide.dev
            </Link>
            .
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
