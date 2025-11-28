/* englang.y - Parser and Interpreter for English-Like Language */

%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

extern int line_num;
extern FILE *yyin;
int yylex();
void yyerror(const char *s);

/* Symbol Table Entry */
typedef struct symbol {
    char name[100];
    double num_value;
    char str_value[1000];
    int is_string;
    int is_defined;
    struct symbol *next;
} Symbol;

Symbol *symbol_table = NULL;
int break_flag = 0;
int continue_flag = 0;

/* Function Table Entry */
typedef struct function {
    char name[100];
    char params[10][100];
    int param_count;
    int defined;
    struct function *next;
} Function;

Function *function_table = NULL;

/* Set numeric symbol */
void set_num_symbol(const char *name, double value) {
    Symbol *s = symbol_table;
    while (s != NULL) {
        if (strcmp(s->name, name) == 0) {
            s->num_value = value;
            s->is_string = 0;
            s->is_defined = 1;
            return;
        }
        s = s->next;
    }
    s = (Symbol*)malloc(sizeof(Symbol));
    strcpy(s->name, name);
    s->num_value = value;
    s->is_string = 0;
    s->is_defined = 1;
    s->next = symbol_table;
    symbol_table = s;
}

/* Set string symbol */
void set_str_symbol(const char *name, const char *value) {
    Symbol *s = symbol_table;
    while (s != NULL) {
        if (strcmp(s->name, name) == 0) {
            strcpy(s->str_value, value);
            s->is_string = 1;
            s->is_defined = 1;
            return;
        }
        s = s->next;
    }
    s = (Symbol*)malloc(sizeof(Symbol));
    strcpy(s->name, name);
    strcpy(s->str_value, value);
    s->is_string = 1;
    s->is_defined = 1;
    s->next = symbol_table;
    symbol_table = s;
}

/* Get numeric symbol */
double get_num_symbol(const char *name) {
    Symbol *s = symbol_table;
    while (s != NULL) {
        if (strcmp(s->name, name) == 0) {
            if (s->is_defined) {
                if (s->is_string) {
                    printf("ERROR: Variable '%s' is a string, not a number\n", name);
                    exit(1);
                }
                return s->num_value;
            } else {
                printf("ERROR: Variable '%s' used before assignment\n", name);
                exit(1);
            }
        }
        s = s->next;
    }
    printf("ERROR: Undefined variable '%s'\n", name);
    exit(1);
}

/* Get string symbol */
char* get_str_symbol(const char *name) {
    Symbol *s = symbol_table;
    while (s != NULL) {
        if (strcmp(s->name, name) == 0) {
            if (s->is_defined) {
                if (!s->is_string) {
                    printf("ERROR: Variable '%s' is a number, not a string\n", name);
                    exit(1);
                }
                return s->str_value;
            }
        }
        s = s->next;
    }
    return NULL;
}

/* Check if symbol exists */
int symbol_exists(const char *name) {
    Symbol *s = symbol_table;
    while (s != NULL) {
        if (strcmp(s->name, name) == 0 && s->is_defined) {
            return 1;
        }
        s = s->next;
    }
    return 0;
}

/* Print symbol table */
void print_symbol_table() {
    printf("\n╔══════════════════════════════════════╗\n");
    printf("            SYMBOL TABLE              \n");
    printf("╚══════════════════════════════════════╝\n");
    printf("%-20s %-15s %s\n", "Variable", "Type", "Value");
    printf("================================================\n");
    
    Symbol *s = symbol_table;
    while (s != NULL) {
        if (s->is_defined) {
            if (s->is_string) {
                printf("%-20s %-15s %s\n", s->name, "string", s->str_value);
            } else {
                printf("%-20s %-15s %.2f\n", s->name, "number", s->num_value);
            }
        }
        s = s->next;
    }
    printf("================================================\n");
}

/* String concatenation helper */
char* concat_strings(const char *s1, const char *s2) {
    static char result[2000];
    strcpy(result, s1);
    strcat(result, s2);
    return result;
}

/* Remove quotes from string */
char* remove_quotes(char *str) {
    static char result[1000];
    int len = strlen(str);
    if (len >= 2 && str[0] == '"' && str[len-1] == '"') {
        strncpy(result, str+1, len-2);
        result[len-2] = '\0';
        return result;
    }
    return str;
}

