#!/bin/bash

# real db
#export MONGO_URL="mongodb://username:password@real-mongodb.domain.com:port_number/shine"

# test db
#export MONGO_URL="mongodb://username:password@test-mongodb.domain.com:port_number/shine"

# mail
export MAIL_URL="smtp://dev%40bookp.al:tkddka9898!@smtp.gmail.com:465/"

# log
# $1 read from the calling shell script
export LOG_DIR="/Users/mac/developers/dev-meteor/shine/logs/$1"

