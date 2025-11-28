const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories
const uploadsDir = path.join(__dirname, 'uploads');
const compilerDir = path.join(__dirname, 'compiler');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(compilerDir)) {
    fs.mkdirSync(compilerDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `source_${Date.now()}.eng`);
    }
});

const upload = multer({ storage });

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Parseon Compiler Backend is running' });
});

// Get language syntax documentation
app.get('/api/docs', (req, res) => {
    const docs = {
        title: "Parseon Language Documentation",
        sections: [
            {
                name: "Variables",
                keywords: ["set", "change", "keep"],
                examples: [
                    "set x = 10",
                    "set name = \"Alice\"",
                    "change x = 20"
                ]
            },
            {
                name: "Output",
                keywords: ["say", "show"],
                examples: [
                    "say \"Hello World\"",
                    "show x",
                    "show x + y"
                ]
            },
            {
                name: "Input",
                keywords: ["ask"],
                examples: [
                    "ask username",
                    "say \"Enter age:\"",
                    "ask age"
                ]
            },
            {
                name: "Conditionals",
                keywords: ["when", "check", "otherwise", "do", "end"],
                examples: [
                    "when x > 5 do\n    say \"Greater\"\nend",
                    "check x == 10 do\n    say \"Equal\"\notherwise\n    say \"Not equal\"\nend"
                ]
            },
            {
                name: "Loops",
                keywords: ["loop", "repeat", "to", "break", "continue"],
                examples: [
                    "loop i = 1 to 10 do\n    show i\nend",
                    "repeat (x < 100) do\n    x = x + 1\nend"
                ]
            }
        ]
    };
    res.json(docs);
});

