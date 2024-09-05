#!/bin/bash

# Define a trap to handle the TERM signal
function term_handler() {
  echo "Script encountered a critical error and is terminating. Possible causes: missing environment variables or incorrect configuration. Please check your setup and try again."
  exit 1
}

# Trap the TERM signal and call the term_handler function
trap term_handler TERM

function loadEnvFile() {
  # Load the .env file if it exists (for local development)
  if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
  fi
}

function getVar() {
  # Load environment variables from .env file (for local development)
  loadEnvFile

  # Check if the PRIVATE_TOKEN is set (either via .env or GitLab CI/CD)
  if [ -z "$PRIVATE_TOKEN" ]; then
    echo "Error: PRIVATE_TOKEN environment variable is not set."
    kill -s TERM $$
  fi

  # Use the PRIVATE_TOKEN from environment variables
  json=$(curl --silent --header "PRIVATE-TOKEN: $PRIVATE_TOKEN" "https://gitlab.com/api/v4/projects/27800370/variables/$1")

  # Check if the API call was successful
  if [ -z "$json" ]; then
    echo "Error: Failed to retrieve variable $1 from GitLab."
    kill -s TERM $$
  fi

  # Process the JSON output as before
  local var=$(echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w "value")

  if [ -z "$var" ]; then
    echo "Error: Variable $1 is not found."
    kill -s TERM $$
  fi

  # Return the value
  echo ${var##*|}
}

# Determine the PREFIX based on the environment argument
if [ $1 = "development" ]; then
  PREFIX="DEV"
elif [ $1 = "staging" ]; then
  PREFIX="STG"
elif [ $1 = "feat" ]; then
  PREFIX="FEAT"
elif [ $1 = "pre-production" ]; then
  PREFIX="PRE_PROD"
elif [ $1 = "production" ]; then
  PREFIX="PROD"
else
  echo "Error: Invalid environment specified. Use 'development', 'staging', 'feat', 'pre-production', or 'production'."
  kill -s TERM $$
fi

# Ensure S3_BUCKET and DISTRIBUTION_ID are set
S3_BUCKET=$(getVar $PREFIX"_S3_BUCKET")
DISTRIBUTION_ID=$(getVar $PREFIX"_DISTRIBUTION_ID")

if [ -z "$S3_BUCKET" ]; then
  echo "Error: S3_BUCKET environment variable is not set for $PREFIX."
  kill -s TERM $$
fi

if [ -z "$DISTRIBUTION_ID" ]; then
  echo "Error: DISTRIBUTION_ID environment variable is not set for $PREFIX."
  kill -s TERM $$
fi

# Remove the dist/ directory from S3
aws s3 rm s3://"$S3_BUCKET"/dist/ --recursive

# Sync the local dist/ directory to S3
aws s3 sync dist/ s3://"$S3_BUCKET" --delete

# Create CloudFront invalidation
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
