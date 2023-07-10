#!/usr/bin/env bash
 
set -euo pipefail
 
 
 
echo "configuring sqs"
echo "==================="
LOCALSTACK_HOST=localhost
AWS_REGION=us-east-2
TOPIC_ARN=arn:aws:sns:us-east-2:000000000000:MyFanoutTopic
QUEUE_ARN_1=arn:aws:sqs:us-east-2:000000000000:MyFanoutQueue1
QUEUE_ARN_2=arn:aws:sqs:us-east-2:000000000000:MyFanoutQueue2

 
# # https://docs.aws.amazon.com/cli/latest/reference/sqs/create-queue.html
create_queue() {
  local QUEUE_NAME_TO_CREATE=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --region ${AWS_REGION} --attributes VisibilityTimeout=30
}

#create
create_queue "MyFanoutQueue1"
create_queue "MyFanoutQueue2"

#create sns
create_sns() {
  local TOPIC_NAME=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name ${TOPIC_NAME} --region ${AWS_REGION} --output table | cat
}

create_sns "MyFanoutTopic"


subscribe_sqs_to_sns() {
  local QUEUE_NAME_TO_SUBSCRIBE_WITH=$1
    echo "=================== subss =================="
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns subscribe --topic-arn ${TOPIC_ARN} --region ${AWS_REGION}  --protocol sqs --notification-endpoint ${QUEUE_NAME_TO_SUBSCRIBE_WITH} --output table | cat
}


subscribe_sqs_to_sns "${QUEUE_ARN_1}"
subscribe_sqs_to_sns "${QUEUE_ARN_2}"