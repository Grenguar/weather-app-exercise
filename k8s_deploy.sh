echo "Creating Container Engine cluster"
export GCLOUD_PROJECT=$DEVSHELL_PROJECT_ID
gcloud container clusters create weatherapp-cluster --zone europe-north1-a --scopes cloud-platform
gcloud container clusters get-credentials weatherapp-cluster --zone europe-north1-a

gcloud builds submit --tag gcr.io/$GCLOUD_PROJECT/weatherapp_frontend ./frontend/
gcloud builds submit --tag gcr.io/$GCLOUD_PROJECT/weatherapp_backend ./backend/

echo "Setting up environment variables"
sed -i -e "s/\[GCLOUD_PROJECT\]/$GCLOUD_PROJECT/g" ./backend/backend-deployment.yml
sed -i -e "s/\[APPID\]/$APPID/g" ./backend/backend-deployment.yml
sed -i -e "s/\[GCLOUD_PROJECT\]/$GCLOUD_PROJECT/g" ./frontend/frontend-deployment.yml
sed -i -e "s/\[GEO_API_KEY\]/$GEO_API_KEY/g" ./frontend/frontend-deployment.yml

echo "Deploying to Container Engine"
kubectl create -f ./backend/backend-deployment.yml
kubectl create -f ./backend/backend-service.yml
ip=""; while [ -z $ip ]; do echo "Waiting for end point..."; ip=$(kubectl get svc weatherapp-backend-service --template="{{range .status.loadBalancer.ingress}}{{.ip}}{{end}}"); [ -z "$ip" ] && sleep 10; done; echo "End point:" && echo $ip; export ENDPOINT=$ip
sed -i -e "s/\[ENDPOINT\]/$ENDPOINT/g" ./frontend/frontend-deployment.yml
kubectl create -f ./frontend/frontend-deployment.yml
kubectl create -f ./frontend/frontend-service.yml
ip=""; while [ -z $ip ]; do echo "Waiting for frontend end point..."; ip=$(kubectl get svc weatherapp-frontend --template="{{range .status.loadBalancer.ingress}}{{.ip}}{{end}}"); [ -z "$ip" ] && sleep 10; done; echo "Frontend ip:" && echo $ip; export FRONTEND=$ip


echo "Backend API (for Helsinki): http://$ENDPOINT:9000/api/weather"
echo "Backend API (for Paris): http://$ENDPOINT:9000/api/weather/48.864716,2.349014"
echo "Frontend address: http://$FRONTEND"