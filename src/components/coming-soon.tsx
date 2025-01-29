import NewsletterSignup from './newsletter-signup';
import FAQPageComponent from '@/components/faq-page-component';

export default function ComingSoon() {
  return (
    <main className="h-screen overflow-y-auto bg-gradient-to-br from-red-700 to-orange-500 flex justify-center px-4 py-8">
      <div className="max-w-4xl w-full space-y-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-down text-white  text-center">
          Coming Soon
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in-up text-white  text-center">
          We&apos;re working hard to bring you something amazing. Stay tuned!
        </p>
        {/*<Countdown />*/}
        <div className="mt-12 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white  text-center">
            Get notified when we launch
          </h2>
          <NewsletterSignup />
        </div>
        <FAQPageComponent showTitle={false} />
      </div>
    </main>
  );
}
