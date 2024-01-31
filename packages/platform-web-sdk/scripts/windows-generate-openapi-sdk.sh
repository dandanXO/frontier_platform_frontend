#!/bin/bash

set -ex

SH_DIR="$(cd "$(dirname "$0")"; pwd -P)"
ROOT_DIR=$(dirname $SH_DIR)

SWAGGER_PATH=${ROOT_DIR}/SwaggerFrontierPlatformWebAPI/FrontierPlatformWebAPI.yaml
SDK_PATH=${ROOT_DIR}/src

openapi-generator-cli generate -i $SWAGGER_PATH -g typescript-axios -o $SDK_PATH --skip-validate-spec
