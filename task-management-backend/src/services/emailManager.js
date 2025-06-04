const { fromEnv } = require("../utils");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: fromEnv("EMAIL_USER"),
    pass: fromEnv("EMAIL_PASS"),
  },
});

async function sendResetPasswordLink(receiver, resetLink) {
  try {
    const info = await transporter.sendMail({
      from: `"Support Team" <${fromEnv("EMAIL_USER")}>`,
      to: receiver,
      subject: "Reset Your Password",
      html: `
        <p>You requested to reset your password.</p>
        <p>Please click the link below to reset it:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    console.log("Password reset email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Failed to send password reset email.");
  }
}

async function sendTaskDetailsToAssignees(task, receiver, sender) {
  try {
    const info = await transporter.sendMail({
      from: `"${sender}" <noreply@yourdomain.com>`,
      to: receiver,
      subject: `📝 New Task Assigned: ${task.title}`,
      html: `
        <p>Hello,</p>
        <p><strong>${sender}</strong> has assigned a new task to you.</p>
        <h3>Task Details:</h3>
        <ul>
          <li><strong>Title:</strong> ${task.title}</li>
          <li><strong>Description:</strong> ${task.description}</li>
      <li><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleString(
        "en-US",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      )}</li>

      <li><strong>Created At:</strong> ${new Date(task.createdAt).toLocaleString(
        "en-US",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      )}</li>

          <li><strong>Priority:</strong> ${task.priority}</li>
          <li><strong>Status:</strong> ${task.status}</li>
        </ul>
        <p>Please log in to the system to view or update the task.</p>
        <p>Thanks,<br/>Task Management System</p>
      `,
    });

    console.log("Task assignment email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending task email:", error);
    throw new Error("Failed to send task assignment email.");
  }
}

module.exports = { sendResetPasswordLink, sendTaskDetailsToAssignees };
