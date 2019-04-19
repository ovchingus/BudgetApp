// Budget controller
const budgetController = (function () {

})();


// UI controller
const UIController = (function () {
    return {
        getinput: function () {
            return {
                type: document.querySelector(".add__type").value, //Will be inc or exp
                description: document.querySelector(".add__description").value,
                value: document.querySelector(".add__value").value
            }
        }
    }
})();


// Global app controller
const controller = (function (budgetCtrl, UICtrl) {

    const ctrlAddItem = function () {
        // 1. get the filled input data

        // 2. Add the item to the budget controller

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Displey the budget on the UI
    };

    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    })


})(budgetController, UIController);
