const name = document.getElementById("name")
const phone = document.getElementById("phone")
const password = document.getElementById("password")
const passwordVerify = document.getElementById("passwordVerify")
const logout = document.querySelector(".logout")
const editBtn = document.querySelector(".edit-btn")

const user = localStorage.getItem("elementry")
const userObj = JSON.parse(user)

name.value = userObj.name
phone.value = userObj.phone

logout.addEventListener("click", function() {
    localStorage.removeItem("elementry")
})

editBtn.addEventListener("click", function() {

    let result = isHypenPhoneNumber(phone.value)

    if (result === false) {
        alert("전화번호가 잘못되었습니다")
        name.value = ""
        phone.value = ""
        password.value = ""
        passwordVerify.value = ""
        return
    }

    let verify = validatePassword(password.value, passwordVerify.value)
    if (!verify) {
        return
    }

    fetch("/auth/myPage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name.value,
            phone: phone.value,
            password: password.value
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.errorMessage) {
            alert(data.errorMessage)
            return
        }

        localStorage.removeItem('elementry')
        alert("비밀번호가 변경되었습니다")
        window.location.href = "/login.html"
    })
})

function validatePassword(newPassword, confirmPassword) {

	var passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_~]).{8,16}$/

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

phone.addEventListener("keyup", function(event) {
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