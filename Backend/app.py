import secrets
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
import bcrypt
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS
from functools import wraps  
from decimal import Decimal

app = Flask(__name__)
CORS(app, origins="http://localhost:5173", supports_credentials=True)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'dbproject'

mysql = MySQL(app)

app.config['SECRET_KEY'] = secrets.token_hex(16)

# revoked_tokens = set() отзыв токенов

@app.route('/')
def index():
    return 'Hello, this is the Flask server!'


from flask import request, jsonify

@app.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        tel_number = data.get('tel_number')
        feedback_text = data.get('feedback_text')

        if first_name is not None and last_name is not None and tel_number is not None and feedback_text is not None:
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO feedback (first_name, last_name, tel_number, message) VALUES (%s, %s, %s, %s)",
                        (first_name, last_name, tel_number, feedback_text))
            mysql.connection.commit()
            cur.close()

            return jsonify({"message": "Feedback submitted successfully"}), 200
        else:
            return jsonify({"error": "All fields must be filled"}), 400  # Bad Request

    except Exception as e:
        return jsonify({"error": str(e)}), 500




    
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')
    firstName = data.get('firstName')
    lastName = data.get('lastName')

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    existing_user = cur.fetchone()
    cur.close()

    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO users (username, password, firstName, lastName, role) VALUES (%s, %s, %s, %s, %s)", (username, hashed_password, firstName, lastName, "user"))
    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "User registered successfully"})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE username = %s", (username,)) #SQL запрос
    user = cur.fetchone() #данные user
    cur.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')): #проверка пароля
        role = user[5]  
        token = jwt.encode({   # создание токена
            'user_id': user[0],
            'firstName': user[3],
            'lastName': user[4],
            'role': role,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({"token": token})
    else:
        print(f"Login failed for user: {username}")
        return jsonify({"message": "Invalid credentials"}), 401



#-----------GET PRODUCTS------------
@app.route('/getproducts', methods=['GET'])
def getproducts():
    try:
        cur = mysql.connection.cursor()

        # Базовый запрос
        query = "SELECT * FROM products WHERE 1"

        # Параметры фильтрации
        category = request.args.get('category')
        priceFrom = request.args.get('priceFrom')
        priceTo = request.args.get('priceTo')

        print("category:", category)
        print("priceFrom:", priceFrom)
        print("priceTo:", priceTo)

        # Добавление условий фильтрации к запросу
        if category:
            query += f" AND category = '{category}'"

        if priceFrom is not None:
          query += f" AND price >= {Decimal(priceFrom)}"

        if priceTo is not None:
            query += f" AND price <= {Decimal(priceTo)}"

        cur.execute(query)
        products = cur.fetchall()
        cur.close()

        products_list = [
            {'id': item[0], 'name': item[1], 'discription': item[2], 'price': item[3], 'img': item[4], 'category': item[5], 'quantity': item[6]} 
            for item in products
        ]

        return jsonify(products_list)

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


#------------GET NEWS------------
@app.route('/getnews', methods=['GET'])
def getnews():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM news")
    news = cur.fetchall()
    cur.close()

    news_list = [
        {'id': item[0], 'title': item[1], 'discription': item[2], 'img': item[3]} 
        for item in news
    ]

    return jsonify(news_list)


#---------ADD TO CART----------
@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    token = request.headers.get('Authorization').encode('utf-8')

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    data = request.get_json()
    product_id = data.get('product_id', None)

    cur = mysql.connection.cursor()
    
    # Check if the product is already in the user's cart
    cur.execute("SELECT * FROM basket WHERE user_id = %s AND product_id = %s", (user_id, product_id))
    existing_item = cur.fetchone()

    if existing_item:
        # If the product is already in the cart, update the quantity
        new_quantity = existing_item[3] + 1
        cur.execute("UPDATE basket SET quantity = %s WHERE user_id = %s AND product_id = %s", (new_quantity, user_id, product_id))
    else:
        # If the product is not in the cart, add a new entry
        cur.execute("INSERT INTO basket (user_id, product_id, quantity) VALUES (%s, %s, 1)", (user_id, product_id))

    mysql.connection.commit()
    cur.close()

    return jsonify({"message": "Product added to the cart successfully"}), 200

    return response, 200


#---------GET CART ITEMS-----------
@app.route('/get_cart_items', methods=['GET'])
def get_cart_items():
    token = request.headers.get('Authorization').encode('utf-8')

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    cur = mysql.connection.cursor()
    cur.execute("SELECT basket.id, products.name, products.discription, products.price, products.img, products.category, basket.quantity FROM basket JOIN products ON basket.product_id = products.id WHERE basket.user_id = %s", (user_id,))
    cart_items = cur.fetchall()
    cur.close()

    cart_list = [
        {'id': item[0], 'name': item[1], 'description': item[2], 'price': item[3], 'img': item[4], 'category': item[5], 'quantity': item[6]} 
        for item in cart_items
    ]

    return jsonify(cart_list)



#-----------DELETE FROM CART------------
@app.route('/delete_from_cart', methods=['POST'])
def delete_from_cart():
    data = request.get_json()

    token = request.headers.get('Authorization').encode('utf-8')

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = decoded_token['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    product_id = data.get('product_id')

    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM basket WHERE user_id = %s AND id = %s", (user_id, product_id))
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Item removed from cart successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#----------DELETE PRODUCT-----------
@app.route('/del_product', methods=['POST'])
def del_product():
    data = request.get_json()

    token = request.headers.get('Authorization').encode('utf-8')

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_role = decoded_token.get('role', 'user')
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    if user_role != 'admin':
        return jsonify({"error": "Permission denied. Only admin can delete products"}), 403

    product_id = data.get('product_id')

    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Product removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



#-----------ADD PRODUCT------------
@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.get_json()

    token = request.headers.get('Authorization').encode('utf-8')

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_role = decoded_token.get('role', 'user')
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    if user_role != 'admin':
        return jsonify({"error": "Permission denied. Only admin can add products"}), 403

    try:
        data = request.get_json()

        product = data.get('product')
        title = product.get('name')
        discription = product.get('discription')
        price = product.get('price')
        image_link = product.get('img')
        category = product.get('category')
        quantity = product.get('quantity')

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO products (name, discription, price, img, category, quantity) VALUES (%s, %s, %s, %s, %s, %s)",
                    (title, discription, price, image_link, category, quantity))
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Product added successfully", "received_data": data, "isAdmin": user_role == 'admin'}), 200
    except Exception as e:
        return jsonify({"error": str(e), "received_data": data}), 500


#-------UPDATE PRODUCT--------
@app.route('/update_product', methods=['PUT'])
def update_product():
    print("Received PUT request to /update_product")

    data = request.get_json()

    # data = {'updated_product': {'name': '12', 'discription': 'ad', 'price': '12', 'img': 'dad', 'category': 'daad', 'quantity': '12'}}

    token = request.headers.get('Authorization').encode('utf-8')

    try:
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        user_role = decoded_token.get('role', 'user')
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    if user_role != 'admin':
        return jsonify({"error": "Permission denied. Only admin can update products"}), 403

    try:
        updated_product = data.get('updated_product')
        print(updated_product)

        cur = mysql.connection.cursor()
        cur.execute("UPDATE products SET name=%s, discription=%s, price=%s, img=%s, category=%s, quantity=%s WHERE id=%s",
                    (updated_product['name'], updated_product['discription'], updated_product['price'],
                    updated_product['img'], updated_product['category'], updated_product['quantity'], updated_product['id']))
        mysql.connection.commit()
        cur.close()

        print("Product updated successfully")
        return jsonify({"message": "Product updated successfully"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, port=5000)

