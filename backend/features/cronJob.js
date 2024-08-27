const cron = require("node-cron");
const { Email } = require("../db");

const processEmails = async () => {
  try {
    const emails = await Email.find({ status: "Pending" }).limit(10);

    if (emails.length === 0) {
      console.log("No pending emails to process.");
      return;
    }

    // Update the status
    const emailIds = emails.map(email => email._id);
    await Email.updateMany(
      { _id: { $in: emailIds } },
      { $set: { status: "sended" } }
    );

    console.log(`Processed ${emails.length} emails.`);
  } catch (error) {
    console.error("Error processing emails:", error);
  }
};

cron.schedule("* * * * *", processEmails, {
  scheduled: true,
  timezone: "UTC",
});