# Colorix API

This API is a learning project to set up an API for CRUD operation with MongoDB. The intention, as a next step, is to further develop the web application 'Colorix', a ficticious online store and paint supplier. The API will serve the web-application with the product data from the API.

## Installation

## Usage

## API Endpoints

### Products

| HTTP verb | Endpoint             | Action                              |
| --------- | -------------------- | ----------------------------------- |
| GET       | /api/v1/products     | To retrieve all products            |
| POST      | /api/v1/products     | To create a product                 |
| GET       | /api/v1/products/:id | To retrieve a product by product-id |
| PATCH     | /api/v1/products/:id | To update parts of a product        |
| DELETE    | /api/v1/products/:id | To delete a product                 |

### Users

| HTTP verb | Endpoint          | Action                            |
| --------- | ----------------- | --------------------------------- |
| GET       | /api/v1/users     | To retrieve all users             |
| POST      | /api/v1/users     | To create a user                  |
| GET       | /api/v1/users/:id | To retrieve a user by id          |
| PATCH     | /api/v1/users/:id | To update parts of a user details |
| DELETE    | /api/v1/users/:id | To delete a user                  |

## Technologies used

-   [Node.js](https://nodejs.org/)
-   [Express](https://expressjs.com/)
-   [Postman](https://www.postman.com/)
-   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/lp/try4?utm_content=controlhterms&utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_core_prosp-brand_gic-null_emea-se_ps-all_desktop_eng_lead&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624566&adgroup=115749708223&cq_cmp=12212624566&gad=1&gclid=EAIaIQobChMIkJjiosGTgAMV_k9BAh0nOgcTEAAYASAAEgLB1vD_BwE)
-   [MongoDB Compass](https://www.mongodb.com/products/compass)
-   [Mongoose](https://mongoosejs.com/)
