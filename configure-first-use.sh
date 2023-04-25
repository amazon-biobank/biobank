

GREEN='\033[0;32m'; echo -e "${GREEN}Moving Fabric artifacts to project folder"
mv ../bin ./blockchain/
mv ../config ./blockchain/

GREEN='\033[0;32m'; echo -e "${GREEN}Installing npm packages on currency contract"
cd "blockchain/currency-contract/"
npm install
cd -

GREEN='\033[0;32m'; echo -e "${GREEN}Installing npm packages on biobank contract"
cd "blockchain/biobank-contract/"
npm install
cd -

GREEN='\033[0;32m'; echo -e "${GREEN}Installing npm packages on api"
cd ./api
npm install
cd -

GREEN='\033[0;32m'; echo -e "${GREEN}Installing npm packages on application"
cd ./application/
npm install
cd - 


GREEN='\033[0;32m'; echo -e "${GREEN}Installing npm packages on keyguard"
cd ./../keyguard/
npm install
cd -

GREEN='\033[0;32m'; echo -e "${GREEN}Copying .env file on application"
cd ./application/
cp sample.env .env
cd - 


GREEN='\033[0;32m'; echo -e "${GREEN}Copying .env file keyguard. Please configure your database"
cd ./../keyguard/
cp sample.env .env
cd -

GREEN='\033[0;32m'; echo -e "${GREEN}Criados certificados em "$(pwd)"/wallet"