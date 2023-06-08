const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const localstackEndpoint = 'http://localhost:4566'; // LocalStack endpoint

// Configure the SNS client with the desired region and LocalStack endpoint
const snsClientConfig = {
  region: 'us-east-2',
  endpoint: localstackEndpoint,
  credentials: {
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
  },
};

// Publish message to SNS topic
const publishToSNSTopic = async (topicArn, message) => {
  const snsClient = new SNSClient(snsClientConfig);

  const command = new PublishCommand({
    TopicArn: topicArn,
    Message: message,
  });

  try {
    const response = await snsClient.send(command);
    console.log('Message published to SNS topic:', response.MessageId);
  } catch (error) {
    console.error('Failed to publish message to SNS topic:', error);
    throw error;
  }
};

// Usage example
(async () => {
  try {
    const topicArn = 'arn:aws:sns:us-east-2:000000000000:MyFanoutTopic'; // Replace with your SNS topic ARN

    for (let i = 1; i <= 5; i++) {
      const message = `Message ${i}`; // Replace with your message
      
      await publishToSNSTopic(topicArn, message);

      console.log(`Message ${i} published successfully!`);
    }
  } catch (error) {
    console.error('Failed to publish messages:', error);
  }
})();
