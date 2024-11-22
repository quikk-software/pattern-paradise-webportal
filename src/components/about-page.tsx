import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import creativeWomenIllustration from '@/assets/illustrations/undraw_creative_woman_re_u5tk.svg';
import connectIllustration from '@/assets/illustrations/undraw_connection_re_lcud.svg';

export default function AboutPageComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Pattern Paradise 👋</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connecting creatives worldwide to share, perfect, and celebrate handmade pattern
          creations.
        </p>
        <Image
          src={creativeWomenIllustration}
          alt="Colorful yarn and crochet hooks"
          width={600}
          height={600}
          className="rounded-lg shadow-lg mx-auto"
        />
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Buy & Sell Patterns"
            description="A marketplace for unique crochet and knitting patterns, supporting independent designers."
            icon="💰"
          />
          <FeatureCard
            title="Pattern Testing"
            description="Ensure your designs are flawless with our community of skilled testers."
            icon="🧶"
          />
          <FeatureCard
            title="Collaborative Tools"
            description="Work together on tutorials and designs with our advanced collaboration features."
            icon="🤝"
          />
        </div>
      </section>

      {/* Community Section */}
      <section className="mb-16 bg-muted p-8 rounded-lg">
        <div className="md:flex items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-semibold mb-4">Join Our Creative Community</h2>
            <p className="text-lg mb-4">
              Pattern Paradise is more than just a marketplace – it&apos;s a thriving community of
              passionate crafters, designers, and artists.
            </p>
            <p className="text-lg">
              Share your creations, get inspired, and connect with like-minded individuals from
              around the globe.
            </p>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <Image
              src={connectIllustration}
              alt="Community of crafters"
              width={600}
              height={600}
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Join Pattern Paradise?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Start your journey in the world&apos;s most vibrant handmade pattern community today!
        </p>
        <Button asChild size="lg">
          <Link href="/auth/registration">Join Now</Link>
        </Button>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="text-4xl mr-2">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
