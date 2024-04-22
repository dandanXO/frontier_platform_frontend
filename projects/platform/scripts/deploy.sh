function getVar() {
  json=$(curl --header "PRIVATE-TOKEN: glpat-aseMRSUiyDo_e6NQcr6a" "https://gitlab.com/api/v4/projects/27800370/variables/$1")

  # https://gist.github.com/cjus/1047794
  local var=$(echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w "value")

  echo ${var##*|}
}

if [ $1 = "development" ]; then
  PREFIX="DEV"
elif [ $1 = "staging" ]; then
  PREFIX="STG"
elif [ $1 = "pre-production" ]; then
  PREFIX="PRE_PROD"
elif [ $1 = "production" ]; then
  PREFIX="PROD"
fi


# 刪除 S3 上的 dist/ 目錄
aws s3 rm s3://"$(getVar $PREFIX"_S3_BUCKET")"/dist/ --recursive

# 同步本地目錄 dist/ 到 S3
aws s3 sync dist/ s3://"$(getVar $PREFIX"_S3_BUCKET")" --delete
aws cloudfront create-invalidation --distribution-id "$(getVar $PREFIX"_DISTRIBUTION_ID")" --paths "/*"
