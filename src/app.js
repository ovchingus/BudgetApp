// Budget controller
const budgetController = (function() {
    const Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = function(type) {
        let sum = 0;
        data.flow[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.total[type] = sum;
    };

    const data = {
        flow: {
            exp: [],
            inc: []
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des, val) {
            let newItem, ID;

            // [1 2 3 4 5], next ID = 6
            // [1 2 4 6 8], next ID = 9
            // ID = lastID + 1

            // Create new ID
            if (data.flow[type].length === 0) {
                ID = 0;
            } else {
                ID = data.flow[type][data.flow[type].length - 1].id + 1;
            }
            // Create new item based on 'inc' or 'exp' type
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            data.flow[type].push(newItem);

            // Return the new element
            return newItem;
        },

        deleteItem: function(type, id) {
            // if = 6
            // data.flow[type][id]
            //ids = [1 2 4 6 8]
            // index = 3

            const ids = data.flow[type].map(function(cur) {
                return cur.id;
            });

            const index = ids.indexOf(id);

            if (index !== -1) {
                data.flow[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal("inc");
            calculateTotal("exp");

            // calculate the budget: income - expenses
            data.budget = data.total.inc - data.total.exp;

            // calculate the percentage of income that we spent
            if (data.total.inc > 0) {
                data.percentage = Math.round(
                    (data.total.exp / data.total.inc) * 100
                );
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            };
        }
    };
})();

// UI controller
const UIController = (function() {
    const DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expensesContainer: ".expenses__list",
        budgetLabel: ".budget__value",
        expensesLabel: ".budget__expenses--value",
        incomeLabel: ".budget__income--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container"
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be inc or exp
                description: document.querySelector(DOMStrings.inputDescription)
                    .value,
                value: parseFloat(
                    document.querySelector(DOMStrings.inputValue).value
                )
            };
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;

            // 1. Create HTML string with placeholder text

            if (type === "exp") {
                element = DOMStrings.expensesContainer;
                html =
                    '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === "inc") {
                element = DOMStrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // 2. Replace the placeholder text with some actual data
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);
            console.log(newHtml);

            // 3. Insert the HTML into DOM
            document
                .querySelector(element)
                .insertAdjacentHTML("beforeend", newHtml);
        },

        clearFields: function() {
            const fields = document.querySelectorAll(
                DOMStrings.inputDescription + ", " + DOMStrings.inputValue
            );

            const fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current) {
                current.value = "";
            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent =
                obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent =
                obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent =
                obj.totalExp;
            document.querySelector(DOMStrings.percentageLabel).textContent =
                obj.percentage;

            if (obj.percentage > 0) {
                document.querySelector(
                    (DOMStrings.percentageLabel.textContent =
                        obj.percentage + "%")
                );
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent =
                    "---";
            }
        },

        getDOMStrings: function() {
            return DOMStrings;
        }
    };
})();

// Global app controller
const controller = (function(budgetCtrl, UICtrl) {
    const setupEventListeners = function() {
        const DOM = UICtrl.getDOMStrings();

        document
            .querySelector(DOM.inputBtn)
            .addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document
            .querySelector(DOM.container)
            .addEventListener("click", ctrlDeleteItem);
    };

    const ctrlAddItem = function() {
        // 1. get the filled input data
        const input = UICtrl.getInput();

        if (
            input.description !== "" &&
            !isNaN(input.value) &&
            input.value > 0
        ) {
            // 2. Add the item to the budget controller
            const newItem = budgetCtrl.addItem(
                input.type,
                input.description,
                input.value
            );

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update the budget on the UI
            updateBudget();
        }
    };

    const ctrlDeleteItem = function(event) {
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split("-");
            type = splitID[0];
            ID = splitID[1];
        }

        // 1. Delete the item from the data structure
        budgetCtrl.deleteItem(type, ID);

        // 2. Delete the item from the UI

        // 3. Update and show the new budget
    };

    const updateBudget = function() {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        const budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    return {
        init: function() {
            console.log("Application has started.");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();
