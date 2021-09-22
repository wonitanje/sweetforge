# Stock
## Get routes
### /get-stock/:type
Returns all models from database by type
Type argument is one of stock model (Package, Sweet, Attachment) must be string.

## Post routes
### /add-stock
Creating new collection by type from body. 
Saving to database. 
Returns all models from database with equivalent type
Body of request is equivalent one of stock model (You can find this in models folder).