# API readme

## API example




- GET /api/services
    - Description: Fetch a list of all available services in the system.
    - Request body: None
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: An array of names of services
        ``` json
        [
            {
                "name": "Bank Account"
            },
            {
                "name": "Digital Billing"
            },
            {
                "name": "Electronic Certificate"
            },
            {
                "name": "Finance & Postal Service"
            },
            ...
        ]
        ```
    - Error responses: 503 Service Unavailable (service error)


- GET /api/counters/:id/services
    - Description: Retrieve the services offered by a specific counter based on its ID.
    - Request body: None
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: An array of services associated with the counter.
        ``` json
        [
            {
                "id": 1,
                "name": "Bank Account"
            },
            {
                "id": 2,
                "name": "Payment card"
            }
        ]
        ```
    - Error responses: 500 Internal Server Error (generic error)

- GET /api/ticket/:service
    - Description: Retrieve a new ticket for the specified service tag
    - Request body: None
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: The tag of the service associated to the ticket
    - Error responses: 503 Service Unavailable (service error)

- GET /api/counters
    - Description: Retrieve a list of all counters
    - Request body: None
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: An array of counters id
    ``` json
    [
        {
            "id": 1,
        },
        {
            "id": 2,
        }
    ]
    ```
    - Error responses: 500 Internal Server Error (generic error)

- GET /api/counters/actual_client
    - Description: Retrieve the current client being served at each counter.
    - Request body: None
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: An array of object, composed of the id of the counter and tha actual ticket that is served by that counter
    ``` json
    [
    {
        "id": 1,
        "tag": "DB2",
        "num": {
            "ticketInQueue": 1,
            "tag": "DB"
        }
    },
    {
        "id": 2,
        "tag": "DB3",
        "num": {
            "ticketInQueue": 1,
            "tag": "DB"
        }
    },
    ]
    ```
    - Error responses: 503 Service Unavailable (service error)

 - GET /api/counters/:counterId/next
    - Description: Retrieve the next customer in line for the specified counter ID.
    - Request body: None
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: the id of the ticket to serve
    - Error responses: 503 Service Unavailable (service error)

- PUT /api/tickets/:ticketId
    - Description: Update the counter assignment for a specific ticket.
    - Request body: An object containing the counter ID.
        ``` json
        {
        "counterId": 1
        }
        ```
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: Confirmation message and the assigned counter ID.
        ``` json
        {
            "message": "Ticket state updated",
            "counterId": 1
        }
        ```
    - Error responses: 503 Service Unavailable (service error)

 - GET /api/officers
    - Description: Retrieve the list of all officers (role: employee).
    - Request body: None
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: An array of employee ( id + key_name)
        ``` json
        [
            {
                "id": 6,
                "key_name": "emp1"
            },
            {
                "id": 7,
                "key_name": "emp2"
            },
        ]
        ```
    - Error responses: 503 Service Unavailable (service error)

- PUT /api/counters/:counterId
    - Description: Update the employee who is working for the counter.
    - Request body: An object containing the counter ID.
        ``` json
        {
        "employeeId": 7
        }
        ```
    - Request query parameter: None
    - Response: 200 OK (success)
    - Response body: Confirmation message and the assigned counter ID.
        ``` json
        {
            "message": "Counter state updated",
            "counterId": "1"
        }
        ```
    - Error responses: 503 Service Unavailable (service error)



