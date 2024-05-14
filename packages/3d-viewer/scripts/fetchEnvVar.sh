function getVar() {
  json=$(curl --header "PRIVATE-TOKEN: glpat-jih4MynXq-M_A49DXp4z" "https://gitlab.com/api/v4/projects/27800370/variables/$1")

  # https://gist.github.com/cjus/1047794
  local var=$(echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w "value")

  echo ${var##*|}
}

PREFIX="DEV"
NODE_ENV="development"
STRIPE_KEY="STRIPE_KEY_TEST"
GA_MEASUREMENT_ID="GA_MEASUREMENT_ID_TEST"

rm .env.$1.local

echo NODE_ENV=$NODE_ENV >>.env.$1.local
echo VITE_APP_API_ENDPOINT=$(getVar $PREFIX"_API_ENDPOINT") >>.env.$1.local
echo VITE_APP_OPEN_API_ENDPOINT=$(getVar $PREFIX"_OPEN_API_ENDPOINT") >>.env.$1.local
echo VITE_APP_WEB_URL=$(getVar $PREFIX"_WEB_URL") >>.env.$1.local
