# Parseon Compiler

A full-stack online compiler implementing the PARSEON programming language - a custom English-like language built with Lex/Yacc compiler tools.

## Overview

Parseon Compiler provides a web-based integrated development environment for the PARSEON programming language, featuring real-time code compilation and execution with a modern cyberpunk-inspired interface.

## Technical Architecture

### Backend
- **Node.js** + **Express.js** - REST API server
- **Lex/Yacc** - Compiler construction (C-based)
- **File System** - Temporary file management for compilation

### Frontend
- **Single-page Application** - HTML5, CSS3, JavaScript
- **Real-time Interface** - Code editor with live output
- **Responsive Design** - Mobile-optimized layout

## Installation

### Prerequisites
- Node.js 14+
- Flex 2.6+
- Bison 3.0+
- GCC compiler

### Setup
```bash
# Clone repository
git clone https://github.com/JhanaviR082/Parseon-Compiler.git
cd Parseon-Compiler

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
python3 -m http.server 8080
Access application at: http://localhost:8080
```
## PARSEON Language Specification
### Core Features
-English-like syntax with natural keywords
-Structured programming constructs
-Standard arithmetic and mathematical operations
-String manipulation capabilities
-Conditional and iterative control flow

### Language Syntax
#### Variable Declaration
```bash
parseon
set identifier = expression
change identifier = new_value
Input/Output Operations
parseon
say "message"          # Output string
show expression        # Output expression result
ask variable          # User input
Control Structures
parseon
# Conditional execution
when condition do
    statements
end

check condition do
    statements
otherwise
    statements
end

# Iteration
loop variable = start to end do
    statements
end

repeat (condition) do
    statements
end
Operators
Arithmetic: +, -, *, /, %

Comparison: ==, !=, <, >, <=, >=

Logical: and, or, not

Built-in Functions
parseon
sqrt(number)     # Square root
pow(base, exp)   # Exponentiation
abs(number)      # Absolute value
API Endpoints
GET /api/health - Service status

GET /api/docs - Language documentation

GET /api/examples - Code examples collection

POST /api/compile - Code compilation and execution
``` 
### Project Structure
```bash
Parseon-Compiler/
├── backend/
│   ├── server.js           # Express server
│   ├── compiler/
│   │   ├── englang.l       # Lex specification
│   │   └── englang.y       # Yacc grammar
│   └── package.json
├── frontend/
│   └── index.html          # Web interface
└── README.md
```
### Compilation Process
```bash
cd backend/compiler
bison -d englang.y
flex englang.l
gcc lex.yy.c englang.tab.c -o englang -ll -lm
./englang source_file.eng
```
### Usage Example
parseon
```bash
# Calculate factorial
set n = 5
set factorial = 1
set i = 1

loop i = 1 to n do
    factorial = factorial * i
end

say "Factorial of"
show n
say "is:"
show factorial
```
#### Development
The compiler implements standard compiler phases:
Lexical Analysis - Token recognition
Syntax Analysis - Grammar parsing
Semantic Analysis - Symbol table management
Execution - Direct interpretation

