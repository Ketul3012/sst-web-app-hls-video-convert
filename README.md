# HLS Video SST Application

## Overview

This project is a serverless application designed to manage video uploads, convert videos to HLS format, and serve them to users. It leverages various AWS services to create a scalable, secure, and efficient cloud architecture.

## AWS Cloud Architecture

### 1. Amazon S3 (Storage)
- **Purpose**: Used for storing uploaded videos, HLS video files after processing, and for deploying the frontend application.
- **Details**: 
  - Uploaded videos are stored in an S3 bucket.
  - After processing, HLS video files are stored in a separate S3 bucket.
  - The frontend application is deployed and served from an S3 bucket configured for static website hosting.

### 2. Amazon DynamoDB (Database)
- **Purpose**: Stores metadata and details about the videos.
- **Details**: 
  - DynamoDB tables store information such as video titles, descriptions, statuses, and S3 locations of the original and processed videos.

### 3. AWS Lambda (Compute)
- **Purpose**: Hosts the backend logic, handling video processing, data manipulation, and other application functionalities.
- **Details**: 
  - Individual Lambda functions are used to process events like video uploads, conversion triggers, and database updates.

### 4. Amazon API Gateway (Networking and Content Delivery)
- **Purpose**: Exposes the Lambda functions as RESTful API endpoints.
- **Details**: 
  - The API Gateway acts as a front door to the application, routing requests to the appropriate Lambda functions and ensuring secure, managed access to backend logic.

### 5. AWS CloudFormation (Management and Governance)
- **Purpose**: Automates the provisioning and management of AWS infrastructure.
- **Details**: 
  - CloudFormation templates are used to define the application's resources, making it easy to deploy and manage the entire stack.

### 6. AWS Elemental MediaConvert (Media Services)
- **Purpose**: Converts uploaded video files into HLS format for adaptive streaming.
- **Details**: 
  - MediaConvert jobs are triggered by Lambda functions to process uploaded videos and convert them into HLS format, storing the output in the designated S3 bucket.

### 7. AWS CloudFront (Networking and Content Delivery)
- **Purpose**: Delivers the frontend application and videos through a global content delivery network (CDN).
- **Details**: 
  - CloudFront is used to serve the frontend application with low latency and high transfer speeds.
  - It also distributes HLS video files globally for optimal viewing performance.

### 8. AWS IAM (Security, Identity, and Compliance)
- **Purpose**: Manages access control and permissions across the application.
- **Details**: 
  - IAM roles and policies are created and assigned to different AWS services, ensuring secure access and operations within the architecture.

### 9. AWS Systems Manager (Management and Governance)
- **Purpose**: Stores and manages configuration variables required by other AWS services.
- **Details**: 
  - Systems Manager Parameter Store is used to securely store and retrieve configuration settings, such as database table names and API keys.

### 10. Amazon CloudWatch (Monitoring and Logging)
- **Purpose**: Monitors and logs actions and usage across the application.
- **Details**: 
  - CloudWatch is used to log API Gateway requests and Lambda function executions, providing insights into application performance and issues.

## Deployment

The application is deployed using AWS CloudFormation and the Serverless Stack (SST) framework. Follow the steps below to deploy the application:

1. Clone the repository.
2. Set up your AWS credentials and ensure you have the necessary permissions.
3. Install the required dependencies using `pnpm install`.
4. Deploy the infrastructure using the SST framework: `pnpm deploy:sst`.
5. The CloudFormation stack will automatically create and configure all the required AWS resources.

## Configuration

Before deployment, ensure you have set up the necessary configuration variables in AWS Systems Manager Parameter Store. These include:

- S3 bucket names for video storage.
- DynamoDB table names.
- API keys and secrets for integrated services.
- MediaConvert job templates and settings.

## Usage

After deployment, you can use the provided API endpoints to:

- Upload videos to S3.
- Trigger video processing and conversion to HLS format.
- Retrieve video details from DynamoDB.
- Access and stream videos via the CloudFront-distributed URLs.

## Monitoring and Logging

Use Amazon CloudWatch to monitor the application’s performance and log any issues. Logs for API Gateway requests and Lambda function executions can be found in the CloudWatch console.

## Security

- IAM roles and policies are strictly defined to limit access to only the necessary services and resources.
- S3 buckets are configured with appropriate permissions and encryption to ensure data security.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

