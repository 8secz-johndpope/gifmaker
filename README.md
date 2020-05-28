# gifmaker
👾 AWS Lambda function to convert videos to gifs using the Serverless framework, Layers and ffmpeg  


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
```
