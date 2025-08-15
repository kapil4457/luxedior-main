terraform {
required_providers {
  aws = {
    source  = "hashicorp/aws"
    version = "~> 5.0"
  }
}



backend "s3" {
  bucket         = "luxedior-remote-backend-s3-bucket"
  key            = "terraform.tfstate"
  region         = "ap-south-1"
  dynamodb_table = "luxedior-remote-backend-dynamodb-table-state-locking"
  encrypt        = true
}
}



provider "aws" {
  region = var.region
}


module "vpc" {
  source = "./modules/vpc"

  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  private_subnet_cidrs = var.private_subnet_cidrs
  public_subnet_cidrs  = var.public_subnet_cidrs
  cluster_name         = var.cluster_name
}



resource "aws_security_group" "fargate_sg" {
  name        = "fargate-sg"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "fargate-sg"
  }
}


module "eks" {
  source = "./modules/eks"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids

}

