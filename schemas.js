const Joi=require('joi').extend(require('joi-phone-number')).extend(require("@joi/date"));

module.exports.entrySchema=Joi.object({
    entry:Joi.object({
        type:Joi.boolean().required(),
        // image:Joi.string().required(),
        value:Joi.number().min(0).required(),
        description:Joi.string().required(),
        // date:Joi.date().format('YYYY-MM-DD').utc().required(),
        date:Joi.date().max('now').required(),
    }).required(),
})

module.exports.userSchema=Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email:Joi.string().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')).required(),
    phoneNumber:[Joi.string().allow(""),Joi.string().phoneNumber()],
    password: Joi.string().required(),
    confirm_password: Joi.ref('password'),
});
