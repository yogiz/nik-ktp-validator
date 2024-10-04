# API for Indonesian ID Card Identification (Adaptation to Hono.js)

This project is an adaptation of the [Indonesian ID Card Identification API](https://github.com/audhiaprilliant/indonesian-id-card-identification) to use Node.js and Hono.js. It provides functionality to validate (parsing method not validate using dukcapil) information from Indonesian ID cards (KTP).

## Prerequisites

- Node.js (version >= 18.14.1)
- npm (Node Package Manager)

## How to Run This API

1. Open your favorite terminal.
2. Install module dependencies:
   ```bash
   npm install
   ```
3. Build:
   ```bash
   npm run build
   ```
4. Start:
   ```bash
   npm start
   ```

### Deployment using Docker

Dockerfile is at `./Dockerfile`

- Build docker

  ```
  docker build -t hono-ktp .
  ```

- Run Docker
  ```
  docker run -p 5000:5000 hono-ktp
  ```

---

### Request body

- Open Postman
- Create a POST request on http://127.0.0.1:5000/api/nik
- Sample of request body:

```
{
    "nik": [
        "1234567891234567"
    ],
    "process": "full"
}
```

- `nik` contains list of ID card (KTP)
- `process` as method how the ID card information will be returned. You can choose `limited` for the limited information or `full` for the rich information

### Response API

If you choose `limited`, the response API will be as the following output

```
{
    "message": "success",
    "errors": [],
    "data": {
        "1234567891234567": false
    },
    "summary": {
        "number": 1,
        "number_processed": 1,
        "error": 0,
        "valid": {
            "all_section": 0,
            "section": {
                "length": 1,
                "area": 0,
                "dob": 0,
                "gender": 1,
                "computerized": 1
            }
        }
    }
}
```

If you choose `full`, the response API will be as the following output

```
{
    "message": "success",
    "errors": [],
    "data": {
        "1234567891234567": {
            "data": {
                "length": {
                    "value": "1234567891234567",
                    "valid": true
                },
                "area": {
                    "value": {
                        "province": "None",
                        "district": "None",
                        "subdistrict": "None"
                    },
                    "valid": false
                },
                "dob": {
                    "value": {
                        "dob": "None",
                        "age": "None"
                    },
                    "valid": false
                },
                "gender": {
                    "value": "Woman",
                    "valid": true
                },
                "computerized": {
                    "value": "4567",
                    "valid": true
                }
            },
            "valid": false
        }
    },
    "summary": {
        "number": 1,
        "number_processed": 1,
        "error": 0,
        "valid": {
            "all_section": 0,
            "section": {
                "length": 1,
                "area": 0,
                "dob": 0,
                "gender": 1,
                "computerized": 1
            }
        }
    }
}
```

But, if something error in the process, the following response will appear.

```
{
    "message": "failed",
    "data": [
        "1234567891234567"
    ]
}
```

## Attribution

This project is inspired by the original work by [audhiaprilliant](https://github.com/audhiaprilliant/indonesian-id-card-identification). Please refer to their repository for more details on the original API.
