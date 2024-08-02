AWS Cloud architecture

1. Amazon S3 - For storing uploaded videos and HLS videos after processing, deploying frontend application (Storage)
2. Amazon DynamoDB - For storing video details (Database)
3. AWS Lambda - For storing individual functions (Compute)
4. API Gateway - For exposing individual Lambda functions as API endpoints (Networking and Content Delivery)
5. AWS Cloudformation - For automating AWS infrastructure provisioning (Management and Governance)
6. AWS Elemental MediaConvert - To convert any video files to HLS video file (Media Services)
7. AWS Cloudfront - To deliver frontend application and videos using Edge Content Delivery network (Networking and Content Delivery)
8. AWS IAM - for creating and assigning roles and policies to various services (Security, Identity and Compliance)
9. AWS Systems manager - For storing configuration variables required by other AWS Services (Management and Governance)
10. Amazon Cloudwatch - For logging API gateway actions and uses
