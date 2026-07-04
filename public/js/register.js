const name = document.getElementById("name")
const registerPhone = document.getElementById("register-phone")
const registerPassword = document.getElementById("register-password")
const registerEmail = document.getElementById("register-email")
const passwordVerify = document.getElementById("passwordVerify")
const registerBtn = document.querySelector(".register-btn")
const logout = document.querySelector(".logout")
const codeBtn = document.querySelector(".code-btn")
const registerCode = document.getElementById("register-code")
const emailForm = document.getElementById("email-form")
const passcode = document.querySelector(".passcode")
const code = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

emailForm.addEventListener("submit", function(event) {
    event.preventDefault()

    let code = ""

    for(i=0; i<6; i++) {
        const digit = Math.floor(Math.random() * code.length)
        code += digit.toString()
    }

    console.log(code)

    passcode.value = code

    emailjs.sendForm('service_s9lo74t', 'template_aws9w7t', this)
    .then(function() {
        console.log('이메일 전송 성공!')
        alert('메일이 성공적으로 발송되었습니다.')
        // contactForm.reset()
    }, function(error) {
        console.log('이메일 전송 실패...', error)
        alert('전송에 실패했습니다. 다시 시도해주세요.')
    })
})

registerBtn.addEventListener("click", function() {

    let result = isHypenPhoneNumber(registerPhone.value)

    if (result === false) {
        alert("전화번호가 잘못되었습니다")
        name.value = ""
        registerPhone.value = ""
        registerPassword.value = ""
        passwordVerify.value = ""
        return
    }

    if (registerCode.value !== passcode.value) {
        alert("잘못된 코드입니다. 코드 확인후 다시 시도해주세요")
        return
    }

    let verify = validatePassword(registerPassword.value, passwordVerify.value)
    console.log(verify)
    if (!verify) {
        return
    }

    fetch("/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name.value,
            phone: registerPhone.value,
            password: registerPassword.value
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.errorMessage) {
            alert(data.errorMessage)
            return
        } 
        alert("사용자 등록이 정상적으로 처리되었습니다")
        window.location.href = "/login.html"
    })
})

function validatePassword(newPassword, confirmPassword) {
    console.log("-------------------", newPassword, confirmPassword)
	var passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*?_]).{8,16}$/
    console.log(passwordRegex.test(newPassword))
	if (passwordRegex.test(newPassword)) {
		if (newPassword === confirmPassword) {
            return true
		}else{
			alert('비밀번호가 일치하지 않습니다')
            return false
		}
	} else {
        alert("비밀번호는 알파벳, 숫자, 특수문자(!@#$%^&*?_)의 조합으로 8 글자 이상이어야 합니다.")

        return false

    }
}

function checkPhoneNumber( number ) {
    const regExp = new RegExp( /^[0-9|-]*$/ );
    if( regExp.test( number ) == true ) { return true; }
    else { return false; }
}

function isHypenPhoneNumber(phone) {
    const regex = /^0\d{1,2}-\d{3,4}-\d{4}$/
    return regex.test(phone)
}

registerPhone.addEventListener("keyup", function(event) {
    inputPhoneNumber(event.target)
})

function inputPhoneNumber( phone ) {
    if( event.keyCode != 8 ) {
        const regExp = new RegExp( /^[0-9]{2,3}-^[0-9]{3,4}-^[0-9]{4}/g );
        if( phone.value.replace( regExp, "").length != 0 ) {                
            if( checkPhoneNumber( phone.value ) == true ) {
                let number = phone.value.replace( /[^0-9]/g, "" );
                let tel = "";
                let seoul = 0;
                if( number.substring( 0, 2 ).indexOf( "02" ) == 0 ) {
                    seoul = 1;
                    phone.setAttribute("maxlength", "12");
                    console.log( phone );
                } else {
                    phone.setAttribute("maxlength", "13");
                }
                if( number.length < ( 4 - seoul) ) {
                    return number;
                } else if( number.length < ( 7 - seoul ) ) {
                    tel += number.substr( 0, (3 - seoul ) );
                    tel += "-";
                    tel += number.substr( 3 - seoul );
                } else if(number.length < ( 11 - seoul ) ) {
                    tel += number.substr( 0, ( 3 - seoul ) );
                    tel += "-";
                    tel += number.substr( ( 3 - seoul ), 3 );
                    tel += "-";
                    tel += number.substr( 6 - seoul );
                } else {
                    tel += number.substr( 0, ( 3 - seoul ) );
                    tel += "-";
                    tel += number.substr( ( 3 - seoul), 4 );
                    tel += "-";
                    tel += number.substr( 7 - seoul );
                }
                phone.value = tel;
            } else {
                const regExp = new RegExp( /[^0-9|^-]*$/ );
                phone.value = phone.value.replace(regExp, "");
            }
        }
    }
}

logout.addEventListener("click", function() {
    localStorage.removeItem("elementry")
})