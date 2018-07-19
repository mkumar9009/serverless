## Welcome to Serverless

This repository contains the functions on which I have worked upon.
We are using AWS lambda service and [serverless framework](https://serverless.com/) to deploy all functions.


### Tasks

** SQS + Lambda Consumer + Lambda Workers **

*** Language: Nodejs 8.10 ***

Sending mass emails is an I/O bound process, if you have sufficient network bandwidth. Multi Threading is one way by which you can achieve the purpose.

We get all the emails data in SQS and then we need to process that data to send it across million users via emails.

So we decided to achieve this by dividin into two parts:

- Creating a Lambda Consumer
- Creating a Lambda Worker 

Consumer reads from the queue at particular times and lanuches the no. of workers equal to the no. of messages in the queue. Since there is a limit to read max no. of messages from queue in a single access. We keep reading from queue and launching worker as long as there are messages in the queue.

Each worker is a separate lambda function invoke which has its own time execution limits and infra resources.

*** Scheduling the EC2 instances ***

*** Language: Pyhton 2.7 ***

Starting and stopping an ec2 instance in AWS is quite an easy task.

boto3 is quite an handy module to connect to AWS resources like ec2.

instances = ['i-xxxxxxxxxxxxxxx','i-xxxxxxxxxxxxxx']

def lambda_handler(event, context):
    ec2 = boto3.client('ec2', region_name=region)
    ec2.start_instances(InstanceIds=instances)

Above 3 lines do the task required.
Stopping an instance is also quite similar.




Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/mkumar9009/serverless/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
