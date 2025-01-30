import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PRO_MEMBERSHIP_PRICE } from '@/lib/constants';
import PatternParadiseIcon from '@/lib/icons/PatternParadiseIcon';
import Countdown from '@/components/countdown';

export default function ComingSoon() {
  return (
    <main className="h-screen overflow-y-auto bg-gradient-to-br from-red-700 to-orange-500 flex justify-center px-4 py-8">
      <div className="max-w-4xl w-full space-y-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in-down text-white  text-center">
          Coming Soon
        </h1>
        <div className="flex justify-center items-center w-full">
          <PatternParadiseIcon className="animate-pulse w-32 h-32 fill-white" />
        </div>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in-up text-white text-center">
          We&apos;re working hard to bring you something amazing. Stay tuned!
        </p>
        <Countdown />
        {/*<div className="mt-12 animate-fade-in">*/}
        {/*  <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white  text-center">*/}
        {/*    Get notified when we launch*/}
        {/*  </h2>*/}
        {/*  <NewsletterSignup />*/}
        {/*</div>*/}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                What is Pattern Paradise?
              </AccordionTrigger>
              <AccordionContent>
                Pattern Paradise is an online marketplace that connects crochet and knitting
                enthusiasts. We provide a platform for designers to sell their unique patterns and
                for buyers to discover a wide range of high-quality, handmade designs. We also offer
                collaborative tools for pattern testing and refinement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                How does Pattern Paradise make money?
              </AccordionTrigger>
              <AccordionContent>
                We charge a 5% fee on the gross value of each pattern sold. This fee helps us
                maintain and improve our platform, develop new collaboration tools, and ensure the
                quality of patterns shared in our community. We also offer a Pro Membership for
                users who need advanced features and want to be the highest ranked on Pattern
                Paradise.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                What is a pattern?
              </AccordionTrigger>
              <AccordionContent>
                A pattern is a detailed set of instructions for creating handmade items using
                crochet or knitting techniques. It includes step-by-step directions, stitch counts,
                measurements, and sometimes visual aids. Patterns serve as blueprints for crafting
                various items, from clothing to home decor.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                How are patterns delivered?
              </AccordionTrigger>
              <AccordionContent>
                All patterns on Pattern Paradise are available as digital downloads. Once purchased,
                you can instantly access and start your project.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                Can I sell my own patterns on Pattern Paradise?
              </AccordionTrigger>
              <AccordionContent>
                Yes! Pattern Paradise welcomes designers to showcase and sell their unique patterns.
                You can easily upload your designs and set your own prices. We&apos;ll handle the
                transactions and provide tools to help you manage your pattern sales.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                What makes Pattern Paradise unique?
              </AccordionTrigger>
              <AccordionContent>
                Pattern Paradise stands out due to our strong ties with the crocheting and knitting
                community on social media. We leverage these connections to increase designers&apos;
                visibility, promote patterns, and attract more creators and buyers to our platform.
                We also offer innovative collaboration tools for pattern testing and refinement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="collaborate">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                How can I collaborate on pattern testing?
              </AccordionTrigger>
              <AccordionContent>
                Pattern Paradise provides advanced tools for tutorials and feedback. You can
                participate in pattern testing, offer suggestions for improvements, and help refine
                designs before they&apos;re finalized. This collaborative approach ensures
                high-quality patterns and fosters community engagement. Register as a Tester or
                update your selected roles in your Profile Settings. Once you have everything set
                up, you can browse Tester Calls.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-semibold text-[#8B4513] text-left">
                Is there a membership fee to join Pattern Paradise?
              </AccordionTrigger>
              <AccordionContent>
                No, there&apos;s no membership fee to join Pattern Paradise. Our platform is free to
                use for both designers and buyers. We only charge a 5% fee on successful pattern
                sales. If you are interested in a Pro membership for advanced features, you can
                purchase this in a separate subscription for {PRO_MEMBERSHIP_PRICE} per month.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="h-8" />
      </div>
    </main>
  );
}
