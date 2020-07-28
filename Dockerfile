FROM ubuntu:20.04

# Install dependencies
RUN apt-get update \
  && apt-get -y install sudo \
                     apt-transport-https \
                     ca-certificates \
                     curl \
                     gnupg-agent \
                     software-properties-common

# Add docker repositories
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
   | apt-key add - \
   && add-apt-repository \
      "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) \
      stable"

# Install docker
RUN apt-get update \
   && apt-get -y install docker-ce docker-ce-cli containerd.io

#Install docker-compose
RUN  curl -L "https://github.com/docker/compose/releases/download/1.26.2/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose \
   && chmod +x /usr/local/bin/docker-compose


# RUN useradd -m docker && echo "docker:docker" | chpasswd && adduser docker

# USER docker

# Install fabric Binaries
RUN curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.0 1.4.7

ENV PATH="/home/bin:${PATH}"



CMD /bin/bash