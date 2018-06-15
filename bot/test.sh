set -e
set -x

npm run build
scp -r ./dist/* trutel:~/rpi-bot/
ssh trutel "sudo node ~/rpi-bot/test.js"
