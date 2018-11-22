$.fn.check = function passwordChecker(id, formId)  {
  let strength = {
    0: "Bad",
    1: "Average",
    2: "Strong",
    3: "Secure"
  };
  let result;
  let password = document.getElementById(id);
  let text = document.getElementById('password-strength-text');

  let num = {};
  let bonus = {};
  bonus.Excess = 3;
  bonus.Upper = 4;
  bonus.Numbers = 5;
  bonus.Symbols = 5;
  bonus.Combo = 0;
  bonus.FlatLower = 0;
  bonus.FlatNumber = 0;
  let minPasswordLength = 6;
  let baseScore = 0,
    score = 0;
  password && password.addEventListener('input', function() {
    let val = password.value;
    let charPassword = val.split("");
    num.Excess = 0;
    num.Upper = 0;
    num.Numbers = 0;
    num.Symbols = 0;
    baseScore = 0;
    score = 0;


    if (charPassword.length >= minPasswordLength) {
      baseScore = 50;
      analyzeString();
      calcComplexity();
    } else { baseScore = 0;}

    function analyzeString () {
      for (let i=0; i < charPassword.length;i++) {
        if (charPassword[i].match(/[A-Z]/g)) {num.Upper++;}
        if (charPassword[i].match(/[0-9]/g)) {num.Numbers++;}
        if (charPassword[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)) {num.Symbols++;}
      }

      num.Excess = charPassword.length - minPasswordLength;

      if (num.Upper && num.Numbers && num.Symbols) {
        bonus.Combo = 25;
      }

      else if ((num.Upper && num.Numbers) || (num.Upper && num.Symbols) || (num.Numbers && num.Symbols)) {
        bonus.Combo = 15;
      }

      if (val.match(/^[\sa-z]+$/)) {
        bonus.FlatLower = -15;
      }

      if (val.match(/^[\s0-9]+$/)) {
        bonus.FlatNumber = -35;
      }
    }

    function calcComplexity() {
      score = baseScore +
        (num.Excess*bonus.Excess) +
        (num.Upper*bonus.Upper) +
        (num.Numbers*bonus.Numbers) +
        (num.Symbols*bonus.Symbols) +
        bonus.Combo +
        bonus.FlatLower +
        bonus.FlatNumber;
    }
    switch (true) {
      case (score<50):
        result = 0;
        break;
      case (score>=50 && score<75):
        result = 1;
        break;
      case (score>=75 && score<100):
        result = 2;
        break;
      case (score>=100):
        result = 3;
        break;
      default:
        result = 0;
    }
    let form = document.getElementById(formId);
    // Update the text indicator
    if(val !== "") {
      text.innerHTML = `<span class=${strength[result].toLowerCase()}>${strength[result]}! 
                ${(val.length < 6)? 'At least 6 characters please!' : ''}</span>`;
      if(result < 2 && !form.classList.contains('no-submit')) {
        form.className += " no-submit";
      } else if (result >= 2){
        form.classList.remove("no-submit")
      }
    }
    else {
      text.innerHTML = "";
    }
  });
};