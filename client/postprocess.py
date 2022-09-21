import os

def set_binary_names():
    # We want to find the "inode.js" file and replace ["<BINARY_NAMES_HERE>"] with the directory listing of the binaries
    try:
        data = None
        with open("dist/src/fs/inode.js", "r") as f:
            # Maybe done fucking do this
            data = f.read()

        binary_names = []

        for file in os.listdir("src/bin"):
            if file.endswith(".ts"):
                binary_names.append(file.replace(".ts", ""))

        new_binary_string = "["
        for b in binary_names:
             new_binary_string += f'\"{b}\", '
        new_binary_string += "]"
        data = data.replace("[\"<BINARY_NAMES_HERE>\"]", new_binary_string)

        with open("dist/src/fs/inode.js", "w") as f:
            f.write(data)
    except Exception as e:
        print(f"Failed to set binary names in dist/src/fs/inode.js: {e}")

def run_job(job_function, job_name, job_num):
    try:
        print(f"Trying to run \"{job_name}\" (job #{job_num})")
        job_function()
        print(f"Successfully ran \"{job_name}\" (job #{job_num})")
    except Exception as e:
        print(f"Failed while running \"{job_name}\" (job #{job_num}) ({e}")



if __name__ == "__main__":
    jobs = [[set_binary_names, "Set binary names"]]

    counter = 0
    for job in jobs:
        run_job(job[0], job[1], counter)
        counter+=1
