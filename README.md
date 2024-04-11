# a simple service with two endpoints: Youtube API and health check for your service

to run locally using Docker:
run: docker build -t my-image . 
run: docker run -e  GOOGLE_API_KEY=<your_api_key> -p 3000:3000 my-image

You can access my instance of the app (running on Heroku):
https://enigmatic-forest-12084-d9dbfe7807a7.herokuapp.com/youtube