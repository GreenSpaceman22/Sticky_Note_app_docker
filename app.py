from flask import Flask, request, jsonify, render_template, redirect, url_for
from pymongo import MongoClient
from flask_cors import CORS


with open('mongo.txt', 'r') as connection_DB:
    connection_string = connection_DB.read()
    

conn_str = connection_string
client = MongoClient(conn_str)
db = client['stickynoteapp']
collection = db['user_note_app']
app = Flask(__name__)
CORS(app)

global_user = ""
def active_user_setter(inputed):
    global global_user
    global_user = inputed
    print(global_user)
    return global_user

    

@app.route('/')
def login_screen():
    return render_template('login.html')

@app.route('/logout', methods=['POST'])
def log_out():
    return redirect(url_for('login_screen'))
@app.post('/signup')
def sign_up():
    user_name_past = request.form.get('signuser')
    password_past = request.form.get('signpass')
    existing_user = []
    
    cursor = collection.find()
    for document in cursor:
        
        old_user = document.get('user_name')
        existing_user.append(old_user)
    if user_name_past in existing_user:
        return jsonify({"Error" : "Error: 409, username already taken."})
    
    else:
        collection.insert_one({"user_name" : user_name_past, "Password" : password_past, "Note" : ""})
        return redirect(url_for('load_it', current_user=user_name_past))
    

@app.route('/login', methods=['POST'])
def login():
    user_name_past = request.form.get('loguser')
    password_past = request.form.get('logpass')
    
    
    cursor = collection.find()
    all_users = []
    old_user_info = []
    for document in cursor:
        old_user_info.append(document)
        all_users.append(document.get('user_name'))
        if user_name_past == document.get('user_name'):
            if password_past == document.get('Password'):
                return redirect(url_for("load_it", current_user=user_name_past))
    if user_name_past in all_users:
         print('loggin in')

    else:
        return jsonify({"Error" : "Error: 409, user doesn't exist."}) 

@app.get('/on_page_load')
def load_it():
    current_user = request.args.get('current_user')
    cursor = collection.find()
    each_note = []
    for document in cursor:
        if current_user == document.get('user_name'):
            user_returning = document.get('user_name')
            user_returned_notes = document.get('Note')
            with open(f'{user_returning}.txt', 'w') as returning_user:
                if user_returned_notes != None:
                    returning_user.write(user_returned_notes)
                else:
                    returning_user.write("welcome")                

            break
    with open(f'{user_returning}.txt', 'r') as returned_user_notes:
        for line in returned_user_notes:
            each_note.append(line)
    return redirect(url_for('home', users_note=each_note, current_user=current_user))

@app.get('/home')
def home():
    current_user = request.args.get('current_user')

    returning_notes = request.args.get('users_note')
    print(returning_notes)
    
    return render_template("index.html", returned_note=returning_notes, current_user=current_user)

@app.post('/post_it')
def post_it():
    print("in the post_it")
    cursor = collection.find()
    data = request.json
    print(data)
    user_id = data.get("user_name")
    user_id = user_id.replace(" ", "")
    notes = data.get("Note")
    notes = f"{notes}"
    count_documents = collection.count_documents({})
    user_to_find = {'user_name' : f'{user_id}'}
      
    if count_documents == 0:
        collection.insert_one({'user_name' : user_id, 'Note' : notes})
        with open(f'{user_id}.txt', 'w') as new_user_notes:
            new_user_notes.write(f"{notes}\n")
        
    else: 
        user_list = []
        for document in cursor:
            user_list.append(document.get('user_name'))
        if user_id in user_list:
            with open(f'{user_id}.txt', 'a') as user_notes:
                user_notes.write(f"{notes}\n")
                user_notes.close()
            with open(f'{user_id}.txt', 'r') as user_notes_read:
                new_notes = user_notes_read.read()
                update_data = {'$set' : {'user_name' : user_id, 'Note' : new_notes}}
                collection.update_one(user_to_find, update_data) 
        else:
            with open(f'{user_id}.txt', 'w') as new_user_notes:
                new_user_notes.write(f"{notes}\n")
                collection.insert_one({'user_name' : user_id, 'Note' : notes})   
       
    return jsonify({user_id : notes})

@app.route('/save_user')
def save_user():
    print("in the save user ______________")
    cursor = collection.find()
    global global_user    
    print("GlobalUser: ", global_user)
    active_user_list = []
    active_user_maybe = collection.find({ "active user": 1})
    count_documents = collection.count_documents({})
    if active_user_maybe == False:
        collection.insert_one({'active_user' : global_user})

    for document in cursor:
        if document.get('active_user') == "" or document.get('active_user') == global_user: 
            print('in the IF for save user global user: ', global_user)
            active_user_list.append(document)
            break
        else:
            print("not here in the else")
    if len(active_user_list) != 0 and len(active_user_list) != None:
        old_data = active_user_list[0]
    else:
        print("why oh why? my list is junk! list: ", active_user_list)
    
    updated_data = {'$set': {'active_user' : global_user}}
    if old_data:    
        collection.update_one(old_data, updated_data)
        return jsonify({'message' : 'active user set', 'document' : f'{old_data}'}) 
    else:
        print("Failed: old_data is None.")
        return jsonify({'message' : 'active user set', 'document' : 'old_data is none'})
@app.route('/get_user', methods=['POST'])
def get_user():
    data = request.json
    print("Here is my data from /get_user: ", data)
    active_user_setter(data.get("active_user"))
    return redirect(url_for("save_user"))

@app.get('/load_user')
def load_user():
    global global_user
    return jsonify({"active_user" : global_user })

if __name__ == '__main__':
    app.run(debug=True)