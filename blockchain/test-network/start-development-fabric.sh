

# 1) clear Microfab
for CONTAINER in $(docker ps -f label=fabric-environment-name="1 Org Local Fabric Microfab" -q -a) 
  do 
    docker rm -f ${CONTAINER}
  done

docker volume prune -f


# 2) Microfab config - 2 channel
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


# 3) Start Microfab
START_IMAGE="ibmcom/ibp-microfab:0.0.13"
docker run -e MICROFAB_CONFIG --label fabric-environment-name="1 Org Local Fabric Microfab" -p 8080:8080 $START_IMAGE

# 4) deploy chaincodes (biobank and currency)
# 5) edit config file (biobank/blockchain/currency-contract/config.json)
# 6) createUserAccount (biobank/blockchain/test-network/createUserAccount.sh)


# 7) Edit connectService file
# 8) Rename .env file (Keyguard hostname)
# 8) start express
NODE_ENV=development node index.js
# 9) enter localhost:3000
# 10) Logout
# 11) enter new certificate
# 12) Use



# 13) create client.id (common-name = client)
# 14) create keyguard.id (common-name = keyguard)
# 15) move keyguard.id, client.id and Org1 CA Admin.id to keyguard/wallet
# 16) Execute parse-certificates.sh
# 17) Execute keyguard
NODE_ENV=development node index.js &
# 18) Test Keyguard. Expected result "Data does not exist"
NODE_ENV=development node client-test-read-dna-key.js 