'use strict';

const {spawnSync} = require('child_process');
const {readFileSync, writeFileSync, unlinkSync} = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports.gifmaker = async event => {
    if (!event.Records) {
        console.log('not an s3 invocation!');
        return;
    }

    for (const record of event.Records) {
        if (!record.s3) {
            console.log('not an s3 invocation!');
            continue;
        }
        if (record.s3.object.key.endsWith('.gif')) {
            console.log('already a gif');
            continue;
        }

        // get the file
        const s3Object = await s3
            .getObject({
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key,
            })
            .promise();
        // write file to disk
        writeFileSync(`/tmp/${record.s3.object.key}`, s3Object.Body);
        // convert to gif!
        // https://gist.github.com/MichaelKreil/0dffd8e5062e2dcfb7ea
        //ffmpeg -re -ignore_loop 0 -i image.gif -vf "scale=40:ih*40/iw, crop=40:16" -f rawvideo -vcodec rawvideo -sws_flags bilinear -pix_fmt rgb24 - > /dev/udp/matelight.cbrp3.c-base.org/1337
        // 9:16 -> 90:160
        spawnSync(
        
            '/opt/ffmpeg/ffmpeg',
            [
                '-i',
                `/tmp/${record.s3.object.key}`,
                '-ignore_loop',
                '0',
                '-r',
                '2',
                '-vf',
                'scale=9:16, crop=9:16',
                '-sws_flags',
                'bilinear',
                '-f',
                'gif',
                `/tmp/${record.s3.object.key}.gif`,
                '-y',
            ],
            {stdio: 'inherit'}
        );
        // read gif from disk
        const gifFile = readFileSync(`/tmp/${record.s3.object.key}.gif`);
        // delete the temp files
        unlinkSync(`/tmp/${record.s3.object.key}.gif`);
        unlinkSync(`/tmp/${record.s3.object.key}`);
        // upload gif to s3
        await s3
            .putObject({
                Bucket: record.s3.bucket.name,
                Key: `${record.s3.object.key}.gif`,
                Body: gifFile,
            })
            .promise();
    }
};
