# Fanout

Fanout is a sample application that demonstrates how to use AWS SDK to interact with SNS and SQS services. This README provides instructions on setting up and running LocalStack to emulate AWS services locally.

## Prerequisites

- Docker
- Docker Compose
- Yarn

## Getting Started

1. Clone the repository:

   ```shell
   git clone <repository-url> `

1.  Install dependencies using Yarn:

    shellCopy code

    `yarn`

2.  Start LocalStack using Docker Compose:

    shellCopy code

    `docker-compose up -d`

    This command will download and start the LocalStack Docker image, emulating AWS services such as DynamoDB, SNS, and SQS. The services will be accessible at `http://localhost:4566`.

3.  Create SNS topics and SQS queues:

    Run the development server to create the SNS topics and SQS queues:

    shellCopy code

    `yarn dev`

    This will create the necessary SNS topics and SQS queues for the application to function correctly.

4.  Publish messages to SNS topics:

    Use the `pub` script to run the `publisher.js` file, which publishes messages to the SNS topics.

    shellCopy code

    `yarn pub`

5.  Start the message poller:

    Use the `poll` script to run the `poller.js` file, which listens for messages on the SQS queues and processes them.

    shellCopy code

    `yarn poll`

6.  Verify the output:

    As messages are published to the SNS topics, the poller will receive and process them. You will see the received messages logged in the console.

Cleanup
-------

To stop and remove the LocalStack containers, run the following command:

shellCopy code

`docker-compose down`

This will stop the LocalStack services and clean up the Docker resources.

License
-------

This project is licensed under the MIT License. See the [LICENSE](https://chat.openai.com/c/LICENSE) file for details.

javascriptCopy code

 `Make sure to replace `<repository-url>` with the actual URL of your Git repository.

This updated version includes the step to run `yarn dev` before running `yarn pub`. Running `yarn dev` will create the necessary SNS topics and SQS queues using the development server.`

