FROM node:12
RUN mkdir -p /home/Service
WORKDIR /home/Service    
COPY ./ /home/Service 
RUN  npm install --production
EXPOSE 3004
CMD ["npm","start"]