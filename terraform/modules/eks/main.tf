resource "aws_iam_role" "cluster" {
  name = "${var.cluster_name}-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
  })
}


resource "aws_iam_role_policy_attachment" "cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.cluster.name
}


resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  version  = var.cluster_version
  role_arn = aws_iam_role.cluster.arn

  vpc_config {
    subnet_ids = var.subnet_ids
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_policy
  ]
}

resource "aws_iam_role" "fargate" {
  name = "${var.cluster_name}-fargate-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks-fargate-pods.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "fargate_policy" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonEKSFargatePodExecutionRolePolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  ])

  policy_arn = each.value
  role       = aws_iam_role.fargate.name
}

resource "aws_eks_fargate_profile" "web" {
  cluster_name         = aws_eks_cluster.main.name
  fargate_profile_name = "${var.cluster_name}-web-fargate-profile"
  pod_execution_role_arn = aws_iam_role.fargate.arn
  subnet_ids = var.subnet_ids

  selector {
    namespace = "argocd"
  }
  
  selector {
    namespace = "frontend"
    labels = {
      name = "luxedior-frontend"
    }
  }

  selector {
    namespace = "sanity-studio"
    labels = {
      name = "luxedior-sanity-studio"
    }
  }

  tags = {
    Name = "fargate-profile"
  }
  
  depends_on = [
    aws_iam_role_policy_attachment.fargate_policy
  ]
}