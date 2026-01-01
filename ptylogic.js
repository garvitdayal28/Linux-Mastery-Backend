import * as pty from "node-pty";


export const spawnPty = (socket) =>{

    
const command = 'docker';
const args = [
  'run', '-it', '--rm',
  '--memory', '256m',       // Limit RAM to 256MB
  '--cpus', '.5',            // Limit to 50% of one CPU core
  '--pids-limit', '50',      // Prevent "Fork Bombs"
  // '--net', 'none',           // Disable internet inside the container (optional)
  'ubuntu', 'bash'
];
    
    
    
const ptyProcess = pty.spawn(command, args, {
  name: "xterm-color",
  cols: 120,
  rows: 40,
  // cwd: process.env.HOME, // Sets the starting directory
  // env: process.env,       // Passes PATH and other critical variables
});

// ptyProcess.write(data);

ptyProcess.onData((data) => {
    socket.emit("terminal-output", data);
});

socket.on("terminal-input", (data) => {
    ptyProcess.write(data);
  });

socket.on("disconnect", () => {
    ptyProcess.kill();
  });


}

