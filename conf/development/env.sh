#!/bin/bash

# real db
#export MONGO_URL="mongodb://username:password@real-mongodb.domain.com:port_number/shine"

# test db
#export MONGO_URL="mongodb://username:password@test-mongodb.domain.com:port_number/shine"

# mail
#export MAIL_URL="smtp://email-address:password@smtp.mail.com:port_number/"
export MAIL_URL="smtp://codemyio:codemy123@smtp.gmail.com:25"

# log
# $1 read from the calling shell script
export LOG_DIR="/Users/jackass91/Desktop/meteor-shine/logs/$1"

