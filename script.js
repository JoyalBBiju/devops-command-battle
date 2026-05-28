// DevOps Command Challenges Database
const devopsCommands = [
    // Beginner Level
    {
        id: 1,
        difficulty: 'Beginner',
        category: 'File Navigation',
        question: 'List all files in the current directory including hidden files',
        correctCommand: ['ls -a', 'ls -la', 'ls -lah'],
        hint: 'Use ls with the "-a" flag to show hidden files (files starting with .)'
    },
    {
        id: 2,
        difficulty: 'Beginner',
        category: 'File Navigation',
        question: 'Print the current working directory path',
        correctCommand: ['pwd'],
        hint: 'pwd stands for "Print Working Directory"'
    },
    {
        id: 3,
        difficulty: 'Beginner',
        category: 'File Navigation',
        question: 'Change to the home directory',
        correctCommand: ['cd ~', 'cd', 'cd $HOME'],
        hint: 'Use cd with ~ symbol or just cd alone'
    },
    {
        id: 4,
        difficulty: 'Beginner',
        category: 'File Navigation',
        question: 'Create a new empty file named "config.txt"',
        correctCommand: ['touch config.txt'],
        hint: 'Use the touch command to create empty files'
    },
    {
        id: 5,
        difficulty: 'Beginner',
        category: 'File Navigation',
        question: 'Create a new directory named "myproject"',
        correctCommand: ['mkdir myproject'],
        hint: 'mkdir stands for "make directory"'
    },

    // Intermediate Level
    {
        id: 6,
        difficulty: 'Intermediate',
        category: 'File Operations',
        question: 'Display the contents of a file named "config.txt"',
        correctCommand: ['cat config.txt'],
        hint: 'Use the cat command to display file contents'
    },
    {
        id: 7,
        difficulty: 'Intermediate',
        category: 'File Operations',
        question: 'Change permissions to make a file executable',
        correctCommand: ['chmod +x filename', 'chmod 755 filename', 'chmod u+x filename'],
        hint: 'Use chmod command with +x flag or 755 permission'
    },
    {
        id: 8,
        difficulty: 'Intermediate',
        category: 'File Operations',
        question: 'Copy a file "source.txt" to "destination.txt"',
        correctCommand: ['cp source.txt destination.txt'],
        hint: 'Use cp command for copying files'
    },
    {
        id: 9,
        difficulty: 'Intermediate',
        category: 'File Operations',
        question: 'Move or rename "oldname.txt" to "newname.txt"',
        correctCommand: ['mv oldname.txt newname.txt'],
        hint: 'Use mv command to move or rename files'
    },
    {
        id: 10,
        difficulty: 'Intermediate',
        category: 'File Operations',
        question: 'Remove a file named "temp.txt"',
        correctCommand: ['rm temp.txt'],
        hint: 'Use rm command to remove files'
    },

    // Intermediate Level - Search & Find
    {
        id: 11,
        difficulty: 'Intermediate',
        category: 'Search & Find',
        question: 'Find all files with ".log" extension in current directory and subdirectories',
        correctCommand: ['find . -name "*.log"', "find . -name '*.log'", 'find . -type f -name "*.log"'],
        hint: 'Use find command with -name pattern for recursive search'
    },
    {
        id: 12,
        difficulty: 'Intermediate',
        category: 'Search & Find',
        question: 'Search for the word "error" in a file "app.log"',
        correctCommand: ['grep error app.log', 'grep "error" app.log'],
        hint: 'Use grep command to search for text in files'
    },
    {
        id: 13,
        difficulty: 'Intermediate',
        category: 'Search & Find',
        question: 'Find files modified in the last 24 hours',
        correctCommand: ['find . -mtime -1', 'find . -type f -mtime -1'],
        hint: 'Use find with -mtime flag to search by modification time'
    },

    // Advanced Level
    {
        id: 14,
        difficulty: 'Advanced',
        category: 'Text Processing',
        question: 'Count the number of lines in a file "data.txt"',
        correctCommand: ['wc -l data.txt'],
        hint: 'Use wc command with -l flag (for lines)'
    },
    {
        id: 15,
        difficulty: 'Advanced',
        category: 'Text Processing',
        question: 'Search for a string "ERROR" in all .log files recursively',
        correctCommand: ['grep -r "ERROR" *.log', 'grep -r ERROR *.log', 'grep -r "ERROR" . --include="*.log"'],
        hint: 'Use grep with -r flag for recursive search across multiple files'
    },
    {
        id: 16,
        difficulty: 'Advanced',
        category: 'Text Processing',
        question: 'Display the first 10 lines of a file "large.txt"',
        correctCommand: ['head -10 large.txt', 'head -n 10 large.txt'],
        hint: 'Use head command with -n flag to specify number of lines'
    },
    {
        id: 17,
        difficulty: 'Advanced',
        category: 'Text Processing',
        question: 'Display the last 20 lines of a file "log.txt"',
        correctCommand: ['tail -20 log.txt', 'tail -n 20 log.txt'],
        hint: 'Use tail command with -n flag to view end of file'
    },

    // Advanced Level - Compression
    {
        id: 18,
        difficulty: 'Advanced',
        category: 'Compression',
        question: 'Create a compressed archive of a folder named "myproject"',
        correctCommand: ['tar -czf myproject.tar.gz myproject', 'tar -cf myproject.tar myproject', 'tar -czvf myproject.tar.gz myproject'],
        hint: 'Use tar command: -c create, -z gzip compression, -f filename'
    },
    {
        id: 19,
        difficulty: 'Advanced',
        category: 'Compression',
        question: 'Extract a tar.gz archive named "backup.tar.gz"',
        correctCommand: ['tar -xzf backup.tar.gz', 'tar -xzvf backup.tar.gz'],
        hint: 'Use tar with -x extract, -z for gzip, -f for file'
    },
    {
        id: 20,
        difficulty: 'Advanced',
        category: 'Compression',
        question: 'Compress a file "document.txt" with gzip',
        correctCommand: ['gzip document.txt'],
        hint: 'Use gzip command to compress files'
    },

    // Advanced Level - System Info
    {
        id: 21,
        difficulty: 'Advanced',
        category: 'System Information',
        question: 'List all running processes with detailed information',
        correctCommand: ['ps aux', 'ps -ef', 'ps -eF'],
        hint: 'Use ps command with aux or -ef flags for full output'
    },
    {
        id: 22,
        difficulty: 'Advanced',
        category: 'System Information',
        question: 'Display system memory usage',
        correctCommand: ['free -h', 'free', 'free -m'],
        hint: 'Use free command (with -h for human readable format)'
    },
    {
        id: 23,
        difficulty: 'Advanced',
        category: 'System Information',
        question: 'Check disk space usage of all mounted filesystems',
        correctCommand: ['df -h', 'df -ah'],
        hint: 'Use df command with -h flag for human-readable format'
    },
    {
        id: 24,
        difficulty: 'Advanced',
        category: 'System Information',
        question: 'Display the current user logged in',
        correctCommand: ['whoami'],
        hint: 'Use whoami command to display current user'
    },

    // Expert Level
    {
        id: 25,
        difficulty: 'Expert',
        category: 'Permissions & Ownership',
        question: 'Change ownership of a file "app.py" to user "developer"',
        correctCommand: ['chown developer app.py', 'chown developer:developer app.py'],
        hint: 'Use chown command to change file owner'
    },
    {
        id: 26,
        difficulty: 'Expert',
        category: 'Permissions & Ownership',
        question: 'Change ownership of a directory and all contents recursively',
        correctCommand: ['chown -R owner:group /path/to/dir', 'chown -R owner /path/to/dir'],
        hint: 'Use chown with -R flag for recursive change'
    },
    {
        id: 27,
        difficulty: 'Expert',
        category: 'Permissions & Ownership',
        question: 'Set file permissions to 644 (read/write for owner, read for others)',
        correctCommand: ['chmod 644 filename'],
        hint: 'Use chmod with octal notation: 644 = rw-r--r--'
    },

    // Expert Level - Piping & Redirection
    {
        id: 28,
        difficulty: 'Expert',
        category: 'Piping & Redirection',
        question: 'Count the number of files in current directory using ls and wc',
        correctCommand: ['ls | wc -l'],
        hint: 'Use pipe operator | to pass output from ls to wc'
    },
    {
        id: 29,
        difficulty: 'Expert',
        category: 'Piping & Redirection',
        question: 'Redirect output of echo "hello" to a file "output.txt"',
        correctCommand: ['echo "hello" > output.txt', "echo 'hello' > output.txt"],
        hint: 'Use > operator to redirect output to a file'
    },
    {
        id: 30,
        difficulty: 'Expert',
        category: 'Piping & Redirection',
        question: 'Append text "new line" to end of file "notes.txt"',
        correctCommand: ['echo "new line" >> notes.txt', "echo 'new line' >> notes.txt"],
        hint: 'Use >> operator to append (not overwrite) to a file'
    },

    // Expert Level - Package Management
    {
        id: 31,
        difficulty: 'Expert',
        category: 'Package Management',
        question: 'Install a package named "docker" using apt',
        correctCommand: ['apt install docker', 'apt-get install docker', 'sudo apt install docker'],
        hint: 'Use apt install command (may need sudo)'
    },
    {
        id: 32,
        difficulty: 'Expert',
        category: 'Package Management',
        question: 'Update all installed packages',
        correctCommand: ['apt update', 'apt-get update', 'sudo apt update', 'sudo apt-get update'],
        hint: 'Use apt update to refresh package list'
    },
    {
        id: 33,
        difficulty: 'Expert',
        category: 'Package Management',
        question: 'Remove a package "curl" completely',
        correctCommand: ['apt remove curl', 'apt-get remove curl', 'sudo apt remove curl'],
        hint: 'Use apt remove command'
    },

    // Expert Level - Services & Processes
    {
        id: 34,
        difficulty: 'Expert',
        category: 'Services & Processes',
        question: 'Start a service named "nginx"',
        correctCommand: ['systemctl start nginx', 'sudo systemctl start nginx', 'service nginx start'],
        hint: 'Use systemctl start command (may need sudo)'
    },
    {
        id: 35,
        difficulty: 'Expert',
        category: 'Services & Processes',
        question: 'Stop a running service "apache2"',
        correctCommand: ['systemctl stop apache2', 'sudo systemctl stop apache2', 'service apache2 stop'],
        hint: 'Use systemctl stop command'
    },
    {
        id: 36,
        difficulty: 'Expert',
        category: 'Services & Processes',
        question: 'Enable a service to start on boot',
        correctCommand: ['systemctl enable service_name', 'sudo systemctl enable service_name'],
        hint: 'Use systemctl enable to start service on boot'
    },
    {
        id: 37,
        difficulty: 'Expert',
        category: 'Services & Processes',
        question: 'Kill a process by name "firefox"',
        correctCommand: ['killall firefox', 'pkill firefox'],
        hint: 'Use killall or pkill with process name'
    },

    // Master Level - Advanced Scripting
    {
        id: 38,
        difficulty: 'Master',
        category: 'Advanced Scripting',
        question: 'Find all files larger than 100MB in current directory',
        correctCommand: ['find . -size +100M', 'find . -type f -size +100M'],
        hint: 'Use find with -size flag: +100M means greater than 100MB'
    },
    {
        id: 39,
        difficulty: 'Master',
        category: 'Advanced Scripting',
        question: 'Execute a command and suppress all error output',
        correctCommand: ['command 2>/dev/null', 'command 2>&1 >/dev/null'],
        hint: 'Use 2>/dev/null to redirect stderr to null device'
    },
    {
        id: 40,
        difficulty: 'Master',
        category: 'Advanced Scripting',
        question: 'Monitor log file in real-time as it is being written',
        correctCommand: ['tail -f /var/log/syslog', 'tail -F logfile.log'],
        hint: 'Use tail with -f flag to follow file in real-time'
    },
    {
        id: 41,
        difficulty: 'Master',
        category: 'Advanced Scripting',
        question: 'Extract specific columns from CSV file using awk',
        correctCommand: ['awk -F"," \'{print $1, $2}\' file.csv', "awk -F',' '{print $1, $2}' file.csv"],
        hint: 'Use awk with -F flag to set field separator'
    },
    {
        id: 42,
        difficulty: 'Master',
        category: 'Advanced Scripting',
        question: 'Find and replace all occurrences of "old" with "new" in a file',
        correctCommand: ['sed -i \'s/old/new/g\' filename', 'sed -i "s/old/new/g" filename'],
        hint: 'Use sed command: -i for in-place, s for substitute, g for global'
    },

    // Master Level - Docker
    {
        id: 43,
        difficulty: 'Master',
        category: 'Docker',
        question: 'Build a Docker image from current directory\'s Dockerfile',
        correctCommand: ['docker build -t myapp:latest .', 'docker build -t myapp .'],
        hint: 'Use docker build with -t flag for tag name'
    },
    {
        id: 44,
        difficulty: 'Master',
        category: 'Docker',
        question: 'Run a Docker container from image "nginx" with port mapping',
        correctCommand: ['docker run -p 8080:80 nginx', 'docker run --publish 8080:80 nginx'],
        hint: 'Use docker run with -p flag for port mapping (host:container)'
    },
    {
        id: 45,
        difficulty: 'Master',
        category: 'Docker',
        question: 'List all Docker containers including stopped ones',
        correctCommand: ['docker ps -a', 'docker ps --all'],
        hint: 'Use docker ps with -a flag to show all containers'
    },

    // Master Level - Git
    {
        id: 46,
        difficulty: 'Master',
        category: 'Git',
        question: 'Initialize a new Git repository',
        correctCommand: ['git init'],
        hint: 'Use git init to initialize a new repository'
    },
    {
        id: 47,
        difficulty: 'Master',
        category: 'Git',
        question: 'Clone a remote repository',
        correctCommand: ['git clone <repository-url>'],
        hint: 'Use git clone with the repository URL'
    },
    {
        id: 48,
        difficulty: 'Master',
        category: 'Git',
        question: 'Stage all changes for commit',
        correctCommand: ['git add .', 'git add -A'],
        hint: 'Use git add . or git add -A to stage all changes'
    },
    {
        id: 49,
        difficulty: 'Master',
        category: 'Git',
        question: 'Commit changes with message "Initial commit"',
        correctCommand: ['git commit -m "Initial commit"'],
        hint: 'Use git commit with -m flag for commit message'
    },
    {
        id: 50,
        difficulty: 'Master',
        category: 'Git',
        question: 'Push commits to remote repository',
        correctCommand: ['git push', 'git push origin main', 'git push origin master'],
        hint: 'Use git push to send commits to remote repository'
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = devopsCommands;
}
