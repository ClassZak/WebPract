class ExpressionNode {
	constructor(type, value = null, left = null, right = null) {
		this.type = type; // 'number', 'operator', 'bracket'
		this.value = value;
		this.left = left;
		this.right = right;
	}
}

class Expression {
	constructor(text) {
		this.tokens = Expression.getTokens(text);
		this.ast = this._buildAST(this.tokens);
	}
	static getTokens(text){
		return text.match(/(\d+|\+|\-|\*|\/|\(|\))/g);
	}

	evaluate() {
		return this._evaluateNode(this.ast);
	}

	_buildAST(tokens) {
		if (tokens.length === 0) return null;

		// Обрабатываем выражения в скобках
		let bracketGroups = this._groupBrackets(tokens);
		if (bracketGroups.length === 1 && bracketGroups[0].isBracket) {
			return this._buildAST(bracketGroups[0].tokens);
		}

		// Ищем операторы с наименьшим приоритетом (для правильной ассоциативности)
		const operators = ['+', '-', '*', '/'];
		
		for (let op of operators) {
			for (let i = bracketGroups.length - 1; i >= 0; i--) {
				if (!bracketGroups[i].isBracket && bracketGroups[i].token === op) {
					const leftTokens = bracketGroups.slice(0, i).flatMap(g => 
						g.isBracket ? ['(', ...g.tokens, ')'] : [g.token]
					);
					const rightTokens = bracketGroups.slice(i + 1).flatMap(g => 
						g.isBracket ? ['(', ...g.tokens, ')'] : [g.token]
					);
					
					return new ExpressionNode(
						'operator',
						op,
						this._buildAST(leftTokens),
						this._buildAST(rightTokens)
					);
				}
			}
		}

		// Если операторов нет, обрабатываем как число или скобочное выражение
		if (bracketGroups.length === 1) {
			if (bracketGroups[0].isBracket) {
				return this._buildAST(bracketGroups[0].tokens);
			} else {
				return new ExpressionNode('number', parseFloat(bracketGroups[0].token));
			}
		}

		throw new Error("Invalid expression");
	}

	_groupBrackets(tokens) {
		const groups = [];
		let i = 0;

		while (i < tokens.length) {
			if (tokens[i] === '(') {
				const bracketContent = this._extractBracketContent(tokens, i);
				groups.push({
				isBracket: true,
				tokens: bracketContent
				});
				i += bracketContent.length + 2; // +2 для открывающей и закрывающей скобок
			} else {
				groups.push({
					isBracket: false,
					token: tokens[i]
				});
				i++;
			}
		}

		return groups;
	}

	_extractBracketContent(tokens, startIndex) {
		let bracketCount = 1;
		const content = [];
		
		for (let i = startIndex + 1; i < tokens.length; i++) {
			if (tokens[i] === '(') bracketCount++;
			else if (tokens[i] === ')') bracketCount--;
			
			if (bracketCount === 0) break;
			content.push(tokens[i]);
		}
		
		return content;
	}

	_evaluateNode(node) {
		if (!node) return 0;

		switch (node.type) {
		case 'number':
			return node.value;
		
		case 'operator':
			const leftVal = this._evaluateNode(node.left);
			const rightVal = this._evaluateNode(node.right);
			
			switch (node.value) {
			case '+': return leftVal + rightVal;
			case '-': return leftVal - rightVal;
			case '*': return leftVal * rightVal;
			case '/': 
				if (rightVal === 0) throw new Error("Division by zero");
				return leftVal / rightVal;
			default:
				throw new Error(`Unknown operator: ${node.value}`);
			}
		
		default:
			throw new Error(`Unknown node type: ${node.type}`);
		}
	}

	// Вспомогательный метод для визуализации дерева
	toString() {
		return this._nodeToString(this.ast);
	}

	_nodeToString(node, level = 0) {
		if (!node) return '';
		
		const indent = '  '.repeat(level);
		
		if (node.type === 'number') {
		return `${indent}Number(${node.value})`;
		}
		
		if (node.type === 'operator') {
		return `${indent}Operator(${node.value})\n` +
				`${this._nodeToString(node.left, level + 1)}\n` +
				`${this._nodeToString(node.right, level + 1)}`;
		}
		
		return `${indent}Unknown`;
	}
}