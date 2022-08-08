function getVar() {
  json=$(curl --header "PRIVATE-TOKEN: glpat-aseMRSUiyDo_e6NQcr6a" "https://gitlab.com/api/v4/projects/27800370/variables/$1")

  # https://gist.github.com/cjus/1047794
  local var=$(echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w "value")

  echo ${var##*|}
}

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

echo NODE_ENV=$NODE_ENV >>.env.$1.local
echo VITE_APP_API_ENDPOINT=$(getVar $PREFIX"_API_ENDPOINT") >>.env.$1.local
echo VITE_APP_WEB_URL=$(getVar $PREFIX"_WEB_URL") >>.env.$1.local
echo VITE_APP_STRIPE_KEY=$(getVar $STRIPE_KEY) >>.env.$1.local
echo VITE_APP_GA_MEASUREMENT_ID=$(getVar $GA_MEASUREMENT_ID) >>.env.$1.local
echo VITE_APP_GOOGLE_CLIENT_ID=$(getVar "GOOGLE_CLIENT_ID") >>.env.$1.local
echo VITE_APP_FACEBOOK_APP_ID=$(getVar "FACEBOOK_APP_ID") >>.env.$1.local
