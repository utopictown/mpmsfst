# mpmsfst
nestjs marketplace microservices with oauth2 implementation


### how to run
 1. copy .env.example to .env `cp .env.example .env`
 1. fill the correct data
 1. run `docker-compose up -d`

### API docs
Swagger API documentation is available on `/docs`

### Authenticating
1. login on `:8080/login` (test:test)
1. authorize permission
1. create `access_token` on `:8080/token` with Basic header authentication `base64(client_id:client_secret)` (99b7f4c5-77f2-11ed-8dea-0242ac1b0002:clientsecret)
