# clear Microfab
for CONTAINER in $(docker ps -f label=fabric-environment-name="1 Org Local Fabric Microfab" -q -a) 
  do 
    docker rm -f ${CONTAINER}
  done

docker volume prune -f


# Microfab config - 2 channel
export MICROFAB_CONFIG='{
    "port": 8080,
    "endorsing_organizations":[
        {
            "name": "Org1"
        }
      ],
    "channels":[
        {
            "name": "channel1",
            "endorsing_organizations":[
                "Org1"
            ],
            "capability_level": "V2_0"
        },
        {
            "name": "channel2",
            "endorsing_organizations":[
                "Org1"
            ],
            "capability_level": "V2_0"
        }
    ],
    "timeout": "60s"
}'


# Start Microfab
START_IMAGE="ibmcom/ibp-microfab:0.0.13"
docker run -e MICROFAB_CONFIG --label fabric-environment-name="1 Org Local Fabric Microfab" -p 8080:8080 $START_IMAGE
