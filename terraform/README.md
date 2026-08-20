# Terraform Configuration for Marble

This directory contains Terraform infrastructure-as-code for managing deployments.

## Getting Started

1. **Initialize Terraform:**
   ```bash
   terraform init
   ```

2. **Create terraform.tfvars:**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

3. **Plan deployment:**
   ```bash
   terraform plan
   ```

4. **Apply configuration:**
   ```bash
   terraform apply
   ```

## Files

- `main.tf` - Main resource definitions
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `terraform.tfvars.example` - Example variable values

## Configuration

Edit the files above to configure your cloud provider and resources.
