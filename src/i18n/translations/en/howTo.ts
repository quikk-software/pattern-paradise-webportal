const howTo = {
  title: 'How To Guides',
  subtitle: 'Step-by-step instructions to help you navigate Pattern Paradise',
  tabs: {
    all: 'All Guides',
    patterns: 'Pattern Guides',
    testing: 'Testing Guides',
    account: 'Account Guides',
    payments: 'Payment Guides',
  },
  sections: {
    uploadPattern: {
      title: 'How to Upload a Pattern',
      description: 'Learn how to share your crochet or knitting patterns with the community',
      intro:
        'Welcome to Pattern Paradise! Follow these steps to upload your crochet or knitting pattern to the platform and share it with the world.',
      steps: {
        step1: {
          title: 'Fill in the Basic Details',
          requiredFields: 'Required Fields:',
          optionalFields: 'Optional:',
          hashtags: 'Add up to 10 hashtags to help people find your pattern.',
          fields: {
            title: 'Title: Keep it under 30 characters.',
            description: 'Description: Describe your pattern clearly.',
            price: 'Price:',
            priceDetails: [
              'Enter your price in USD.',
              'Or check "Offer this pattern free of charge" if it\'s free.',
            ],
            experience: 'Experience Level: Choose from Beginner, Intermediate, or Advanced.',
          },
        },
        step2: {
          title: 'Choose the Category',
          description:
            'Select a craft type (e.g., Crocheting or Knitting) and the related subcategories (e.g., Toys/Amigurumi, Clothes etc.). This helps organize your pattern on the marketplace.',
        },
        step3: {
          title: 'Upload Images',
          tips: [
            'Upload 1 to 6 high-quality images of your finished project.',
            'Use the drag-and-drop area to reorder images if needed.',
            'You can also remove any image by clicking the ✖️ button.',
          ],
          warning: '⚠️ You must upload at least one image to proceed.',
        },
        step4: {
          title: 'Upload the Pattern File(s)',
          tips: [
            'Upload your pattern in PDF format.',
            'You can upload multiple files in different languages.',
            'Reorder the files using the drag-and-drop section if needed.',
            'Each PDF should include your complete pattern.',
          ],
        },
        step5: {
          title: 'Mystery Pattern Option',
          description1:
            "If your pattern isn't free, you can choose to join the Mystery Patterns program:",
          description2:
            'Say "Yes" to give your pattern extra exposure via mystery boxes sold at $3.',
        },
        step6: {
          title: 'Submit Your Pattern',
          description: 'Click the Start Upload button at the bottom.',
          systemSteps: [
            'Upload your images.',
            'Upload your pattern file(s).',
            'Save your pattern listing.',
          ],
          note: "Please don't leave the site while the upload is in progress!",
        },
        step7: {
          title: 'Reset If Needed',
          description:
            'Made a mistake or want to upload the next pattern? Click Reset Form to clear everything and start over.',
        },
        step8: {
          title: 'After Successful Upload',
          description: 'Once uploaded:',
          items: [
            "You'll be redirected to a success page.",
            "You'll have the option to start a tester call for your pattern to gather feedback.",
          ],
        },
      },
      errors: {
        title: 'Common Upload Errors (and Fixes)',
        items: [
          {
            title: 'Missing title/description',
            description: 'Fill out all required fields marked with *',
          },
          {
            title: 'Too many images',
            description: 'Upload 1–6 images only',
          },
          {
            title: 'No pattern file uploaded',
            description: 'Upload at least one PDF or image file',
          },
          {
            title: 'Upload errors',
            description: 'Retry if an error occurs during uploading',
          },
        ],
      },
    },

    testerCall: {
      title: 'How to Apply for a Tester Call',
      description: 'Learn how to preview upcoming patterns and help designers refine their work',
      intro:
        "Tester Calls are a great way to preview upcoming crochet or knitting patterns and help designers refine their work. Here's how you can apply to participate:",
      steps: {
        step1: {
          title: 'Log In or Sign Up',
          description: 'To apply for any tester call, you must be logged into your account.',
          note: 'If you click "Apply as a Tester" without being logged in, you\'ll be redirected to the signup/login page.',
        },
        step2: {
          title: 'Visit the Tester Call Page',
          list: [
            'In your dashboard',
            'Through social media links',
            'Or by browsing the Tester Calls section on Pattern Paradise',
          ],
          includes: [
            'A description of the pattern',
            'Designer details',
            'Required skill level',
            'Time commitment',
            'Tester benefits',
          ],
        },
        step3: {
          title: 'Review the Requirements',
          list: [
            'Have the required skill level (e.g., Intermediate Crochet)',
            'Finish the project within the stated time frame',
            'Share progress and feedback',
            'Submit final project photos',
          ],
        },
        step4: {
          title: 'Know the Perks',
          list: [
            'Receive the pattern for free',
            'Get credited in the final design',
            'Gain early access to unique patterns',
            'Connect with a supportive crafting community',
          ],
        },
        step5: {
          title: 'Apply as a Tester',
          steps: [
            'Click the "Apply as a Tester" button.',
            'A confirmation popup will ask you to confirm—click Continue.',
            "That's it! You'll see a confirmation message.",
          ],
          reviewNote:
            "The designer will review your application. If accepted, you'll receive an email with the next steps.",
        },
        step6: {
          title: 'Change Your Mind?',
          steps: [
            'Click "Click here to leave" in the success message.',
            'Confirm your choice in the popup.',
            "You'll be removed from the tester list (and can reapply later if needed).",
          ],
        },
      },
      limitations: {
        title: "When You Can't Apply",
        list: [
          "You're the creator of the tester call",
          "You've already applied",
          'The call status is closed (e.g., "In Progress", "Approved", or "Declined")',
        ],
      },
      cta: {
        title: 'Ready to Help Shape a Pattern?',
        description: 'Just head to a tester call page and click Apply as a Tester to get started!',
      },
    },

    chat: {
      title: 'How to Use the Tester Chat',
      description:
        'Learn how to collaborate with designers and other testers in the dedicated chat room',
      intro:
        "Once you're selected as a tester for a pattern, a dedicated chat room is created just for that tester call. This space is where you'll collaborate, share progress, and provide feedback.",
      features: {
        title: 'Features Overview',
        items: [
          {
            title: 'Chat',
            description:
              'Send and receive messages in real-time with the designer and other testers',
          },
          {
            title: 'Attach Files',
            description: 'Share photos or PDFs (e.g., WIP images, notes)',
          },
          {
            title: 'Reply',
            description: 'Respond to specific messages with context',
          },
          {
            title: 'System Messages',
            description: 'Get notified of key actions (e.g., assignments, uploads)',
          },
          {
            title: 'Download Pattern',
            description: 'Access the latest version of the pattern file',
          },
          {
            title: 'Leave Review',
            description: 'Submit your final review after completing the project',
          },
          {
            title: 'View Other Testers',
            description: "See who's part of the testing group",
          },
        ],
      },
      actions: {
        step1: 'Sending a Message',
        step2: 'Sharing Progress Images',
        step3: 'Replying to a Message',
        step4: 'Downloading the Pattern',
        step5: 'Leaving a Review',
        step6: 'View Other Testers',
      },
      realtime: {
        title: 'Real-Time Messaging',
        description: "Messages appear in real-time. You don't need to refresh!",
      },
      systemBox: {
        title: 'System Announcements',
        description: 'Watch for system messages from Pattern Paradise about:',
        list: ['Pattern updates', 'Deadlines', 'Instructions from the designer'],
        note: 'These will appear in an orange-highlighted box.',
      },
      limitations: {
        title: "When You Can't Send Messages",
        list: [
          'The test is not in progress',
          'Your application was declined',
          'The test was aborted or cancelled',
        ],
        note: 'You can still view the chat history and download patterns.',
      },
      leaving: {
        title: 'Want to Leave?',
        steps: [
          'Please contact the creator of the tester call',
          'The creator can remove you from the group',
        ],
      },
    },
  },
  help: {
    heading: 'Need more help?',
    description:
      "Didn't find what you're looking for? Contact our support team or check out our additional resources.",
    contact: 'Contact Support',
  },
};

export default howTo;
