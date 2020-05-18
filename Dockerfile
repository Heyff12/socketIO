FROM node:12
RUN mkdir -p /home/Service
WORKDIR /home/Service    
COPY ./ /home/Service 
# COPY package*.json /home/Service/
RUN ls && pwd
RUN  npm install --production
EXPOSE 3004
CMD ["npm","start"]