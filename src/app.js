// Budget controller
const budgetController = (function () {

})();


// UI controller
const UIController = (function () {

    const DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn"
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, //Will be inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },

        getDOMStrings: function () {
            return DOMStrings;
        }
    }
})();


// Global app controller
const controller = (function (budgetCtrl, UICtrl) {

    const setupEventListeners = function () {

        const DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
    };

    const ctrlAddItem = function () {
        // 1. get the filled input data
        const input = UICtrl.getInput();

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };

    return {
        init: function () {
            console.log("Application has started.");
            setupEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();
