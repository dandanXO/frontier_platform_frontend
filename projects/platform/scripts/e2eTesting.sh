folders=($(git diff HEAD~1 --name-only | xargs dirname | sort | uniq))
isDisabled=true

for folder in "${folders[@]}"
do
  if [[ $folder != *"packages/i18n/locales"* ]];then
    npx start-server-and-test "npm run serve --mode=${1}" 8080 cy:run
    break
  fi
done

