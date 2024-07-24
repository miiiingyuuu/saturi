 
#!/bin/sh
cd ~/BUILD_PATH
PID=$(ps -ef|grep build.jar|grep -v grep|awk '{print $2}')
if [ "$PID" == "" ]; then
    echo "no process exist"
else
    echo "process id (${PID}) killed"
    kill -9 ${PID}
fi
echo "Program Start"
nohup java -jar build.jar 1 > /dev/null 2>&1 &
