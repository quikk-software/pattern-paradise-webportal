import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message, reason } = await req.json();
    await sendMail({
      name,
      email,
      message,
      reason,
    });
    return Response.json({});
  } catch (error) {
    console.log({ error });
    return Response.error();
  }
}

const createTransport = async () =>
  nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

const sendMail = async ({
  email,
  name,
  message,
  reason,
}: {
  name: string;
  reason: string;
  email: string;
  message: string;
}) => {
  const transporter = await createTransport();
  await transporter.sendMail({
    from: `"Pattern Paradise" <${process.env.MAIL_REPLY}>`,
    to: email,
    subject: `Your inquiry | Pattern Paradise`,
    bcc: process.env.MAIL_CC,
    html: `Hi ${name}, we've received your inquiry and will get back to you as soon as possible!<br /><br />Selected reason: ${
      reason ? reason : 'Nothing selected'
    }<br /><br />Your message: ${message}<br /><br /><br />The email to which we will reply is: <a href='mailto:${email}'>${email}</a>`,
  });
};
