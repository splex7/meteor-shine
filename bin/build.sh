#!/bin/bash

if [ "$1" != "front" ] && [ "$1" != "admin" ]; then
  echo "input argument as the app directory: 'front' or 'admin'."
  exit 1
fi


MODE="production"

PROJECT_HOME="/Users/mac/developers/dev-meteor/shine"
OPTION_MOBILE_SETTINGS="--mobile-settings $PROJECT_HOME/conf/$MODE/settings-$1-minified.json"
OPTION_SERVER="--server https://shine.meteor.com"
APP_PATH="$PROJECT_HOME/apps/$1"

# the argument $1 is passed into the env.sh
echo "Loading Environment Variables"
source $PROJECT_HOME/conf/$MODE/env.sh


# move to the App Path
cd $APP_PATH


# add mobile platform environment
meteor add-platform ios
yes '' | meteor add-platform android


# do build process
echo "Building..."
rm -rf $PROJECT_HOME/release/$1/*
meteor build $PROJECT_HOME/release/$1 $OPTION_SERVER $OPTION_MOBILE_SETTINGS
echo "Build done..."

# make the APK file
cd $PROJECT_HOME/release/$1/android
jarsigner -digestalg SHA1 -storepass rmflawk2004 unaligned.apk bookpalfree
~/.meteor/android_bundle/android-sdk/build-tools/20.0.0/zipalign 4 unaligned.apk bookpalfree.apk
echo "APK file created"

# upload to the dropbox, the distribution destination
echo "Uploading..."
rm -rf ~/Dropbox/BookpalFree/*
cp bookpalfree.apk ~/Dropbox/Shine
echo "APK uploaded to the Dropbox"
