/* englang.l - Lexical Analyzer for English-Like Language */

%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "englang.tab.h"


int line_num = 1;
%}

%option noyywrap

%%

    /* Keywords - Variables */
"set"           { printf("TOKEN: KEYWORD 'set' at line %d\n", line_num); return SET; }
"change"        { printf("TOKEN: KEYWORD 'change' at line %d\n", line_num); return CHANGE; }
"keep"          { printf("TOKEN: KEYWORD 'keep' at line %d\n", line_num); return KEEP; }

    /* Keywords - Output */
"say"           { printf("TOKEN: KEYWORD 'say' at line %d\n", line_num); return SAY; }
"show"          { printf("TOKEN: KEYWORD 'show' at line %d\n", line_num); return SHOW; }

    /* Keywords - Input */
"ask"           { printf("TOKEN: KEYWORD 'ask' at line %d\n", line_num); return ASK; }

    /* Keywords - Conditionals */
"when"          { printf("TOKEN: KEYWORD 'when' at line %d\n", line_num); return WHEN; }
"check"         { printf("TOKEN: KEYWORD 'check' at line %d\n", line_num); return CHECK; }
"otherwise"     { printf("TOKEN: KEYWORD 'otherwise' at line %d\n", line_num); return OTHERWISE; }
"do"            { printf("TOKEN: KEYWORD 'do' at line %d\n", line_num); return DO; }
"end"           { printf("TOKEN: KEYWORD 'end' at line %d\n", line_num); return END; }

    /* Keywords - Loops */
"repeat"        { printf("TOKEN: KEYWORD 'repeat' at line %d\n", line_num); return REPEAT; }
"loop"          { printf("TOKEN: KEYWORD 'loop' at line %d\n", line_num); return LOOP; }
"to"            { printf("TOKEN: KEYWORD 'to' at line %d\n", line_num); return TO; }
"step"          { printf("TOKEN: KEYWORD 'step' at line %d\n", line_num); return STEP; }
"break"         { printf("TOKEN: KEYWORD 'break' at line %d\n", line_num); return BREAK; }
"continue"      { printf("TOKEN: KEYWORD 'continue' at line %d\n", line_num); return CONTINUE; }

    /* Keywords - Functions */
"make"          { printf("TOKEN: KEYWORD 'make' at line %d\n", line_num); return MAKE; }
"return"        { printf("TOKEN: KEYWORD 'return' at line %d\n", line_num); return RETURN; }

    /* Keywords - Classes */
"type"          { printf("TOKEN: KEYWORD 'type' at line %d\n", line_num); return TYPE; }

    /* Keywords - Boolean */
"true"          { printf("TOKEN: BOOLEAN 'true' at line %d\n", line_num); 
                  yylval.num = 1.0; return TRUE; }
"false"         { printf("TOKEN: BOOLEAN 'false' at line %d\n", line_num); 
                  yylval.num = 0.0; return FALSE; }

    /* Keywords - Logical Operators */
"and"           { printf("TOKEN: OPERATOR 'and' at line %d\n", line_num); return AND; }
"or"            { printf("TOKEN: OPERATOR 'or' at line %d\n", line_num); return OR; }
"not"           { printf("TOKEN: OPERATOR 'not' at line %d\n", line_num); return NOT; }

    /* Built-in Functions */
"sqrt"          { printf("TOKEN: FUNCTION 'sqrt' at line %d\n", line_num); return SQRT; }
"pow"           { printf("TOKEN: FUNCTION 'pow' at line %d\n", line_num); return POW; }
"abs"           { printf("TOKEN: FUNCTION 'abs' at line %d\n", line_num); return ABS; }
"length"        { printf("TOKEN: FUNCTION 'length' at line %d\n", line_num); return LENGTH; }
"substring"     { printf("TOKEN: FUNCTION 'substring' at line %d\n", line_num); return SUBSTRING; }

    /* Identifiers */
[a-zA-Z_][a-zA-Z0-9_]*  { 
                            printf("TOKEN: IDENTIFIER '%s' at line %d\n", yytext, line_num);
                            yylval.str = strdup(yytext); 
                            return IDENTIFIER; 
                        }

    /* Numbers */
[0-9]+          { 
                    printf("TOKEN: NUMBER '%s' at line %d\n", yytext, line_num);
                    yylval.num = atof(yytext); 
                    return NUMBER; 
                }

[0-9]+\.[0-9]+  { 
                    printf("TOKEN: FLOAT '%s' at line %d\n", yytext, line_num);
                    yylval.num = atof(yytext); 
                    return NUMBER; 
                }

    /* String literals */
\"([^\\\"]|\\.)*\"  {
                        printf("TOKEN: STRING %s at line %d\n", yytext, line_num);
                        yylval.str = strdup(yytext);
                        return STRING;
                    }

    /* Operators */
"+"             { printf("TOKEN: OPERATOR '+' at line %d\n", line_num); return PLUS; }
"-"             { printf("TOKEN: OPERATOR '-' at line %d\n", line_num); return MINUS; }
"*"             { printf("TOKEN: OPERATOR '*' at line %d\n", line_num); return MULTIPLY; }
"/"             { printf("TOKEN: OPERATOR '/' at line %d\n", line_num); return DIVIDE; }
"%"             { printf("TOKEN: OPERATOR '%%' at line %d\n", line_num); return MODULO; }
"="             { printf("TOKEN: OPERATOR '=' at line %d\n", line_num); return ASSIGN; }
"=="            { printf("TOKEN: OPERATOR '==' at line %d\n", line_num); return EQ; }
"!="            { printf("TOKEN: OPERATOR '!=' at line %d\n", line_num); return NE; }
"<"             { printf("TOKEN: OPERATOR '<' at line %d\n", line_num); return LT; }
">"             { printf("TOKEN: OPERATOR '>' at line %d\n", line_num); return GT; }
"<="            { printf("TOKEN: OPERATOR '<=' at line %d\n", line_num); return LE; }
">="            { printf("TOKEN: OPERATOR '>=' at line %d\n", line_num); return GE; }

    /* Delimiters */
"("             { printf("TOKEN: LPAREN at line %d\n", line_num); return LPAREN; }
")"             { printf("TOKEN: RPAREN at line %d\n", line_num); return RPAREN; }
"{"             { printf("TOKEN: LBRACE at line %d\n", line_num); return LBRACE; }
"}"             { printf("TOKEN: RBRACE at line %d\n", line_num); return RBRACE; }
"["             { printf("TOKEN: LBRACKET at line %d\n", line_num); return LBRACKET; }
"]"             { printf("TOKEN: RBRACKET at line %d\n", line_num); return RBRACKET; }
","             { printf("TOKEN: COMMA at line %d\n", line_num); return COMMA; }
"."             { printf("TOKEN: DOT at line %d\n", line_num); return DOT; }

    /* Comments */
"#".*           { /* Single-line comment - ignore */ }
"/*"([^*]|\*+[^*/])*\*+"/"  { 
                    /* Multi-line comment - count newlines */ 
                    char *p = yytext;
                    while (*p) {
                        if (*p == '\n') line_num++;
                        p++;
                    }
                }

    /* Whitespace */
[ \t]+          { /* Ignore whitespace */ }
\n              { line_num++; }

    /* Unrecognized */
.               { 
                    printf("ERROR: Unrecognized character '%s' at line %d\n", yytext, line_num); 
                }

%%
