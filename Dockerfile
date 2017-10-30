FROM 137112412989.dkr.ecr.us-west-2.amazonaws.com/amazonlinux:latest

RUN curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -

RUN yum -y install nodejs imagemagick

RUN mkdir /app
WORKDIR /app