%}

%union {
    double num;
    char *str;
    struct {
        double num;
        char str[1000];
        int is_string;
    } value;
}

%token <str> IDENTIFIER STRING
%token <num> NUMBER TRUE FALSE
%token SET CHANGE KEEP SAY SHOW ASK
%token WHEN CHECK OTHERWISE DO END
%token REPEAT LOOP TO STEP BREAK CONTINUE
%token MAKE RETURN TYPE
%token PLUS MINUS MULTIPLY DIVIDE MODULO ASSIGN
%token EQ NE LT GT LE GE AND OR NOT
%token LPAREN RPAREN LBRACE RBRACE LBRACKET RBRACKET COMMA DOT
%token SQRT POW ABS LENGTH SUBSTRING

%type <num> expression logical_expr comparison_expr term factor
%type <str> string_expr
%type <num> statement assignment_statement print_statement
%type <num> conditional_statement loop_statement

%left OR
%left AND
%left EQ NE
%left LT GT LE GE
%left PLUS MINUS
%left MULTIPLY DIVIDE MODULO
%right NOT

%%

program:
    /* empty */
    | program statement { 
        if (break_flag || continue_flag) {
            break_flag = 0;
            continue_flag = 0;
        }
    }
    ;

statement:
    assignment_statement
    | print_statement
    | conditional_statement
    | loop_statement
    | input_statement
    | BREAK { 
        printf(">> BREAK statement\n"); 
        break_flag = 1;
        $$ = 0; 
    }
    | CONTINUE { 
        printf(">> CONTINUE statement\n"); 
        continue_flag = 1;
        $$ = 0; 
    }
    ;

/* Variable Assignment */
assignment_statement:
    SET IDENTIFIER ASSIGN expression {
        printf(">> SET %s = %.2f\n", $2, $4);
        set_num_symbol($2, $4);
        $$ = $4;
    }
    | SET IDENTIFIER ASSIGN string_expr {
        printf(">> SET %s = %s\n", $2, $4);
        set_str_symbol($2, $4);
        $$ = 0;
    }
    | SET IDENTIFIER ASSIGN TRUE {
        printf(">> SET %s = true\n", $2);
        set_num_symbol($2, 1.0);
        $$ = 1.0;
    }
    | SET IDENTIFIER ASSIGN FALSE {
        printf(">> SET %s = false\n", $2);
        set_num_symbol($2, 0.0);
        $$ = 0.0;
    }
    | CHANGE IDENTIFIER ASSIGN expression {
        printf(">> CHANGE %s = %.2f\n", $2, $4);
        set_num_symbol($2, $4);
        $$ = $4;
    }
    | IDENTIFIER ASSIGN expression {
        printf(">> %s = %.2f\n", $1, $3);
        set_num_symbol($1, $3);
        $$ = $3;
    }
    ;

/* Print Statements */
print_statement:
    SAY string_expr {
        printf(">> OUTPUT: %s\n", $2);
        $$ = 0;
    }
    | SHOW expression {
        printf(">> OUTPUT: %.2f\n", $2);
        $$ = $2;
    }
    | SHOW string_expr {
        printf(">> OUTPUT: %s\n", $2);
        $$ = 0;
    }
    | SHOW IDENTIFIER {
        if (symbol_exists($2)) {
            Symbol *s = symbol_table;
            while (s != NULL) {
                if (strcmp(s->name, $2) == 0 && s->is_defined) {
                    if (s->is_string) {
                        printf(">> OUTPUT: %s\n", s->str_value);
                    } else {
                        printf(">> OUTPUT: %.2f\n", s->num_value);
                    }
                    break;
                }
                s = s->next;
            }
        }
        $$ = 0;
    }
    ;

/* Input Statement */
input_statement:
    ASK IDENTIFIER {
        char input[1000];
        printf(">> INPUT for '%s': ", $2);
        if (fgets(input, sizeof(input), stdin)) {
            input[strcspn(input, "\n")] = 0;
            // Try to parse as number
            char *endptr;
            double num = strtod(input, &endptr);
            if (*endptr == '\0' && endptr != input) {
                set_num_symbol($2, num);
            } else {
                set_str_symbol($2, input);
            }
        }
    }
    ;

