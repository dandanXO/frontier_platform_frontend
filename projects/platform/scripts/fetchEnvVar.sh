#!/bin/bash

# Define a trap to handle the TERM signal
function term_handler() {
  echo "Script encountered a critical error and is terminating. Possible causes: missing .env file, unset environment variables, or API communication failure. Please check your configuration and try again."
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

  # Check if VITE_APP_X_API_KEY is set (either via .env or GitLab CI/CD)
  if [ -z "$VITE_APP_X_API_KEY" ]; then
    echo "Error: VITE_APP_X_API_KEY environment variable is not set."
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

# Setup environment configuration based on the argument passed
MIXPANEL_ENV=( "production" "pre-production" )

if [ $1 = "development" ]; then
  PREFIX="DEV"
  NODE_ENV="development"
  STRIPE_KEY="STRIPE_KEY_TEST"
  GA_MEASUREMENT_ID="GA_MEASUREMENT_ID_TEST"
elif [ $1 = "staging" ]; then
  PREFIX="STG"
  NODE_ENV="production"
  STRIPE_KEY="STRIPE_KEY_TEST"
  GA_MEASUREMENT_ID="GA_MEASUREMENT_ID_TEST"
elif [ $1 = "feat" ]; then
  PREFIX="FEAT"
  NODE_ENV="production"
  STRIPE_KEY="STRIPE_KEY_TEST"
  GA_MEASUREMENT_ID="GA_MEASUREMENT_ID_TEST"
elif [ $1 = "pre-production" ]; then
  PREFIX="PRE_PROD"
  NODE_ENV="production"
  STRIPE_KEY="STRIPE_KEY_TEST"
  GA_MEASUREMENT_ID="GA_MEASUREMENT_ID_TEST"
elif [ $1 = "production" ]; then
  PREFIX="PROD"
  NODE_ENV="production"
  STRIPE_KEY="STRIPE_KEY_PROD"
  GA_MEASUREMENT_ID="GA_MEASUREMENT_ID_PROD"

fi

rm .env.$1.local
rm .env.testing.local

API_ENDPOINT=$(getVar $PREFIX"_API_ENDPOINT")

# Write variables to the .env file
echo NODE_ENV=$NODE_ENV >>.env.$1.local
echo VITE_APP_API_ENDPOINT=$API_ENDPOINT >>.env.$1.local
echo VITE_APP_TEXTILE_CLOUD_ENDPOINT=$(getVar $PREFIX"_TEXTILE_CLOUD_ENDPOINT") >>.env.$1.local
echo VITE_APP_OPEN_API_ENDPOINT=$(getVar $PREFIX"_OPEN_API_ENDPOINT") >>.env.$1.local
echo VITE_APP_WEB_URL=$(getVar $PREFIX"_WEB_URL") >>.env.$1.local
echo VITE_APP_STRIPE_KEY=$(getVar $STRIPE_KEY) >>.env.$1.local
echo VITE_APP_GA_MEASUREMENT_ID=$(getVar $GA_MEASUREMENT_ID) >>.env.$1.local
echo VITE_APP_GOOGLE_CLIENT_ID=$(getVar "GOOGLE_CLIENT_ID") >>.env.$1.local
echo VITE_APP_FACEBOOK_APP_ID=$(getVar "FACEBOOK_APP_ID") >>.env.$1.local
echo VITE_APP_AG_GRID_LICENSE_KEY_BASE64_ENCODED=$(getVar "AG_GRID_LICENSE_KEY_BASE64_ENCODED") >>.env.$1.local

if [[ " ${MIXPANEL_ENV[*]} " =~ [[:space:]]${1}[[:space:]] ]]; then
  echo VITE_APP_MIXPANEL_TOKEN=$(getVar $PREFIX"_MIXPANEL_TOKEN") >> .env.$1.local
fi

# For testing purposes
echo CYPRESS_API_ENDPOINT=$API_ENDPOINT >>.env.testing.local
