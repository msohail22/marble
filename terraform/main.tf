terraform {
  required_version = ">= 1.0"
  required_providers {
    # Add your providers here
    # aws = {
    #   source  = "hashicorp/aws"
    #   version = "~> 5.0"
    # }
  }

  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "marble/terraform.tfstate"
  #   region         = "us-east-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

# Add your resources here
