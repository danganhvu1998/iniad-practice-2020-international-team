# INSTALL NODE 12
sudo apt update
sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt -y install nodejs
sudo apt -y  install gcc g++ make
sudo npm i -g sequelize-cli

# INSTALL DOCKER AND DOCKER COMPOSE
# https://gist.github.com/wdullaer/f1af16bd7e970389bad3
sudo true
wget -qO- https://get.docker.com/ | sh

# Install docker-compose
COMPOSE_VERSION=`git ls-remote https://github.com/docker/compose | grep refs/tags | grep -oE "[0-9]+\.[0-9][0-9]+\.[0-9]+$" | sort --version-sort | tail -n 1`
sudo sh -c "curl -L https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose"
sudo chmod +x /usr/local/bin/docker-compose
sudo sh -c "curl -L https://raw.githubusercontent.com/docker/compose/${COMPOSE_VERSION}/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose"

# Install docker-cleanup command
cd /tmp
git clone https://gist.github.com/76b450a0c986e576e98b.git
cd 76b450a0c986e576e98b
sudo mv docker-cleanup /usr/local/bin/docker-cleanup
sudo chmod +x /usr/local/bin/docker-cleanup

# Set Ubuntu user can use docker without sudo
sudo groupadd docker
sudo usermod -aG docker ubuntu

# Install Nginx
sudo apt install nginx -y
sudo cp config/nginx.conf /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl restart nginx

# Install certbot
sudo add-apt-repository ppa:certbot/certbot -y # might be not necessary 
sudo apt-get install -y python3-certbot-nginx
sudo certbot --nginx