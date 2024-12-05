# Step 1: Use an official Node.js runtime as the base image
FROM node:18-slim

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (if exists) into the container
COPY package*.json ./

# Step 4: Install app dependencies
RUN npm install --production

# Step 5: Install TensorFlow dependencies (if required)
# The base image node:18-slim may already have Python3 and pip installed,
# but TensorFlow may need specific packages installed.
RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install tensorflow

# Step 6: Copy the entire `src` directory into the container
COPY ./src ./src

# Step 8: Expose the port that your app will run on 
EXPOSE 8080

# Step 9: Define the command to run the application
CMD ["npm", "start"]
