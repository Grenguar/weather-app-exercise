echo "Creating Container Engine cluster"
gcloud container clusters create weatherapp-cluster --zone europe-north1-a --scopes cloud-platform
gcloud container clusters get-credentials weatherapp-cluster --zone europe-north1-a

gcloud builds submit --tag gcr.io/$GCLOUD_PROJECT/weatherapp_frontend ./frontend/
gcloud builds submit --tag gcr.io/$GCLOUD_PROJECT/weatherapp_backend ./backend/

echo "Deploying to Container Engine"
export GCLOUD_PROJECT=$DEVSHELL_PROJECT_ID
export APPID=$WEATHER_API
export GEO_API_KEY=$GEO_API
sed -i -e "s/\[GCLOUD_PROJECT\]/$GCLOUD_PROJECT/g" ./backend/backend-deployment.yml
sed -i -e "s/\[APPID\]/$APPID/g" ./backend/backend-deployment.yml
sed -i -e "s/\[GCLOUD_PROJECT\]/$GCLOUD_PROJECT/g" ./frontend/frontend-deployment.yml
sed -i -e "s/\[GEO_API_KEY\]/$GEO_API_KEY/g" ./frontend/frontend-deployment.yml
echo "###### backend-deployment ######"
cat ./backend/backend-deployment.yml
echo "###### frontend-deployment ######"
cat ./frontend/frontend-deployment.yml
echo "######"
kubectl create -f ./backend/backend-deployment.yml
kubectl create -f ./backend/backend-service.yml
kubectl create -f ./frontend/frontend-deployment.yml
kubectl create -f ./frontend/frontend-service.yml