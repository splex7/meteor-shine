#!/bin/bash

# real db
#export MONGO_URL="mongodb://username:password@real-mongodb.domain.com:port_number/shine"

# test db
#export MONGO_URL="mongodb://username:password@test-mongodb.domain.com:port_number/shine"

# mail
#export MAIL_URL="smtp://email-address:password@smtp.mail.com:port_number/"

# log
# $1 read from the calling shell script
export LOG_DIR="/Users/mac/developers/dev-meteor/shine/logs/$1"

