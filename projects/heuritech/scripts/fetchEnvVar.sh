function getVar() {
  json=$(curl --header "PRIVATE-TOKEN: glpat-aseMRSUiyDo_e6NQcr6a" "https://gitlab.com/api/v4/projects/27800370/variables/$1")

  # https://gist.github.com/cjus/1047794
  local var=$(echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w "value")

  echo ${var##*|}
}

if [ $1 = "development" ]; then
  NODE_ENV="development"
elif [ $1 = "production" ]; then
  NODE_ENV="production"
fi
PREFIX="PROD"

rm .env.$1.local

echo NODE_ENV=$NODE_ENV >>.env.$1.local
echo VITE_APP_API_ENDPOINT=$(getVar $PREFIX"_API_ENDPOINT") >>.env.$1.local
echo VITE_APP_X_API_KEY="2a825b9fd2834a19a8b46081ba67555d" >>.env.$1.local
echo VITE_APP_OPEN_API_ENDPOINT=$(getVar $PREFIX"_OPEN_API_ENDPOINT") >>.env.$1.local
