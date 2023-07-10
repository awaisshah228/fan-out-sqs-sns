#!/usr/bin/env bash
 
set -euo pipefail
 
# enable debug
# set -x
 
 
echo "configuring sqs"
echo "==================="
LOCALSTACK_HOST=localhost
AWS_REGION=us-east-2
TOPIC_ARN=arn:aws:sns:us-east-2:000000000000:MyFanoutTopic
FIFO_TOPIC_ARN=arn:aws:sns:us-east-2:000000000000:WebsocketTopic.fifo
QUEUE_ARN_1=arn:aws:sqs:us-east-2:000000000000:ActivePositionQueue
QUEUE_ARN_2=arn:aws:sqs:us-east-2:000000000000:GeneralQueue
QUEUE_ARN_3=arn:aws:sqs:us-east-2:000000000000:WebsocketQueue
QUEUE_ARN_4=arn:aws:sqs:us-east-2:000000000000:WebsocketQueue.fifo
 
# # https://docs.aws.amazon.com/cli/latest/reference/sqs/create-queue.html
create_queue() {
  local QUEUE_NAME_TO_CREATE=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --region ${AWS_REGION} --attributes VisibilityTimeout=30
}

create_queue_fifo() {
  local QUEUE_NAME_TO_CREATE=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sqs create-queue --queue-name ${QUEUE_NAME_TO_CREATE} --region ${AWS_REGION} --attributes VisibilityTimeout=30,FifoQueue=true,ContentBasedDeduplication=true
}

create_queue_fifo "WebsocketQueue.fifo"
create_queue "ActivePositionQueue"
create_queue "GeneralQueue"
create_queue "WebsocketQueue"

create_sns_fifo() {
  local TOPIC_NAME=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name ${TOPIC_NAME} --region ${AWS_REGION} --attributes FifoTopic=true,ContentBasedDeduplication=true --output table | cat
}

create_sns() {
  local TOPIC_NAME=$1
  awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns create-topic --name ${TOPIC_NAME} --region ${AWS_REGION} --output table | cat
}

create_sns_fifo "WebsocketTopic.fifo"
create_sns "MyFanoutTopic"

subscribe_sqs_to_sns() {
  local QUEUE_NAME_TO_SUBSCRIBE_WITH=$1
    echo "=================== subss =================="
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns subscribe --topic-arn ${TOPIC_ARN} --region ${AWS_REGION}  --protocol sqs --notification-endpoint ${QUEUE_NAME_TO_SUBSCRIBE_WITH} --output table | cat
}

subscribe_sqs_to_sns_fifo() {
  local QUEUE_NAME_TO_SUBSCRIBE_WITH=$1
    echo "=================== subss =================="
    awslocal --endpoint-url=http://${LOCALSTACK_HOST}:4566 sns subscribe --topic-arn ${FIFO_TOPIC_ARN} --region ${AWS_REGION}  --protocol sqs --notification-endpoint ${QUEUE_NAME_TO_SUBSCRIBE_WITH} --output table | cat
}

subscribe_sqs_to_sns "${QUEUE_ARN_1}"
subscribe_sqs_to_sns "${QUEUE_ARN_2}"
subscribe_sqs_to_sns "${QUEUE_ARN_3}"
subscribe_sqs_to_sns_fifo "${QUEUE_ARN_4}"


# aws --endpoint-url=http://localhost:4566 sns create-topic \
#     --name order_creation_events \
#     --region us-east-2 \
#     --attributes FifoTopic=true \
#     --attributes ContentBasedDeduplication=false \
#     --output table | cat

# aws --endpoint-url=http://localhost:4566 sns create-topic --name command_post_topic_1.fifo  --attributes FifoTopic=true,ContentBasedDeduplication=true --region us-east-2
# aws --endpoint-url=http://localhost:4566 sqs create-queue --queue-name command_post_queue_1.fifo  --attributes FifoQueue=true,ContentBasedDeduplication=true --region us-east-2


# http://localhost:4566/000000000000/command_post_queue_1.fifo

# aws sqs get-queue-attributes --queue-url http://localhost:4566/000000000000/command_post_queue_1.fifo --endpoint-url=http://localhost:4566 --region us-east-2 --attribute-names All