'use strict';
var AWS=require("aws-sdk");
var async = require('async');

const AWS_REGION='ap-south-1';
const TASK_QUEUE_URL='https://sqs.ap-south-1.amazonaws.com/xxxx/xxxxxxxxxxx';
const WORKER_LAMBDA_NAME='callworker-dev-callworker';

var sqs = new AWS.SQS({region: AWS_REGION});
var lambda = new AWS.Lambda({region: AWS_REGION});

function receiveMessages(callback) {
  var params = {
    QueueUrl: TASK_QUEUE_URL,
    MaxNumberOfMessages: 10
  };
  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.error(err, err.stack);
      callback(err);
    } else {
      callback(null, data.Messages);
    }
  });
}

function invokeWorkerLambda(task, callback) {
  //add quene name for worker
  task['qurl']=TASK_QUEUE_URL;
  var params = {
    FunctionName: WORKER_LAMBDA_NAME,
    InvocationType: 'Event',
    Payload: JSON.stringify(task)
  };
  lambda.invoke(params, function(err, data) {
    if (err) {
      console.error(err, err.stack);
      callback(err);
    } else {
      console.log(params);
      callback(null, data);
    }
  });
}

function handleSQSMessages(context, callback) {
  receiveMessages(function(err, messages) {
    if(err) {
          console.error(err, err.stack);
      }
    else if (messages && messages.length > 0) {
      var invocations = [];
      messages.forEach(function(message) {
        invocations.push(function(callback) {
          invokeWorkerLambda(message, callback);
        });
      });
      async.parallel(invocations, function(err) {
        if (err) {
          console.error(err, err.stack);
          callback(err);
        } else {
          if (context.getRemainingTimeInMillis() > 1000) {
            console.log('we have time');
            handleSQSMessages(context, callback);
            
          } else {
            callback(null, 'PAUSE');
          }         
        }
      });
    } else {
      console.log('no message in queue');
      callback(null, 'DONE');
    }
  });
}

module.exports.DummyConsumer = (event, context, callback) => {
  handleSQSMessages(context, callback);
};


