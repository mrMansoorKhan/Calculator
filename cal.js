        let currentOperand = '';
        let previousOperand = '';
        let operation = undefined;
        let calculationHistory = [];

        const currentOperandElement = document.getElementById('currentOperand');
        const previousOperandElement = document.getElementById('previousOperand');
        const historyElement = document.getElementById('history');

        function updateDisplay() {
            currentOperandElement.innerText = currentOperand;
            if (operation != null) {
                previousOperandElement.innerText = `${previousOperand} ${getOperationSymbol(operation)}`;
            } else {
                previousOperandElement.innerText = previousOperand;
            }
        }

        function getOperationSymbol(op) {
            switch(op) {
                case '+': return '+';
                case '-': return '-';
                case '*': return '×';
                case '/': return '÷';
                case '%': return '%';
                default: return '';
            }
        }

        function appendNumber(number) {
            if (number === '.' && currentOperand.includes('.')) return;
            if (currentOperand === '0' && number !== '.') currentOperand = '';
            currentOperand = currentOperand.toString() + number.toString();
            updateDisplay();
        }

        function appendOperation(op) {
            if (currentOperand === '') return;
            if (previousOperand !== '') {
                calculate();
            }
            operation = op;
            previousOperand = currentOperand;
            currentOperand = '';
            updateDisplay();
        }

        function calculate() {
            let computation;
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        computation = "Error";
                    } else {
                        computation = prev / current;
                    }
                    break;
                case '%':
                    computation = prev % current;
                    break;
                default:
                    return;
            }
            
            // Add to history
            const historyItem = `${previousOperand} ${getOperationSymbol(operation)} ${currentOperand} = ${computation}`;
            calculationHistory.unshift(historyItem);
            updateHistory();
            
            currentOperand = computation;
            operation = undefined;
            previousOperand = '';
            updateDisplay();
        }

        function clearAll() {
            currentOperand = '0';
            previousOperand = '';
            operation = undefined;
            updateDisplay();
        }

        function backspace() {
            currentOperand = currentOperand.toString().slice(0, -1);
            if (currentOperand === '') currentOperand = '0';
            updateDisplay();
        }

        function updateHistory() {
            historyElement.innerHTML = '';
            calculationHistory.forEach(item => {
                const historyItemElement = document.createElement('div');
                historyItemElement.classList.add('history-item');
                historyItemElement.textContent = item;
                historyElement.appendChild(historyItemElement);
            });
        }

        function toggleHistory() {
            const historyPanel = document.getElementById('historyPanel');
            if (historyPanel.style.display === 'block') {
                historyPanel.style.display = 'none';
            } else {
                historyPanel.style.display = 'block';
            }
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            if (/[0-9]/.test(event.key)) {
                appendNumber(event.key);
            } else if (event.key === '.') {
                appendNumber('.');
            } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                appendOperation(event.key);
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                calculate();
            } else if (event.key === 'Escape') {
                clearAll();
            } else if (event.key === 'Backspace') {
                backspace();
            } else if (event.key === '%') {
                appendOperation('%');
            }
        });

        updateDisplay();