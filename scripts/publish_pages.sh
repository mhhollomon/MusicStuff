#!/usr/bin/bash

# Directory that has the clone sitting on the branch gh-pages
OUTPUT_REPO_DIR=${HOME}/src/ms-pages

# Build directory to be used - it will be wiped out if it exists
BUILD_DIR=build-web-deploy

#
BASE_HREF='--base-href /MusicStuff/'

# It is assumed that this is called sitting in the root
# of the source repo.


echo "####################################################################"
echo "Building web app"
echo "####################################################################"

rm -rf ${BUILD_DIR};
npm ci
ng build ${BASE_HREF} --optimization --output-path ${BUILD_DIR} --configuration production;

if [ ! -e  ${BUILD_DIR}/index.html ]; then
    echo "Can't find the web files. Something went wrong"
    exit 44
fi


echo "####################################################################"
echo "Copy web files"
echo "####################################################################"

( cd ${OUTPUT_REPO_DIR};
    rm -rf assets *
)

# The 404 page used for gh-pages isn't really a part of the build.
# So, copy it specially. Hopefully I can find a way around this at
# some point.

cp src/404.html ${OUTPUT_REPO_DIR}

( cd ${BUILD_DIR};
    cp -r *  ${OUTPUT_REPO_DIR}
)

( cd ${OUTPUT_REPO_DIR} ;
    git add -A
    git status
)

echo "####################################################################"
echo "Check git status above and commit/push if everything looks okay"
echo "####################################################################"


