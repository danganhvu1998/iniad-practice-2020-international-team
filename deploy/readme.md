# Deployment Script

## Purpose

+ Deploy everything in one cmd: `sudo chmod +x nodeWithDockerInstallScript.sh & ./nodeWithDockerInstallScript.sh`

## Setting before execution

+ Run cmd when inside `/shozemi-backend/deploy`
+ Setting domain name in `config/nginx.conf`. At the writing time, it is close to line 7
  + `server_name domainName;`
+ Setting user to use docker without `sudo` in `nodeWithDockerInstallScript.sh`.  At the writing time, it is close to line 29. Initial it was set to `ubuntu` as the default username for AWS EC2
  + `sudo usermod -aG docker ubuntu`

## Note

+ Double check on `config/nginx.conf` as if it is incorrect, we hardly able to read warning message from `nginx`
