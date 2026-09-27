const fs = require('fs');
const path = require('path');

// Grab the .bt file path from the terminal arguments
const filePath = process.argv[2];

if (!filePath) {
    console.error("Usage: node runner.js <filename.bt>");
    process.exit(1);
}

// Read your custom .bt file line-by-line
try {
    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const lines = code.split(/\r?\n/);
    
    // This object acts as the "RAM/Memory" for your custom language variables
    const memory = {};

    console.log("--- RUNNING BUTTERS ENGINE ---");

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();

        // 1. Skip empty lines or your custom comment symbol
        if (!trimmedLine || trimmedLine.startsWith("//")) {
            return;
        }

        // -----------------------------------------------------------
        // WRITE YOUR CUSTOM LOGIC HERE!
        // -----------------------------------------------------------

        // Example Rule A: Custom Print Keyword (e.g., say "Hello World")
        if (trimmedLine.startsWith('say "') && trimmedLine.endsWith('"')) {
            const text = trimmedLine.substring(5, trimmedLine.length - 1);
            console.log(text);
            return;
        }

        // Example Rule B: Custom Variable Assignment (e.g., set points = 10)
        if (trimmedLine.startsWith('set ') && trimmedLine.includes('=')) {
            // Split line by spaces to parse variable name and value
            const parts = trimmedLine.replace('set ', '').split('=');
            const varName = parts[0].trim();
            const varValue = parseInt(parts[1].trim(), 10);
            
            memory[varName] = varValue;
            return;
        }

        // Example Rule C: Custom View Variable Keyword (e.g., view points)
        if (trimmedLine.startsWith('view ')) {
            const varName = trimmedLine.replace('view ', '').trim();
            if (varName in memory) {
                console.log(memory[varName]);
            } else {
                console.error(`Runtime Error (Line ${lineNumber}): Variable '${varName}' is not defined.`);
            }
            return;
        }

        // -----------------------------------------------------------
        // Catch-all syntax error handler
        // -----------------------------------------------------------
        console.error(`Syntax Error (Line ${lineNumber}): Unrecognized command -> "${trimmedLine}"`);
    });

    console.log("--- EXECUTION FINISHED ---");

} catch (err) {
    console.error(`Error opening file: ${err.message}`);
}
