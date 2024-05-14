function getVar() {
	json=$(curl --header "PRIVATE-TOKEN: glpat-jih4MynXq-M_A49DXp4z" "https://gitlab.com/api/v4/projects/27800370/variables/$1")

	# https://gist.github.com/cjus/1047794
	local var=$(echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w "value")

	echo ${var##*|}
}

aws s3 sync storybook-static/ s3://"$(getVar "STORYBOOK_S3_BUCKET")" --delete
aws cloudfront create-invalidation --distribution-id "$(getVar "STORYBOOK_DISTRIBUTION_ID")" --paths "/*"