// Get example programs
app.get('/api/examples', (req, res) => {
    const examples = [
        {
            id: 1,
            title: "Hello World",
            description: "Basic output example",
            code: `# Hello World Program
say "Hello, World!"
say "Welcome to Parseon!"

set name = "Developer"
say "Hello " + name`
        },
        {
            id: 2,
            title: "Variables & Math",
            description: "Working with numbers and arithmetic",
            code: `# Math Operations
set x = 10
set y = 20
set sum = x + y
set product = x * y

show sum
show product
show sqrt(144)
show pow(2, 8)`
        },
        {
            id: 3,
            title: "Conditionals",
            description: "If-else conditions",
            code: `# Conditional Example
set age = 25

when age >= 18 do
    say "You are an adult"
end

set score = 85

check score >= 90 do
    say "Grade: A"
otherwise
    say "Grade: B"
end`
        },
        {
            id: 4,
            title: "Loops",
            description: "For loop demonstration",
            code: `# Loop Example
set sum = 0

loop i = 1 to 10 do
    sum = sum + i
    show i
end

show sum
say "Loop complete!"`
        },
        {
            id: 5,
            title: "Factorial Calculator",
            description: "Calculate factorial using loops",
            code: `# Factorial Calculator
set n = 5
set factorial = 1

loop i = 1 to n do
    factorial = factorial * i
end

show factorial
say "Factorial calculated!"`
        },
        {
            id: 6,
            title: "Basic Arithmetic Demo",
            description: "Variables, math operations and functions",
            code: `# Basic Variables and Arithmetic
say "=== Basic Arithmetic Demo ==="
set x = 10
set y = 20
set sum = x + y

show x
show y
show sum

set product = x * y
set difference = y - x
set quotient = y / x

show product
show difference
show quotient

say "=== Math Functions Demo ==="
set num = 25
show sqrt(num)

set base = 2
set exponent = 8
show pow(base, exponent)

set negative = -15
show abs(negative)

set result = sqrt(16) + pow(2, 3) + abs(-5)
show result`
        },
        {
            id: 7,
            title: "Conditionals & Logic",
            description: "If-else, boolean variables and logical operators",
            code: `say "=== Conditionals Demo ==="
set x = 15
set y = 10
set flag = true

when x > y do
    say "x is greater than y"
    set diff = x - y
    show diff
end

check x < 20 and flag do
    say "x is less than 20 and flag is true"
otherwise
    say "Condition failed"
end

set isReady = true
when isReady do
    say "System is ready!"
end`
        },
        {
            id: 8,
            title: "Loop Demonstrations",
            description: "Counting loops, calculations and nested loops",
            code: `say "=== Loop Demo ==="
# Simple counting loop
loop i = 1 to 5 do
    say "Iteration:"
    show i
end

# Loop with calculations
set total = 0
loop num = 1 to 10 do
    total = total + num
end
say "Sum of 1 to 10:"
show total

# Nested loops
say "=== Multiplication Table ==="
loop i = 1 to 5 do
    loop j = 1 to 5 do
        set product = i * j
        show product
    end
end`
        },
        {
            id: 9,
            title: "String Operations",
            description: "String concatenation and manipulation",
            code: `say "=== String Demo ==="
set name = "Alice"
set greeting = "Hello "
set message = greeting + name

say message
show name

set firstName = "John"
set lastName = "Doe"
set fullName = firstName + " " + lastName
say fullName`
        },
        {
            id: 10,
            title: "Advanced Calculator",
            description: "Comprehensive math operations and functions",
            code: `say "=== Advanced Calculator ==="
set num1 = 25
set num2 = 5

say "Numbers:"
show num1
show num2

say "--- Basic Operations ---"
set add = num1 + num2
show add

set sub = num1 - num2
show sub

set mul = num1 * num2
show mul

set div = num1 / num2
show div

set mod = num1 % num2
show mod

say "--- Advanced Operations ---"
set sqrtResult = sqrt(num1)
show sqrtResult

set powerResult = pow(num2, 3)
show powerResult

set absResult = abs(-num1)
show absResult`
        },
        {
            id: 11,
            title: "Comprehensive Feature Demo",
            description: "Showcases all EnglishLang features together",
            code: `say "======================================"
say "   EnglishLang Feature Demo"
say "======================================"

# Variables
set x = 10
set y = 20
set name = "EnglishLang"

say "Variable Assignment:"
show x
show y
show name

# Arithmetic
set sum = x + y
set product = x * y
say "Arithmetic:"
show sum
show product

# Math functions
set sqrtVal = sqrt(100)
set powVal = pow(2, 5)
set absVal = abs(-42)

say "Math Functions:"
show sqrtVal
show powVal
show absVal

# Conditionals
say "Conditionals:"
when x < y do
    say "x is less than y"
    set diff = y - x
    show diff
end

check sum > 25 do
    say "Sum is greater than 25"
otherwise
    say "Sum is 25 or less"
end

# Loops
say "Loop Example:"
set factorial = 1
loop i = 1 to 5 do
    factorial = factorial * i
end
say "Factorial of 5:"
show factorial

# Logical operators
set a = true
set b = false
when a and not b do
    say "Logical condition true!"
end

# Modulo
set remainder = 17 % 5
say "17 mod 5:"
show remainder

say "======================================"
say "   Program Complete!"
say "======================================"`
        },
        {
            id: 12,
            title: "Temperature Converter",
            description: "Celsius to Fahrenheit conversion",
            code: `say "=== Temperature Converter ==="
set celsius = 25.0
say "Celsius:"
show celsius

# Convert to Fahrenheit
set fahrenheit = celsius * 1.8 + 32.0
say "Fahrenheit:"
show fahrenheit

# Convert back
set celsiusCheck = (fahrenheit - 32.0) / 1.8
say "Back to Celsius:"
show celsiusCheck

# Freezing and boiling points
set freezing = 0.0
set boiling = 100.0

set freezingF = freezing * 1.8 + 32.0
set boilingF = boiling * 1.8 + 32.0

say "Water freezes at (F):"
show freezingF
say "Water boils at (F):"
show boilingF`
        },
        {
            id: 13,
            title: "Quadratic Equation Solver",
            description: "Solves quadratic equations with real roots",
            code: `# Quadratic Equation Solver: ax² + bx + c = 0
say "=== Quadratic Equation Solver ==="

set a = 1
set b = -5
set c = 6

# Calculate discriminant
set discriminant = b * b - 4 * a * c

say "Discriminant:"
show discriminant

when discriminant >= 0 do
    set sqrtDisc = sqrt(discriminant)
    set x1 = (-b + sqrtDisc) / (2 * a)
    set x2 = (-b - sqrtDisc) / (2 * a)
    
    say "Root 1:"
    show x1
    say "Root 2:"
    show x2
otherwise
    say "No real roots (complex numbers)"
end`
        },
        {
            id: 14,
            title: "Binary Search",
            description: "Search algorithm for sorted arrays - O(log n)",
            code: `# Binary Search Algorithm
say "=== BINARY SEARCH ==="
set target = 42
set arr1 = 10
set arr2 = 20
set arr3 = 30
set arr4 = 42
set arr5 = 50
set arr6 = 60

set low = 1
set high = 6
set found = false
set position = 0

say "Searching for:"
show target
say "In array: [10, 20, 30, 42, 50, 60]"

repeat (low <= high and not found) do
    set mid = low + (high - low) / 2
    set mid = floor(mid)
    
    # Get mid value
    when mid == 1 do
        set midVal = arr1
    end
    when mid == 2 do
        set midVal = arr2
    end
    when mid == 3 do
        set midVal = arr3
    end
    when mid == 4 do
        set midVal = arr4
    end
    when mid == 5 do
        set midVal = arr5
    end
    when mid == 6 do
        set midVal = arr6
    end
    
    say "Checking position"
    show mid
    say "Value:"
    show midVal
    
    when midVal == target do
        set found = true
        set position = mid
        say "*** TARGET FOUND ***"
    otherwise when midVal < target do
        set low = mid + 1
        say "Search right half"
    otherwise
        set high = mid - 1
        say "Search left half"
    end
end

when found do
    say "Element found at index:"
    show position
otherwise
    say "Element not found"
end`
        },
        {
            id: 15,
            title: "Bubble Sort",
            description: "Simple sorting algorithm - O(n²)",
            code: `# Bubble Sort Algorithm
say "=== BUBBLE SORT ==="
set a = 64
set b = 34
set c = 25
set d = 12
set e = 22
set n = 5

say "Original array:"
show a
show b
show c
show d
show e

set i = 1
loop i = 1 to n-1 do
    say "--- Pass"
    show i
    say "---"
    
    set j = 1
    loop j = 1 to n-i do
        set first = 0
        set second = 0
        
        # Get adjacent elements
        when j == 1 do
            set first = a
            set second = b
        end
        when j == 2 do
            set first = b
            set second = c
        end
        when j == 3 do
            set first = c
            set second = d
        end
        when j == 4 do
            set first = d
            set second = e
        end
        
        say "Comparing"
        show first
        say "and"
        show second
        
        when first > second do
            say "Swapping elements"
            # Swap elements
            when j == 1 do
                set temp = a
                set a = b
                set b = temp
            end
            when j == 2 do
                set temp = b
                set b = c
                set c = temp
            end
            when j == 3 do
                set temp = c
                set c = d
                set d = temp
            end
            when j == 4 do
                set temp = d
                set d = e
                set e = temp
            end
        otherwise
            say "No swap needed"
        end
    end
    
    say "Array after pass"
    show i
    show a
    show b
    show c
    show d
    show e
end

say "=== FINAL SORTED ARRAY ==="
show a
show b
show c
show d
show e`
        },
        {
            id: 16,
            title: "Selection Sort",
            description: "Find min element and swap - O(n²)",
            code: `# Selection Sort Algorithm
say "=== SELECTION SORT ==="
set a = 64
set b = 25
set c = 12
set d = 22
set e = 11
set n = 5

say "Original array:"
show a
show b
show c
show d
show e

set i = 1
loop i = 1 to n-1 do
    say "--- Iteration"
    show i
    say "---"
    
    set minIndex = i
    set minVal = 0
    
    # Initialize min value
    when i == 1 do
        set minVal = a
    end
    when i == 2 do
        set minVal = b
    end
    when i == 3 do
        set minVal = c
    end
    when i == 4 do
        set minVal = d
    end
    
    set j = i + 1
    loop j = i + 1 to n do
        set currentVal = 0
        when j == 2 do
            set currentVal = b
        end
        when j == 3 do
            set currentVal = c
        end
        when j == 4 do
            set currentVal = d
        end
        when j == 5 do
            set currentVal = e
        end
        
        when currentVal < minVal do
            set minVal = currentVal
            set minIndex = j
            say "New minimum found:"
            show minVal
        end
    end
    
    say "Swapping element"
    show i
    say "with minimum at"
    show minIndex
    
    # Swap elements
    when i == 1 do
        set temp = a
        when minIndex == 2 do
            set a = b
            set b = temp
        end
        when minIndex == 3 do
            set a = c
            set c = temp
        end
        when minIndex == 4 do
            set a = d
            set d = temp
        end
        when minIndex == 5 do
            set a = e
            set e = temp
        end
    end
    
    say "Array after iteration:"
    show a
    show b
    show c
    show d
    show e
end

say "=== FINAL SORTED ARRAY ==="
show a
show b
show c
show d
show e`
        },
        {
            id: 17,
            title: "Insertion Sort",
            description: "Build sorted array one element at a time - O(n²)",
            code: `# Insertion Sort Algorithm
say "=== INSERTION SORT ==="
set a = 12
set b = 11
set c = 13
set d = 5
set e = 6
set n = 5

say "Original array:"
show a
show b
show c
show d
show e

set i = 2
loop i = 2 to n do
    say "--- Processing element at index"
    show i
    say "---"
    
    set key = 0
    when i == 2 do
        set key = b
    end
    when i == 3 do
        set key = c
    end
    when i == 4 do
        set key = d
    end
    when i == 5 do
        set key = e
    end
    
    say "Key value:"
    show key
    
    set j = i - 1
    set moving = true
    
    repeat (j >= 1 and moving) do
        set compareVal = 0
        when j == 1 do
            set compareVal = a
        end
        when j == 2 do
            set compareVal = b
        end
        when j == 3 do
            set compareVal = c
        end
        when j == 4 do
            set compareVal = d
        end
        
        when compareVal > key do
            say "Shifting element from position"
            show j
            say "to position"
            show j + 1
            
            # Shift element right
            when j == 1 do
                when j + 1 == 2 do
                    set b = a
                end
            end
            when j == 2 do
                when j + 1 == 3 do
                    set c = b
                end
            end
            when j == 3 do
                when j + 1 == 4 do
                    set d = c
                end
            end
            when j == 4 do
                when j + 1 == 5 do
                    set e = d
                end
            end
            
            set j = j - 1
        otherwise
            set moving = false
        end
    end
    
    # Insert key at correct position
    say "Inserting key at position"
    show j + 1
    when j + 1 == 1 do
        set a = key
    end
    when j + 1 == 2 do
        set b = key
    end
    when j + 1 == 3 do
        set c = key
    end
    when j + 1 == 4 do
        set d = key
    end
    when j + 1 == 5 do
        set e = key
    end
    
    say "Array after iteration:"
    show a
    show b
    show c
    show d
    show e
end

say "=== FINAL SORTED ARRAY ==="
show a
show b
show c
show d
show e`
        },
        {
            id: 18,
            title: "Palindrome Check",
            description: "Check if string reads same forwards and backwards",
            code: `# Palindrome Check
say "=== PALINDROME CHECK ==="
set str = "racecar"
set length = 7
set isPalindrome = true

say "Checking string:"
show str
say "Length:"
show length

set i = 1
loop i = 1 to length/2 do
    set leftChar = " "
    set rightChar = " "
    
    # Get characters from positions
    when i == 1 do
        set leftChar = "r"
        set rightChar = "r"
    end
    when i == 2 do
        set leftChar = "a"
        set rightChar = "a"
    end
    when i == 3 do
        set leftChar = "c"
        set rightChar = "e"
    end
    
    say "Comparing position"
    show i
    say "("
    show leftChar
    say ") with position"
    show length - i + 1
    say "("
    show rightChar
    say ")"
    
    when leftChar != rightChar do
        set isPalindrome = false
        say "Characters don't match!"
        break
    otherwise
        say "Characters match ✓"
    end
end

say "=== RESULT ==="
when isPalindrome do
    say "✓ 'racecar' IS a palindrome"
otherwise
    say "✗ 'racecar' is NOT a palindrome"
end`
        },
        {
            id: 19,
            title: "Niven Number Check",
            description: "Check if number is divisible by sum of its digits",
            code: `# Niven (Harshad) Number Check
say "=== NIVEN NUMBER CHECK ==="
set num = 18
set originalNum = num
set sumDigits = 0

say "Checking if"
show num
say "is a Niven number"

# Extract and sum digits
when num >= 10 do
    set digit1 = num / 10
    set digit1 = floor(digit1)
    set digit2 = num % 10
    set sumDigits = digit1 + digit2
    say "Digits:"
    show digit1
    say "and"
    show digit2
    say "Sum of digits:"
    show sumDigits
otherwise
    set sumDigits = num
    say "Single digit, sum is:"
    show sumDigits
end

say "Checking divisibility:"
show num
say "%"
show sumDigits
say "="
show num % sumDigits

when num % sumDigits == 0 do
    say "✓"
    show originalNum
    say "IS a Niven number"
otherwise
    say "✗"
    show originalNum
    say "is NOT a Niven number"
end`
        },
        {
            id: 20,
            title: "Fibonacci Sequence",
            description: "Generate Fibonacci sequence - O(n)",
            code: `# Fibonacci Sequence
say "=== FIBONACCI SEQUENCE ==="
set n = 10
say "First"
show n
say "Fibonacci numbers:"

set a = 0
set b = 1
set count = 0

say "Fibonacci"
show count
say ":"
show a

set count = 1
when n >= 1 do
    say "Fibonacci"
    show count
    say ":"
    show b
end

set i = 2
loop i = 2 to n do
    set c = a + b
    say "Fibonacci"
    show i
    say ":"
    show c
    set a = b
    set b = c
end

say "=== SEQUENCE COMPLETE ==="`
        },
        {
            id: 21,
            title: "Prime Number Check",
            description: "Check if number is prime - O(√n)",
            code: `# Prime Number Check
say "=== PRIME NUMBER CHECK ==="
set number = 17
set isPrime = true

say "Checking if"
show number
say "is prime"

when number <= 1 do
    set isPrime = false
    say "Numbers <= 1 are not prime"
end

set i = 2
set limit = sqrt(number)
set limit = floor(limit)

say "Checking divisors from 2 to"
show limit

loop i = 2 to limit do
    say "Checking divisor"
    show i
    set remainder = number % i
    show remainder
    
    when remainder == 0 do
        set isPrime = false
        say "Divisible by"
        show i
        say "- NOT PRIME"
        break
    otherwise
        say "Not divisible by"
        show i
    end
end

say "=== RESULT ==="
when isPrime do
    say "✓"
    show number
    say "IS prime"
otherwise
    say "✗"
    show number
    say "is NOT prime"
end`
        },
        {
            id: 22,
            title: "GCD using Euclidean Algorithm",
            description: "Find Greatest Common Divisor - O(log min(a,b))",
            code: `# GCD using Euclidean Algorithm
say "=== GREATEST COMMON DIVISOR ==="
set a = 48
set b = 18
set originalA = a
set originalB = b

say "Finding GCD of"
show a
say "and"
show b
say "using Euclidean Algorithm"

set step = 1
repeat (b != 0) do
    say "--- Step"
    show step
    say "---"
    say "a ="
    show a
    say "b ="
    show b
    
    set remainder = a % b
    say "Remainder:"
    show a
    say "%"
    show b
    say "="
    show remainder
    
    set a = b
    set b = remainder
    set step = step + 1
end

say "=== RESULT ==="
say "GCD("
show originalA
say ","
show originalB
say ") ="
show a`
        },
        {
            id: 23,
            title: "Array Maximum Element",
            description: "Find maximum element in array - O(n)",
            code: `# Maximum Element in Array
say "=== MAXIMUM ELEMENT ==="
set arr1 = 3
set arr2 = 7
set arr3 = 2
set arr4 = 9
set arr5 = 1

say "Array: [3, 7, 2, 9, 1]"
say "Finding maximum element..."

set maxVal = arr1
say "Initial max:"
show maxVal

when arr2 > maxVal do
    set maxVal = arr2
    say "New max found:"
    show arr2
end
when arr3 > maxVal do
    set maxVal = arr3
    say "New max found:"
    show arr3
end
when arr4 > maxVal do
    set maxVal = arr4
    say "New max found:"
    show arr4
end
when arr5 > maxVal do
    set maxVal = arr5
    say "New max found:"
    show arr5
end

say "=== RESULT ==="
say "Maximum value in array:"
show maxVal`
        },
        {
            id: 24,
            title: "Array Sum Calculator",
            description: "Calculate sum of array elements - O(n)",
            code: `# Sum of Array Elements
say "=== ARRAY SUM CALCULATOR ==="
set arr1 = 1
set arr2 = 2
set arr3 = 3
set arr4 = 4
set arr5 = 5

say "Array: [1, 2, 3, 4, 5]"
say "Calculating sum..."

set sum = 0
say "Initial sum:"
show sum

set sum = sum + arr1
say "After adding element 1:"
show sum

set sum = sum + arr2
say "After adding element 2:"
show sum

set sum = sum + arr3
say "After adding element 3:"
show sum

set sum = sum + arr4
say "After adding element 4:"
show sum

set sum = sum + arr5
say "After adding element 5:"
show sum

say "=== RESULT ==="
say "Total sum of array:"
show sum`
        }
    ];
    res.json(examples);
});

