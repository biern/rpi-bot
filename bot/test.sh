set -e
set -x

HOST=$1
SCRIPT=$2

npm run build
scp -r ./dist/* $HOST:~/rpi-bot/
ssh $HOST "cd ~/rpi-bot/ && npm i --production"
ssh $HOST "sudo node ~/rpi-bot/${SCRIPT}"
