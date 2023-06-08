const { SNSClient, CreateTopicCommand, SubscribeCommand } = require("@aws-sdk/client-sns");
const { SQSClient, CreateQueueCommand, GetQueueAttributesCommand } = require("@aws-sdk/client-sqs");

const localstackEndpoint = 'http://localhost:4566'; // LocalStack endpoint

// Configure the SNS client with the desired region, LocalStack endpoint, and credentials
const snsClientConfig = {
  region: 'us-east-2',
  endpoint: localstackEndpoint,
  credentials: {
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
  },
};

// Create SNS topic
const createSNSTopic = async (topicName) => {
  const snsClient = new SNSClient(snsClientConfig);

  const command = new CreateTopicCommand({
    Name: topicName,
    Attributes: {
      DisplayName: topicName, // Optional: Set a display name for the topic
    },
  });

  try {
    const response = await snsClient.send(command);
    console.log('SNS topic created:', response.TopicArn);
    return response.TopicArn;
  } catch (error) {
    console.error('Failed to create SNS topic:', error);
    throw error;
  }
};

// Configure the SQS client with the desired region, LocalStack endpoint, and credentials
const sqsClientConfig = {
  region: 'us-east-2',
  endpoint: localstackEndpoint,
  credentials: {
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
  },
};

// Create SQS queue
const createSQSQueue = async (queueName) => {
  const sqsClient = new SQSClient(sqsClientConfig);

  const command = new CreateQueueCommand({
    QueueName: queueName,
    Attributes: {
      VisibilityTimeout: '30', // Optional: Set the visibility timeout in seconds
    },
  });

  try {
    const response = await sqsClient.send(command);
    console.log('SQS queue created:', response.QueueUrl);
    return response.QueueUrl;
  } catch (error) {
    console.error('Failed to create SQS queue:', error);
    throw error;
  }
};

// Get the ARN of an SQS queue
const getSQSQueueArn = async (queueUrl) => {
  const sqsClient = new SQSClient(sqsClientConfig);

  const command = new GetQueueAttributesCommand({
    QueueUrl: queueUrl,
    AttributeNames: ['QueueArn'],
  });

  try {
    const response = await sqsClient.send(command);
    return response.Attributes.QueueArn;
  } catch (error) {
    console.error('Failed to get SQS queue ARN:', error);
    throw error;
  }
};

// Subscribe SQS queue to SNS topic
const subscribeSQSToSNS = async (topicArn, queueArn) => {
  const snsClient = new SNSClient(snsClientConfig);

  const command = new SubscribeCommand({
    TopicArn: topicArn,
    Protocol: 'sqs',
    Endpoint: queueArn,
  });

  try {
    const response = await snsClient.send(command);
    console.log('SQS queue subscribed to SNS topic:', response.SubscriptionArn);
  } catch (error) {
    console.error('Failed to subscribe SQS queue to SNS topic:', error);
    throw error;
  }
};

// Usage example
(async () => {
  try {
    const topicArn = await createSNSTopic('MyFanoutTopic');
    const queueUrl1 = await createSQSQueue('MyFanoutQueue1');
    const queueUrl2 = await createSQSQueue('MyFanoutQueue2');

    const queueArn1 = await getSQSQueueArn(queueUrl1);
    const queueArn2 = await getSQSQueueArn(queueUrl2);

    await subscribeSQSToSNS(topicArn, queueArn1);
    await subscribeSQSToSNS(topicArn, queueArn2);

    console.log('Fanout pattern created successfully!');
  } catch (error) {
    console.error('Failed to create fanout pattern:', error);
  }
})();
