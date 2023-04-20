import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

// Define the inputs needed for a time off request
export const RequestFTO = DefineFunction({
  callback_id: "request_fto",
  title: "Request FTO",
  description: "Send a request for flexible time off to a manager",
  source_file: "functions/request_fto.ts",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      manager: {
        type: Schema.slack.types.user_id,
        description: "The approving manager",
      },
      employee: {
        type: Schema.slack.types.user_id,
        description: "The requesting employee",
      },
      start_date: {
        type: Schema.slack.types.date,
        description: "The requested start date",
      },
      end_date: {
        type: Schema.slack.types.date,
        description: "The requested end date",
      },
      reason: {
        type: Schema.types.string,
        description: "Reason for requesting time off",
      },
    },
    required: ["manager", "employee", "start_date", "end_date"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

// Send a message constructed with Block Kit message to the manager
// View the message in block kit builder: https://app.slack.com/block-kit-builder/T5J4Q04QG#%7B%22blocks%22:%5B%7B%22type%22:%22header%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22A%20new%20time-off%20request%20has%20been%20submitted%22%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*From*:%20%3C@$%7Bemployee%7D%3E%22%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Dates:*%20$%7Bstart_date%7D%20to%20$%7Bend_date%7D%22%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Reason:*%22%7D%7D%5D%7D
export default SlackFunction(
  RequestFTO,
  async ({ inputs, client }) => {
    const { manager, employee, start_date, end_date, reason } = inputs;

    const message = await client.chat.postMessage({
      channel: manager,
      text: "A new time-off request has been submitted",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `A new time-off request has been submitted`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*From:* <@${employee}>`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Dates:* ${start_date} to ${end_date}`,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Reason:* ${reason ?? "_none provided_"}`,
          },
        },
      ],
    });

    const uuid = crypto.randomUUID();
    const response = await client.apps.datastore.put({
      datastore: "leave_requests",
      item: {
        id: uuid,
        manager: inputs.interactivity?.interactor.id,
        requester: inputs.employee,
        start_date: inputs.start_date,
        end_date: inputs.end_date,
        reason: inputs.reason,
      },
    });

    if (!message.ok) {
      return { error: `Failed to send message: ${message.error}` };
    } else {
      console.log(`A new row saved: ${JSON.stringify(response)}`);
      return { outputs: {} };
    }
  },
);
