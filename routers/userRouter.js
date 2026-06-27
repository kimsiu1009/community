const router = require("express").Router()
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")


// 사용자 등록
router.post('/register', async (req, res) => {
    
    try {
        
        const {name, phone, password} = req.body // 구조분해 방식
        if (!name || !phone || !password) {
            return res.status(400).json({errorMessage: "이름, 휴대전화, 비밀번호를 모두 입력하세요."})
    }

    if  (password.length < 8) {
        return res.status(400).json({errorMessage: "비밀번호는 최소 8자 이상이어야 합니다."})
    }
    
    // DB에 폰 번호가 이미 있는지 확인
    
    const existingUser = await User.findOne({ phone })
    
    if (existingUser) {
        return res.status(400).json({errorMessage: "입력한 전화번호는 이미 등록된 전화번호 입니다."})
    }
    
    // password 암호화
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)
    
    const newUser = new User({
        name,
        phone,
        passwordHash
    })
    
    const savedUser = await newUser.save()
    
    res.send({result: "success"})
    
} catch (err) {
    console.error(err)
    res.status(500).send()
}

})

// 로그인

router.post('/login', async (req, res) => {
    
    try {

        const {phone, password} = req.body
        if (!phone || !password) {
            return res.status(400).json({errorMessage: "휴대전화, 비밀번호를 모두 입력하세요 "})
        }
        
        const existingUser = await User.findOne({ phone })
        if (!existingUser) {
            return res.status(400).json({errorMessage: "입력한 전화번호는 등록된 사용자가 아닙니다.\n먼저 사용자 등록을 하세요"})
        }
        
        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.passwordHash
        )

        if(!passwordCorrect) {
            return res.status(401).json({ errorMessage: "잘못된 비밀번호가 임력되었습니다" });
        }

        res.send({
            result: "success",
            name: existingUser.name,
            phone: existingUser.phone
        })
    } catch (err) {
        console.error(err)
        res.status(500).send()
    }
    
})

// 마이페이지

router.post('/myPage', async (req, res) => {

    try {
        const {name, phone, password} = req.body // 구조분해 방식
        if (!name || !phone || !password) {
            return res.status(400).json({errorMessage: "이름, 휴대전화, 비밀번호를 모두 입력하세요."})
        }

        if  (password.length < 8) {
            return res.status(400).json({errorMessage: "비밀번호는 최소 8자 이상이어야 합니다."})
        }
        
        // DB에 폰 번호가 이미 있는지 확인
        
        const existingUser = await User.findOne({ name })
        
        if (!existingUser) {
            return res.status(400).json({errorMessage: "입력한 사용자는 등록되지 않은 사용자입니다"})
        }
        
        // password 암호화
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        existingUser.name = name
        existingUser.phone = phone
        existingUser.passwordHash = passwordHash

        await existingUser.save()
        
        res.send({result: "success"})
    
    } catch (err) {
        console.error(err)
        res.status(500).send()
    }

})

module.exports = router