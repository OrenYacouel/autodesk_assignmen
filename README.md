# Home assignment
## A simple service with two endpoints: Youtube API and health check for your service


### You can access my instance of the app (running on Heroku) on:
    https://enigmatic-forest-12084-d9dbfe7807a7.herokuapp.com/youtube

### To run locally using Docker:
    run: docker build -t my-image . 
    run: docker run -e GOOGLE_API_KEY=<your_api_key> -p 3000:3000 my-image

You can access the service at localhost:3000/health or localhost:3000/youtube. If you chose a different port number other than 3000, change the port number at the local address.
