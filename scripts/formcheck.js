let formChecker = (function(){

    function numbersOnly(testStr){
        let numCheck = /^[0-9]+$/
        if(numCheck.test(testStr)){
            return true;
        }
        return false;
    }

    function charsOnlyTest(testStr){
        let nameCheck = /^[a-zA-z]+$/;
        if(nameCheck.test(testStr)){
            return true;
        }
        return false;
    }

    function postalCodeTest(testStr){
        let postalCheck = /^[a-zA-Z]{1}[0-9]{1}[a-zA-Z]{1}[ ]?[0-9]{1}[a-zA-Z]{1}[0-9]{1}$/
        if(postalCheck.test(testStr)){
            return true;
        }
        return false;
    }

    function emailTest(testStr){ //added (common) valid email test, minimum of "name@domain"
        console.log(`Checking email: ${testStr}`);
        let emailCheck = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@{1}[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*$/
        if(emailCheck.test(testStr) && testStr.length<=256){
            return true;
        }
        return false;
    }

    function hasValue(testStr){
        if(testStr!=null && testStr.length>=1){
            return true;
        }
        return false;
    }

    function checkEmpty(testStr){ //check if Feedback is empty.
        if(testStr!=""){
            return true;
        }
        return false;
    }

    function radioCheckedValue(checkAge){ //returns radio value or null
        console.log(`radio value: ${event.target.querySelector(`input[name=${checkAge}]:checked`)}`);
        if(event.target.querySelector(`input[name=${checkAge}]:checked`) != null){
            return event.target.querySelector(`input[name=${checkAge}]:checked`);
        }
            return null;
    }

    function radioChecked(checkAge){ //if radio value is != null (exists) then an age is selected
        if(checkAge != null){
            return true;
        }
            return false;
    }

    function errorsCheck(valuesList){
        let errors=[];
            valuesList.forEach((item) => {
                if((item.func)(item.val)==false){
                    errors.push(`<p>${item.errMsg}</p>`);
                }
            });
        return errors;
    }

    function canSubmit(errorsList){
        showErrors(errorsList);
        if(errorsList.length>0){
            errors.style.display="block";
            return false;
        }
        errors.style.display="none";
        return true;
    }

    function showErrors(errorsList){
      //console.log(`Error list (showErrors): ${errorsList}`);
      let errorDisplay = event.target.querySelector("#errors");
      errorDisplay.innerHTML=errorsList.join('');
    }

    function secretCheck(testStr){ //checks for secret message in 'Feedback'
        let messageCheck = /^.*[Tt]?his is a secret to everyone!.*$/
        let audio = new Audio("sounds/ZSS_Fanfare_Item.mp3");
        if(messageCheck.test(testStr)){
            console.log("Secret found.");
            audio.currentTime = 0; /* reset .mp3 playback */
            audio.play();
            return true;
        }
        console.log("Secret not found.");
        return false;
    }

    function checkForm(event){
        event.preventDefault();
        //
        let submitValues = {};
        submitValues.first_name = event.target.querySelector("#firstname").value;
        submitValues.last_name = event.target.querySelector("#lastname").value;
        submitValues.email = event.target.querySelector("#email").value;
        submitValues.age = radioCheckedValue('age');
        submitValues.street_address = event.target.querySelector("#street_address").value;
        submitValues.city = event.target.querySelector("#city").value;
        submitValues.postal_code = event.target.querySelector("#postalcode").value;
        submitValues.province = event.target.querySelector("select[name=province]").value;
        submitValues.feedback  = event.target.querySelector("#feedback").value;
        // https://www.debuggex.com/cheatsheet/regex/javascript

        let errorsList = errorsCheck(
            [
                {val:submitValues.first_name, func:charsOnlyTest, errMsg:"* Please enter your first name."},
                {val:submitValues.last_name, func:charsOnlyTest, errMsg:"* Please enter your last name."},
                {val:submitValues.email, func:emailTest, errMsg:"* Please enter your email."},
                {val:submitValues.age, func:radioChecked,errMsg:"* Please select an age range."},
                {val:submitValues.street_address, func:hasValue, errMsg:"* Please enter a street address."},
                {val:submitValues.city, func:charsOnlyTest, errMsg:"* Please enter a city."},
                {val:submitValues.province, func:charsOnlyTest, errMsg:"* Please select a province."},
                {val:submitValues.postal_code, func:postalCodeTest, errMsg:"* Please enter a postal code."},
                {val:submitValues.feedback, func:checkEmpty, errMsg:"* Please enter feedback."}
            ]);

        if(canSubmit(errorsList)){
            console.log("I am ready for submit.");
            //console.table(submitValues);
            if(secretCheck(event.target.querySelector("#feedback").value)){
              //secret found
              success.style.display = "none";
              secretCode.style.display = "block";
            } else {
              //secret not found
              success.style.display = "block";
              secretCode.style.display = "none";
            }
            event.target.reset();
        } else {
            //errors found
            success.style.display = "none";
            secretCode.style.display = "none";
        }
    }
    return {
        initForm: function(userForm){
            userForm.addEventListener("submit", checkForm);
        }
    }
})();
