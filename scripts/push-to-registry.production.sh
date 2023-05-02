# Tag Docker images
docker tag frontend registry.digitalocean.com/billimo/frontend
docker tag administration registry.digitalocean.com/billimo/administration
docker tag payments registry.digitalocean.com/billimo/payments
docker tag invoicing registry.digitalocean.com/billimo/invoicing
docker tag email-service registry.digitalocean.com/billimo/email-service
docker tag api-gateway registry.digitalocean.com/billimo/api-gateway
# Push docker images
docker push registry.digitalocean.com/billimo/frontend
docker push registry.digitalocean.com/billimo/administration
docker push registry.digitalocean.com/billimo/payments
docker push registry.digitalocean.com/billimo/invoicing
docker push registry.digitalocean.com/billimo/email-service
docker push registry.digitalocean.com/billimo/api-gateway
