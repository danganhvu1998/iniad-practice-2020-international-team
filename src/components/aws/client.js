import AWS from 'aws-sdk';
import config from 'config';

const credentials = {
    accessKeyId: config.get('aws_s3.access_key'),
    secretAccessKey: config.get('aws_s3.access_secret_key'),
};
AWS.config.update({
    credentials,
    region: 'ap-northeast-1',
});

const s3 = new AWS.S3({
    signatureVersion: 'v4',
});

export { s3 };
