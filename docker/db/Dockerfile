FROM mongo:5.0

COPY samples/users.json /users.json
COPY samples/definitions.json /definitions.json
COPY samples/votes.json /votes.json

CMD mongoimport --host db --db kreol -u kreol -p password -c users --drop --file /users.json && \
    mongoimport --host db --db kreol -u kreol -p password -c definitions --drop --file /definitions.json && \
    mongoimport --host db --db kreol -u kreol -p password -c votes --drop --file /votes.json


