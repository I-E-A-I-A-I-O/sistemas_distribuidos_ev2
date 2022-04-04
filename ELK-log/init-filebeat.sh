curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-6.8.3-amd64.deb
dpkg -i filebeat-6.8.3-amd64.deb
filebeat modules enable elasticsearch
filebeat setup
service filebeat start