const Event = require("./event")
const User = require("./user")

const foodItems = ["sudha","nescafe","maggi","canteen","food", "swiggy", "zomato","basti"]
const leisure = ["gift","hangout","leisure", "movie", "trip", "shopping", "arcade", "party", "tour", "celebration"]
const shopping= ["zudio", "p&m",]
const misc = ["dhobi", "jio"]
const eventItems = ["birthday", "holi", "diwali","christmas","deewali","shivratri","new year"]

module.exports.postFunction = async (doc) => {
    if (doc) {
        const presentUser = await User.findById(doc.author)
        if (doc.type) {
            presentUser.totalBalance += doc.value
        }
        else {
            presentUser.totalBalance -= doc.value;
        }
        var check = 0
        let currMonth=doc.date.getMonth()
        let currYear=doc.date.getFullYear()
        
        if (doc.type == 0) {
            const desc = doc.description.toLowerCase()
            for(let i=0;i<foodItems.length;i++){
                if(desc.includes(foodItems[i])){
                    if(presentUser.foodExpenditure[currMonth].mark!=currYear){
                        presentUser.foodExpenditure[currMonth].value=0
                    }
                    presentUser.foodExpenditure[currMonth].value+=doc.value
                    presentUser.foodExpenditure[currMonth].mark=currYear
                    check = 1
                    break
                }
            }
            for(let i=0;i<leisure.length;i++){
                if(desc.includes(leisure[i])){
                    if(presentUser.leisureExpenditure[currMonth].mark!=currYear){
                        presentUser.leisureExpenditure[currMonth].value=0
                    }
                    presentUser.leisureExpenditure[currMonth].value+=doc.value
                    presentUser.leisureExpenditure[currMonth].mark=currYear
                    check = 1
                    break
                }
            }
            for(let i=0;i<shopping.length;i++){
                if(desc.includes(shopping[i])){
                    if(presentUser.shoppingExpenditure[currMonth].mark!=currYear){
                        presentUser.shoppingExpenditure[currMonth].value=0
                    }
                    presentUser.shoppingExpenditure[currMonth].value+=doc.value
                    presentUser.shoppingExpenditure[currMonth].mark=currYear
                    check = 1
                    break
                }
            }
            for(let i=0;i<misc.length;i++){
                if(desc.includes(misc[i])){
                    if(presentUser.miscExpenditure[currMonth].mark!=currYear){
                        presentUser.miscExpenditure[currMonth].value=0
                    }
                    presentUser.miscExpenditure[currMonth].value+=doc.value
                    presentUser.miscExpenditure[currMonth].mark=currYear
                    check = 1
                    break
                }
            }
            for(let i=0;i<eventItems.length;i++){
                if(desc.includes(eventItems[i])){
                    const { description, value, date } = doc
                    const newEvent = new Event({ description, value, date })
                    newEvent.author = doc.author
                    await newEvent.save()
                    check=1
                    break
                }
            }
            await presentUser.save()
        }
    }
}
