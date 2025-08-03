provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "luxedior-remote-backend-s3-bucket" {
  bucket = "luxedior-remote-backend-s3-bucket"

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_s3_bucket_versioning" "luxedior-remote-backend-s3-bucket-versioning" {
  bucket = aws_s3_bucket.luxedior-remote-backend-s3-bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "luxedior-remote-backend-s3-bucket-encryption-configuration" {
  bucket = aws_s3_bucket.luxedior-remote-backend-s3-bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_dynamodb_table" "luxedior-remote-backend-dynamodb-table-state-locking" {
  name         = "luxedior-remote-backend-dynamodb-table-state-locking"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}