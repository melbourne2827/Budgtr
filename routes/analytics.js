const express = require('express')
const User = require("../models/user")
const Event = require("../models/event")
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { loggedIn } = require('../middleware')

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const average = (items) => {
    const date=new Date()
    const currMonth = date.getMonth()
    const currYear = date.getFullYear()
    let total = 0;
    let count = 0;
    for (let i = 0; i < 12; i++) {
        if (items[i].mark>=currYear-1 && i!=currMonth) {
            total += items[i].value
            count++;
        }
    }
    if (count == 0) {
        return 0;
    }
    return (total / count);
}

router.get('/analytics', loggedIn, catchAsync(async (req, res) => {
    const currMonth = (new Date()).getMonth()
    // console.log(currMonth)
    const arr = await Event.find({ "$expr": { "$eq": [{ "$month": "$date" }, currMonth+1] } })
    const events = arr.filter((element) => {
        if (element.author.equals(req.user._id)) {
            return element;
        }
    })
    const presentUser = await User.findById(req.user._id)
    const food = presentUser.foodExpenditure
    const leisure = presentUser.leisureExpenditure
    const shopping = presentUser.shoppingExpenditure
    const misc = presentUser.miscExpenditure

    const foodAverage = average(food)
    const leisureAverage = average(leisure)
    const shoppingAverage = average(shopping)
    const miscAverage = average(misc)
    
    res.render('analytics/index', { foodAverage, leisureAverage, shoppingAverage, miscAverage, events })
}))

module.exports = router
