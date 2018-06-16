set -e
set -x

HOST=$1
FILE=rpi-bot.service


scp -r ./templates/$FILE $HOST:~/
ssh $HOST "bash -c \"sudo mv $FILE /lib/systemd/system && sudo chmod 644 /lib/systemd/system/$FILE && sudo systemctl daemon-reload && sudo systemctl enable $FILE && sudo systemctl start $FILE\""
