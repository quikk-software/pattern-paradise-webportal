import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  MessageSquare,
  CheckCircle,
  LogIn,
  Clock,
  MessageSquareText,
  Paperclip,
  Reply,
  Download,
  Star,
  UserCircle,
} from 'lucide-react';
import GuideSection from '@/lib/components/GuideSection';
import StepItem from '@/lib/components/StepItem';
import Link from 'next/link';
import InstagramIcon from '@/lib/icons/InstagramIcon';
import TikTokIcon from '@/lib/icons/TikTokIcon';
import WelcomeCard from '@/lib/components/WelcomeCard';
import { generatePageMetadata } from '@/lib/core/metadata';

export const metadata = generatePageMetadata('/how-to');

export default function HowToPage() {
  return (
    <div>
      <div className="space-y-4 mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">How To Guides</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Step-by-step instructions to help you navigate Pattern Paradise
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="grid w-full grid-cols-1 mb-6">
          <TabsTrigger value="all">All Guides</TabsTrigger>
          {/*<TabsTrigger value="patterns">Patterns</TabsTrigger>*/}
          {/*<TabsTrigger value="testing">Testing</TabsTrigger>*/}
          {/*<TabsTrigger value="account">Account</TabsTrigger>*/}
          {/*<TabsTrigger value="payments">Payments</TabsTrigger>*/}
        </TabsList>

        <WelcomeCard />

        <TabsContent value="all" className="space-y-6 mt-0">
          <GuideSection
            title="How to Upload a Pattern"
            description="Learn how to share your crochet or knitting patterns with the community"
            defaultOpen={true}
          >
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground">
                Welcome to Pattern Paradise! Follow these steps to upload your crochet or knitting
                pattern to the platform and share it with the world.
              </p>
            </div>

            <StepItem number={1} title="Fill in the Basic Details" isRequired={true}>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Required Fields:</p>
                  <ul className="mt-2 flex flex-col gap-4">
                    <li className="flex flex-col justify-start items-start gap-2">
                      <span className="font-semibold">Title:</span> Keep it under 30 characters.
                    </li>
                    <li className="flex flex-col justify-start items-start gap-2">
                      <span className="font-semibold">Description:</span> Describe your pattern
                      clearly.
                    </li>
                    <li className="flex flex-col justify-start items-start gap-2">
                      <span className="font-semibold">Price:</span>
                      <ul className="list-disc list-inside ml-2">
                        <li>Enter your price in USD.</li>
                        <li>
                          Or check &quot;Offer this pattern free of charge&quot; if it&apos;s free.
                        </li>
                      </ul>
                    </li>
                    <li className="flex flex-col justify-start items-start gap-2">
                      <span className="font-semibold">Experience Level:</span> Choose from Beginner,
                      Intermediate, or Advanced.
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Optional:</p>
                  <ul className="mt-2">
                    <li className="flex items-start gap-2">
                      <span className="font-medium">Hashtags:</span> Add up to 10 hashtags to help
                      people find your pattern.
                    </li>
                  </ul>
                </div>
              </div>
            </StepItem>

            <StepItem number={2} title="Choose the Category" isRequired={true}>
              <p>
                Select a craft type (e.g., Crocheting or Knitting) and the related subcategories
                (e.g., Toys/Amigurumi, Clothes etc.). This helps organize your pattern on the
                marketplace.
              </p>
            </StepItem>

            <StepItem number={3} title="Upload Images" isRequired={true}>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span>Upload 1 to 6 high-quality images of your finished project.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>Use the drag-and-drop area to reorder images if needed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>You can also remove any image by clicking the ✖️ button.</span>
                </li>
              </ul>
              <p className="mt-3 text-destructive font-medium flex items-center gap-1.5">
                <span>⚠️</span> You must upload at least one image to proceed.
              </p>
            </StepItem>

            <StepItem number={4} title="Upload the Pattern File(s)" isRequired={true}>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span>Upload your pattern in PDF format.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>You can upload multiple files in different languages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>Reorder the files using the drag-and-drop section if needed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>Each PDF should include your complete pattern.</span>
                </li>
              </ul>
            </StepItem>

            <StepItem number={5} title="Mystery Pattern Option">
              <p>
                If your pattern isn&apos;t free, you can choose to join the Mystery Patterns
                program:
              </p>
              <p className="mt-2">
                Say &quot;Yes&quot; to give your pattern extra exposure via mystery boxes sold at
                $3.
              </p>
            </StepItem>

            <StepItem number={6} title="Submit Your Pattern" isRequired={true}>
              <p>Click the Start Upload button at the bottom.</p>
              <p className="mt-2">The system will:</p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <span>Upload your images.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Upload your pattern file(s).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Save your pattern listing.</span>
                </li>
              </ul>
              <p className="mt-2">
                You&apos;ll see live progress bars and status updates during the upload.
                <br />
                <br />
                <strong>Please don&apos;t leave the site while the upload is in progress!</strong>
              </p>
            </StepItem>

            <StepItem number={7} title="Reset If Needed">
              <p>
                Made a mistake or want to upload the next pattern? Click Reset Form to clear
                everything and start over.
              </p>
            </StepItem>

            <StepItem number={8} title="After Successful Upload">
              <p>Once uploaded:</p>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2">
                  <span>You&apos;ll be redirected to a success page.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>
                    You&apos;ll have the option to start a tester call for your pattern to gather
                    feedback.
                  </span>
                </li>
              </ul>
            </StepItem>

            <div className="mt-8 rounded-lg bg-muted/50 p-4">
              <h4 className="font-semibold text-lg mb-3">Common Upload Errors (and Fixes)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="font-medium">Missing title/description</span>
                  <span className="text-muted-foreground">
                    Fill out all required fields marked with *
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium">Too many images</span>
                  <span className="text-muted-foreground">Upload 1–6 images only</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium">No pattern file uploaded</span>
                  <span className="text-muted-foreground">
                    Upload at least one PDF or image file
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-medium">Upload errors</span>
                  <span className="text-muted-foreground">
                    Retry if an error occurs during uploading
                  </span>
                </div>
              </div>
            </div>
          </GuideSection>

          <GuideSection
            title="How to Apply for a Tester Call"
            description="Learn how to preview upcoming patterns and help designers refine their work"
          >
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground">
                Tester Calls are a great way to preview upcoming crochet or knitting patterns and
                help designers refine their work. Here&apos;s how you can apply to participate:
              </p>
            </div>

            <StepItem number={1} title="Log In or Sign Up" isRequired={true}>
              <p>To apply for any tester call, you must be logged into your account.</p>
              <p className="mt-2 flex items-center gap-2">
                <LogIn size={16} className="text-primary" />
                <span>
                  If you click &quot;Apply as a Tester&quot; without being logged in, you&apos;ll be
                  redirected to the signup/login page.
                </span>
              </p>
            </StepItem>

            <StepItem number={2} title="Visit the Tester Call Page">
              <p>You&apos;ll find tester calls:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>In your dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Through social media links</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Or by browsing the Tester Calls section on Pattern Paradise</span>
                </li>
              </ul>

              <p className="mt-3">Each tester call includes:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>A description of the pattern</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Designer details</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Required skill level</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Time commitment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  <span>Tester benefits</span>
                </li>
              </ul>
            </StepItem>

            <StepItem number={3} title="Review the Requirements" isRequired={true}>
              <p>Read the Tester Requirements carefully. You&apos;ll need to:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>Have the required skill level (e.g., Intermediate Crochet)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Finish the project within the stated time frame</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Share progress and feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Submit final project photos</span>
                </li>
              </ul>
            </StepItem>

            <StepItem number={4} title="Know the Perks">
              <p>When you apply, you may:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>Receive the pattern for free</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Get credited in the final design</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Gain early access to unique patterns</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Connect with a supportive crafting community</span>
                </li>
              </ul>
            </StepItem>

            <StepItem number={5} title="Apply as a Tester" isRequired={true}>
              <ol className="space-y-2">
                <li className="flex items-center gap-2">
                  <span>Click the &quot;Apply as a Tester&quot; button.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>A confirmation popup will ask you to confirm—click Continue.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>That&apos;s it! You&apos;ll see a confirmation message.</span>
                </li>
              </ol>
              <p className="mt-3">
                <Clock size={16} className="inline-block mr-1.5 text-primary" />
                The designer will review your application. If accepted, you&apos;ll receive an email
                with the next steps.
              </p>
            </StepItem>

            <StepItem number={6} title="Change Your Mind?">
              <p>If you applied by accident:</p>
              <ol className="mt-2 space-y-2">
                <li className="flex items-center gap-2">
                  <span>Click &quot;Click here to leave&quot; in the success message.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Confirm your choice in the popup.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>
                    You&apos;ll be removed from the tester list (and can reapply later if needed).
                  </span>
                </li>
              </ol>
            </StepItem>

            <div className="mt-8 rounded-lg bg-destructive/10 p-4">
              <h4 className="font-semibold text-lg mb-3 text-destructive">
                When You Can&apos;t Apply
              </h4>
              <p>You won&apos;t be able to apply if:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>You&apos;re the creator of the tester call</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>You&apos;ve already applied</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>
                    The call status is closed (e.g., &quot;In Progress&quot;, &quot;Approved&quot;,
                    or &quot;Declined&quot;)
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-4 text-center p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h4 className="font-medium text-lg text-primary">Ready to Help Shape a Pattern?</h4>
              <p className="mt-1">
                Just head to a{' '}
                <Link href="/app/tester-calls" className="text-blue-500 underline">
                  tester call page
                </Link>{' '}
                and click Apply as a Tester to get started!
              </p>
            </div>
          </GuideSection>

          <GuideSection
            title="How to Use the Tester Chat"
            description="Learn how to collaborate with designers and other testers in the dedicated chat room"
          >
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground">
                Once you&apos;re selected as a tester for a pattern, a dedicated chat room is
                created just for that tester call. This space is where you&apos;ll collaborate,
                share progress, and provide feedback.
              </p>
            </div>

            <div className="mb-8 rounded-lg bg-muted/50 p-4">
              <h4 className="font-semibold text-lg mb-3">Features Overview</h4>
              <p className="mb-3">Here&apos;s what you can do inside the Tester Chat:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-start gap-3">
                  <MessageSquare size={18} className="text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">Chat</span>
                    <p className="text-muted-foreground text-sm">
                      Send and receive messages in real-time with the designer and other testers
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Paperclip size={18} className="text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">Attach Files</span>
                    <p className="text-muted-foreground text-sm">
                      Share photos or PDFs (e.g., WIP images, notes)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Reply size={18} className="text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">Reply</span>
                    <p className="text-muted-foreground text-sm">
                      Respond to specific messages with context
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquareText size={18} className="text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">System Messages</span>
                    <p className="text-muted-foreground text-sm">
                      Get notified of key actions (e.g., assignments, uploads)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Download size={18} className="text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">Download Pattern</span>
                    <p className="text-muted-foreground text-sm">
                      Access the latest version of the pattern file
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Star size={18} className="text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">Leave Review</span>
                    <p className="text-muted-foreground text-sm">
                      Submit your final review after completing the project
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCircle size={18} className="text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">View Other Testers</span>
                    <p className="text-muted-foreground text-sm">
                      See who else is part of the testing group
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <StepItem number={1} title="Sending a Message">
              <ol className="space-y-2">
                <li className="flex items-center gap-2">
                  <span>Type your message in the &quot;Type a message...&quot; field.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Attach images (optional) via the 📎 paperclip icon.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Click Send.</span>
                </li>
              </ol>
              <p className="mt-3">
                <Clock size={16} className="inline-block mr-1.5 text-primary" />
                If you&apos;re uploading images, they will be processed before your message appears.
              </p>
            </StepItem>

            <StepItem number={2} title="Sharing Progress Images">
              <ol className="space-y-2">
                <li className="flex items-center gap-2">
                  <span>Click the 📎 icon.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Choose one or more images (JPG, PNG, etc.).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>After attaching, hit Send.</span>
                </li>
              </ol>
            </StepItem>

            <StepItem number={3} title="Replying to a Message">
              <ol className="space-y-2">
                <li className="flex items-center gap-2">
                  <span>Swipe left on a message.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>A reply preview will appear above your input.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Type your message and Send.</span>
                </li>
              </ol>
              <p className="mt-2">
                Great for referencing specific feedback or following up on comments.
              </p>
            </StepItem>

            <StepItem number={4} title="Downloading the Pattern">
              <ol className="space-y-2">
                <li className="flex items-center gap-2">
                  <span>Click the ⬇️ Download button in the top-right.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Choose your preferred language version.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>The pattern will automatically download to your device.</span>
                </li>
              </ol>
            </StepItem>

            <StepItem number={5} title="Leaving a Review">
              <p>When you&apos;re done testing:</p>
              <ol className="mt-2 space-y-2">
                <li className="flex items-center gap-2">
                  <span>Click the ⭐ Leave Review button.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Fill out your feedback in the review form.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Submit your review to complete your tester responsibilities.</span>
                </li>
              </ol>
            </StepItem>

            <StepItem number={6} title="View Other Testers">
              <p>Click the 👥 icon to:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>See who&apos;s testing alongside you</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>View tester status and assignments</span>
                </li>
              </ul>
            </StepItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 p-4">
                <h4 className="font-semibold text-lg mb-3 text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <span className="text-xl">🟢</span> Real-Time Messaging
                </h4>
                <p>Messages appear in real-time. You don&apos;t need to refresh!</p>
              </div>

              <div className="rounded-lg bg-purple-50 dark:bg-orange-950/40 p-4">
                <h4 className="font-semibold text-lg mb-3 text-primary flex items-center gap-2">
                  <span className="text-xl">📦</span> System Announcements
                </h4>
                <p>Watch for system messages from Pattern Paradise about:</p>
                <ul className="mt-2 space-y-1">
                  <li>Pattern updates</li>
                  <li>Deadlines</li>
                  <li>Instructions from the designer</li>
                </ul>
                <p className="mt-2 text-sm">These will appear in a orange-highlighted box.</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-destructive/10 p-4">
              <h4 className="font-semibold text-lg mb-3 text-destructive">
                When You Can&apos;t Send Messages
              </h4>
              <p>You&apos;ll be unable to send messages if:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>The test is not in progress</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>Your application was declined</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span>
                  <span>The test was aborted or cancelled</span>
                </li>
              </ul>
              <p className="mt-3">You can still view the chat history and download patterns.</p>
            </div>

            <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <h4 className="font-medium text-lg mb-2">Want to Leave?</h4>
              <p>If you decide to leave the test:</p>
              <ol className="mt-2 space-y-1">
                <li className="flex items-start gap-2">
                  <span>Please contact the creator of the tester call</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>The creator can remove you from the group</span>
                </li>
              </ol>
            </div>
          </GuideSection>

          <GuideSection
            title="How to Select Testers for Your Pattern"
            description="Learn how to review applications and start the testing process"
          >
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground">
                Once testers apply to your call, you can choose who you&apos;d like to work with.
                This guide walks you through reviewing applications and officially starting the
                testing process.
              </p>
            </div>

            <StepItem number={1} title="View Applications" isRequired={true}>
              <p>
                Go to the Tester Applicants page from your dashboard or tester call management area.
              </p>
              <p className="mt-3">There, you&apos;ll see:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>Each applicant&apos;s name, username, and avatar</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Date applied and last updated</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Badges if they&apos;ve linked Instagram or TikTok</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  <span>Profile links for a deeper look</span>
                </li>
              </ul>
            </StepItem>

            <StepItem number={2} title="Filter and Sort Applicants">
              <p>To find the right testers:</p>

              <div className="mt-3">
                <p className="font-medium">Sort by:</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1.5">
                    <span>Recently applied</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Recently updated</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="font-medium">Filter by:</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-2">
                    <InstagramIcon className="w-8 h-8" />
                    <span>Instagram available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TikTokIcon className="w-8 h-8" />
                    <span>TikTok available</span>
                  </div>
                </div>
              </div>

              <p className="mt-3">
                This helps highlight testers who are active or offer additional exposure.
              </p>
            </StepItem>

            <StepItem number={3} title="Select at Least 3 Testers" isRequired={true}>
              <p>Click on a card to select a tester (a green ring and ✔️ icon will appear).</p>
              <p className="mt-2 font-medium">
                You must select at least 3 testers to begin the process.
              </p>
              <p className="mt-3 text-destructive font-medium flex items-center gap-4">
                <span>⚠️</span> If there are fewer than 3 applicants, you&apos;ll see a warning.
                Wait for more to apply.
              </p>
            </StepItem>

            <StepItem number={4} title="Confirm and Start Testing" isRequired={true}>
              <ol className="space-y-2">
                <li className="flex items-center gap-2">
                  Once you&apos;ve selected your preferred testers, click &quot;Complete
                  Selection&quot;.
                </li>
                <li className="flex items-center gap-2">
                  A confirmation drawer will appear showing the testers you selected.
                </li>
                <li className="flex items-center gap-2">
                  Click &quot;Start Testing Process&quot;.
                </li>
              </ol>
              <p className="mt-3">Once confirmed:</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span>Selected testers are added to a private group chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>You&apos;re automatically redirected to the Tester Chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>The testing status updates to &quot;In Progress&quot;</span>
                </li>
              </ul>
            </StepItem>

            <div className="mt-8 rounded-lg bg-muted/60 p-4">
              <h4 className="font-semibold text-lg mb-3">FAQs</h4>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Q: Can I cancel or go back?</p>
                  <p className="text-muted-foreground">
                    Yes! Click &quot;Cancel&quot; in the confirmation drawer before submitting.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Q: Can I view more about a tester?</p>
                  <p className="text-muted-foreground">
                    Click their username or name to view their full profile.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Q: What if I choose the wrong person?</p>
                  <p className="text-muted-foreground">
                    You can deselect someone by clicking their card again before finalizing your
                    choices.
                  </p>
                </div>
              </div>
            </div>
          </GuideSection>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6 mt-0">
          {/* This tab would display only the patterns-related guide */}
          <GuideSection
            title="How to Upload a Pattern"
            description="Learn how to share your crochet or knitting patterns with the community"
            defaultOpen={true}
          >
            {/* Same content as in "all" tab */}
            <div className="space-y-2 mb-6">
              <p className="text-muted-foreground">
                Welcome to Pattern Paradise! Follow these steps to upload your crochet or knitting
                pattern to the platform and share it with the world.
              </p>
            </div>

            {/* Same steps as in "all" tab */}
            {/* ... */}
            <p className="text-center p-4">Content is the same as in the All Guides tab</p>
          </GuideSection>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6 mt-0">
          {/* This tab would display only the testing-related guides */}
          <p className="text-center p-4">This tab would display the testing-related guides</p>
        </TabsContent>

        <TabsContent value="account" className="space-y-6 mt-0">
          {/* This tab would display account-related guides */}
          <p className="text-center p-4">This tab would display account-related guides</p>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 mt-0">
          {/* This tab would display payment-related guides */}
          <p className="text-center p-4">This tab would display payment-related guides</p>
        </TabsContent>
      </Tabs>

      <div className="text-center space-y-2 max-w-lg mx-auto">
        <h2 className="text-xl font-medium">Need more help?</h2>
        <p className="text-muted-foreground">
          Didn&apos;t find what you&apos;re looking for? Contact our support team or check out our
          additional resources.
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <Button asChild>
            <Link href="/help" className="space-x-2">
              <MessageSquare size={16} />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
