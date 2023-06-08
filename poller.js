const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");

const localstackEndpoint = 'http://localhost:4566'; // LocalStack endpoint

// Configure the SQS client with the desired region and LocalStack endpoint
const sqsClientConfig = {
  region: 'us-east-2',
  endpoint: localstackEndpoint,
  credentials: {
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key',
  },
};
// Poll messages from SQS queue
const pollSQSQueue = async (queueUrl) => {
    const sqsClient = new SQSClient(sqsClientConfig);
  
    const command = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10, // Maximum number of messages to retrieve at a time
      WaitTimeSeconds: 10, // Long polling wait time in seconds
    });
  
    try {
      const response = await sqsClient.send(command);
      const messages = response.Messages || [];
  
      for (const message of messages) {
        console.log('Received message:');
        console.log(JSON.stringify(JSON.parse(message.Body), null, 2));
  
        // TODO: Process the message here
  
        // Delete the message from the queue after processing
        await deleteSQSMessage(queueUrl, message.ReceiptHandle);
      }
    } catch (error) {
      console.error('Failed to poll SQS queue:', error);
      throw error;
    }
  };
  
  // Delete message from SQS queue
  const deleteSQSMessage = async (queueUrl, receiptHandle) => {
    const sqsClient = new SQSClient(sqsClientConfig);
  
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    });
  
    try {
      await sqsClient.send(command);
      console.log('Message deleted from SQS queue:', receiptHandle);
    } catch (error) {
      console.error('Failed to delete message from SQS queue:', error);
      throw error;
    }
  };
  
  // Usage example
  (async () => {
    try {
      const queueUrl = 'http://localhost:4566/000000000000/MyFanoutQueue1'; // Replace with your SQS queue URL
  
      // Start listening to the SQS queue
      setInterval(async () => {
        await pollSQSQueue(queueUrl);
      }, 1000); // Poll every 1 second
  
      console.log('Listening to SQS queue...');
    } catch (error) {
      console.error('Failed to start listening to SQS queue:', error);
    }
  })();
  