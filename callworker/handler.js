'use strict';
var AWS = require("aws-sdk");
var request = require("request");
var json = require("json");
var AWS_REGION = 'ap-south-1';

var sqs = new AWS.SQS({region: AWS_REGION});

function deleteMessage(qurl,receiptHandle, cb) {
  sqs.deleteMessage({
    ReceiptHandle: receiptHandle,
    QueueUrl: qurl
  }, cb);
}

function work(task, cb) {
  console.log(task);
  var data=JSON.parse(task);
  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:task['api_url'],
    body:data
  },function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("200   ..."+body);
        }else{
            console.log("5xx or 4xx ... " + error + response.statusCode);
        }
    });
  cb(null,"executed");
}   

module.exports.callworker = function(event, context, callback) {
  work(event.Body, function(err) {
    if (err) {
      callback(err);
    } else {
      console.log('delete from queue');
      deleteMessage(event.qurl,event.ReceiptHandle, callback);
    }
  });
};