/* Conditional Statements */
conditional_statement:
    WHEN logical_expr DO program END {
        if ($2) {
            printf(">> WHEN condition TRUE\n");
        } else {
            printf(">> WHEN condition FALSE\n");
        }
        $$ = $2;
    }
    | WHEN logical_expr DO program OTHERWISE program END {
        if ($2) {
            printf(">> WHEN condition TRUE\n");
        } else {
            printf(">> OTHERWISE block executed\n");
        }
        $$ = $2;
    }
    | CHECK logical_expr DO program END {
        if ($2) {
            printf(">> CHECK condition TRUE\n");
        } else {
            printf(">> CHECK condition FALSE\n");
        }
        $$ = $2;
    }
    | CHECK logical_expr DO program OTHERWISE program END {
        if ($2) {
            printf(">> CHECK condition TRUE\n");
        } else {
            printf(">> OTHERWISE block executed\n");
        }
        $$ = $2;
    }
    ;

/* Loop Statements */
loop_statement:
    LOOP IDENTIFIER ASSIGN expression TO expression DO program END {
        printf(">> LOOP %s from %.0f to %.0f\n", $2, $4, $6);
        double start = $4;
        double end = $6;
        for (double i = start; i <= end; i++) {
            set_num_symbol($2, i);
            if (break_flag) {
                break_flag = 0;
                break;
            }
            if (continue_flag) {
                continue_flag = 0;
                continue;
            }
        }
        $$ = 0;
    }
    | REPEAT LPAREN logical_expr RPAREN DO program END {
        printf(">> REPEAT while condition is true\n");
        int iterations = 0;
        int max_iterations = 10000;
        while ($3 && iterations < max_iterations) {
            if (break_flag) {
                break_flag = 0;
                break;
            }
            if (continue_flag) {
                continue_flag = 0;
            }
            iterations++;
        }
        if (iterations >= max_iterations) {
            printf("WARNING: Loop exceeded maximum iterations\n");
        }
        $$ = 0;
    }
    ;

/* Logical Expressions */
logical_expr:
    comparison_expr { $$ = $1; }
    | logical_expr AND comparison_expr {
        $$ = ($1 && $3) ? 1.0 : 0.0;
        printf("   Evaluated: %.0f AND %.0f = %.0f\n", $1, $3, $$);
    }
    | logical_expr OR comparison_expr {
        $$ = ($1 || $3) ? 1.0 : 0.0;
        printf("   Evaluated: %.0f OR %.0f = %.0f\n", $1, $3, $$);
    }
    | NOT comparison_expr {
        $$ = !$2 ? 1.0 : 0.0;
        printf("   Evaluated: NOT %.0f = %.0f\n", $2, $$);
    }
    | TRUE { $$ = 1.0; }
    | FALSE { $$ = 0.0; }
    ;

/* Comparison Expressions */
comparison_expr:
    expression { $$ = $1; }
    | expression EQ expression {
        $$ = ($1 == $3) ? 1.0 : 0.0;
        printf("   Evaluated: %.2f == %.2f = %.0f\n", $1, $3, $$);
    }
    | expression NE expression {
        $$ = ($1 != $3) ? 1.0 : 0.0;
        printf("   Evaluated: %.2f != %.2f = %.0f\n", $1, $3, $$);
    }
    | expression LT expression {
        $$ = ($1 < $3) ? 1.0 : 0.0;
        printf("   Evaluated: %.2f < %.2f = %.0f\n", $1, $3, $$);
    }
    | expression GT expression {
        $$ = ($1 > $3) ? 1.0 : 0.0;
        printf("   Evaluated: %.2f > %.2f = %.0f\n", $1, $3, $$);
    }
    | expression LE expression {
        $$ = ($1 <= $3) ? 1.0 : 0.0;
        printf("   Evaluated: %.2f <= %.2f = %.0f\n", $1, $3, $$);
    }
    | expression GE expression {
        $$ = ($1 >= $3) ? 1.0 : 0.0;
        printf("   Evaluated: %.2f >= %.2f = %.0f\n", $1, $3, $$);
    }
    ;

