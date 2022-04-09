# REQUESTS
## REGISTER
``` bash
curl -X POST -H 'Content-Type: application/json' -d '{"email": "asd69@xd.yes", "password": "123"}' http://localhost:8000/{bff}/auth/users
```

Donde `{bff}` = desktop || mobile

## LOGIN
``` bash
curl -X POST -H 'Content-Type: application/json' -d '{"email": "asd69@xd.yes", "password": "123"}' http://localhost:8000/{bff}/auth/users/session
```

Donde `{bff}` = desktop || mobile

## API CREATE
```bash
curl -X POST -H 'Content-Type: application/json' -H 'authorization: {token}' -d '{"name": "Rin Tin Tin", "age": 8, "breed": "German Sheperd"}' http://localhost:8000/{bff}/api/dogs
```

Donde `{bff}` = desktop || mobile y `{token}` es el JsonWebToken recibido luego del hacer login exitosamente

## API READ
### READ ALL
```bash
curl -H 'authorization: {token}' http://localhost:8000/{bff}/api/dogs
```

Donde `{bff}` = desktop || mobile y `{token}` es el JsonWebToken recibido luego del hacer login exitosamente
### READ ID
```bash
curl -H 'authorization: {token}' http://localhost:8000/{bff}/api/dogs/{dogID}
```

Donde `{bff}` = desktop || mobile, `{token}` es el JsonWebToken recibido luego del hacer login exitosamente, y `{dogID}` es la ID del perro

## API UPDATE
```bash
curl -X PATCH -H 'Content-Type: application/json' -H 'authorization: {token}' -d '{"name": "Bambi", "age": 400, "breed": "Dalmata"}' http://localhost:8000/{bff}/api/dogs/{dogID}
```

Donde `{bff}` = desktop || mobile, `{token}` es el JsonWebToken recibido luego del hacer login exitosamente, y `{dogID}` es la ID del perro

## API DELETE
```bash
curl -X DELETE -H 'authorization: {token}' http://localhost:8000/{bff}/api/dogs/{dogID}
```

Donde `{bff}` = desktop || mobile, `{token}` es el JsonWebToken recibido luego del hacer login exitosamente, y `{dogID}` es la ID del perro