// Compile endpoint
app.post('/api/compile', async (req, res) => {
    const { code } = req.body;

    if (!code || code.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'No code provided'
        });
    }

    const timestamp = Date.now();
    const sourceFile = path.join(uploadsDir, `source_${timestamp}.eng`);
    const executableFile = path.join(uploadsDir, `program_${timestamp}`);

    try {
        // Write source code to file
        fs.writeFileSync(sourceFile, code);

        // Compile the code
        const compileCommand = `cd ${compilerDir} && bison -d englang.y && flex englang.l && gcc lex.yy.c englang.tab.c -o ${executableFile} -ll -lm`;

        exec(compileCommand, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                // Cleanup
                if (fs.existsSync(sourceFile)) fs.unlinkSync(sourceFile);
                
                return res.json({
                    success: false,
                    error: 'Compilation failed',
                    details: compileStderr || compileError.message
                });
            }

            // Execute the compiled program
            const executeCommand = `${executableFile} ${sourceFile}`;

            exec(executeCommand, { timeout: 5000 }, (execError, execStdout, execStderr) => {
                // Cleanup files
                if (fs.existsSync(sourceFile)) fs.unlinkSync(sourceFile);
                if (fs.existsSync(executableFile)) fs.unlinkSync(executableFile);
                
                // Clean up compiler artifacts
                const artifactsToClean = ['lex.yy.c', 'englang.tab.c', 'englang.tab.h'];
                artifactsToClean.forEach(artifact => {
                    const artifactPath = path.join(compilerDir, artifact);
                    if (fs.existsSync(artifactPath)) fs.unlinkSync(artifactPath);
                });

                if (execError) {
                    return res.json({
                        success: false,
                        error: 'Execution failed',
                        output: execStdout || '',
                        details: execStderr || execError.message
                    });
                }

                res.json({
                    success: true,
                    output: execStdout || 'Program executed successfully with no output'
                });
            });
        });

    } catch (error) {
        // Cleanup on error
        if (fs.existsSync(sourceFile)) fs.unlinkSync(sourceFile);
        if (fs.existsSync(executableFile)) fs.unlinkSync(executableFile);

        res.status(500).json({
            success: false,
            error: 'Server error',
            details: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║   PARSEON COMPILER BACKEND READY     ║
╚══════════════════════════════════════╝

🚀 Server running on http://localhost:${PORT}
📡 API Endpoints:
   - GET  /api/health
   - GET  /api/docs
   - GET  /api/examples
   - POST /api/compile
    `);
});