/* Arithmetic Expressions */
expression:
    term { $$ = $1; }
    | expression PLUS term { 
        $$ = $1 + $3; 
        printf("   Evaluated: %.2f + %.2f = %.2f\n", $1, $3, $$);
    }
    | expression MINUS term { 
        $$ = $1 - $3; 
        printf("   Evaluated: %.2f - %.2f = %.2f\n", $1, $3, $$);
    }
    ;

term:
    factor { $$ = $1; }
    | term MULTIPLY factor { 
        $$ = $1 * $3; 
        printf("   Evaluated: %.2f * %.2f = %.2f\n", $1, $3, $$);
    }
    | term DIVIDE factor { 
        if ($3 == 0) {
            printf("ERROR: Division by zero\n");
            exit(1);
        }
        $$ = $1 / $3; 
        printf("   Evaluated: %.2f / %.2f = %.2f\n", $1, $3, $$);
    }
    | term MODULO factor {
        if ($3 == 0) {
            printf("ERROR: Modulo by zero\n");
            exit(1);
        }
        $$ = (int)$1 % (int)$3;
        printf("   Evaluated: %.0f %% %.0f = %.0f\n", $1, $3, $$);
    }
    ;

factor:
    NUMBER { $$ = $1; }
    | TRUE { $$ = 1.0; }
    | FALSE { $$ = 0.0; }
    | IDENTIFIER { 
        $$ = get_num_symbol($1); 
        printf("   Looked up: %s = %.2f\n", $1, $$);
    }
    | LPAREN expression RPAREN { $$ = $2; }
    | MINUS factor { $$ = -$2; }
    | SQRT LPAREN expression RPAREN {
        if ($3 < 0) {
            printf("ERROR: Cannot take square root of negative number\n");
            exit(1);
        }
        $$ = sqrt($3);
        printf("   Evaluated: sqrt(%.2f) = %.2f\n", $3, $$);
    }
    | POW LPAREN expression COMMA expression RPAREN {
        $$ = pow($3, $5);
        printf("   Evaluated: pow(%.2f, %.2f) = %.2f\n", $3, $5, $$);
    }
    | ABS LPAREN expression RPAREN {
        $$ = fabs($3);
        printf("   Evaluated: abs(%.2f) = %.2f\n", $3, $$);
    }
    ;

/* String Expressions */
string_expr:
    STRING { 
        $$ = remove_quotes($1); 
    }
    | string_expr PLUS STRING {
        $$ = concat_strings($1, remove_quotes($3));
    }
    | string_expr PLUS IDENTIFIER {
        char *str_val = get_str_symbol($3);
        if (str_val) {
            $$ = concat_strings($1, str_val);
        } else {
            printf("ERROR: Cannot concatenate with undefined variable\n");
            exit(1);
        }
    }
    | STRING PLUS IDENTIFIER {
        char *str_val = get_str_symbol($3);
        if (str_val) {
            $$ = concat_strings(remove_quotes($1), str_val);
        }
    }
    ;

%%

void yyerror(const char *s) {
    fprintf(stderr, "SYNTAX ERROR at line %d: %s\n", line_num, s);
}

int main(int argc, char *argv[]) {
    printf("\n");
    printf("╔═══════════════════╗\n");
    printf("   PARSEON COMPILER.   \n");
    printf("╚═══════════════════╝\n");
    printf("\n");

    if (argc < 2) {
        printf("Usage: %s <source_file.eng>\n", argv[0]);
        printf("\nTry: %s example.eng\n", argv[0]);
        return 1;
    }

    FILE *fp = fopen(argv[1], "r");
    if (!fp) {
        printf("ERROR: Cannot open file '%s'\n", argv[1]);
        return 1;
    }

    yyin = fp;
    
    printf("========== LEXICAL ANALYSIS & EXECUTION ==========\n\n");
    
    int result = yyparse();
    
    fclose(fp);
    
    if (result == 0) {
        printf("\n✓ Program executed successfully!\n");
        print_symbol_table();
    } else {
        printf("\n✗ Program execution failed.\n");
    }
    
    return result;
}
