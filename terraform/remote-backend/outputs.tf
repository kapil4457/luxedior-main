output "s3_bucket_name" {
  value       = aws_s3_bucket.luxedior-remote-backend-s3-bucket.id
  description = "The name of the S3 bucket"
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.luxedior-remote-backend-dynamodb-table-state-locking.id
  description = "The name of the DynamoDB table"
}