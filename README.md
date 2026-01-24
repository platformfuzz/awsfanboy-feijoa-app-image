# awsfanboy-feijoa-app-image

Container image for the Feijoa Bucket demo app (EKS Capabilities + DynamoDB).

## Quick start

This image expects AWS credentials with permission to access the DynamoDB table
(for example, standard AWS env vars or an IAM role in your runtime).

```bash
docker run --rm -p 8080:80 \
  -e AWS_REGION=ap-southeast-6 \
  -e DYNAMODB_TABLE_NAME=feijoa-stack-table \
  ghcr.io/platformfuzz/awsfanboy-feijoa-app-image:latest
```

Open `http://localhost:8080`.

## Environment variables

- `AWS_REGION` (default: `ap-southeast-6`)
- `DYNAMODB_TABLE_NAME` (default: `feijoa-stack-table`)
- Uses standard AWS credential environment variables when present:
   `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`

## Build locally

```bash
docker build -t awsfanboy-feijoa-app-image:local .
```
