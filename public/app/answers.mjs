export const MAX_EXPRESSION_LENGTH = 160;

export function isExpression(task) {
  return Array.isArray(task.answers);
}

function expressionTokens(value) {
  return value.match(/[A-Za-z_][A-Za-z_0-9]*|[0-9]+|<=|>=|==|!=|[^ \t]/g) ?? [];
}

// Parentheses around the whole expression do not change the expected answer.
function stripOuterParentheses(tokens) {
  while (tokens[0] === '(' && tokens.at(-1) === ')') {
    let depth = 0;
    const end = tokens.findIndex(token => {
      if (token === '(') depth++;
      if (token === ')') depth--;
      return depth === 0;
    });
    if (end !== tokens.length - 1) break;
    tokens = tokens.slice(1, -1);
  }
  return tokens;
}

export function gradeAnswer(task, value) {
  if (!isExpression(task)) {
    if (!Number.isInteger(value) || value < 0 || value >= task.choices.length) return null;
    return value === task.answer;
  }

  if (typeof value !== 'string' || !value.trim() || value.length > MAX_EXPRESSION_LENGTH || /[\r\n]/.test(value)) return null;
  const tokens = stripOuterParentheses(expressionTokens(value)).join(' ');
  return task.answers.some(answer => stripOuterParentheses(expressionTokens(answer)).join(' ') === tokens);
}

export function workedAnswer(task) {
  return isExpression(task) ? task.answers[0] : task.choices[task.answer];
}
