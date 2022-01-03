import sqlite3
import tabulate
import os

# Only root can run
if os.geteuid() != 0:
    exit("You need to have root privileges to run this script.\nPlease try again, this time using 'sudo'. Exiting.")

# Setup db
if os.getenv("EDITFILES_DB") is None:
    db = sqlite3.connect('../share.db')
else:
    db = sqlite3.connect(os.getenv("EDITFILES_DB"))

while True:
    while True:
        print("[1] List Files")
        print("[2] New File")
        print("[3] Change Password")
        print("[4] Toggle Archive File")
        print("[0] Quit")

        operation = input("Choose an operation: ")

        try:
            operation = int(operation)
            break
        except ValueError:
            print("Invalid input")

    if operation == 0:
        exit()

    if operation == 1:
        print("Listing Files")
        cursor = db.execute("SELECT * FROM files")
        headers = ["Filename", "Alias", "Password", "Is Archived"]
        data = []

        for row in cursor:
            data.append([row[1], row[4], row[2], True if row[3] == 1 else False])

        print(tabulate.tabulate(data, headers, tablefmt="pretty"))

    elif operation == 2:
        while True:
            filename = input("Name: ")
            if filename == "":
                print("A name is required")
            else:
                break

        password = input("Password (optional): ")
        if password == "":
            password = None

        alias = input("Alias (optional): ")
        if alias == "":
            alias = None

        # Insert into db
        db.execute("INSERT INTO files (filename, password, alias) VALUES (?, ?, ?)", (filename, password, alias))
        db.commit()

        print("File added")
    elif operation == 3:
        while True:
            filename = input("Name: ")
            if filename == "":
                print("A name is required")
            else:
                break

        # Make sure file exists
        file = db.execute("SELECT * FROM files WHERE filename=?", (filename,)).fetchone()
        if file is None:
            print("File does not exist")
            exit()

        password = input("New Password: ")
        if password == "":
            password = None

        # Update db
        db.execute("UPDATE files SET password=? WHERE filename=?", (password, filename))
        db.commit()

        print("Password updated")
    elif operation == 4:
        while True:
            filename = input("Name: ")
            if filename == "":
                print("A name is required")
            else:
                break

        # Get the current archive status
        archived = db.execute("SELECT archived FROM files WHERE filename=?", (filename,)).fetchone()
        if not archived:
            print("File not found")
            exit()
        archived = True if archived[0] == 1 else False

        # Update db
        result = db.execute("UPDATE files SET archived=NOT archived WHERE filename=?", (filename,))
        db.commit()

        print(f"Changed archive status to: {not archived}")
