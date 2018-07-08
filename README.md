# Mineself
A server to store and analyze my own search histories on Google, Bing and Baidu...

The following browser extension is needed to relay the search query back to this server:

* [search-digitme](https://github.com/DingDean/search-digitalme.git)

## Usage

The following environment variables need to be set:

* `PORT`
  - desc: the port server listens to
  - default: 8889

* `MONGO_URL`
  - desc: The mongodb endpoint the server use
  - default: 'mongodb://localhost:27017/test'

* `JWT_SECRECT`:
  - desc: the secret used to generate the JWT token
  - default: none

* `SINGLE_TOKEN`:
  - desc: the token that identifies yourself
  - default: none

