# gifmaker
👾 AWS Lambda function to convert videos to gifs using the Serverless framework, Layers and ffmpeg  

see here 
https://engineering.giphy.com/how-to-make-gifs-with-ffmpeg/

check timeout
# serverless-state.json
```javascript
    "gifmaker": {
        "handler": "s_gifmaker.handler",
        "events": [
          {
            "s3": "8seczgifmakerbucket"
          }
        ],
        "layers": {
          "$ref": "$[\"service\"][\"provider\"][\"compiledCloudFormationTemplate\"][\"Resources\"][\"GifmakerLambdaFunction\"][\"Properties\"][\"Layers\"]"
        },
        "name": "gifmaker-dev-gifmaker",
        "package": {},
        "memory": 1024,
        "timeout": 60,
        "runtime": "nodejs12.x",
        "vpc": {},
        "versionLogicalId": "GifmakerLambdaVersionydwQ7AxMYhyJqR4jtuyLAN3s5KdGIGnjfUZRPENwok"
      }
      
      


# handler.js
```javascript
      '/opt/ffmpeg/ffmpeg',
            [
                '-i',
                `/tmp/${record.s3.object.key}`,
                '-f',
                'gif',
                `/tmp/${record.s3.object.key}.gif`,
            ]
```

you will need to find / replace the bucket name - gifmakerbucket
set the bucket in serverless.yaml
```json
custom:
  bucket: gifmakerbucket
```

  
```shell
npm install serverless -g
serverless login

# go into serverless.com -> click add app gifmaker
serverless --org 8seczjohndpope --app gifmaker
serverless deploy

# IMPORTANT - to remove use
serverless remove --app gifmaker
```
