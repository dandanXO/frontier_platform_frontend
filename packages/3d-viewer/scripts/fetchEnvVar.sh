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

# Setup variables and remove existing .env file
PREFIX="DEV"
NODE_ENV="development"
STRIPE_KEY="STRIPE_KEY_TEST"
GA_MEASUREMENT_ID="GA_MEASUREMENT_ID_TEST"

rm .env.$1.local

# Write the environment variables to .env file
echo NODE_ENV=$NODE_ENV >>.env.$1.local
echo VITE_APP_API_ENDPOINT=$(getVar $PREFIX"_API_ENDPOINT") >>.env.$1.local
echo VITE_APP_OPEN_API_ENDPOINT=$(getVar $PREFIX"_OPEN_API_ENDPOINT") >>.env.$1.local
echo VITE_APP_WEB_URL=$(getVar $PREFIX"_WEB_URL") >>.env.$1.local
