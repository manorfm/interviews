#!/bin/bash

NAME_SERVICE="manorfm/user-service"
IMAGE="$(docker images | grep $NAME_SERVICE)"
if [ ! -z "$IMAGE" ]; then
    # CONTAINER_STATUS="$(docker ps -a | grep $NAME_SERVICE | awk '{print $8}')"
    # CONTAINER_ID="$(docker ps -a | grep $NAME_SERVICE | awk '{print $1}')"
    CONTAINER_ID_STATUS=($(docker ps -a | grep $NAME_SERVICE | awk '{print $1}{print $8}'))
    CONTAINER_ID=${CONTAINER_ID_STATUS[0]}
    CONTAINER_STATUS=${CONTAINER_ID_STATUS[1]}

    if [ -z "$CONTAINER_ID_STATUS" ]; then
        echo "$CONTAINER_ID is $CONTAINER_STATUS"
    fi
    if [ "$CONTAINER_STATUS" == "Up" ]; then
        echo "Stoping the container $CONTAINER_ID"
        eval "docker stop $CONTAINER_ID"
    fi

    if [ "$CONTAINER_STATUS" == "Exited" ] || [ "$CONTAINER_STATUS" == "Up" ]; then
        echo "Removing the stopped container..."
        eval "docker container rm $CONTAINER_ID"
    fi
    IMAGE_ID="$(echo $IMAGE | awk ' {print $3} ')"
    echo "removing image $NAME_SERVICE with id: $IMAGE_ID"
    docker rmi $IMAGE_ID
fi
eval "yarn build"
eval "docker build . -t $NAME_SERVICE"
eval "rimraf dist"