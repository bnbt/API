# Get Config
## Requiest
### path
```
GET /device/config
```
### auth
via `Device` header
```
Device: <device_id>
``` 
. Ex: `Device: 1e950f`

## Response
### requirements 
!!! Strip all possible headers
### status code
* `200` if succes
* `404` if device not found
### content-type
`x` or any `1 char` length except [`~`, `,`]

### response body
Given :

|id|device_id|state_id|state_name|red|green|blue|
|---|---|---|---|---|---|---|
|123|1e950f|1|State 1|255|0|0|
|124|1e950f|2|State 2|0|255|0|
|125|1e950f|3|State 3|150|150|9|

* **state_name** should not contain `~` or `,`
* **state_id** should start from 1 for a device and should **always** be consecutive. 1,2,4,5 is not allowed should be 1,2,3,4 -- must checked
* **red**, **green** and **blue** should be values from 0 to 255 included

The response should be formated as:
```
~<current_state>,<states_count>,State 1,255,0,0,State 2,0,255,0,State 3,150,150,9~
```
# State
## Requiest
### path
```
PUT /device/state?s=<state_id>&u=<rfid_card_code>
```
both **state_id** and **rfid_card_code** are integer values
### auth
via `Device` header
```
Device: <device_id>
``` 
. Ex: `Device: 1e950f`
## Response
### requirements 
!!! Strip all possible headers
### status code
`202` if success
`403` if user not authorised
### content-type
`x` or any `1 char` length except [`~`, `,`]

### response body
```
~<user_name>~
```
or
```
~403~
```

# Get state
### path
```
GET /device/state
```
### auth
via `Device` header
```
Device: <device_id>
``` 
. Ex: `Device: 1e950f`
## Response
### requirements 
!!! Strip all possible headers
### status code
`202` if success
`404` if user not authorised
### content-type
`x` or any `1 char` length except [`~`, `,`]

### response body
```
~<state_id>~
```
or
```
~404~
```

