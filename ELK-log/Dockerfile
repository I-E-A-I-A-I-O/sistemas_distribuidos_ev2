FROM sebp/elk:683
EXPOSE 5601 9200 5044 7777/udp
COPY udp.conf /etc/logstash/conf.d/99-input-udp.conf
COPY init-filebeat.sh .
RUN ./init-filebeat.sh