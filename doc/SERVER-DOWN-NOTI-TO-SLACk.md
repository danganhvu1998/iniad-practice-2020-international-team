# How to send notification to SLACK whenever server is down

## DOWNTIME MONKEY

+ Website: https://downtimemonkey.com/index.php
+ How to setup:
  + Go to: https://downtimemonkey.com/downtime-alert-notifications-slack.php
  + Follow to flow

## AWS Service

+ Idea: using [AWS Route53 Health Check](https://console.aws.amazon.com/route53/healthchecks/home#/) to send an `Alarms` to [AWS Cloud Watch](https://console.aws.amazon.com/cloudwatch/home). From here, whenever an `Alarm` was sent, it will push a `Notification` to [AWS SNS](https://console.aws.amazon.com/sns/v3/home). Next, this `Notification` will be deliverd to [AWS LAMBDA](https://console.aws.amazon.com/lambda/home) to finally send message to `SLACK` via `SLACK WEEBHOOK`
+ Lambda Code

    ```js
        const axios = require('axios');

        const slackAlarm = {
            postWebhook: process.env.slackWeebhook,
            identity: process.env.slackIdentity
        }

        async function sendAlarmToSlack(message) {
            try {
                const messageText = `\`\`\`time: ${new Date()}\nidentity: ${slackAlarm.identity}\nmessage: ${message}\`\`\``
                const res = await axios({
                    url: slackAlarm.postWebhook,
                    method: 'post',
                    data: { text: messageText },
                });
                return res;
            } catch (e) {
                console.log(`Error in sendAlarmToSlack ${e.message}`);
            }
        }

        exports.handler = async (event) => {
            let messageText = ''
            const snsMessage = JSON.stringify(event);
            if (snsMessage.includes('shz-dev-tokyotechlab-com-awsroute53-8513872f-676c-4fa8-a4a8-89495b807f6b-Low-HealthCheckStatus')) {
                messageText = 'Shozemi Dev Frontend is unreachable';
            } else if (snsMessage.includes('shozemi frontend production')) {
                messageText = 'IMPORTANT - SHOZEMI PRODUCTION FRONTEND is unreachable';
            } else if (snsMessage.includes('shozemi backend production')) {
                messageText = 'IMPORTANT - SHOZEMI PRODUCTION BACKEND is unreachable';
            } else {
                messageText = snsMessage;
            }
            const res = await sendAlarmToSlack(messageText)
            const response = {
                statusCode: 200,
                body: 'OK',
            };
            return response;
        };
    ```

+ Note:
  + Add module to `Lambda`: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html
