aws s3 sync dist/ s3://heuritech.frontier.cool --delete
aws cloudfront create-invalidation --distribution-id E1BHC6HLZ8BC9L --paths "/*"
